// src/components/AdminBottomNav.jsx
import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import GamesIcon from "@mui/icons-material/SportsEsports";
import SlotIcon from "@mui/icons-material/FormatListNumbered";
import KeyIcon from "@mui/icons-material/VpnKey"; // ✅ New Icon
import { useLocation, useNavigate } from "react-router-dom";

function AdminBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    "/admin",
    "/admin/users",
    "/admin/add-game",
    "/admin/add-slot",
    "/admin/add-id-pass", // ✅ Correct ID/Password Page
  ];

  const currentTab = routes.indexOf(location.pathname);

  const handleChange = (event, newValue) => {
    // ✅ Prevent navigate("/") fallback
    if (routes[newValue]) {
      navigate(routes[newValue]);
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        borderTop: "1px solid #ccc",
      }}
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={currentTab === -1 ? 0 : currentTab}
        onChange={handleChange}
      >
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Users" icon={<GroupIcon />} />
        <BottomNavigationAction label="Add Game" icon={<GamesIcon />} />
        <BottomNavigationAction label="Slots" icon={<SlotIcon />} />
        <BottomNavigationAction label="ID Pass" icon={<KeyIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default AdminBottomNav;
