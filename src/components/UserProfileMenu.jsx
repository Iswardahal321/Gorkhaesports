import React, { useState, useEffect, useRef } from "react";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const UserProfileMenu = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [phone, setPhone] = useState("");
  const [dailySlot, setDailySlot] = useState("Not assigned");
  const [weeklySlot, setWeeklySlot] = useState("Not assigned");
  const [newPhone, setNewPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const ref = useRef(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setPhone(data.phone || "");
      }

      const dailySnap = await getDocs(collection(db, "daily_slots"));
      const daily = dailySnap.docs.find((doc) => doc.data().userId === user.uid);
      if (daily) {
        setDailySlot(daily.data().slotNumber || "Assigned");
      }

      const weeklySnap = await getDocs(collection(db, "weekly_slots"));
      const weekly = weeklySnap.docs.find((doc) => doc.data().userId === user.uid);
      if (weekly) {
        setWeeklySlot(weekly.data().slotNumber || "Assigned");
      }
    };

    fetchData();
  }, [user]);

  const handlePhoneSave = async () => {
    if (!newPhone) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { phone: newPhone }, { merge: true });
    setPhone(newPhone);
    setShowPhoneModal(false);
    setNewPhone("");
  };

  const handlePasswordUpdate = async () => {
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordMessage("✅ Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordMessage("❌ Failed to update password. Try re-login or check password.");
    }
  };

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userRef = snap.docs[0].ref;
        await updateDoc(userRef, { popupShown: false }); // ✅ Reset popup flag
      }
    }
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="absolute top-4 right-4 z-50" ref={ref}>
      <button
        onClick={() => setShowOverlay(!showOverlay)}
        className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:opacity-90"
      >
        {user?.email?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {showOverlay && (
        <div className="absolute top-12 right-0 bg-white shadow-xl rounded-md p-4 w-72 border z-50">
          <h2 className="text-lg font-bold mb-3">🙍‍♂️ User Profile</h2>

          <div className="text-sm text-gray-700 mb-2">
            <strong>Email:</strong> <br /> {user?.email}
          </div>
          <div className="text-sm text-gray-700 mb-2 break-all">
            <strong>UID:</strong> <br /> {user?.uid}
          </div>

          <div className="text-sm text-gray-700 mb-4">
            <div className="grid grid-cols-2 gap-2 mt-1 border border-gray-200 p-2 rounded bg-gray-50">
              <div>
                <p className="font-medium text-gray-600">Daily Scrim</p>
                <p className="text-blue-600 font-semibold">Slot {dailySlot || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Weekly War</p>
                <p className="text-purple-600 font-semibold">Slot {weeklySlot || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-700 mb-3">
            <strong>📞 Phone:</strong> <br /> {phone || "Not added"}
          </div>

          <button
            onClick={() => setShowPhoneModal(true)}
            className="w-full bg-yellow-500 text-white py-1 rounded mb-2"
          >
            {phone ? "Update Phone" : "Add Phone"}
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-blue-600 text-white py-1 rounded mb-2"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

      {showPhoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-5 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">📞 Update Phone</h2>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border rounded mb-4"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowPhoneModal(false)}>Cancel</button>
              <button
                onClick={handlePhoneSave}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-5 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">🔐 Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-3 py-2 border rounded mb-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-3 py-2 border rounded mb-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordMessage && (
              <p
                className={`text-sm ${
                  passwordMessage.includes("✅") ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwordMessage}
              </p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button
                onClick={handlePasswordUpdate}
                className="bg-blue-600 text-white px-3 py-1 rounded"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
