import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";

const IDPass = () => {
  const [weekly, setWeekly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [myUserId, setMyUserId] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return;
    setMyUserId(auth.currentUser.uid);

    const fetchIDPass = async () => {
      const snap = await getDocs(collection(db, "id_pass"));
      const now = Timestamp.now();

      snap.docs.forEach((doc) => {
        const data = doc.data();
        const { type, showTime } = data;

        if (showTime?.seconds <= now.seconds) {
          if (type === "Weekly War") setWeekly(data);
          else if (type === "Daily Scrim") setDaily(data);
        }
      });
    };

    fetchIDPass();
  }, []);

  const [hasWeeklySlot, setHasWeeklySlot] = useState(false);
  const [hasDailySlot, setHasDailySlot] = useState(false);

  useEffect(() => {
    const checkSlots = async () => {
      const wSnap = await getDocs(collection(db, "weekly_slots"));
      const dSnap = await getDocs(collection(db, "daily_slots"));

      wSnap.forEach((doc) => {
        if (doc.data().userId === myUserId) setHasWeeklySlot(true);
      });
      dSnap.forEach((doc) => {
        if (doc.data().userId === myUserId) setHasDailySlot(true);
      });
    };

    if (myUserId) checkSlots();
  }, [myUserId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied("✅ Copied to clipboard");
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🆔 Room ID & Password</h2>

      <div className="grid grid-cols-2 gap-4 max-w-xl">
        {/* Daily Scrim */}
        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2 text-green-600">
            🎮 Daily Scrim
          </h3>
          {hasDailySlot ? (
            daily ? (
              <>
                <p>
                  <strong>Room ID:</strong>{" "}
                  <span
                    onClick={() => handleCopy(daily.roomId)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    {daily.roomId} (Tap to Copy)
                  </span>
                </p>
                <p>
                  <strong>Password:</strong>{" "}
                  <span
                    onClick={() => handleCopy(daily.password)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    {daily.password} (Tap to Copy)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">Not yet available.</p>
            )
          ) : (
            <p className="text-red-500">You don't have a Daily Scrim slot.</p>
          )}
        </div>

        {/* Weekly War */}
        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">
            ⚔️ Weekly War
          </h3>
          {hasWeeklySlot ? (
            weekly ? (
              <>
                <p>
                  <strong>Room ID:</strong>{" "}
                  <span
                    onClick={() => handleCopy(weekly.roomId)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    {weekly.roomId} (Tap to Copy)
                  </span>
                </p>
                <p>
                  <strong>Password:</strong>{" "}
                  <span
                    onClick={() => handleCopy(weekly.password)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    {weekly.password} (Tap to Copy)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">Not yet available.</p>
            )
          ) : (
            <p className="text-red-500">You don't have a Weekly War slot.</p>
          )}
        </div>
      </div>

      {/* ✅ Copied Message */}
      {copied && (
        <p className="text-green-600 mt-4 font-medium text-center">{copied}</p>
      )}
    </div>
  );
};

export default IDPass;
