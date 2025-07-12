// 📁 src/pages/SlotList.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [myTeam, setMyTeam] = useState("");
  const [selectedType, setSelectedType] = useState("daily");

  useEffect(() => {
    const fetchMyTeam = async () => {
      const userEmail = auth.currentUser?.email;
      const teamSnap = await getDocs(collection(db, "teams"));
      const myTeamDoc = teamSnap.docs.find(
        (doc) => doc.data().leaderEmail === userEmail
      );
      if (myTeamDoc) {
        setMyTeam(myTeamDoc.data().teamName.trim());
      }
    };

    fetchMyTeam();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      const colName =
        selectedType === "daily" ? "daily_slots" : "weekly_slots";
      const snapshot = await getDocs(collection(db, colName));
      const slotData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.slotNumber - b.slotNumber)
        .map((data, index) => ({
          ...data,
          slno: index + 1,
        }));

      setSlots(slotData);
    };

    fetchSlots();
  }, [selectedType]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Slot List</h2>

      {/* 🔽 Type Selector */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Scrim Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full md:w-60"
        >
          <option value="daily">Daily Scrim</option>
          <option value="weekly">Weekly War</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">Sl. No</th>
              <th className="py-2 px-4 border">Team Name</th>
              <th className="py-2 px-4 border text-center">Slot No</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr
                key={slot.id}
                className={
                  slot.teamName.trim() === myTeam
                    ? "bg-green-100 font-semibold"
                    : "hover:bg-gray-100"
                }
              >
                <td className="py-2 px-4 border text-center">{slot.slno}</td>
                <td className="py-2 px-4 border">{slot.teamName}</td>
                <td className="py-2 px-4 border text-center">
                  {slot.slotNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {slots.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No slots assigned yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SlotList;
