import React from "react";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <>
      <div style={{ paddingBottom: "60px" }}>{children}</div>
      <BottomNav />
    </>
  );
};

export default Layout;
