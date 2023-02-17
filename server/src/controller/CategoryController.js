import CategoryDAO from "../dao/CategoryDAO.js";

const queryCategories = async (request, response) => {
  try {
    const { skip = 0, limit = 1000, category } = request.query;
    const { sort = "_id", direction = "DESC" } = request.query;
    const sortable = { sort, direction: direction === "ASC" ? 1 : -1 };
    const daoReq = { skip, limit, category, sortable };
    const results = await CategoryDAO.queryCategories(daoReq);
    const total = await CategoryDAO.queryCount(category);
    return response.status(200).json({
      success: true,
      results,
      total,
    });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
};

const addCategory = async () => {};

const removeCategory = async () => {};

const queryCategory = async () => {};

export default {
  queryCategories,
  addCategory,
  removeCategory,
  queryCategory,
};
