import React, { useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const AdminAddSlot = () => {
  const [teamName, setTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lastSlotInfo, setLastSlotInfo] = useState(null);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLastSlotInfo(null);

    if (!teamName || !slotNumber) {
      setError("❌ Fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // 🔍 Find team by name
      const teamQuery = query(
        collection(db, "teams"),
        where("teamName", "==", teamName.trim())
      );
      const teamSnap = await getDocs(teamQuery);

      if (teamSnap.empty) {
        setError("❌ Team not found.");
        setLoading(false);
        return;
      }

      const teamData = teamSnap.docs[0].data();
      const userId = teamData.userId || teamSnap.docs[0].id; // fallback to team doc id if userId not found

      // ✅ Add slot with teamName, userId, slotNumber
      await addDoc(collection(db, "slots"), {
        teamName: teamName.trim(),
        slotNumber: parseInt(slotNumber),
        userId,
        createdAt: Timestamp.now(),
      });

      setSuccess("✅ Slot added successfully!");
      setLastSlotInfo({
        teamName: teamName.trim(),
        slotNumber: parseInt(slotNumber),
        userId,
      });

      setTeamName("");
      setSlotNumber("");
      setTimeout(() => {
        setSuccess("");
        setLastSlotInfo(null);
      }, 4000);
    } catch (error) {
      console.error("Error adding slot:", error);
      setError("❌ Something went wrong.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">➕ Assign Slot</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Team Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Slot Number</label>
          <input
            type="number"
            className="w-full border border-gray-300 p-2 rounded"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Slot"}
        </button>

        {success && <p className="text-green-600 mt-3">{success}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}

        {lastSlotInfo && (
          <div className="bg-gray-100 p-4 mt-4 rounded text-sm">
            <p><strong>✅ Assigned Details:</strong></p>
            <p>🧠 Team: <span className="font-medium">{lastSlotInfo.teamName}</span></p>
            <p>🎯 Slot: <span className="font-medium">{lastSlotInfo.slotNumber}</span></p>
            <p>🆔 UID: <code className="bg-gray-200 px-1 py-0.5 rounded">{lastSlotInfo.userId}</code></p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminAddSlot;
