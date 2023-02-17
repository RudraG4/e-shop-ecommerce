import { ObjectId } from "mongodb";
import ProductDAO from "./ProductDAO.js";
import { convertToObj } from "../utilities/Currency.js";
let Cart;

const DELIVERY = {
  standard: {
    deliveryCharge: 1.21,
    deliveryDesc: "Delivers within 2-3 business days",
    deliveryEstimate: { min: 2, max: 3 },
  },
  free: {
    deliveryCharge: 0,
    deliveryDesc: "Delivers within 5-7 business days",
    deliveryEstimate: { min: 5, max: 7 },
  },
  express: {
    deliveryCharge: 2.41,
    deliveryDesc: "Delivers at most 1 business day",
    deliveryEstimate: { min: 1, max: 1 },
  },
};

const COUPONS = {
  ESHOP400: {
    code: "ESHOP400",
    description: "Rs. 400 off on minimum purchase of Rs. 2199",
    discountUnits: { currency: "INR", value: 400 },
  },
  ESHOP500: {
    code: "ESHOP500",
    description: "Rs. 500 off on minimum purchase of Rs. 3699",
    discountUnits: { currency: "INR", value: 500 },
  },
};

const injectClient = async (client) => {
  if (Cart) return;
  if (client) {
    Cart = await client.db(process.env.ESHOP_NS).collection("cart");
  }
};

const _getCart = async (filter = {}) => {
  const cart = {
    user: filter.userId,
    _id: filter.cartId,
    totalProducts: 0,
    products: [],
    subTotal: 0,
  };
  if (!filter.userId && !filter.cartId) {
    return cart;
  }
  const match = {};
  if (filter.userId) {
    match["user"] = new ObjectId(filter.userId);
  } else {
    match["_id"] = new ObjectId(filter.cartId);
  }

  const carts = await Cart.aggregate([
    { $match: match },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products._id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              title: 1,
              availability: 1,
              price: 1,
              mrp: 1,
              category: 1,
              rating: "$ratings.rating",
              lastModified: 1,
              totalPrice: 1,
              quantity: 1,
              stock: 1,
            },
          },
        ],
        as: "product_info",
      },
    },
    { $unwind: "$product_info" },
    {
      $group: {
        _id: { $toString: "$_id" },
        status: { $first: "$status" },
        lastModified: { $first: "$lastModified" },
        user: { $first: "$user" },
        subTotal: { $sum: "$products.totalPrice" },
        totalProducts: { $sum: 1 },
        products: {
          $push: {
            _id: { $toString: "$product_info._id" },
            thumbnail: "$product_info.thumbnail",
            title: "$product_info.title",
            availability: "$product_info.availability",
            price: "$product_info.price",
            mrp: "$product_info.mrp",
            totalPrice: "$products.totalPrice",
            quantity: "$products.quantity",
            category: "$product_info.category",
            rating: "$product_info.rating",
            lastModified: "$product_info.lastModified",
            stock: "$product_info.stock",
          },
        },
      },
    },
    { $limit: 1 },
  ]).toArray();

  return carts.length ? carts[0] : cart;
};

const addCartItem = async (userId, cartId, product) => {
  if (!userId && !cartId) {
    return null;
  }
  const filter = { status: "active" };
  if (userId) {
    filter["user"] = new ObjectId(userId);
  } else {
    filter["_id"] = new ObjectId(cartId);
  }

  return await Cart.updateOne(
    filter,
    {
      $push: {
        products: {
          _id: new ObjectId(product.productId),
          quantity: product.quantity,
          totalPrice: product.priceForQty,
          title: product.title,
        },
      },
      $inc: { totalProducts: 1, subTotal: product.priceForQty },
      $currentDate: { lastModified: true },
    },
    { upsert: true }
  );
};

const updateCartItem = async (userId, cartId, product) => {
  if (!userId && !cartId) {
    return null;
  }
  const filter = {
    status: "active",
    products: { $elemMatch: { _id: new ObjectId(product.productId) } },
  };
  if (userId) {
    filter["user"] = new ObjectId(userId);
  } else {
    filter["_id"] = new ObjectId(cartId);
  }

  return await Cart.updateOne(filter, {
    $inc: {
      subTotal: product.priceForQty,
      "products.$.quantity": product.quantity,
      "products.$.totalPrice": product.priceForQty,
    },
    $currentDate: { lastModified: true },
  });
};

