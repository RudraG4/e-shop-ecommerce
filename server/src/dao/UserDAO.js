import mongo from "mongodb";
let User;

const injectClient = async (client) => {
  if (User) return;
  if (client) {
    User = await client.db(process.env.ESHOP_NS).collection("users");
    User.createIndex({ email: 1 }, { unique: true });
  }
};

const findOne = async (filter = {}, fields = []) => {
  const queryFields = fields.reduce((accum, field) => {
    if (field === "password") return accum;
    accum[field] = 1;
    return accum;
  }, {});
  if (filter && Object.keys(filter).length) {
    return await User.findOne(filter, { projection: { ...queryFields } });
  }
};

const findUserByEmail = async (email, fields = []) => {
  const queryFields = fields.reduce((accum, field) => {
    if (field === "password") return accum;
    accum[field] = 1;
    return accum;
  }, {});
  return await User.findOne({ email }, { projection: { ...queryFields } });
};

const findUserById = async (_id, fields = []) => {
  const queryFields = fields.reduce((accum, field) => {
    if (field === "password") return accum;
    accum[field] = 1;
    return accum;
  }, {});
  return await User.findOne(
    { _id: new mongo.ObjectId(_id) },
    { projection: { ...queryFields } }
  );
};

const findUserWithPassword = async (email) => {
  return await User.findOne({ email });
};

const findDraftUser = async (email) => {
  return await User.findOne(
    {
      $and: [{ email }, { isDraft: true }],
    },
    { projection: { password: 0 } }
  );
};

const findUsers = async ({ skip = 0, limit = 10, filter, sortable }) => {
  const { name, email } = filter;

  const mfilter = [];
  if (name) mfilter.push({ name: { $regex: new RegExp(name, "i") } });
  if (email) mfilter.push({ email: { $regex: new RegExp(email, "i") } });

  const options = { projection: { password: 0, access_token: 0 } };
  if (mfilter.length > 0) {
    return await User.find({ $and: mfilter }, options)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sortable.sort || "_id", sortable.direction || 1)
      .toArray();
  } else {
    return await User.find({}, options)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sortable.sort || "_id", sortable.direction || 1)
      .toArray();
  }
};

const findCount = async ({ filter }) => {
  const { name, email, _id } = filter;
  const mfilter = [];
  if (name) mfilter.push({ name: { $regex: new RegExp(name, "i") } });
  if (email) mfilter.push({ email: { $regex: new RegExp(email, "i") } });
  if (_id) mfilter.push({ _id: new mongo.ObjectId(_id) });

  if (mfilter.length > 0) {
    return await User.count({ $and: mfilter });
  }
  return await User.count({});
};

const updateUserByEmail = async (email, userInfo) => {
  await User.updateOne({ email }, { $set: { ...userInfo } });
  return { success: true };
};

const updateUserById = async (_id, userInfo) => {
  await User.updateOne(
    { _id: new mongo.ObjectId(_id) },
    { $set: { ...userInfo } }
  );
};

const createUser = async (userInfo) => {
  const { name, email, mobile, password } = userInfo;

  const account = await findUserByEmail(email);
  if (account) {
    return { error: "This email address is already in use" };
  }

  const draftUser = await findDraftUser(email);
  if (draftUser) {
    await updateUserByEmail(email, { name, email, mobile, password });
    return { success: true };
  }

  const newUser = {
    name,
    email,
    mobile,
    password,
    isDraft: true,
    createdAt: new Date(),
    isVerified: false,
    admin: false,
    preference: { currency: "USD" },
  };
  await User.insertOne(newUser);
  return { success: true };
};

const updatePreference = async (userId, preference) => {
  if (!userId) {
    return { error: "userId is missing" };
  }
  const response = await User.updateOne(
    { _id: new mongo.ObjectId(userId) },
    { $set: { preference: preference } }
  );

  if (response.matchedCount && response.modifiedCount) {
    return { success: true };
  }
  return { error: "User doesnot exist" };
};

const getUserAddresses = async (userId) => {
  if (!userId) {
    return { error: "userId is missing" };
  }
  const response = await User.findOne(
    { _id: new mongo.ObjectId(userId) },
    {
      projection: {
        addresses: {
          $map: {
            input: "$addresses",
            in: {
              _id: { $toString: "$$this._id" },
              address: "$$this.address",
              name: "$$this.name",
              isDefault: "$$this.isDefault",
            },
          },
        },
        _id: 0,
      },
    }
  );
  return response?.addresses ? response.addresses : [];
};

const updateUserAddress = async (userId, address) => {
  if (!userId) {
    return { error: "userId is missing" };
  }
  const response = await User.updateOne(
    { _id: new mongo.ObjectId(userId), "addresses._id": address._id },
    { $push: { addresses: { ...address } } },
    { upsert: true }
  );
  console.log(response);
  return { success: true };
};

const addressChange = async (userId, addressId) => {
  if (!userId) {
    return { error: "userId is missing" };
  }

  if (!addressId) {
    return { error: "addressId is missing" };
  }

  await User.updateOne(
    { _id: new mongo.ObjectId(userId) },
    {
      $set: { "addresses.$[default].isDefault": "true" },
      $unset: { "addresses.$[nondefault].isDefault": "false" },
    },
    {
      arrayFilters: [
        { "default._id": { $eq: new mongo.ObjectId(addressId) } },
        { "nondefault._id": { $ne: new mongo.ObjectId(addressId) } },
      ],
    }
  );
  return { success: true };
};

const makeAdmin = async (userId) => {
  if (!userId) {
    return { error: "userId is missing" };
  }

  const response = await User.updateOne(
    { _id: new mongo.ObjectId(userId) },
    { $set: { admin: true } }
  );

  if (response.matchedCount && response.modifiedCount) {
    return { success: true };
  }

  return { error: "User doesnot exist" };
};

const revokeAdmin = async (userId) => {
  if (!userId) {
    return { error: "userId is missing" };
  }

  const response = await User.updateOne(
    { _id: new mongo.ObjectId(userId) },
    { $set: { admin: false } }
  );

  if (response.matchedCount && response.modifiedCount) {
    return { success: true };
  }

  return { error: "User doesnot exist" };
};

const UserDAO = {
  injectClient,
  createUser,
  findOne,
  findUserByEmail,
  findUserById,
  findUserWithPassword,
  findUsers,
  findCount,
  updateUserByEmail,
  updateUserById,
  updatePreference,
  getUserAddresses,
  updateUserAddress,
  addressChange,
  makeAdmin,
  revokeAdmin,
};

export default UserDAO;
