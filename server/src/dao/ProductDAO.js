import mongo from "mongodb";
import { convertToObj } from "../utilities/Currency.js";
let Product;

const injectClient = async (client) => {
  if (Product) return;
  if (client) {
    Product = await client.db(process.env.ESHOP_NS).collection("products");
  }
};

const queryProducts = async (request) => {
  const { filter = {}, pagination = { skip: 0, limit: 10 } } = request;
  const { currency = "USD" } = request;
  let { sortable = { _id: "DESC" } } = request;

  const pfilter = [];
  if (filter.category) {
    pfilter.push({ category: filter.category });
  }
  if (filter.keyword) {
    pfilter.push({
      $or: [
        { title: { $regex: new RegExp(filter.keyword, "i") } },
        { category: { $regex: new RegExp(filter.keyword, "i") } },
      ],
    });
  }
  if (filter._id) {
    pfilter.push({ _id: new mongo.ObjectId(filter._id) });
  }
  const availability = ["In Stock"];
  if (filter.includeOOSFlag) {
    availability.push("Out of Stock");
  }
  pfilter.push({ availability: { $in: availability } });

  sortable = Object.keys(sortable).reduce((accum, key) => {
    accum[key] =
      sortable[key] === "ASC"
        ? 1
        : sortable[key] === "DESC"
        ? -1
        : sortable[key];
    return accum;
  }, {});

  let productCursor;
  if (pfilter.length > 0) {
    productCursor = await Product.find({ $and: pfilter });
  } else {
    productCursor = await Product.find({});
  }

  if (productCursor) {
    const products = await productCursor
      .skip(Number(pagination.skip))
      .limit(Number(pagination.limit))
      .sort(sortable)
      .toArray();
    return products.map((product) => {
      product.price = convertToObj(product["price"], currency);
      product.mrp = convertToObj(product["mrp"], currency);
      product.savedAmt = convertToObj(product["savedAmt"], currency);
      return product;
    });
  }
};

const queryProductById = async (_id, currency) => {
  const product = await Product.findOne({ _id: new mongo.ObjectId(_id) });
  if (product) {
    product.price = convertToObj(product["price"], currency);
    product.mrp = convertToObj(product["mrp"], currency);
    product.savedAmt = convertToObj(product["savedAmt"], currency);
  }
  return product;
};

const queryProductByIds = async (ids = []) => {
  return await Product.find({
    _id: { $in: ids.map((_id) => new mongo.ObjectId(_id)) },
  }).toArray();
};

const queryCount = async (filter) => {
  const pfilter = [];
  if (filter.category) {
    pfilter.push({ category: filter.category });
  }
  if (filter.keyword) {
    pfilter.push({
      $or: [
        { title: { $regex: new RegExp(filter.keyword, "i") } },
        { category: { $regex: new RegExp(filter.keyword, "i") } },
      ],
    });
  }
  if (filter._id) {
    pfilter.push({ _id: new mongo.ObjectId(filter._id) });
  }

  if (pfilter.length > 0) {
    return await Product.count({ $and: pfilter });
  }
  return await Product.count({});
};

const updateProduct = async (_id, product) => {
  return await Product.updateOne(
    { _id: new mongo.ObjectId(_id) },
    { $set: { ...product }, $currentDate: { lastModified: true } }
  );
};

const addStock = async (_id, quantity) => {
  return await Product.updateOne({ _id: new mongo.ObjectId(_id) }, [
    { $set: { stock: { $add: ["$stock", quantity] } } },
    {
      $set: {
        availability: {
          $cond: {
            if: { $eq: ["$stock", 0] },
            then: "Out of Stock",
            else: "In Stock",
          },
        },
        lastModified: new Date(),
      },
    },
  ]);
};

const suggest = async (data) => {
  const { userId, productId, currency } = data;
  const rating = 0;
  const ratingCount = 0;
  const match = {
    "ratings.ratingCount": { $ne: 0 },
    "ratings.rating": { $ne: 0 },
  };
  if (productId) {
    const { ratings, category } = await queryProductById(productId);
    match["category"] = category;
    match["_id"] = { $ne: new ObjectId(productId) };
    rating = ratings.rating;
    ratingCount = ratings.ratingCount;
  }
  const products = await Product.aggregate([
    { $match: match },
    {
      $project: {
        _id: 1,
        title: 1,
        availability: 1,
        ratings: 1,
        mrp: 1,
        price: 1,
        savedAmt: 1,
        discountPercentage: 1,
        images: 1,
        category: 1,
        description: 1,
        thumbnail: 1,
        distance: {
          $sqrt: {
            $add: [
              { $pow: [{ $subtract: [rating, "$ratings.rating"] }, 2] },
              {
                $pow: [{ $subtract: [ratingCount, "$ratings.ratingCount"] }, 2],
              },
            ],
          },
        },
      },
    },
    { $match: { distance: { $ne: null } } },
    { $sort: { distance: 1 } },
    { $limit: 5 },
  ]).toArray();
  if (products) {
    return products.map((product) => {
      product.price = convertToObj(product["price"], currency);
      product.mrp = convertToObj(product["mrp"], currency);
      product.savedAmt = convertToObj(product["savedAmt"], currency);
      return product;
    });
  }
  return products;
};

export default {
  injectClient,
  queryProducts,
  queryCount,
  queryProductById,
  queryProductByIds,
  updateProduct,
  addStock,
  suggest,
};
