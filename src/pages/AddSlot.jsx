// src/pages/AddSlot.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

const AddSlot = () => {
  const [teams, setTeams] = useState([]);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔁 Fetch teams and assigned slots
  useEffect(() => {
    const fetchData = async () => {
      const teamsSnapshot = await getDocs(collection(db, "teams"));
      const teamList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().teamName,
      }));
      setTeams(teamList);

      const slotsSnapshot = await getDocs(collection(db, "slots"));
      const slotList = slotsSnapshot.docs.map((doc) => ({
        teamName: doc.data().teamName,
        slotNo: doc.data().slotNo,
      }));
      setAssignedSlots(slotList);
    };

    fetchData();
  }, []);

  const getNextSlotNo = () => {
    const used = assignedSlots.map((s) => s.slotNo);
    for (let i = 2; i <= 24; i++) {
      if (!used.includes(`slot${i}`)) {
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

    if (assignedSlots.some((s) => s.teamName === selectedTeam)) {
      setMessage("⚠️ This team already has a slot.");
      return;
    }

    const nextSlot = getNextSlotNo();
    if (!nextSlot) {
      setMessage("❌ All 23 slots are already assigned.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "slots"), {
        teamName: selectedTeam,
        slotNo: nextSlot,
        createdAt: new Date(),
      });

      setAssignedSlots((prev) => [
        ...prev,
        { teamName: selectedTeam, slotNo: nextSlot },
      ]);
      setSelectedTeam("");
      setMessage(`✅ Assigned ${nextSlot} to ${selectedTeam}`);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Assign Slot</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 border rounded"
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
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleAssign}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Assigning..." : "Assign Slot"}
        </button>

        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">🗂️ Assigned Slots:</h4>
          <ul className="text-sm text-gray-700">
            {assignedSlots.map((slot, i) => (
              <li key={i}>
                {slot.slotNo} → {slot.teamName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddSlot;
