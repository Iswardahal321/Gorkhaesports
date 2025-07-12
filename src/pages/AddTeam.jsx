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
  const [mobileExists, setMobileExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      const mobile = userSnap.data()?.mobile;
      if (mobile) setMobileExists(true);

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
      }
    };

    fetchData();
  }, []);

  const handleAddPlayer = () => {
    if (players.length < 5) {
      setPlayers([...players, ""]);
    }
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
    const mobile = userSnap.data()?.mobile;

    if (!mobile || mobile.trim() === "") {
      setMessage("❌ Please add your mobile number first from Profile section.");
      setLoading(false);
      return;
    }

    if (players.length !== 5 || players.some((p) => p.trim() === "")) {
      setMessage("❌ Please enter exactly 5 player names (no empty fields).");
      setLoading(false);
      return;
    }

    try {
      const teamData = {
        teamName,
        players,
        leaderEmail: currentUser.email,
        leaderName: currentUser.displayName || "Anonymous",
        createdAt: new Date(),
      };

      if (existingTeamId) {
        await updateDoc(doc(db, "teams", existingTeamId), teamData);
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
          disabled={players.length >= 5}
          className={`px-4 py-2 rounded ${
            players.length >= 5
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          + Add Player
        </button>

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
