// src/pages/JoinTournament.jsx
import React, { useState } from "react";

function JoinTournament() {
  const [tournamentCode, setTournamentCode] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Joining Tournament:", tournamentCode, "as", teamName);
    // Add logic here to join tournament using backend or Firestore
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-100 p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Join Tournament
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Tournament Code
          </label>
          <input
            type="text"
            value={tournamentCode}
            onChange={(e) => setTournamentCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default JoinTournament;
