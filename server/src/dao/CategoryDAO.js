let Category;

const injectClient = async (client) => {
  if (Category) return;
  if (client) {
    Category = await client.db(process.env.ESHOP_NS).collection("categories");
  }
};

const queryCategories = async (request) => {
  const { skip = 0, limit = 1000, category, sortable } = request;
  try {
    const cfilter = [];
    if (category) {
      cfilter.push({ label: { $regex: new RegExp(category, "i") } });
    }

    if (cfilter.length > 0) {
      return await Category.find({ $and: cfilter })
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sortable.sort || "_id", sortable.direction || 1)
        .toArray();
    } else {
      return await Category.find({})
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sortable.sort || "_id", sortable.direction || 1)
        .toArray();
    }
  } catch (e) {
    console.error(`Failed to query categories ${e}`);
  }
};

const queryCategoryByName = async (name) => {
  try {
    if (name) {
      return await Category.find({ name });
    }
  } catch (e) {
    console.error(`Failed to query category ${e}`);
  }
};

const queryCount = async (category) => {
  try {
    const cfilter = [];
    if (category)
      cfilter.push({ label: { $regex: new RegExp(category, "i") } });

    if (cfilter.length > 0) {
      return await Category.count({ $and: cfilter });
    }
    return await Category.count({});
  } catch (e) {
    console.error(`Failed to query count ${e}`);
  }
};

const addCategory = async (request) => {
  try {
    const { name, label, image } = request;
    if (!name || !label) return { error: "name / label cannot be empty" };
    const categoryInfo = await Category.queryCategoryByName(name);
    if (categoryInfo) {
      return { error: "Category already exists" };
    }
    await Category.insertOne({ name, label, image });
    return { success: true };
  } catch (e) {
    console.error(`Failed to create category ${e}`);
  }
};

const CategoryDAO = {
  injectClient,
  queryCategories,
  queryCount,
  queryCategoryByName,
  addCategory,
};

export default CategoryDAO;
