// InvoiceDashboardPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import axios from "axios";

export default function InvoiceDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("/user-placeholder.png");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Profile image updated!");
      fetchUserProfile();
      closeChangeImageDialog();
    } catch (error) {
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    const token = localStorage.getItem("jwtToken");

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-password`, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      alert("Password changed successfully!");
      closeChangePasswordDialog();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}` );
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
  openModal={openModal}
  isModalOpen={isModalOpen}
  closeModal={closeModal}
  handleSignOut={handleSignOut}
  toggleSidebar={toggleSidebar}
  isSidebarOpen={isSidebarOpen}
  dialogProps={{
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
      <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hi James. Here’s a glance of your business at All Branches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* KPI Cards */}
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">Total sales for today</p>
      <h2 className="text-2xl font-bold text-gray-800">GHS 10M</h2>
      <p className="text-green-500 text-sm mt-1">↑ 45% – was 734,623.00 yesterday</p>
    </div>

      <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">Estimated profit for today</p>
      <h2 className="text-2xl font-bold text-gray-800">GHS 25k</h2>
      <p className="text-yellow-500 text-sm mt-1">↑ 37% – was 734,623.00 yesterday</p>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">Customers served today</p>
      <h2 className="text-2xl font-bold text-gray-800">104</h2>
      <p className="text-red-500 text-sm mt-1">↓ 12% – was 734,623.00 yesterday</p>
    </div>
    {/* Balance Cards */}
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">Prepaid balance</p>
      <h2 className="text-2xl font-bold text-gray-800">GHS 97,669.73</h2>
      <button className="text-teal-600 text-sm mt-2">Top up Account</button>
    </div>
    <div className="bg-white p-4 rounded shadow col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Sales Account Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">GHS 10,223.73</h2>
        </div>
        <button className="bg-teal-500 text-white px-3 py-1 rounded">Transfer Funds</button>
      </div>
    </div>
  </div>
   {/* Sales Trends Chart */}
  <div className="bg-white p-4 rounded shadow">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Sales Trends For <span className="text-teal-500">PAST 7 DAYS</span></h2>
      <p className="text-gray-500">Gross Sales <span className="text-xl font-bold text-gray-800 ml-2">GHS 456,000</span></p>
    </div>
    {/* Insert your graph/chart component here */}
    <div className="mt-4 h-60 bg-gray-100 rounded flex items-center justify-center text-gray-400">[Sales Chart Here]</div>
  </div>
  {/* Last Transactions */}
  <div className="bg-white p-4 rounded shadow">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Last Transactions</h2>
      <button className="text-teal-500 text-sm">SEE MORE</button>
    </div>
    <ul className="mt-4 divide-y divide-gray-200">
      {Array(7).fill().map((_, i) => (
        <li key={i} className="py-2 flex justify-between items-center text-sm">
          <div>
            <p className="font-medium text-gray-700">+233 24 651 2641</p>
            <p className="text-gray-500">Harman Kardon, Samsung Galaxy A70...</p>
          </div>
          <span className="font-semibold text-gray-800">GHS 76.25</span>
        </li>
      ))}
    </ul>
  </div>


      
    </div>
    </DashboardLayout>
  );
}
