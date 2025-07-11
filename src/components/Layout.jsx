import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Get first letter of email
  const userInitial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Gorkha Esports</h1>

        {/* Profile avatar button */}
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:opacity-90"
        >
          {userInitial}
        </button>
      </div>

      {/* Page content */}
      <div style={{ paddingBottom: "60px" }}>{children}</div>

      {/* Bottom nav */}
      <BottomNav />
    </>
  );
};

export default Layout;
