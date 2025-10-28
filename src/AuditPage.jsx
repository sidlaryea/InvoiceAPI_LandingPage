import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";

export default function AuditPage() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
  });

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
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
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
    const formDataUpload = new FormData();
    formDataUpload.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      await axios.put(
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, "/")}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchAuditData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.type) params.append("type", filters.type);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Audit?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAuditData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch audit data:", error);
      setError("Failed to load audit data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAuditData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyFilters = () => {
    fetchAuditData();
  };

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
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Audit Log</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="payment">Payment</option>
                <option value="invoice">Invoice</option>
                <option value="transaction">Transaction</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            Audit Records
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{auditData.length}</span>
          </h2>

          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && auditData.length === 0 ? (
            <p className="text-sm text-gray-500">No audit records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {auditData.map((record, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 border">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{record.type}</td>
                      <td className="px-4 py-2 border">{record.amount}</td>
                      <td className="px-4 py-2 border">{record.description}</td>
                      <td className="px-4 py-2 border">{record.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
