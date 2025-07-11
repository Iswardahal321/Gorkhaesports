import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function AddSlotPanel() {
  const [teams, setTeams] = useState([]);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch teams and assigned slots
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
      const docRef = await addDoc(collection(db, "slots"), {
        teamName: selectedTeam,
        slotNo: nextSlot,
        createdAt: new Date(),
      });
      setMessage(`✅ Slot assigned: ${nextSlot}`);
      setAssignedSlots((prev) => [
        ...prev,
        { id: docRef.id, teamName: selectedTeam, slotNo: nextSlot },
      ]);
      setSelectedTeam("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign slot.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "slots", id));
      setAssignedSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("❌ Failed to delete slot:", error);
      alert("❌ Failed to delete slot.");
    }
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
              message.includes("✅") ? "text-green-600" : "text-red-500"
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
          <ul className="text-sm text-gray-700 space-y-2">
            {assignedSlots.map((s) => (
              <li key={s.id} className="flex justify-between items-center border-b py-1">
                <span>
                  {s.slotNo} → {s.teamName}
                </span>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  ❌ Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddSlotPanel;
