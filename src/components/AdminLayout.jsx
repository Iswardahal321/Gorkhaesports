// src/components/AdminLayout.jsx
import React from "react";
import AdminBottomNav from "./AdminBottomNav";

function AdminLayout({ children }) {
  return (
    <div className="pb-16">
      {children}
      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;
