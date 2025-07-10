// pages/Payment.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const Payment = () => {
  const location = useLocation();
  const { type, data } = location.state || {};

  const handlePayment = async () => {
    const options = {
      key: "rzp_test_YourKey", // Razorpay key
      amount: (type === "daily" ? data.dailyFee : data.weeklyFee) * 100,
      currency: "INR",
      name: "Gorkha Esports",
      description: `${type === "daily" ? "Daily Scrim" : "Weekly War"}`,
      handler: async function (response) {
        const col = type === "daily" ? "dailyScrimUsers" : "weeklyWarUsers";
        await addDoc(collection(db, col), {
          tournamentId: data.id,
          paymentId: response.razorpay_payment_id,
          joinedAt: new Date(),
        });
        alert("Payment Successful!");
      },
      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (data) handlePayment();
  }, [data]);

  return <div className="p-8">Redirecting to Razorpay...</div>;
};

export default Payment;
