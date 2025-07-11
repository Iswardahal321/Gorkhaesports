import React, { useState } from "react";
import { auth } from "../firebase/config";

const UserProfile = () => {
  const user = auth.currentUser;
  const email = user?.email || "No Email";
  const uid = user?.uid || "No UID";

  // ✅ Slot logic (Firebase custom claim se)
  const slotNumber = user?.customClaims?.slot || "Not assigned yet";

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const userInitial = email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {userInitial}
          </div>
        </div>

        <h2 className="text-xl text-center font-bold mb-2">Gorkha Esports</h2>
        <p className="text-center text-gray-600 mb-4">{email}</p>

        <div className="mb-3">
          <p className="text-sm text-gray-700 font-semibold mb-1">UID:</p>
          <p className="text-sm bg-gray-100 rounded px-3 py-1">{uid}</p>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-700 font-semibold mb-1">Slot Number:</p>
          <p className="text-sm bg-gray-100 rounded px-3 py-1">{slotNumber}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 font-semibold mb-1">Phone Number:</p>
          <p className="text-sm bg-gray-100 rounded px-3 py-1">
            {user.phoneNumber || "Not added"}
          </p>
          <button
            onClick={() => {
              setShowPhoneModal(true);
              setShowPasswordModal(false);
            }}
            className="mt-2 bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
          >
            {user.phoneNumber ? "Update Number" : "Add Phone Number"}
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              setShowPasswordModal(true);
              setShowPhoneModal(false);
            }}
            className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-600"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* ✅ Phone Modal */}
      {showPhoneModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add / Update Phone</h2>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowPhoneModal(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="New password"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
