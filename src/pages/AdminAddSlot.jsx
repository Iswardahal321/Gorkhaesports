import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const AdminAddSlot = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [slotNumber, setSlotNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, "teams"));
      const list = snap.docs.map(doc => ({
        id: doc.id,
        teamName: doc.data().teamName,
        userId: doc.data().userId
      }));
      setTeams(list);
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !slotNumber) return alert("❌ Fill all fields");

    try {
      setLoading(true);
      await addDoc(collection(db, "slots"), {
        teamName: selectedTeam.teamName,
        userId: selectedTeam.userId,
        slotNumber: parseInt(slotNumber),
        createdAt: Timestamp.now(),
      });

      setSlotNumber("");
      setSelectedTeam(null);
      setSuccess("✅ Slot assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Error adding slot:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">🎯 Assign Slot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Team</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedTeam?.teamName || ""}
            onChange={(e) => {
              const team = teams.find(t => t.teamName === e.target.value);
              setSelectedTeam(team || null);
            }}
            required
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        {selectedTeam && (
          <div className="text-sm text-gray-600">
            <p><strong>UID:</strong> {selectedTeam.userId}</p>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Slot Number</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
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
          {loading ? "Adding..." : "Assign Slot"}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AdminAddSlot;
