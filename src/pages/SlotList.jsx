// 📁 src/pages/SlotList.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";

const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [myTeam, setMyTeam] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      const snapshot = await getDocs(collection(db, "slots"));
      const slotData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        slno: index + 1,
        ...doc.data(),
      }));
      setSlots(slotData);
    };

    const fetchMyTeam = async () => {
      const userEmail = auth.currentUser?.email;
      const teamSnap = await getDocs(collection(db, "teams"));
      const myTeamDoc = teamSnap.docs.find(
        (doc) => doc.data().leaderEmail === userEmail
      );
      if (myTeamDoc) {
        setMyTeam(myTeamDoc.data().teamName);
      }
    };

    fetchSlots();
    fetchMyTeam();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Slot List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Sl. No</th>
              <th className="py-2 px-4 border">Team Name</th>
              <th className="py-2 px-4 border">Slot No</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr
                key={slot.id}
                className={
                  slot.teamName === myTeam
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-100"
                }
              >
                <td className="py-2 px-4 border text-center">{slot.slno}</td>
                <td className="py-2 px-4 border">{slot.teamName}</td>
                <td className="py-2 px-4 border text-center">{slot.slotNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotList;
