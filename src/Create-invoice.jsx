import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceDashboardPage from "./InvoicedashboardPage"; // Import the invoice dashboard page
import DashboardLayout from "./components/DashboardLayout";

export default function CreateInvoice() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    profilePic: "",
    email: "",
    plan: "Free",
  });

  const profileImageUrl = userProfile.profilePic
    ? `${import.meta.env.VITE_API_URL}/${userProfile.profilePic.replace(/\\/g, "/")}`
    : "/user-placeholder.png";

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("User is not authenticated. Token not found.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile image updated successfully!");
      await fetchUserProfile();
      setSelectedFile(null);
      setIsChangeImageDialogOpen(false);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to upload profile image.";
      alert(`Upload failed: ${message}`);
    }
  };

  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All password fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Register/update-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Password changed successfully!");
        closeChangePasswordDialog();
      } else {
        alert(`Error changing password: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Register/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (profileRes.status === 200) {
        const { firstName, lastName, profileImageUrl, email, plan } = profileRes.data;
        setUserProfile({
          firstName: firstName || "",
          lastName: lastName || "",
          profilePic: profileImageUrl || "",
          email: email || "",
          plan: plan || "Free",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      openModal={openModal}
      handleSignOut={handleSignOut}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      dialogProps={{
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
        handleChangePassword,
      }}
    >
    



    </DashboardLayout>
  );
}
