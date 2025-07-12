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

          // Check if user already joined
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
          type: tournament.type,
          fee: tournament.entryFee,
          joinedAt: new Date(),
        });
        setJoinInfo({
          paymentId: response.razorpay_payment_id,
          type: tournament.type,
          fee: tournament.entryFee,
        });
        alert("Tournament Joined Successfully!");
      },
      prefill: {
        name: user.displayName || "User",
        email: user.email,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading...</p>;
  if (!tournament) return <p className="text-center mt-10">❌ Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>
      <p className="text-gray-700 mb-1">🎮 Type: {tournament.type}</p>
      <p className="text-gray-700 mb-4">💰 Entry Fee: ₹{tournament.entryFee}</p>

      {joinInfo ? (
        <div className="p-4 bg-green-100 rounded">
          <p className="text-green-700 font-semibold">✅ Already Joined</p>
          <p className="text-sm mt-1">🆔 Payment ID: {joinInfo.paymentId}</p>
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
    </div>
  );
};

export default JoinTournament;
