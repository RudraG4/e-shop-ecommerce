import stripePk from "stripe";
import { ObjectId } from "mongodb";
import { config } from "dotenv";
import CartDAO from "../dao/CartDAO.js";
import OrderDAO from "../dao/OrderDAO.js";
import { convert } from "../utilities/Currency.js";
import EventEmitter from "events";

const eventEmitter = new EventEmitter({ captureRejections: true });

config();
const stripe = stripePk(process.env.STRIPE_KEY);

const getSummary = async (userId, deliveryType, currency) => {
  return await CartDAO.calculateSummary({ userId, deliveryType, currency });
};

const createPaymentIntent = async (req, res) => {
  try {
    const { deliveryType } = req.body;
    const user = req.user;
    const currency = req.headers.currency || "usd";
    if (!user || !user.userId) return res.status(401).send();

    const summary = await getSummary(user.userId, deliveryType, "USD");
    // Create a PaymentIntent with the order amount and currency
    const now = new Date();
    const orderId = ["ORDER", now.getFullYear(), now.getTime()].join("-");

    const customer = await stripe.customers.create({
      name: user.name,
      metadata: { userId: user.userId },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convert(summary.total.amount || 0, currency) * 100,
      currency,
      customer: customer.id,
      payment_method_types: ["card"],
      description: "purchase from eshop online store",
      metadata: {
        userId: user.userId,
        orderId,
        cart: JSON.stringify(
          summary.products.map(
            (product) => `${product.title.trim()}(${product.quantity})`
          )
        ),
      },
    });
    const { client_secret, id } = paymentIntent;

    eventEmitter.emit("payment_intent.created", {
      orderId,
      userId: user.userId,
      summary,
      currency,
      payment: paymentIntent,
    });

    return res.send({ _clst: client_secret, _pid: id });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send();
  }
};

const cancelPaymentIntent = async (req, res) => {
  try {
    const { _pid } = req.body;
    const paymentIntent = await stripe.paymentIntents.cancel(_pid);
    console.log("Payment Intent Status: " + paymentIntent?.status);
    return res.send({ success: paymentIntent?.status === "canceled" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send();
  }
};

const webHook = async (req, res) => {
  let event = req.body;
  let webhookSecret;
  if (webhookSecret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.status(400).send();
    }
  }

  const data = event.data.object;
  const eventType = event.type;

  // Handle the checkout.session.completed event
  switch (eventType) {
    case "payment_intent.succeeded":
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            const orderId = data.metadata.orderId;
            const userId = new ObjectId(data.metadata.userId);
            const order = {};
            order["user"] = userId;
            order["paymentId"] = data.id;
            order["paymentStatus"] = data.status;
            order["orderOn"] = new Date();
            order["currency"] = data.currency;
            order["paymentMethod"] = data.payment_method;
            order["paymentType"] = data.payment_method_types[0];
            order["shipping"] = data.shipping;
            order["status"] = "AwaitingDelivery";
            order["stripe_customer"] = {
              id: customer.id,
              name: customer.name,
            };
            await OrderDAO.updateOrder(userId, orderId, order);
            await CartDAO.clearCart({ userId: customer.metadata.userId });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
      break;
    case "payment_intent.canceled":
      const orderId = data.metadata.orderId;
      const userId = new ObjectId(data.metadata.userId);
      await OrderDAO.deleteOrder(userId, orderId);
      break;
    default:
      console.log(`Unhandled event type ${eventType}`);
  }

  res.status(200).end();
};

eventEmitter.on("payment_intent.created", async (data) => {
  // console.log(data);
  const { orderId, userId, summary, currency, payment } = data;
  const newOrder = {};
  newOrder["_id"] = orderId;
  newOrder["user"] = new ObjectId(userId);
  newOrder["paymentId"] = payment["id"];
  newOrder["paymentStatus"] = payment["status"];
  newOrder["totalCost"] = summary["total"]["amount"];
  newOrder["orderOn"] = new Date();
  newOrder["currency"] = currency;
  newOrder["paymentMethod"] = payment["payment_method"];
  newOrder["paymentType"] = payment["payment_method_types"][0];
  newOrder["status"] = "Initiated";
  newOrder["summary"] = {
    subTotal: summary["subTotal"]["amount"],
    discount: summary["discount"]["amount"],
    delivery: summary["deliveryOption"]["deliveryCharge"]["amount"],
    total: summary["total"]["amount"],
    promotionApplied: summary["promotionApplied"]["amount"],
  };
  newOrder["products"] = summary["products"].map((product) => {
    const _product = {
      _id: new ObjectId(product._id),
      title: product["title"],
      thumbnail: product["thumbnail"],
      quantity: product["quantity"],
      category: product["category"],
      price: product["price"]["amount"],
      totalPrice: product["totalPrice"]["amount"],
    };
    return _product;
  });
  newOrder["createdAt"] = new Date();
  newOrder["lastModifiedAt"] = new Date();
  await OrderDAO.createOrder(newOrder);
});

export default {
  createPaymentIntent,
  cancelPaymentIntent,
  webHook,
};
