// src/pages/AddTeam.jsx
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    if (players.length >= 5) {
      setError("❌ Max 5 players allowed.");
      return;
    }
    setPlayers([...players, ""]);
    setError("");
  };

  const handlePlayerChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return alert("User not authenticated!");

    if (!teamName.trim() || players.some((p) => p.trim() === "")) {
      setError("❌ Fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "teams"), {
        teamName,
        players,
        leaderEmail: currentUser.email,
        leaderName: currentUser.displayName || "Anonymous",
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding team:", err);
      setError("❌ Failed to add team.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🛡️ Create Your Team</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Team Name"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />

          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1} Name`}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              required
            />
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {players.length < 5 && (
            <button
              type="button"
              onClick={handleAddPlayer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              ➕ Add Player
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
          >
            🚀 Submit Team
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTeam;
