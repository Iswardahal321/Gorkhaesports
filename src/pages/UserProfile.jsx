import React, { useState } from "react";
import { auth } from "../firebase/config";

const UserProfile = () => {
  const user = auth.currentUser;
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const slotNumber = user?.customClaim?.slot || "Not assigned yet";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>
      <div className="bg-white p-4 rounded shadow">
        <p className="mb-2">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="mb-2">
          <strong>UID:</strong> {user?.uid}
        </p>
        <p className="mb-4">
          <strong>Slot Number:</strong> {slotNumber}
        </p>

        {/* Phone Number */}
        <button
          onClick={() => setShowPhonePopup(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-4"
        >
          {user?.phoneNumber ? "Update Phone Number" : "Add Phone Number"}
        </button>

        {/* Password */}
        <button
          onClick={() => setShowPasswordPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </div>

      {/* 📱 Phone Popup */}
      {showPhonePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-2">📱 Enter Phone Number</h3>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowPhonePopup(false)}
                className="text-gray-500 hover:text-black mr-4"
              >
                Cancel
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 Password Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-2">🔒 Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="text-gray-500 hover:text-black mr-4"
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
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
