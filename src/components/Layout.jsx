import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Gorkha Esports</h1>
        <button
          onClick={() => navigate("/profile")}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Profile
        </button>
      </div>

      {/* Page content */}
      <div style={{ paddingBottom: "60px" }}>{children}</div>

      {/* Bottom navigation */}
      <BottomNav />
    </>
  );
};

export default Layout;
