import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebase/config";

const UserProfileMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePasswordChange = async () => {
    setMessage("");

    const userAuth = auth.currentUser;
    const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);

    try {
      await reauthenticateWithCredential(userAuth, credential);
      await updatePassword(userAuth, newPassword);
      setMessage("✅ Password updated successfully.");
      setOpenDialog(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update password. Check current password.");
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <Avatar onClick={handleOpen} sx={{ cursor: "pointer", bgcolor: "#1976d2" }}>
        {user?.email?.charAt(0)?.toUpperCase() || "U"}
      </Avatar>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleClose();
          }}
        >
          🙍‍♂️ Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDialog(true);
            handleClose();
          }}
        >
          🔒 Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          🔓 Logout
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          {message && (
            <p
              className={`text-sm ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfileMenu;
