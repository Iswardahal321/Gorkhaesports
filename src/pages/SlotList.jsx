import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedType, setSelectedType] = useState("daily");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) setUserId(uid);
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
    <div className="p-4 max-w-3xl mx-auto">
      {/* 🔽 Type Selector */}
      <div className="mb-4">
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
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto border border-gray-300 rounded">
        <table className="min-w-full bg-white text-sm">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
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
                  slot.userId === userId
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
          <p className="text-center text-gray-500 mt-4">No slots found.</p>
        )}
      </div>
    </div>
  );
};

export default SlotList;
