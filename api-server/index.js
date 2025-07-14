import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/razorpay", async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ message: "Amount required" });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
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
    console.error("Razorpay error:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
