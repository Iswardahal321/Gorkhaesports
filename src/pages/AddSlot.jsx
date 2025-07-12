import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminAddSlot = () => {
  const [scrimType, setScrimType] = useState("");
  const [paidUsers, setPaidUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [assignedDaily, setAssignedDaily] = useState([]);
  const [assignedWeekly, setAssignedWeekly] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [slotNumber, setSlotNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [popupType, setPopupType] = useState(""); // 'daily' or 'weekly'
  const [slotList, setSlotList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        teamName: doc.data().teamName.trim(),
      }));
      setTeams(data);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAssignedSlots = async () => {
      const daily = await getDocs(collection(db, "daily_slots"));
      const weekly = await getDocs(collection(db, "weekly_slots"));
      setAssignedDaily(daily.docs.map((doc) => doc.data().userId));
      setAssignedWeekly(weekly.docs.map((doc) => doc.data().userId));
    };
    fetchAssignedSlots();
  }, []);

  useEffect(() => {
    const fetchPaidUsers = async () => {
      const snapshot = await getDocs(collection(db, "tournament_joins"));
      const filtered = snapshot.docs
        .map((doc) => doc.data())
        .filter((data) =>
          scrimType === "daily"
            ? data.type === "Daily Scrim"
            : data.type === "Weekly War"
        );
      setPaidUsers(filtered);
    };

    if (scrimType) fetchPaidUsers();
  }, [scrimType]);

  useEffect(() => {
    const fetchNextSlot = async () => {
      if (!scrimType) return;
      const colName = scrimType === "daily" ? "daily_slots" : "weekly_slots";
      const snap = await getDocs(collection(db, colName));
      const nums = snap.docs.map((doc) => doc.data().slotNumber || 0);
      const max = nums.length > 0 ? Math.max(...nums) : 0;
      setSlotNumber(max + 1);
    };

    fetchNextSlot();
  }, [scrimType]);

  const handleTeamSelect = (e) => {
    const uid = e.target.value;
    const team = teams.find((t) => t.userId === uid);
    if (team) {
      setSelectedTeam({ teamName: team.teamName, userId: uid });
    } else {
      setSelectedTeam(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scrimType || !selectedTeam || !slotNumber) {
      alert("❌ Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const colName = scrimType === "daily" ? "daily_slots" : "weekly_slots";
      await addDoc(collection(db, colName), {
        teamName: selectedTeam.teamName,
        userId: selectedTeam.userId,
        slotNumber,
        createdAt: Timestamp.now(),
      });

      setSelectedTeam(null);
      setSuccess("✅ Slot assigned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Slot error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const openSlotList = async (type) => {
    setPopupType(type);
    const col = type === "daily" ? "daily_slots" : "weekly_slots";
    const snap = await getDocs(collection(db, col));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSlotList(data);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    const col = popupType === "daily" ? "daily_slots" : "weekly_slots";
    const ok = window.confirm("Are you sure you want to delete this slot?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, col, id));
      setSlotList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const filteredTeamUsers = paidUsers.filter((u) => {
    if (scrimType === "daily") {
      return !assignedDaily.includes(u.userId);
    } else {
      return !assignedWeekly.includes(u.userId);
    }
  });

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">🎯 Assign Slot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Scrim Type</label>
          <select
            value={scrimType}
            onChange={(e) => setScrimType(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Select --</option>
            <option value="daily">Daily Scrim</option>
            <option value="weekly">Weekly War</option>
          </select>
        </div>

        {scrimType && (
          <>
            <div>
              <label className="block mb-1 font-medium">Select Team</label>
              <select
                onChange={handleTeamSelect}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Choose Team --</option>
                {filteredTeamUsers.map((u, idx) => {
                  const team = teams.find((t) => t.userId === u.userId);
                  return (
                    team && (
                      <option key={idx} value={u.userId}>
                        {team.teamName}
                      </option>
                    )
                  );
                })}
              </select>
            </div>

            {selectedTeam?.userId && (
              <div className="text-sm text-gray-600">
                <strong>UID:</strong> {selectedTeam.userId}
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">Slot Number</label>
              <input
                type="number"
                className="w-full border p-2 rounded bg-gray-100"
                value={slotNumber}
                readOnly
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              {loading ? "Assigning..." : "Assign Slot"}
            </button>

            {success && <p className="text-green-600 mt-2">{success}</p>}
          </>
        )}
      </form>

      {/* ✅ View Buttons: Daily first */}
      <div className="mt-6 flex gap-4 justify-center">
        <button
          onClick={() => openSlotList("daily")}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          📆 View Daily Slots
        </button>
        <button
          onClick={() => openSlotList("weekly")}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          📅 View Weekly Slots
        </button>
      </div>

      {/* ✅ Popup Slot Table */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-lg p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-3">
              {popupType === "daily" ? "🧾 Daily Slots" : "📋 Weekly Slots"}
            </h3>

            {slotList.length === 0 ? (
              <p>No slots found.</p>
            ) : (
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-1">Slot</th>
                    <th className="border p-1">Team</th>
                    <th className="border p-1">UID</th>
                    <th className="border p-1">❌</th>
                  </tr>
                </thead>
                <tbody>
                  {slotList.map((s) => (
                    <tr key={s.id}>
                      <td className="border p-1 text-center">{s.slotNumber}</td>
                      <td className="border p-1">{s.teamName}</td>
                      <td className="border p-1 text-xs">{s.userId}</td>
                      <td className="border p-1 text-center">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="text-right mt-3">
              <button
                onClick={() => setShowPopup(false)}
                className="text-blue-600 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddSlot;
