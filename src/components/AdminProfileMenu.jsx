// src/components/AdminProfileModal.jsx
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { signOut, updatePassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AdminProfileModal = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
    setMessage("");
  };
  const handleClose = () => {
    setOpen(false);
    setNewPassword("");
    setMessage("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePasswordUpdate = async () => {
    try {
      if (newPassword.length < 6) {
        setMessage("❌ Password must be at least 6 characters.");
        return;
      }
      await updatePassword(auth.currentUser, newPassword);
      setMessage("✅ Password updated successfully.");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update password.");
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <Avatar
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          bgcolor: "#1976d2",
          border: "2px solid white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        {user?.email?.charAt(0)?.toUpperCase() || "A"}
      </Avatar>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            👤 Admin Profile
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Role:</strong> Admin
          </Typography>

          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          {message && (
            <Typography
              variant="body2"
              sx={{ mt: 1, color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </Typography>
          )}
          <div className="flex justify-between mt-4 gap-2">
            <Button
              onClick={handlePasswordUpdate}
              variant="contained"
              color="primary"
              fullWidth
            >
              Update Password
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="error"
              fullWidth
            >
              Logout
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminProfileModal;
