// 📁 api/createOrder.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_order_" + Math.floor(Math.random() * 1000000),
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: "Order creation failed", detail: err });
  }
}
