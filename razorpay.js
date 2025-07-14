// 📁 /api/razorpay.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
  });
}
