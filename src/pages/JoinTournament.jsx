import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { loadScript } from "../utils/loadScript";

const JoinTournament = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTournament({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
        showStatus("Tournament not found.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const showStatus = (message, type) => {
    setStatusMessage(message);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 4000); // 4s me gayab
  };

  const handlePayment = async () => {
    try {
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
          showStatus("✅ Tournament Joined Successfully!", "success");
        },
        prefill: {
          name: user.displayName || "User",
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      showStatus("❌ Payment failed. Try again.", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!tournament) return <p className="text-center mt-10">Tournament not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded relative">

      {/* ✅ Message */}
      {statusMessage && (
        <div
          className={`absolute top-2 left-2 right-2 text-white text-center py-2 rounded ${
            statusType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {statusMessage}
        </div>
      )}

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
