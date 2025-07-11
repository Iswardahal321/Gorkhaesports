import React, { useEffect, useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const UserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [phone, setPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const uid = user?.uid || "Unavailable";
  const email = user?.email || "Unavailable";
  const slotNumber = user?.customClaim?.slot || "Not assigned yet";

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
      setShowPhonePopup(false);
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
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordPopup(false);
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed.");
    }
  };

  useEffect(() => {
    fetchPhone();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow relative">
      <h1 className="text-2xl font-bold mb-6">👤 User Profile</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading profile...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <p className="text-gray-700">{email}</p>
          </div>

          <div className="mb-4">
            <label className="font-semibold">UID:</label>
            <p className="text-gray-700 break-all">{uid}</p>
          </div>

          <div className="mb-4">
            <label className="font-semibold">Slot Number:</label>
            <p className="text-gray-700">#{slotNumber}</p>
          </div>

          <div className="mb-4">
            <label className="font-semibold">Phone Number:</label>
            <p className="text-gray-700">{phone || "Not Added"}</p>
            <button
              onClick={() => setShowPhonePopup(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
            >
              {phone ? "Update Phone" : "Add Phone"}
            </button>
          </div>

          <div className="mb-4 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🔐 Password</h2>
            <button
              onClick={() => setShowPasswordPopup(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Change Password
            </button>
          </div>
        </>
      )}

      {/* 📱 Phone Popup */}
      {showPhonePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 shadow w-80">
            <h3 className="text-lg font-semibold mb-2">📱 {phone ? "Update" : "Add"} Phone Number</h3>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowPhonePopup(false)}
                className="mr-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePhoneUpdate}
                className="bg-yellow-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 Password Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 shadow w-80">
            <h3 className="text-lg font-semibold mb-2">🔒 Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="mr-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
