// ✅ Tap to Copy
import React from "react";
import AdminBottomNav from "./AdminBottomNav";

function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow">{children}</div>
      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;
