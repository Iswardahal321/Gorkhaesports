import React, { useEffect, useState } from "react";
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

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyMessage(`${label} copied`);
    const utterance = new SpeechSynthesisUtterance(`${label} copied`);
    window.speechSynthesis.speak(utterance);
    setTimeout(() => setCopyMessage(""), 3000);
  };

  const formatCountdown = (time) => {
    const diff = Math.floor((time - now) / 1000);
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const shouldShowIDP = (showTime) => {
    return !showTime || showTime.toDate().getTime() <= now;
  };

  const renderSection = (title, data, hasSlot) => {
    const showTime = data?.showTime;
    const countdown = showTime && !shouldShowIDP(showTime)
      ? formatCountdown(showTime.toDate().getTime())
      : null;

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
        {countdown ? (
          <p className="text-orange-600 font-medium text-center">
            ⏳ IDP in: {countdown} minutes 
          </p>
        ) : (
          <>
            <p className="text-green-700 text-sm mb-2 text-center">✅ Tap to copy your ID & Password</p>
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
                    onClick={() => handleCopy(data.roomId, "Room ID")}
                  >
                    {data.roomId}
                  </td>
                  <td
                    className="p-2 border text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(data.password, "Password")}
                  >
                    {data.password}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
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
        <p className="text-blue-600 font-medium animate-pulse">
          🔍 Fetching IDP...
        </p>
      ) : (
        <div className="space-y-8">
          {!daily && !weekly && (
            <p className="text-yellow-600 font-medium">
              ⚠️ No active game started yet.
            </p>
          )}
          {daily && renderSection("🗓️ Daily Scrim", daily, hasDailySlot)}
          {weekly && renderSection("🛡️ Weekly War", weekly, hasWeeklySlot)}
        </div>
      )}
    </div>
  );
};

export default IDPass;
