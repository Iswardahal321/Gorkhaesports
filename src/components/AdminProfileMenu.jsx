import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const AdminProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="absolute top-4 right-4">
      <Avatar
        onClick={handleOpen}
        sx={{ cursor: "pointer", bgcolor: "#1976d2" }}
      >
        {user?.email?.charAt(0)?.toUpperCase() || "A"}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <strong>Email:</strong>&nbsp; {user?.email}
        </MenuItem>
        <MenuItem disabled>
          <strong>Password:</strong>&nbsp; ********
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          🔓 Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AdminProfileMenu;
