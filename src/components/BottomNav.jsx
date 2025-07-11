import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // demo icon
import { useLocation, useNavigate } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔁 Corrected route
  const routes = ["/add-team", "/dashboard", "/demo"];
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
        <BottomNavigationAction label="Demo" icon={<SmartToyIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
