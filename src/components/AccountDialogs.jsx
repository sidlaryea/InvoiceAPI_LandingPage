// AccountDialogs.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AccountDialogs({
  isModalOpen,
  closeModal,
  openChangeImageDialog,
  openChangePasswordDialog,
  isChangeImageDialogOpen,
  closeChangeImageDialog,
  handleFileChange,
  handleUpload,
  isChangePasswordDialogOpen,
  closeChangePasswordDialog,
  currentPassword,
  newPassword,
  confirmNewPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmNewPassword,
  handleChangePassword
}) {
  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Manage Account</DialogTitle>
        <DialogContent>
          <ul className="list-disc pl-6 space-y-1 text-sm text-blue-600">
            <li><a href="#/" onClick={openChangeImageDialog}>Change Profile Image</a></li>
            <li><a href="#/" onClick={openChangePasswordDialog}>Change Password</a></li>
            <li><a href="#/">Change User Profile Information</a></li>
            <li><a href="/ManageUsers">Manage Users</a></li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isChangeImageDialogOpen} onClose={closeChangeImageDialog}>
        <DialogTitle>Change Profile Image</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpload} color="primary">Upload</Button>
          <Button onClick={closeChangeImageDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isChangePasswordDialogOpen} onClose={closeChangePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePassword} color="primary">Change Password</Button>
          <Button onClick={closeChangePasswordDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}