const getCart = async (filter) => {
  const currency = filter.currency || "USD";
  const cart = await _getCart(filter);
  cart["subTotal"] = convertToObj(cart["subTotal"], currency);
  cart["products"] = cart["products"].map((product) => {
    product.price = convertToObj(product["price"], currency);
    product.totalPrice = convertToObj(product["totalPrice"], currency);
    return product;
  });
  return cart;
};

const getCartCount = async (userId, cartId) => {
  if (!userId && !cartId) {
    return 0;
  }
  const match = {};
  if (userId) {
    match["user"] = new ObjectId(userId);
  } else {
    match["_id"] = new ObjectId(cartId);
  }

  const cart = await Cart.find(match, { $project: { totalProducts: 1 } });
  return cart?.totalProducts || 0;
};

/** Quantity: +1 to add, -1 to remove */
const addToCart = async (cartItem) => {
  const { _id: productId, quantity, userId, cartId, currency } = cartItem;
  if ((!userId && !cartId) || !productId || !quantity) {
    return { error: "Mandatory parameters missing" };
  }

  const product = await ProductDAO.queryProductById(productId, "USD");
  if (product) {
    const { title, price, stock } = product;
    const priceForQty = price.amount * quantity;
    const cart = await _getCart({ userId, cartId });
    const itemExist =
      cart?.products?.findIndex((item) => {
        return item._id.toString() === productId;
      }) > -1;

    if (stock >= quantity) {
      const item = { productId, quantity, title, priceForQty };
      if (!itemExist) {
        await addCartItem(userId, cartId, item);
        // const stockResp = await ProductDAO.addStock(productId, -1 * quantity);
      } else {
        await updateCartItem(userId, cartId, item);
        // const stockResp = await ProductDAO.addStock(productId, -1 * quantity);
      }
      return {
        success: true,
        cart: await getCart({ userId, cartId, currency }),
      };
    }
    return { error: "No sufficient stock available" };
  }
  return { error: "No product found" };
};

const removeFromCart = async (cartItem) => {
  const { productId, userId, cartId, currency } = cartItem;
  if ((!userId && !cartId) || !productId) {
    return { error: "Mandatory parameters missing" };
  }
  const filter = { status: "active" };
  if (userId) {
    filter["user"] = new ObjectId(userId);
  } else {
    filter["_id"] = new ObjectId(cartId);
  }

  const cart = await _getCart({ userId, cartId });
  const index = cart?.products?.findIndex((item) => {
    return item._id.toString() === productId;
  });
  if (index > -1) {
    const { totalPrice, quantity } = cart.products[index];
    await Cart.updateOne(filter, {
      $pull: { products: { _id: new ObjectId(productId) } },
      $inc: {
        subTotal: -1 * totalPrice,
        totalProducts: -1,
      },
      $currentDate: { lastModified: true },
    });
    // const stockResp = await ProductDAO.addStock(productId, quantity);
    return { success: true, cart: await getCart({ userId, cartId, currency }) };
  }
  return { error: "Item not exist in the cart" };
};

const clearCart = async (cartItem) => {
  const { userId, cartId, currency } = cartItem;
  if (!userId && !cartId) {
    return { error: "Mandatory parameters missing" };
  }
  const filter = {};
  if (userId) {
    filter["user"] = new ObjectId(userId);
  } else {
    filter["_id"] = new ObjectId(cartId);
  }

  await Cart.updateOne(filter, {
    $set: {
      status: "active",
      lastModified: new Date(),
      totalProducts: 0,
      subTotal: 0,
      products: [],
    },
  });
  return { success: true, cart: await getCart({ userId, cartId, currency }) };
};

