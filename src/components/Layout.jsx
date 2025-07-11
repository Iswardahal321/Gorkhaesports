// 📁 src/components/Layout.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userInitial = user?.email?.charAt(0)?.toUpperCase() || "U";

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* Topbar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md relative">
        <h1 className="text-xl font-bold text-gray-800">Gorkha Esports</h1>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:opacity-90"
          >
            {userInitial}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingBottom: "60px" }}>{children}</div>

      {/* BottomNav */}
      <BottomNav />
    </>
  );
};

export default Layout;
