import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddGame() {
  const [gameType, setGameType] = useState("Weekly War");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const collectionName =
    gameType === "Daily Scrim" ? "games_daily" : "games_weekly";

  // Fetch existing data and pre-fill form
  useEffect(() => {
    const fetchGame = async () => {
      setError("");
      setSuccess("");
      try {
        const q = query(
          collection(db, collectionName),
          where("gameType", "==", gameType)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setFee(docData.fee || "");
          setDescription(docData.description || "");
        } else {
          setFee("");
          setDescription("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch game data.");
      }
    };

    fetchGame();
  }, [gameType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fee || !description) {
      setError("All fields are required.");
      return;
    }

    try {
      const gameRef = doc(
        db,
        collectionName,
        gameType.toLowerCase().replace(" ", "_")
      );
      await setDoc(gameRef, {
        gameType,
        fee,
        description,
        updatedAt: new Date(),
      });

      setSuccess("Game saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save game.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Add / Update Game
        </h2>

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
          {success && <p className="text-green-600 text-sm">{success}</p>}

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
