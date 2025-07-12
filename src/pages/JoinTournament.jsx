// 📁 src/pages/JoinTournament.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const JoinTournament = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Auth Check
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
    });

    // ✅ Tournament Fetch
    const fetchTournament = async () => {
      try {
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error loading tournament:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
    return () => unsubscribe();
  }, [id]);

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load.");

    const options = {
      key: "rzp_test_AvXRP4rfovLSun",
      amount: tournament.entryFee * 100,
      currency: "INR",
      name: "Gorkha Esports",
      description: tournament.name,
      handler: async (response) => {
        await addDoc(collection(db, "tournament_joins"), {
          tournamentId: tournament.id,
          userId: user.uid,
          email: user.email,
          paymentId: response.razorpay_payment_id,
          joinedAt: new Date(),
        });
        alert("Tournament Joined Successfully!");
      },
      prefill: {
        name: user.displayName || "Player",
        email: user.email,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!tournament) return <p className="text-center mt-10">Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>
      <p className="mb-2">Type: {tournament.type}</p>
      <p className="mb-4">💰 Entry Fee: ₹{tournament.entryFee}</p>

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Pay & Join Tournament
      </button>
    </div>
  );
};

export default JoinTournament;
