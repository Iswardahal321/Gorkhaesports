import React, { useEffect, useState } from "react";
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilCloudDownload,
  cilLayers,
  cilPuzzle,
  cilSpeedometer,
  cilUser,
  cilMenu,
} from "@coreui/icons";

import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const Sidebar = () => {
  const [hasTeam, setHasTeam] = useState(false);
  const [visible, setVisible] = useState(false); // default closed

  useEffect(() => {
    const checkTeam = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "teams", user.uid);
        const docSnap = await getDoc(docRef);
        setHasTeam(docSnap.exists());
      }
    };
    checkTeam();
  }, []);

  const toggleSidebar = () => {
    setVisible((prev) => !prev);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 999,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <CIcon icon={cilMenu} size="xl" />
      </button>

      <CSidebar className="border-end" visible={visible} onVisibleChange={setVisible}>
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>Gorkha Esports</CSidebarBrand>
        </CSidebarHeader>

        <CSidebarNav>
          <CNavTitle>Dashboard</CNavTitle>

          <CNavItem component={Link} to="/dashboard">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
            &nbsp; Dashboard
          </CNavItem>

          <CNavItem component={Link} to={hasTeam ? "/my-team" : "/add-team"}>
            <CIcon customClassName="nav-icon" icon={cilUser} />
            &nbsp; {hasTeam ? "My Team" : "Add Team"}
          </CNavItem>

          <CNavItem component={Link} to="/scrims">
            <CIcon customClassName="nav-icon" icon={cilPuzzle} />
            &nbsp; Scrims
          </CNavItem>
        </CSidebarNav>

        <CSidebarHeader className="border-top">
          <CSidebarToggler />
        </CSidebarHeader>
      </CSidebar>
    </>
  );
};

export default Sidebar;
