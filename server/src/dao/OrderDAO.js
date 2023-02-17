import mongodb from "mongodb";
import { formatCurrency, convertToObj } from "../utilities/Currency.js";
let Orders;

const injectClient = async (client) => {
  if (Orders) return;
  if (client) {
    Orders = await client.db(process.env.ESHOP_NS).collection("orders");
  }
};

const createOrder = async (order) => {
  return await Orders.insertOne(order);
};

const updateOrder = async (userId, orderId, order) => {
  return await Orders.updateOne(
    { _id: orderId, user: userId },
    {
      $set: order,
      $setOnInsert: { lastModifiedAt: new Date() },
    },
    { upsert: true }
  );
};

const deleteOrder = async (userId, orderId) => {
  await Orders.deleteOne({ _id: orderId, user: userId });
};

const queryOrders = async (
  userId,
  filter = {},
  skip = 0,
  limit = 10,
  currency
) => {
  const _filter = { $and: [{ user: new mongodb.ObjectId(userId) }] };
  if (filter.search) {
    _filter["$and"].push({
      $or: [
        { "products.title": { $regex: new RegExp(filter.search, "i") } },
        { _id: filter.search },
      ],
    });
  }
  const projection = {
    currency: 1,
    orderOn: 1,
    products: 1,
    shipping: { address: 1, name: 1 },
    status: 1,
    totalCost: 1,
  };
  const orders = await Orders.find(_filter, { projection })
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ orderOn: -1 })
    .toArray();
  if (orders && orders.length) {
    return orders.map((order) => {
      order["totalCost"] = convertToObj(order["totalCost"], currency);
      order["orderOn"] = new Date(order["orderOn"]).toLocaleString("en-US", {
        day: "numeric",
        year: "numeric",
        month: "long",
      });
      return order;
    });
  }
  return orders;
};

export default {
  injectClient,
  createOrder,
  updateOrder,
  deleteOrder,
  queryOrders,
};
