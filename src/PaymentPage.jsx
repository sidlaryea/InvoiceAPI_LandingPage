import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import { jwtDecode } from "jwt-decode";

export default function PaymentPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  

  const [reference, setReference] = useState("");
const [transactionId, setTransactionId] = useState("");
const [userProfile, setUserProfile] = useState(null);
 
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
     
  const [error, setError] = useState(null);
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
    
if (!token) {
  setError("Authentication token not found.");
  return;
}

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
      const { profileImageUrl, ...restProfile } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
      setUserProfile(restProfile);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  


  useEffect(() => {
 const fetchInvoices = async () => {
    try {
      const apiKey = localStorage.getItem("apiKey"); // Include this if your API requires auth

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Invoice`, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey, // Add this if required by your backend
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched invoices:", data); // ✅ Debug log
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  };

    fetchInvoices();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvoices([]);
    } else {
      setFilteredInvoices(
        invoices.filter((inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, invoices]);



  



  const paymentOptions = [
    { name: "Visa", logo: "./logos/Visa.png" },
    { name: "MasterCard", logo: "./logos/mastercard.png" },
    { name: "MTN Mobile Money", logo: "./logos/mtn.png" },
    { name: "AirtelTigo", logo: "./logos/tigo.jpg" },
    { name: "Vodafone Cash", logo: "./logos/telecel.png" },
  ];

  
  
  
  
 const handlePay = async () => {
  if (!selectedInvoice || !selectedMethod)
  {setError ("Please select an invoice and payment method.");
    return;
  }

  const token = localStorage.getItem("jwtToken");
  if (!token || typeof token !== "string") {
  console.error("No valid token found in localStorage");
  return;
}
    const decoded = jwtDecode(token);
    const createdBy =decoded?.name || "Unknown User";
setError(null);
  setLoading(true);
  const autoGeneratedRef = `INV-${selectedInvoice.id}-${Date.now()}`;
  const paymentData = {
    invoiceId: selectedInvoice.id,
    transactionId:transactionId || `TXN-${Date.now()}`, // Can be auto-generated or from gateway
    amount: selectedInvoice.total,
    paymentMethod: selectedMethod,
    paymentDate: new Date().toISOString(),
    reference: reference || autoGeneratedRef,
      createdBy: createdBy,
  };

  try {

    
    const apiKey = localStorage.getItem("apiKey");

    const res = await fetch (`${import.meta.env.VITE_API_URL}/api/Payment`,  {
        method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "X-API-KEY":apiKey ,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

    alert("Payment Successful ✅");
     setSuccess("Payment successfully recorded.");
    setReference("");
    setTransactionId("");
    // Optionally clear invoice/method
    setSelectedInvoice(null);
    setSelectedMethod(null);
    // Optionally reset state or navigate
  } catch (err) {
    console.error(err);
    setError("Failed to record payment. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  
  
  
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };





  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      userProfile={userProfile}
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
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <div className="mb-8">
     <div className="flex items-center justify-between">
     <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoice Management</h1>
      <p className="text-gray-600">Create and manage your payments efficiently!</p>
     </div>

     
   </div>
   </div>
        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Today's Payments</p>
            <h2 className="text-xl font-semibold text-teal-700">GHS 1,250.00</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <h2 className="text-xl font-semibold text-teal-700">24</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Unpaid Invoices</p>
            <h2 className="text-xl font-semibold text-red-600">6</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-xl font-semibold text-green-600">GHS 18,750.00</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Activity Pane */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Retrieve Invoice</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Invoice</label>
           <input
          type="text"
          placeholder="Type invoice number..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedInvoice(null);
          }}
        />


          {/* Dropdown List */}
      {filteredInvoices.length > 0 && (
        <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-white shadow z-10">
          {filteredInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
              onClick={() => {
                setSelectedInvoice(invoice);
                setSearchTerm(invoice.invoiceNumber); // show in input
                setFilteredInvoices([]); // hide dropdown
              }}
            >
              {invoice.invoiceNumber} – GHS {invoice.total?.toFixed(2)}
            </li>
          ))}
        </ul>
      )}




            {selectedInvoice && (
              <div className="text-sm text-gray-700">
                <p><strong>Customer Name:</strong> {selectedInvoice.customer.fullName}</p>
          <p><strong>Invoice Issue Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> GHS{selectedInvoice.total.toFixed(2)}</p>

          
             
              </div>
            )}
          </div>

          {/* Center Pane: Payment Options */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Select Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              {paymentOptions.map((option, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                    selectedMethod === option.name ? "border-teal-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedMethod(option.name)}
                >
                  <img src={option.logo} alt={option.name} className="h-8 object-contain" />
                  <span className="text-sm font-medium text-gray-700">{option.name}</span>
                </div>
              ))}
            </div>
          </div>
          
      {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Right Activity Pane */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Payment Summary</h2>
            {["BankTransfer", "MobileMoney", "POS"].includes(selectedMethod) && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
    <input
      type="text"
      className="w-full border p-2 rounded"
      placeholder="Enter payment reference (e.g. MoMo Txn ID)"
      value={reference}
      onChange={(e) => setReference(e.target.value)}
    />
  </div>
)}
            {selectedInvoice && selectedMethod ? (
              <>
                <p className="text-sm text-gray-700">
                  You're paying <strong>GHS {selectedInvoice.total.toFixed(2)}</strong> via <strong>{selectedMethod}</strong>
                </p>
                <button
  onClick={handlePay}
  disabled={loading}
  className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 disabled:opacity-50"
>
  {loading ? "Processing..." : "Proceed to Pay"}
</button>
{success && <p className="text-green-600 text-sm mt-2">{success}</p>}
{error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </>
            ) : (
              <p className="text-gray-500 text-sm">Select an invoice and a payment method to proceed.</p>
            )}
          </div>
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

