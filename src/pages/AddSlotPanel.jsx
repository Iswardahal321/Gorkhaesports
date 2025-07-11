import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

function AddSlotPanel() {
  const [allTeams, setAllTeams] = useState([]);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all teams and slots
  useEffect(() => {
    const fetchData = async () => {
      const teamSnap = await getDocs(collection(db, "teams"));
      const slotSnap = await getDocs(
        query(collection(db, "assigned_slots"), orderBy("slotNo", "asc"))
      );

      const teams = teamSnap.docs.map((doc) => doc.data().teamName);
      const slots = slotSnap.docs.map((doc) => doc.data());

      setAllTeams(teams);
      setAssignedSlots(slots);
    };

    fetchData();
  }, []);

  // Filter teams not assigned yet
  useEffect(() => {
    const assignedTeamNames = assignedSlots.map((slot) => slot.teamName);
    const available = allTeams.filter((name) => !assignedTeamNames.includes(name));
    setAvailableTeams(available);
  }, [allTeams, assignedSlots]);

  const getNextSlotNo = () => 2 + assignedSlots.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nextSlot = getNextSlotNo();

    if (!selectedTeam) {
      setError("Please select a team.");
      return;
    }

    if (nextSlot > 24) {
      setError("Maximum slots filled (Slot 2 to 24).");
      return;
    }

    try {
      await addDoc(collection(db, "assigned_slots"), {
        slotNo: nextSlot,
        teamName: selectedTeam,
        timestamp: Timestamp.now(),
      });

      setSuccess(`Slot ${nextSlot} assigned to ${selectedTeam}`);
      setSelectedTeam("");
      // Refresh state
      setAssignedSlots([...assignedSlots, { slotNo: nextSlot, teamName: selectedTeam }]);
    } catch (err) {
      console.error(err);
      setError("Failed to assign slot.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-lg mt-10 rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Assign Slot to Team</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Select Team</label>
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Select a Team --</option>
            {availableTeams.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 text-gray-700">
          <strong>Next Slot:</strong> Slot {getNextSlotNo()}
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={getNextSlotNo() > 24 || availableTeams.length === 0}
        >
          Assign Slot
        </button>
      </form>
    </div>
  );
}

export default AddSlotPanel;
