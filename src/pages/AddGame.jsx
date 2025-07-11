// src/pages/AddGame.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddGame() {
  const [gameType, setGameType] = useState("Weekly War");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [docId, setDocId] = useState(""); // To track existing doc ID if found

  const navigate = useNavigate();

  // ✅ Auto-fetch game on load
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const q = query(collection(db, "games"), where("gameType", "==", gameType));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setDocId(querySnapshot.docs[0].id);
          setFee(data.fee || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("Error fetching game:", err);
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
      const data = {
        gameType,
        fee,
        description,
        updatedAt: serverTimestamp(),
      };

      if (docId) {
        // ✅ Update if exists
        await setDoc(doc(db, "games", docId), data, { merge: true });
        setSuccess("Game updated successfully.");
      } else {
        // ✅ Add new if not exists
        const newRef = doc(collection(db, "games"));
        await setDoc(newRef, {
          ...data,
          createdAt: serverTimestamp(),
        });
        setSuccess("Game added successfully.");
        setDocId(newRef.id); // Set new docId for later updates
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add or update game. Try again.");
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
