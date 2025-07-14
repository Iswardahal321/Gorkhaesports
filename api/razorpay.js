// api/razorpay.js
const Razorpay = require("razorpay");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
}