const associateCartToUser = async (userId, cartId) => {
  try {
    if (!userId || !cartId) return { error: "Mandatory parameters missing" };
    const userCart = await _getCart({ userId });
    const tempCart = await _getCart({ cartId });
    if (tempCart) {
      if (userCart) {
        let subTotal = 0;
        const mergedProducts = [
          ...tempCart.products,
          ...userCart.products,
        ].reduce((acc, prod) => {
          const i = acc.findIndex(
            (p) => p._id.toString() === prod._id.toString()
          );
          if (i > -1) {
            acc[i]["quantity"] += prod["quantity"];
            acc[i]["totalPrice"] = acc[i]["quantity"] * acc[i]["price"];
            subTotal += acc[i]["totalPrice"];
          } else {
            const newProd = {
              _id: new ObjectId(prod._id),
              quantity: prod.quantity,
              totalPrice: prod.totalPrice,
              title: prod.title,
            };
            acc.push(newProd);
          }
          return acc;
        }, []);

        await Cart.updateOne(
          { user: new ObjectId(userId) },
          {
            $set: {
              status: "active",
              lastModified: new Date(),
              totalProducts: mergedProducts.length,
              subTotal: subTotal,
              products: mergedProducts,
            },
          }
        );
      } else {
        // create new user cart
        await Cart.insertOne({
          user: new ObjectId(userId),
          status: "active",
          lastModified: tempCart.lastModified,
          totalProducts: tempCart.totalProducts,
          subTotal: tempCart.subTotal,
          products: tempCart.products.reduce((accum, product) => {
            return {
              _id: new ObjectId(product._id),
              quantity: product.quantity,
              totalPrice: product.totalPrice,
              title: product.title,
            };
          }, []),
        });
      }
      // delete tempcart
      await Cart.deleteOne({ _id: new ObjectId(cartId) });
    }
  } catch (err) {
    console.error(err.message);
  }
};

const calculateSummary = async (cart) => {
  const { userId, cartId, deliveryType, couponCode, currency } = cart;
  const summary = {
    user: null,
    _id: null,
    products: [],
    totalProducts: 0,
    subTotal: convertToObj(0, currency),
    discount: convertToObj(0, currency),
    total: convertToObj(0, currency),
    promotionApplied: convertToObj(0, currency),
    coupon: null,
    deliveryOption: {
      deliveryBy: null,
      deliveryType: null,
      deliveryCharge: convertToObj(0, currency),
      deliveryDesc: null,
      isFreeDelivery: false,
    },
  };

  const _cart = await _getCart({ userId, cartId });
  if (_cart) {
    summary["_id"] = _cart["_id"];
    summary["user"] = _cart["user"];
    summary["products"] = _cart["products"].map((product) => {
      product.price = convertToObj(product["price"], currency);
      product.mrp = convertToObj(product["mrp"], currency);
      product.totalPrice = convertToObj(product["totalPrice"], currency);
      return product;
    });
    summary["totalProducts"] = _cart["totalProducts"];
    const subTotal = _cart["subTotal"];
    summary["subTotal"] = convertToObj(subTotal, currency);

    summary.coupon = COUPONS[couponCode];
    const discount = Math.max(summary.coupon?.discountUnits?.value || 0, 0);
    summary.discount = convertToObj(discount, currency);

    const isFreeDelivery = subTotal >= 6.05;
    let _deliveryType = deliveryType;
    if (!_deliveryType) {
      if (isFreeDelivery) {
        _deliveryType = "free";
      } else {
        _deliveryType = "standard";
      }
    }
    const deliveryInfo = DELIVERY[_deliveryType];
    const deliveryCharge = deliveryInfo["deliveryCharge"];
    const deliveryOption = {
      deliveryType: _deliveryType,
      isFreeDelivery: isFreeDelivery,
      deliveryCharge: convertToObj(deliveryCharge, currency),
      deliveryDesc: deliveryInfo["deliveryDesc"],
      deliveryBy: "",
    };
    const now = new Date();
    now.setDate(now.getDate() + deliveryInfo.deliveryEstimate.max);
    deliveryOption["deliveryBy"] = [
      now.toLocaleString("en-US", { dateStyle: "full" }),
      now.toLocaleString("en-US", { timeStyle: "short" }),
    ].join(" ");

    summary["deliveryOption"] = deliveryOption;
    const promotionApplied =
      isFreeDelivery && ["standard", "free"].includes(_deliveryType)
        ? deliveryCharge
        : 0;
    summary["promotionApplied"] = convertToObj(promotionApplied, currency);

    const total = subTotal
      ? subTotal - discount + deliveryCharge - promotionApplied
      : 0;
    summary["total"] = convertToObj(total, currency);
  }
  return summary;
};

export default {
  injectClient,
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  getCartCount,
  associateCartToUser,
  calculateSummary,
};
