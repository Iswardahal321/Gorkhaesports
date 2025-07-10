// src/pages/AddTeam.jsx
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([""]);
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    setPlayers([...players, ""]);
  };

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (!currentUser) return alert("Not authenticated");

    await addDoc(collection(db, "teams"), {
      teamName,
      players,
      leaderEmail: currentUser.email,
      leaderName: currentUser.displayName || "Anonymous",
      createdAt: new Date(),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Add Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Team Name"
          className="border px-4 py-2 w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        <div className="space-y-2">
          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1} Name`}
              className="border px-4 py-2 w-full"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPlayer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Player
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Team
        </button>
      </form>
    </div>
  );
}

export default AddTeam;
