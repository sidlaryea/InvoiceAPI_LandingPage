import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";

export default function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId") || "",
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    tin: "",
  });

  const [customers, setCustomers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formData, {
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

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Customer/GetCustomerByUserId`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCustomers();
  }, []);


const handleEditCustomer = (customer) => {
  setSelectedCustomer(customer);
  setFormData({
    userId: customer.userId || localStorage.getItem("userId") || "",
    name: customer.fullName || "",
    email: customer.email || "",
    phone: customer.phone || "",
    address: customer.address || "",
    country: customer.country || "",
    tin: customer.tin || "",
  });
};
     


  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess(null);
  setError(null);

  const isEditing = selectedCustomer !== null;

  try {
    // Step 1: Always get the latest API key
    const apiRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/ApiKey`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (apiRes.status === 200 && apiRes.data.key) {
      const apiKey = apiRes.data.key;
      localStorage.setItem("apiKey", apiKey);
    } else {
      throw new Error("API key fetch failed");
    }

    // Step 2: Set endpoint & method dynamically
    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/api/Customer/${selectedCustomer.id}`
      : `${import.meta.env.VITE_API_URL}/api/Customer`;

    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "X-API-KEY": localStorage.getItem("apiKey"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error(isEditing ? "Failed to update customer" : "Failed to register customer");

    setSuccess(isEditing ? "Customer updated successfully!" : "Customer registered successfully!");
    setTimeout(() => {
  setSuccess(null);
}, 3000);

    // Clear form
    setFormData({
      userId: localStorage.getItem("userId") || "",
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      tin: "",
    });
    setSelectedCustomer(null); // reset editing state
    fetchCustomers(); // refresh list
  } catch (error) {
    console.error(error);
    setError("An error occurred while submitting the customer.");
  }
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Register New Customer</h2>

            {success && <p className="text-green-600 mb-4">{success}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email", "phone", "address", "country", "tin"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {field === "tin" ? "TIN (Tax ID)" : field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {selectedCustomer ? "Update Customer" : "Register Customer"}
              </button>
            </form>
          </div>

          {/* Customers Table */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
    Registered Customers
    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{customers.length}</span>
  </h2>

  {customers.length === 0 ? (
    <p className="text-sm text-gray-500">No customers found.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">TIN</th>
            <th className="px-4 py-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i} className="hover:bg-blue-50 transition">
              <td className="px-4 py-2 border">{c.fullName}</td>
              <td className="px-4 py-2 border">{c.email}</td>
              <td className="px-4 py-2 border">{c.phone}</td>
              <td className="px-4 py-2 border">{c.tin}</td>
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => handleEditCustomer(c)}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                  title="Edit"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z" />
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
