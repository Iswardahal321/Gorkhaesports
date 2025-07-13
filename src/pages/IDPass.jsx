// 📁 src/pages/IDPass.jsx

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const IDPass = () => {
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [hasDailySlot, setHasDailySlot] = useState(false);
  const [hasWeeklySlot, setHasWeeklySlot] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubDaily = onSnapshot(doc(db, "daily_idp", "current"), (snap) => {
      if (snap.exists()) setDaily(snap.data());
      else setDaily(null);
    });

    const unsubWeekly = onSnapshot(doc(db, "weekly_idp", "current"), (snap) => {
      if (snap.exists()) setWeekly(snap.data());
      else setWeekly(null);
    });

    const unsubDailySlot = onSnapshot(doc(db, "daily_slots", userId), (snap) => {
      setHasDailySlot(snap.exists());
    });

    const unsubWeeklySlot = onSnapshot(doc(db, "weekly_slots", userId), (snap) => {
      setHasWeeklySlot(snap.exists());
    });

    setTimeout(() => setLoading(false), 1000); // Simulate loading delay

    return () => {
      unsubDaily();
      unsubWeekly();
      unsubDailySlot();
      unsubWeeklySlot();
    };
  }, [userId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  const renderTimer = (showTime) => {
    const [remaining, setRemaining] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        const diff = new Date(showTime.seconds * 1000) - new Date();
        if (diff <= 0) {
          setRemaining("0");
          clearInterval(interval);
        } else {
          const min = Math.floor(diff / 60000);
          const sec = Math.floor((diff % 60000) / 1000);
          setRemaining(`${min}m ${sec}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [showTime]);

    return remaining !== "0" ? (
      <p className="text-orange-600">⏳ Starting in: {remaining}</p>
    ) : null;
  };

  const renderSection = (title, data, slotAssigned) => {
    const canShow = data.status === "active" && slotAssigned;
    const isTimerMode = data.showTime && new Date(data.showTime.seconds * 1000) > new Date();

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>

        {!slotAssigned ? (
          <p className="text-red-600">❌ Slot not assigned to you.</p>
        ) : !canShow ? (
          <p className="text-yellow-600">⚠️ Not started yet.</p>
        ) : isTimerMode ? (
          renderTimer(data.showTime)
        ) : (
          <div className="border border-gray-300">
            <div className="flex font-semibold bg-gray-100 p-2 border-b">
              <div className="w-1/2">Room ID</div>
              <div className="w-1/2">Password</div>
            </div>
            <div className="flex p-2">
              <div
                className="w-1/2 text-blue-700 cursor-pointer"
                onClick={() => handleCopy(data.roomId)}
              >
                {data.roomId}
              </div>
              <div
                className="w-1/2 text-blue-700 cursor-pointer"
                onClick={() => handleCopy(data.password)}
              >
                {data.password}
              </div>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1 ml-2">✅ Copied: {copied}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-6 text-center">🎮 Room ID & Password</h2>

      {loading ? (
        <p className="text-blue-600 font-medium animate-pulse">
          🔄 Fetching IDP...
        </p>
      ) : !daily && !weekly ? (
        <p className="text-yellow-600 text-center font-medium">
          ⚠️ Game not started yet.
        </p>
      ) : (
        <div className="space-y-6">
          {daily
            ? renderSection("📅 Daily Scrim", daily, hasDailySlot)
            : (
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">📅 Daily Scrim</h3>
                <p className="text-yellow-600">⚠️ Not started yet.</p>
              </div>
            )}

          {weekly
            ? renderSection("🛡️ Weekly War", weekly, hasWeeklySlot)
            : (
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">🛡️ Weekly War</h3>
                <p className="text-yellow-600">⚠️ Not started yet.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default IDPass;
