// src/pages/AddTeam.jsx
import React, { useState } from "react";

function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([""]);

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const handleAddPlayer = () => {
    setPlayers([...players, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Team Name:", teamName);
    console.log("Players:", players);
    // You can send this data to your backend or Firestore
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-100 p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add Team</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Players
          </label>
          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
              placeholder={`Player ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={handleAddPlayer}
            className="text-sm text-blue-600 mt-2"
          >
            + Add Player
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddTeam;
