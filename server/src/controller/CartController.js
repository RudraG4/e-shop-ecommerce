import CartDAO from "../dao/CartDAO.js";

const addToCart = async (req, resp) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const { currency } = req.headers;
    const cartItem = {
      ...req.body,
      userId: user?.userId,
      cartId: sessionid,
      currency,
    };
    const cartResp = await CartDAO.addToCart(cartItem);
    if (cartResp?.success) {
      return resp.status(200).json(cartResp);
    }
    return resp.status(400).json(cartResp);
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, resp) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const { currency } = req.headers;
    const cartItem = {
      productId: req.body._id,
      userId: user?.userId,
      cartId: sessionid,
      currency,
    };
    const cartResp = await CartDAO.removeFromCart(cartItem);
    if (cartResp?.success) {
      return resp.status(200).json(cartResp);
    }
    return resp.status(400).json(cartResp);
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
};

const clearCart = async (req, resp) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const { currency } = req.headers;
    const cartItem = { userId: user?.userId, cartId: sessionid, currency };
    const cartResp = await CartDAO.clearCart(cartItem);
    if (cartResp?.success) {
      return resp.status(200).json(cartResp);
    }
    return resp.status(400).json(cartResp);
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
};

const getCart = async (req, resp) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const { currency } = req.headers;
    const filter = { userId: user?.userId, cartId: sessionid, currency };
    const cart = await CartDAO.getCart(filter);
    return resp.status(200).json({ cart });
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
};

const getCartCount = async (req, res) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const count = await CartDAO.getCartCount(user?.userId, sessionid);
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const calculateSummary = async (req, resp) => {
  try {
    const user = req.user;
    const { sessionid } = req.session;
    const { currency } = req.headers;
    const cart = {
      ...req.body,
      userId: user?.userId,
      cartId: sessionid,
      currency,
    };
    const summary = await CartDAO.calculateSummary(cart);
    return resp.status(200).json(summary);
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
};

export default {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  getCartCount,
  calculateSummary,
};
