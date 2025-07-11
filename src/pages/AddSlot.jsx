// src/pages/AddSlot.jsx

import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const AddSlot = () => {
  const [slotNo, setSlotNo] = useState("");
  const [teamName, // src/pages/AddSlotPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

function AddSlotPanel() {
  const [teams, setTeams] = useState([]);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const teamList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().teamName,
      }));
      setTeams(teamList);
    };

    const fetchAssignedSlots = async () => {
      const snapshot = await getDocs(collection(db, "slots"));
      const slots = snapshot.docs.map((doc) => ({
        id: doc.id,
        teamName: doc.data().teamName,
        slotNo: doc.data().slotNo,
      }));
      setAssignedSlots(slots);
    };

    fetchTeams();
    fetchAssignedSlots();
  }, []);

  const getNextSlotNumber = () => {
    const existingSlotNumbers = assignedSlots.map((s) => s.slotNo);
    for (let i = 2; i <= 24; i++) {
      if (!existingSlotNumbers.includes(`slot${i}`)) {
        return `slot${i}`;
      }
    }
    return null;
  };

  const handleAssign = async () => {
    setMessage("");
    if (!selectedTeam) {
      setMessage("❌ Please select a team.");
      return;
    }

    if (assignedSlots.find((s) => s.teamName === selectedTeam)) {
      setMessage("⚠️ This team is already assigned a slot.");
      return;
    }

    const nextSlot = getNextSlotNumber();
    if (!nextSlot) {
      setMessage("❌ Maximum 23 slots already assigned.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "slots"), {
        teamName: selectedTeam,
        slotNo: nextSlot,
        createdAt: new Date(),
      });
      setMessage(`✅ Slot assigned: ${nextSlot}`);
      setAssignedSlots((prev) => [
        ...prev,
        { teamName: selectedTeam, slotNo: nextSlot },
      ]);
      setSelectedTeam("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign slot.");
    }
    setLoading(false);
  };

  const availableTeams = teams.filter(
    (team) => !assignedSlots.some((s) => s.teamName === team.name)
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Assign Slot to Team</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Select a Team --</option>
            {availableTeams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p
            className={`text-sm mb-3 ${
              message.includes("✅")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">🗂️ Assigned Slots:</h4>
          <ul className="text-sm text-gray-700">
            {assignedSlots.map((s, idx) => (
              <li key={idx}>
                {s.slotNo} → {s.teamName}
              </li>
            ))// src/pages/AddSlotPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

function AddSlotPanel() {
  const [teams, setTeams] = useState([]);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const teamList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().teamName,
      }));
      setTeams(teamList);
    };

    const fetchAssignedSlots = async () => {
      const snapshot = await getDocs(collection(db, "slots"));
      const slots = snapshot.docs.map((doc) => ({
        id: doc.id,
        teamName: doc.data().teamName,
        slotNo: doc.data().slotNo,
      }));
      setAssignedSlots(slots);
    };

    fetchTeams();
    fetchAssignedSlots();
  }, []);

  const getNextSlotNumber = () => {
    const existingSlotNumbers = assignedSlots.map((s) => s.slotNo);
    for (let i = 2; i <= 24; i++) {
      if (!existingSlotNumbers.includes(`slot${i}`)) {
        return `slot${i}`;
      }
    }
    return null;
  };

  const handleAssign = async () => {
    setMessage("");
    if (!selectedTeam) {
      setMessage("❌ Please select a team.");
      return;
    }

    if (assignedSlots.find((s) => s.teamName === selectedTeam)) {
      setMessage("⚠️ This team is already assigned a slot.");
      return;
    }

    const nextSlot = getNextSlotNumber();
    if (!nextSlot) {
      setMessage("❌ Maximum 23 slots already assigned.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "slots"), {
        teamName: selectedTeam,
        slotNo: nextSlot,
        createdAt: new Date(),
      });
      setMessage(`✅ Slot assigned: ${nextSlot}`);
      setAssignedSlots((prev) => [
        ...prev,
        { teamName: selectedTeam, slotNo: nextSlot },
      ]);
      setSelectedTeam("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign slot.");
    }
    setLoading(false);
  };

  const availableTeams = teams.filter(
    (team) => !assignedSlots.some((s) => s.teamName === team.name)
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Assign Slot to Team</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Select a Team --</option>
            {availableTeams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p
            className={`text-sm mb-3 ${
              message.includes("✅")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">🗂️ Assigned Slots:</h4>
          <ul className="text-sm text-gray-700">
            {assignedSlots.map((s, idx) => (
              <li key={idx}>
                {s.slotNo} → {s.teamName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddSlotPanel;}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddSlotPanel;] = useState("");
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
