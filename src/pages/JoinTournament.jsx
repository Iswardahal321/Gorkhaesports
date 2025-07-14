import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { loadScript } from "../utils/loadScript";

const JoinTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinInfo, setJoinInfo] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let docRef = doc(db, "games_daily", id);
        let docSnap = await getDoc(docRef);
        let type = "Daily Scrim";

        if (!docSnap.exists()) {
          docRef = doc(db, "games_weekly", id);
          docSnap = await getDoc(docRef);
          type = "Weekly War";
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTournament({
            id: docSnap.id,
            type,
            entryFee: data.fee || 0,
            name: data.name || "Untitled",
            ...data,
          });

          const user = auth.currentUser;
          if (user) {
            const q = query(
              collection(db, "tournament_joins"),
              where("tournamentId", "==", docSnap.id),
              where("userId", "==", user.uid)
            );
            const qSnap = await getDocs(q);
            if (!qSnap.empty) {
              setJoinInfo(qSnap.docs[0].data());
            }
          }
        } else {
          setTournament(null);
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePayment = async () => {
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      showMessage("❌ Razorpay SDK failed to load", "error");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showMessage("❌ You must be logged in", "error");
      return;
    }

    try {
      // 🔸 Call serverless API to create order
      const res = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: tournament.entryFee }),
      });

      const orderData = await res.json();

      const options = {
        key: "rzp_test_AvXRP4rfovLSun", // 🔁 Replace with LIVE key later
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Gorkha Esports",
        description: tournament.name,
        order_id: orderData.id, // ✅ Razorpay Order ID
        handler: async function (response) {
          await addDoc(collection(db, "tournament_joins"), {
            tournamentId: tournament.id,
            userId: user.uid,
            email: user.email,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            type: tournament.type,
            fee: tournament.entryFee,
            joinedAt: new Date(),
          });
          setJoinInfo({
            paymentId: response.razorpay_payment_id,
            type: tournament.type,
            fee: tournament.entryFee,
          });
          showMessage("✅ Joined successfully!", "success");
        },
        prefill: {
          name: user.displayName || "Player",
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showMessage("❌ Payment failed. Try again.", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading...</p>;
  if (!tournament) return <p className="text-center mt-10">❌ Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>
      <p className="text-gray-700 mb-1">🎮 Type: {tournament.type}</p>
      <p className="text-gray-700 mb-4">💰 Entry Fee: ₹{tournament.entryFee}</p>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {joinInfo ? (
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold text-green-700 mb-2">🎫 Payment Details</h3>
          <p className="text-sm">🆔 Payment ID: {joinInfo.paymentId}</p>
          <p className="text-sm">🎮 Type: {joinInfo.type}</p>
          <p className="text-sm">💰 Paid: ₹{joinInfo.fee}</p>
        </div>
      ) : (
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Pay & Join Tournament
        </button>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default JoinTournament;
