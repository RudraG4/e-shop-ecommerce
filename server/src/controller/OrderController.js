import OrderDAO from "../dao/OrderDAO.js";

const queryOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const { search } = req.query;
    const { currency } = req.headers;
    const filter = { search };
    const orders = await OrderDAO.queryOrders(userId, filter, 0, 10, currency);
    return res.status(200).json({ success: true, results: orders });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send();
  }
};

export default {
  queryOrders,
};
