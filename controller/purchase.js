const Razorpay = require("razorpay");
const Order = require("../models/order");
require("dotenv").config();

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      const create = await req.user.createOrder({
        orderid: order.id,
        status: "PENDING",
      });
      if (create) {
        return res.status(201).json({ order, key_id: rzp.key_id });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ message: "something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const p1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFULL",
    });
    const p2 = req.user.update({ ispremiumuser: true });
    const promise = await Promise.all([p1, p2]);
    if (promise) {
      res.status(202).json({
        success: true,
        message: "Transaction successful",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
