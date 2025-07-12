import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { loadScript } from "../utils/loadScript";

const JoinTournament = () => {
  const { type, id } = useParams(); // ✅ type and id from URL
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionName =
      type === "dailyscrim" ? "games_daily" : "games_weekly"; // ✅ normalize type

    const fetchTournament = async () => {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [type, id]);

  const handlePayment = async () => {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    const user = auth.currentUser;

    const options = {
      key: "rzp_test_AvXRP4rfovLSun",
      amount: tournament.fee * 100,
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
      <p className="mb-2">Type: {type}</p>
      <p className="mb-4">💰 Entry Fee: ₹{tournament.fee}</p>

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
