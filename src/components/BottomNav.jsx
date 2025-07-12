import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt"; // Slot List icon
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // ID Pass icon
import { useLocation, useNavigate } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = ["/add-team", "/dashboard", "/slot-list", "/id-pass"];
  const currentTab = routes.indexOf(location.pathname);

  const handleChange = (event, newValue) => {
    navigate(routes[newValue]);
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
        value={currentTab === -1 ? 1 : currentTab}
        onChange={handleChange}
      >
        <BottomNavigationAction label="Team" icon={<GroupAddIcon />} />
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Slot List" icon={<ListAltIcon />} />
        <BottomNavigationAction label="ID Pass" icon={<VpnKeyIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
