import { useState } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";

export default function ReportPage() {
  const [selectedReport, setSelectedReport] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getColumns = (type) => {
    switch (type) {
      case "sales":
        return ["Date", "Invoice ID", "Customer", "Amount"];
      case "customers":
        return ["Name", "Email", "Phone", "Country"];
      case "taxes":
        return ["Name", "Rate (%)", "Country", "Region"];
      case "audits":
        return ["Date", "Type", "Amount", "Description"];
      default:
        return [];
    }
  };

  const getDataKeys = (type) => {
    switch (type) {
      case "sales":
        return ["date", "invoiceId", "customer", "amount"];
      case "customers":
        return ["name", "email", "phone", "country"];
      case "taxes":
        return ["name", "rate", "country", "region"];
      case "audits":
        return ["date", "type", "amount", "description"];
      default:
        return [];
    }
  };

  const fetchReport = async () => {
    if (!selectedReport) return alert("Please select a report type.");
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("type", selectedReport);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setReportData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      setError("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const columns = getColumns(selectedReport);
  const dataKeys = getDataKeys(selectedReport);

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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>

        {/* Report Generator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Generate Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="sales">Sales Report</option>
                <option value="customers">Customer Report</option>
                <option value="taxes">Tax Report</option>
                <option value="audits">Audit Report</option>
              </select>
            </div>
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
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Display */}
        {reportData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{reportData.length}</span>
            </h2>

            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i} className="px-4 py-2 border">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      {dataKeys.map((key, j) => (
                        <td key={j} className="px-4 py-2 border">
                          {key === "date" ? new Date(row[key]).toLocaleDateString() : row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
