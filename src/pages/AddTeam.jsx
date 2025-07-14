// 📁 src/pages/AddTeam.jsx

import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingTeamId, setExistingTeamId] = useState(null);
  const [isTeamJoinedTournament, setIsTeamJoinedTournament] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "teams"),
        where("leaderEmail", "==", currentUser.email)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        setExistingTeamId(docData.id);
        const data = docData.data();
        setTeamName(data.teamName || "");
        setPlayers(data.players || [""]);

        // ✅ Check if user already joined any tournament
        const joinQ = query(
          collection(db, "tournament_joined"),
          where("userId", "==", currentUser.uid)
        );
        const joinedSnap = await getDocs(joinQ);
        setIsTeamJoinedTournament(!joinedSnap.empty);
      }
    };

    fetchTeam();
  }, []);

  const handleAddPlayer = () => {
    if (players.length >= 5) {
      setMessage("❌ Only 5 players allowed.");
      return;
    }
    setPlayers([...players, ""]);
  };

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage("❌ Not authenticated");
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDocRef);
    const phone = userSnap.data()?.phone;

    if (!phone) {
      setMessage("❌ Please add your mobile number first from Profile section.");
      setLoading(false);
      return;
    }

    if (players.some((p) => p.trim() === "")) {
      setMessage("❌ Please fill all player names before submitting.");
      setLoading(false);
      return;
    }

    try {
      const teamData = {
        teamName,
        players,
        leaderEmail: currentUser.email,
        leaderName: currentUser.displayName || "Anonymous",
        userId: currentUser.uid,
        createdAt: new Date(),
      };

      if (existingTeamId) {
        const teamRef = doc(db, "teams", existingTeamId);
        await updateDoc(teamRef, teamData);
        setMessage("✅ Team updated successfully!");
      } else {
        await addDoc(collection(db, "teams"), teamData);
        setMessage("✅ Team added successfully!");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save team.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-4">
        {existingTeamId ? "Update Your Team" : "Add Team"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Team Name"
          className="border px-4 py-2 w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          disabled={isTeamJoinedTournament}
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

        {players.length < 5 && (
          <button
            type="button"
            onClick={handleAddPlayer}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Player
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading
            ? "Saving..."
            : existingTeamId
            ? "Update Team"
            : "Submit Team"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddTeam;
