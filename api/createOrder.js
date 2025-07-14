// 📁 api/createOrder.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;

  const razorpay = new Razorpay({
    key_id: "rzp_test_gYtWdi1vpxeR7f",         // 🟡 Replace with LIVE key later
    key_secret: "xCAvwkYqQvrNqgazbN5FtOX1l"     // 🟡 Replace with LIVE secret later
  });

  const options = {
    amount: amount * 100,  // Razorpay needs paise
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
