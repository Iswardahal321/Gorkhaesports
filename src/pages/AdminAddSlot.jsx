import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const AdminAddSlot = () => {
  const [teamName, setTeamName] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!teamName || !slotNumber) return alert("Fill all fields");

    try {
      setLoading(true);
      await addDoc(collection(db, "slots"), {
        teamName: teamName.trim(),
        slotNumber: parseInt(slotNumber),
        createdAt: Timestamp.now(),
      });

      setTeamName("");
      setSlotNumber("");
      setSuccess("✅ Slot added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Something went wrong");
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
      </form>
    </div>
  );
};

export default AdminAddSlot;
