// 📁 src/components/Layout.jsx

import React from "react";
import BottomNav from "./BottomNav";
import UserProfileMenu from "./UserProfileMenu"; // ✅ Import the dropdown menu

const Layout = ({ children }) => {
  return (
    <>
      {/* Topbar */}
      <div className="relative flex justify-between items-center px-4 py-3 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Gorkha Esports</h1>

        {/* ✅ Top-right floating profile icon */}
        <div className="absolute top-3 right-4">
          <UserProfileMenu />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingBottom: "60px" }}>{children}</div>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
};

export default Layout;
