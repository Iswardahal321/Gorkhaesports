// src/pages/AddSlot.jsx

import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const AddSlot = () => {
  const [slotNo, setSlotNo] = useState("");
  const [teamName, setTeamName] = useState("");
  const [slno, setSlno] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const slotRef = collection(db, "slots");
      await addDoc(slotRef, {
        slno,
        teamName,
        slotNo,
        createdAt: new Date(),
      });

      alert("✅ Slot added successfully!");
      setSlotNo("");
      setTeamName("");
      setSlno("");
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("❌ Failed to add slot.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">➕ Add Slot</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Sl. No"
          value={slno}
          onChange={(e) => setSlno(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Slot Number"
          value={slotNo}
          onChange={(e) => setSlotNo(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
