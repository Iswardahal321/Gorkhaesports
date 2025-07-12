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
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });
        }

        // ✅ Check if user already joined
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "tournament_joins"),
            where("tournamentId", "==", id),
            where("userId", "==", user.uid)
          );
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            setJoinInfo(qSnap.docs[0].data());
          }
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
        const joinRef = await addDoc(collection(db, "tournament_joins"), {
          tournamentId: tournament.id,
          userId: user.uid,
          email: user.email,
          paymentId: response.razorpay_payment_id,
          joinedAt: new Date(),
          fee: tournament.entryFee,
          type: tournament.type || "Unknown",
        });
        const newJoinInfo = {
          tournamentId: tournament.id,
          userId: user.uid,
          email: user.email,
          paymentId: response.razorpay_payment_id,
          joinedAt: new Date(),
          fee: tournament.entryFee,
          type: tournament.type || "Unknown",
        };
        setJoinInfo(newJoinInfo);
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!tournament) return <p className="text-center mt-10">Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>
      <p className="mb-2">Type: {tournament.type}</p>
      <p className="mb-4">💰 Entry Fee: ₹{tournament.entryFee}</p>

      {joinInfo ? (
        <div className="bg-green-50 border border-green-400 p-4 rounded mt-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">🎉 You have joined this tournament</h3>
          <p><strong>Payment ID:</strong> {joinInfo.paymentId}</p>
          <p><strong>Type:</strong> {joinInfo.type}</p>
          <p><strong>Fee Paid:</strong> ₹{joinInfo.fee}</p>
          <p><strong>Joined At:</strong> {new Date(joinInfo.joinedAt?.seconds * 1000).toLocaleString()}</p>
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
