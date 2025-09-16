// InvoiceDashboardPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import axios from "axios";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function InvoiceDashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("/user-placeholder.png");

  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

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
  

  const formatNumber = (num) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(num);

  // 🔹 Fetch Transactions
  const fetchTransactions = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Invoice/GetInvoicesByUserId`,
        {
          headers: { Authorization: `Bearer ${token}` 
          , "X-API-KEY": apiKey
        },
        }
      );
      console.log("Fetched transactions:", res.data); // Debug log
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  // 🔹 Fetch User Profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Register/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { profileImageUrl } = res.data;
      setProfileImageUrl(
        `${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, "/")}`
      );
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      
    }
  };

  // 🔹 Lifecycle
  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  // 🔹 KPI Calculations
  const groupByDate = transactions.reduce((acc, t) => {
    const dateKey = new Date(t.createdAt).toISOString().slice(0, 10);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const todayTxns = groupByDate[todayKey] || [];
  const yesterdayTxns = groupByDate[yesterdayKey] || [];

  const calcTotal = (txns, field) =>
    txns.reduce((sum, t) => sum + (t[field] || 0), 0);

  const todayPayments = calcTotal(todayTxns, "amountPaid");
  const yesterdayPayments = calcTotal(yesterdayTxns, "amountPaid");

  const totalBalance = calcTotal(transactions, "balanceDue");
  const yesterdayBalance = calcTotal(yesterdayTxns, "balanceDue");

  const todayCustomers = new Set(todayTxns.map((t) => t.customer?.id)).size;
  const yesterdayCustomers = new Set(yesterdayTxns.map((t) => t.customer?.id)).size;

  const percentChange = (today, yesterday) => {
    if (yesterday === 0) return "N/A";
    return (((today - yesterday) / yesterday) * 100).toFixed(1);
  };

  const trend = (today, yesterday) => {
    const change = percentChange(today, yesterday);
    if (change === "N/A")
      return <p className="text-gray-400 text-sm mt-1">No data</p>;
    const isUp = today >= yesterday;
    return (
      <p
        className={`${isUp ? "text-green-500" : "text-red-500"} text-sm mt-1`}
      >
        {isUp ? "↑" : "↓"} {change}% – was {formatNumber(yesterday)}
      </p>
    );
  };


// 🔹 Build last 7 days chart data
const last7days = [...Array(7)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return d.toISOString().slice(0, 10);
}).reverse();

const chartData = last7days.map((dateKey) => {
  const txns = transactions.filter(
    (t) => new Date(t.createdAt).toISOString().slice(0, 10) === dateKey
  );
  return {
    date: dateKey.slice(5), // MM-DD format
    payments: calcTotal(txns, "amountPaid"),
    balance: calcTotal(txns, "balanceDue"),
  };
});

useApiInterceptor();

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
      }}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hi. Here’s a glance of your business at All Branches
        </h1>

        {/* 🔹 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Payments Collected Today</p>
            <h2 className="text-2xl font-bold text-gray-800">
              GHS {formatNumber(todayPayments)}
            </h2>
            {trend(todayPayments, yesterdayPayments)}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Outstanding Balance</p>
            <h2 className="text-2xl font-bold text-gray-800">
              GHS {formatNumber(totalBalance)}
            </h2>
            {trend(totalBalance, yesterdayBalance)}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Customers Served Today</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {todayCustomers}
            </h2>
            {trend(todayCustomers, yesterdayCustomers)}
          </div>
        </div>

        {/* 🔹 Sales Trends Chart */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Sales Trends For{" "}
              <span className="text-teal-500">PAST 7 DAYS</span>
            </h2>
            
          </div>
          <div className="mt-4 h-60">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value) => `GHS ${formatNumber(value)}`} />
      <Legend />
      <Line type="monotone" dataKey="payments" stroke="#14b8a6" strokeWidth={2} />
      <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>
        </div>

        {/* 🔹 Last Transactions */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Last Transactions</h2>
            <button className="text-teal-500 text-sm">SEE MORE</button>
          </div>
          <ul className="mt-4 divide-y divide-gray-200">
            {transactions.slice(0, 7).map((txn) => (
              <li
                key={txn.id}
                className="py-2 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {txn.customer?.fullName || "Unknown Customer"}
                  </p>
                  <p className="text-gray-500">
                    Invoice {txn.invoiceNumber} – {txn.status}
                  </p>
                </div>
                <span className="font-semibold text-gray-800">
    
              GHS {formatNumber(txn.amountPaid)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

