// 📁 src/pages/UserProfile.jsx

import React, { useEffect, useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const UserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [phone, setPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const uid = user?.uid || "Unavailable";
  const email = user?.email || "Unavailable";

  const fetchPhone = async () => {
    if (!uid) return;
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPhone(docSnap.data()?.phone || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!newPhone) return;
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, { phone: newPhone }, { merge: true });
      setPhone(newPhone);
      setNewPhone("");
      alert("Phone number updated.");
    } catch (error) {
      console.error("Error updating phone:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed.");
    }
  };

  useEffect(() => {
    fetchPhone();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">👤 User Profile</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading profile...</p>
      ) : (
        <>
          {/* Email */}
          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <p className="text-gray-700">{email}</p>
          </div>

          {/* UID */}
          <div className="mb-4">
            <label className="font-semibold">UID:</label>
            <p className="text-gray-700 break-all">{uid}</p>
          </div>

          {/* Slot Number (Placeholder) */}
          <div className="mb-4">
            <label className="font-semibold">Slot Number:</label>
            <p className="text-gray-700">#Not Assigned</p>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="font-semibold">Phone Number:</label>
            <p className="text-gray-700 mb-2">{phone || "Not Added"}</p>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <button
              onClick={handlePhoneUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {phone ? "Update Phone" : "Add Phone"}
            </button>
          </div>

          {/* Change Password */}
          <div className="mb-4 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🔒 Change Password</h2>
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
              className="w-full px-3 py-2 border rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handlePasswordUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Password
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
