// 📁 api/razorpay.js

import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: "receipt_order_123",
  };

  try {
    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Order creation failed" });
  }
}
