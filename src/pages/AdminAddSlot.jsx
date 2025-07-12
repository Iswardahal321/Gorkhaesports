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

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!teamName || !slotNumber) {
      setError("❌ Fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // 🔍 Fetch userId from teams collection using teamName
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

      const userId = teamSnap.docs[0].data().userId;

      // ✅ Add slot with teamName, slotNumber, and userId
      await addDoc(collection(db, "slots"), {
        teamName: teamName.trim(),
        userId: userId,
        slotNumber: parseInt(slotNumber),
        createdAt: Timestamp.now(),
      });

      setTeamName("");
      setSlotNumber("");
      setSuccess("✅ Slot added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding slot:", error);
      setError("❌ Something went wrong while adding the slot.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">➕ Add Slot</h2>

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

        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
