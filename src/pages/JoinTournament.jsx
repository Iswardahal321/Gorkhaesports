import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function JoinTournament() {
  const [tournamentCode, setTournamentCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [fee, setFee] = useState(null);
  const [tournamentName, setTournamentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feeFetched, setFeeFetched] = useState(false);

  const fetchFee = async () => {
    if (!tournamentCode) return alert("Enter tournament code first");

    try {
      setLoading(true);
      const docRef = doc(db, "tournaments", tournamentCode);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setFee(data.fee || 0);
        setTournamentName(data.name || "Unnamed Tournament");
        setFeeFetched(true);
      } else {
        alert("❌ Tournament not found");
        setFee(null);
        setFeeFetched(false);
      }
    } catch (err) {
      console.error("Error fetching fee:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    const options = {
      key: "rzp_test_AvXRP4rfovLSun",
      amount: fee * 100,
      currency: "INR",
      name: "Gorkha Esports",
      description: `Entry for ${tournamentName}`,
      handler: function (response) {
        alert("✅ Payment Successful\nID: " + response.razorpay_payment_id);
        // TODO: Save payment info in Firestore
      },
      prefill: {
        name: teamName,
        email: "user@example.com",
        contact: "9999999999",
      },
      notes: {
        tournament_code: tournamentCode,
        team_name: teamName,
      },
      theme: { color: "#22c55e" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-100 p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Join Tournament</h2>

        {/* Tournament Code */}
        <div className="mb-3">
          <label className="block text-gray-700 font-semibold mb-1">Tournament Code</label>
          <input
            type="text"
            value={tournamentCode}
            onChange={(e) => {
              setTournamentCode(e.target.value);
              setFee(null);
              setFeeFetched(false);
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            onClick={fetchFee}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Fetch Tournament Details
          </button>
        </div>

        {/* Fee Display */}
        {feeFetched && (
          <>
            <div className="mb-3 text-sm text-gray-700">
              <strong>Tournament:</strong> {tournamentName}
              <br />
              <strong>Entry Fee:</strong> ₹{fee}
            </div>

            {/* Team Name Input */}
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            {/* Pay & Join */}
            <button
              disabled={!teamName || loading}
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Pay ₹{fee} & Join
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default JoinTournament;
