import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const UserProfileMenu = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
        setSlot(data.slot || "Not assigned yet");
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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="absolute top-4 right-4 z-50" ref={ref}>
      {/* Avatar */}
      <button
        onClick={() => setShowOverlay(!showOverlay)}
        className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:opacity-90"
      >
        {user?.email?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {/* Overlay Dropdown */}
      {showOverlay && (
        <div className="absolute top-12 right-0 bg-white shadow-xl rounded-md p-4 w-72 border z-50">
          <h2 className="text-lg font-bold mb-3">🙍‍♂️ User Profile</h2>
          <div className="text-sm text-gray-700 mb-2">
            <strong>Email:</strong> <br /> {user?.email}
          </div>
          <div className="text-sm text-gray-700 mb-2 break-all">
            <strong>UID:</strong> <br /> {user?.uid}
          </div>
          <div className="text-sm text-gray-700 mb-2">
            <strong>Slot Number:</strong> <br /> #{slot}
          </div>
          <div className="text-sm text-gray-700 mb-3">
            <strong>Phone:</strong> <br /> {phone || "Not added"}
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

      {/* Phone Modal */}
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

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-5 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">🔐 Change Password</h2>
            <p className="text-sm text-gray-600">Go to forgot password page.</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-sm text-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
