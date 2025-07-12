// 📁 src/components/Layout.jsx

import React from "react";
import BottomNav from "./BottomNav";
import UserProfileMenu from "./UserProfileMenu"; // ✅ Import avatar with dropdown

const Layout = ({ children }) => {
  return (
    <>
      {/* ✅ Topbar with fixed height & avatar correctly aligned */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md relative">
        <h1 className="text-xl font-bold text-gray-800">Gorkha Esports</h1>

        {/* ✅ Avatar should stay aligned inside the topbar */}
        <div className="ml-auto">
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
