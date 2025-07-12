// 📁 src/pages/JoinTournament.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinInfo, setJoinInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let docRef = doc(db, "games_daily", id);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          docRef = doc(db, "games_weekly", id);
          docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });

          // ✅ Check if user already joined
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
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePayment = async () => {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    const user = auth.currentUser;

    const options = {
      key: "rzp_test_AvXRP4rfovLSun",
      amount: tournament.entryFee * 100,
      currency: "INR",
      name: "Gorkha Esports",
      description: tournament.name,
      handler: async function (response) {
        await addDoc(collection(db, "tournament_joins"), {
          tournamentId: tournament.id,
          userId: user.uid,
          email: user.email,
          paymentId: response.razorpay_payment_id,
          joinedAt: new Date(),
        });
        alert("✅ Tournament Joined Successfully!");
        window.location.reload(); // Reload to show join info
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
  if (!tournament) return <p className="text-center mt-10 text-red-600">Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
      <p className="text-gray-700 mb-1">🎮 Type: {tournament.type}</p>
      <p className="text-gray-700 mb-4">💰 Entry Fee: ₹{tournament.entryFee}</p>

      {joinInfo ? (
        <div className="bg-green-100 text-green-800 p-4 rounded shadow-sm">
          <p className="font-semibold mb-2">✅ You have already joined this tournament</p>
          <p><strong>Payment ID:</strong> {joinInfo.paymentId}</p>
          <p><strong>Email:</strong> {joinInfo.email}</p>
          <p><strong>Joined On:</strong> {new Date(joinInfo.joinedAt.seconds * 1000).toLocaleString()}</p>
        </div>
      ) : (
        <button
          onClick={handlePayment}
          className="w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Pay & Join Tournament
        </button>
      )}
    </div>
  );
};

export default JoinTournament;
