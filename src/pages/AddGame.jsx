// src/pages/AddGame.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  query,
  limit
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddGame() {
  const [gameType, setGameType] = useState("Weekly War");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const getCollectionName = () => {
    return gameType === "Weekly War" ? "games_weekly" : "games_daily";
  };

  // ✅ Auto-fetch data on gameType change
  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setSuccess("");
      try {
        const colRef = collection(db, getCollectionName());
        const q = query(colRef, limit(1)); // Fetch only latest one
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setDocId(snapshot.docs[0].id);
          setFee(data.fee || "");
          setDescription(data.description || "");
        } else {
          setDocId(""); // No existing document
          setFee("");
          setDescription("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load game data.");
      }
    };

    fetchData();
  }, [gameType]);

  // ✅ Save or Update game
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fee || !description) {
      setError("All fields are required.");
      return;
    }

    const gameData = {
      gameType,
      fee,
      description,
      updatedAt: serverTimestamp(),
    };

    try {
      const colRef = collection(db, getCollectionName());

      if (docId) {
        await setDoc(doc(db, getCollectionName(), docId), gameData, { merge: true });
        setSuccess("Game updated successfully.");
      } else {
        const newDoc = doc(colRef);
        await setDoc(newDoc, {
          ...gameData,
          createdAt: serverTimestamp(),
        });
        setDocId(newDoc.id);
        setSuccess("Game added successfully.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save game.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center">Add / Update Game</h2>

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

          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
