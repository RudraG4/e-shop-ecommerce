import ProductDAO from "../dao/ProductDAO.js";
import BrowsingHistoryDAO from "../dao/BrowsingHistoryDAO.js";

const queryProducts = async (request, response) => {
  try {
    const { skip = 0, limit = 10, keyword, _id, category } = request.query;
    const { sort = "_id", direction = "DESC" } = request.query;
    const { currency } = request.headers;
    let sortable = { [sort]: direction };
    if (sort === "newest") {
      sortable = { _id: "DESC" };
    } else if (sort === "price_asc") {
      sortable = { price: "ASC", title: "ASC" };
    } else if (sort === "price_desc") {
      sortable = { price: "DESC", title: "ASC" };
    } else if (sort === "high_rated") {
      sortable = { "ratings.rating": "DESC", title: "ASC" };
    }
    const filter = {
      category: category != "all" ? category : undefined,
      keyword,
      _id,
    };
    const pagination = { skip, limit };
    const results = await ProductDAO.queryProducts({
      filter,
      pagination,
      sortable,
      currency,
    });
    const total = await ProductDAO.queryCount(filter);
    const body = { success: true, results, total };
    return response.status(200).json(body);
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
};

const queryProductById = async (request, response) => {
  try {
    const { _id } = request.params;
    const { user } = request;
    const { currency } = request.headers;
    const result = await ProductDAO.queryProductById(_id, currency);
    if (result) {
      if (user?.userId) {
        await BrowsingHistoryDAO.addToBrowsingHistory(_id, user.userId);
      }
      return response.status(200).json({ success: true, result });
    } else {
      return response
        .status(200)
        .json({ error: `Product with id '${_id}' not found` });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
};

const suggests = async (request, response) => {
  try {
    const user = request;
    const { productId } = request.params;
    const { currency } = request.headers;
    const data = { userId: user?.userId, productId, currency };
    const results = await ProductDAO.suggest(data);
    return response.status(200).json({ success: true, results: results || [] });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
};

export default {
  queryProducts,
  queryProductById,
  suggests,
};
