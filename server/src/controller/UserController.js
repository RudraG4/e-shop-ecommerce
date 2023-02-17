import UserDAO from "../dao/UserDAO.js";

const queryUserInfo = async (req, res) => {
  try {
    const currentUser = req.user;
    let user;
    if (currentUser) {
      const fields = ["name", "email", "mobile", "admin", "preference"];
      user = await UserDAO.findUserByEmail(currentUser.email, fields);
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const finduser = async (req, res) => {
  try {
    const { email } = req.query;
    const fields = ["name", "email", "mobile", "status", "_id"];
    const userInfo = await UserDAO.findUserByEmail(email, fields);
    if (!userInfo) {
      return res.status(200).json({ error: "User not found" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const queryusers = async (req, res) => {
  try {
    const { skip = 0, limit = 10, name, email, _id } = req.query;
    const { sort = "_id", direction = "DESC" } = req.query;
    const filter = { name, email, _id };
    const sortable = { sort, direction: direction === "ASC" ? 1 : -1 };
    const results = await UserDAO.findUsers({ skip, limit, sortable, filter });
    const total = await UserDAO.findCount({ filter });
    const body = { success: true, results, total };
    return res.status(200).json(body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const result = await UserDAO.makeAdmin(id);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: "userId is missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const revokeAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const result = await UserDAO.revokeAdmin(id);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: "userId is missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updatePreference = async (req, res) => {
  try {
    const user = req.user;
    const { preference } = req.body;
    if (user?.userId) {
      const result = await UserDAO.updatePreference(user?.userId, preference);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: "userId is missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const user = req.user;
    if (user?.userId) {
      const results = await UserDAO.getUserAddresses(user?.userId);
      return res.status(200).json({ success: true, results });
    }
    return res.status(200).json({ error: "userId is missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const user = req.user;
    const { address } = req.body;
    if (user?.userId && address._id) {
      const result = await UserDAO.updateUserAddress(user?.userId, address);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: "userId is missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const addressChange = async (req, res) => {
  try {
    const user = req.user;
    const { id: addressId } = req.body;
    if (user?.userId && addressId) {
      const result = await UserDAO.addressChange(user?.userId, addressId);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: "mandatory parameters missing" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default {
  makeAdmin,
  revokeAdmin,
  queryUserInfo,
  queryusers,
  finduser,
  updatePreference,
  getUserAddresses,
  updateUserAddress,
  addressChange,
};
