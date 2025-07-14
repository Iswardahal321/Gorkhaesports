// 📁 /api/razorpay.js

const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const { amount } = req.body;

    const order = await instance.orders.create({
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 100000),
    });

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      order_id: order.id,
    });
  } catch (error) {
    console.error("🔥 Razorpay Error:", error);
    res.status(500).json({ error: "A server error occurred" });
  }
};
