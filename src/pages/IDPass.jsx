// 📁 src/pages/IDPass.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const IDPass = () => {
  const [userId, setUserId] = useState(null);
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const [now, setNow] = useState(Date.now());
  const [hasDailySlot, setHasDailySlot] = useState(false);
  const [hasWeeklySlot, setHasWeeklySlot] = useState(false);
  const voicePlayedRef = useRef({ daily: false, weekly: false });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await checkSlots(user.uid);
        setupLiveListeners();
      }
    });
    return () => unsub();
  }, []);

  const checkSlots = async (uid) => {
    const dailyQ = query(collection(db, "daily_slots"), where("userId", "==", uid));
    const weeklyQ = query(collection(db, "weekly_slots"), where("userId", "==", uid));
    const [dailySnap, weeklySnap] = await Promise.all([getDocs(dailyQ), getDocs(weeklyQ)]);
    setHasDailySlot(!dailySnap.empty);
    setHasWeeklySlot(!weeklySnap.empty);
  };

  const setupLiveListeners = () => {
    const unsubDaily = onSnapshot(doc(db, "daily_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setDaily(snap.data());
      } else {
        setDaily(null);
      }
      setLoading(false);
    });

    const unsubWeekly = onSnapshot(doc(db, "weekly_idp", "current"), (snap) => {
      if (snap.exists() && snap.data().status === "active") {
        setWeekly(snap.data());
      } else {
        setWeekly(null);
      }
    });

    return () => {
      unsubDaily();
      unsubWeekly();
    };
  };

  const handleCopy = (label, text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage(`✅ ${label} copied!`);
    setTimeout(() => setCopyMessage(""), 2000);
  };

  const shouldShowIDP = (showTime) => {
    return !showTime || showTime.toDate().getTime() <= now;
  };

  const playVoice = () => {
    const audio = new Audio("/voice/idp_ready.mp3");
    audio.play().catch((err) => console.error("🔇 Voice error:", err));
  };

  const renderSection = (title, data, hasSlot, type) => {
    const showTime = data?.showTime;
    const isReady = shouldShowIDP(showTime);

    if (isReady && !voicePlayedRef.current[type]) {
      playVoice();
      voicePlayedRef.current[type] = true;
    }

    if (!hasSlot) {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">{title}</h3>
          <p className="text-red-600 font-medium text-center">🚫 Slot not assigned yet.</p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">{title}</h3>
        {isReady ? (
          <>
            <p className="text-green-600 font-medium text-center mb-2">📋 Tap to copy your IDP details</p>
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-center">Room ID</th>
                  <th className="p-2 border text-center">Password</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td
                    className="p-2 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy("Room ID", data.roomId)}
                  >
                    {data.roomId}
                  </td>
                  <td
                    className="p-2 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy("Password", data.password)}
                  >
                    {data.password}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-orange-600 font-medium text-center">⏳ Waiting for match time...</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold mb-4">🎮 Room ID & Password</h2>

      {copyMessage && (
        <p className="text-green-600 font-medium mb-4">{copyMessage}</p>
      )}

      {loading ? (
        <p className="text-blue-600 font-medium animate-pulse">🔍 Fetching IDP...</p>
      ) : (
        <div className="space-y-8">
          {daily && renderSection("🗓️ Daily Scrim", daily, hasDailySlot, "daily")}
          {weekly && renderSection("🛡️ Weekly War", weekly, hasWeeklySlot, "weekly")}
          {!daily && !weekly && (
            <p className="text-yellow-600 font-medium">⚠️ No active match found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IDPass;
