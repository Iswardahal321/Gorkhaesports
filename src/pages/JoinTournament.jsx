import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { loadScript } from "../utils/loadScript";

const JoinTournament = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ✅ Store user safely

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u); // ✅ Auth-safe user
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handlePayment = async () => {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!user) {
      alert("Please log in again");
      return;
    }

    const options = {
      key: "rzp_test_AvXRP4rfovLSun",
      amount: tournament.entryFee * 100,
      currency: "INR",
      name: "Gorkha Esports",
      description: tournament.name,
      handler: async function (response) {
        try {
          await addDoc(collection(db, "tournament_joins"), {
            tournamentId: tournament.id,
            userId: user.uid,
            email: user.email,
            paymentId: response.razorpay_payment_id,
            joinedAt: new Date(),
          });
          alert("Tournament Joined Successfully!");
        } catch (err) {
          alert("Join failed. Try again.");
        }
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
