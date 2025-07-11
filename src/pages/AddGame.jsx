// src/pages/AddGame.jsx
import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // ✅ UPDATED
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddGame() {
  const [gameType, setGameType] = useState("Weekly War");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fee || !description) {
      setError("All fields are required.");
      return;
    }

    try {
      // ✅ Use gameType as document ID for uniqueness
      const gameRef = doc(db, "games", gameType);
      await setDoc(gameRef, {
        gameType,
        fee,
        description,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Failed to add or update game. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center">Add New Game</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Game Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
            >
              <option>Weekly War</option>
              <option>Daily Scrim</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Entry Fee (₹)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Game Description</label>
            <textarea
              rows="4"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter rules, format, map details, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddGame;
