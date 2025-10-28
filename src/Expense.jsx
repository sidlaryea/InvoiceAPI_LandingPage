import { useState, useEffect } from "react";
import { X, Plus, Search, Filter, Download, Upload, Calendar, CreditCard, Building2, Receipt, Tag, User, ChevronDown, Eye, Trash2, Check, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";
import AddCategoryModal from "./components/AddExpenseCategoryModal";
import ViewExpense from "./components/Ui/ViewExpense";
import ApproveExpense from "./components/Ui/ApproveExpense";

export default function ExpensesPage() {
  // State for profile image and dialogs
  const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // New states for expense management layout
  const [showModal, setShowModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showViewExpenseModal, setShowViewExpenseModal] = useState(false);
  const [showApproveExpenseModal, setShowApproveExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedExpenseForApproval, setSelectedExpenseForApproval] = useState(null);
  // const [activeTab, setActiveTab] = useState('expenses');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
    merchant: '',
    paymentMethod: '',
    project: '',
    receiptNumber: '',
    taxAmount: '',
    tags: []
  });

  // Expenses data from API
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats data
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingApproval: 0,
    totalAmount: 0,
    thisMonthAmount: 0,
    totalExpensesPercentage: 0,
    thisMonthPercentage: 0,
  });

  // Expense categories from API
  const [expenseCategories, setExpenseCategories] = useState([]);

  // Country info for header
  const getFlagEmoji = (code) => {
    return code
      ?.toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };
  const country = localStorage.getItem('country');
  const countryCode = localStorage.getItem('countryCode');

  // Categories for filter and form
  const categories = [
    { name: 'Travel', icon: '✈️', color: 'bg-blue-100 text-blue-700' },
    { name: 'Meals', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
    { name: 'Office Supplies', icon: '📦', color: 'bg-purple-100 text-purple-700' },
    { name: 'Utilities', icon: '⚡', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Transportation', icon: '🚗', color: 'bg-green-100 text-green-700' },
    { name: 'Software', icon: '💻', color: 'bg-indigo-100 text-indigo-700' }
  ];

  // Get status text from number
  const getStatusText = (status) => {
    const statusMap = {
      0: 'Draft',
      1: 'Pending',
      2: 'Approved',
      3: 'Paid',
      4: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
  };

  // Get status element with color
  const getStatusElement = (status) => {
    const text = getStatusText(status);
    const colorMap = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Paid': 'bg-blue-100 text-blue-800 border-blue-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${colorMap[text] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>{text}</span>;
  };

  // Get category info for badges
  const getCategoryInfo = (categoryName) => {
    return categories.find(c => c.name === categoryName) || { icon: '📄', color: 'bg-gray-100 text-gray-700' };
  };

  // Format number with commas for thousands
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Handle file change for receipt upload in modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Could update formData with receipt file if needed
  };

  // Handle upload profile image
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formDataUpload = new FormData();
    formDataUpload.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Profile image updated!");
      fetchUserProfile();
      setIsChangeImageDialogOpen(false);
    } catch (error) {
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    }
  };

  // Handle change password
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
      alert("Authentication token not found.");
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
      setIsChangePasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  // Fetch user profile image
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  // Handle status update
  const handleStatusUpdate = (expenseId, newStatus) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.expenseId === expenseId
          ? { ...expense, expenseStatus: newStatus }
          : expense
      )
    );
  };

  // Handle save expense
  const saveExpense = async () => {
    if (!formData.date || !formData.category || !formData.amount || !formData.description || !formData.merchant || !formData.paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    const expenseData = {
      date: formData.date,
      categoryId: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      merchant: formData.merchant,
      paymentMethod: formData.paymentMethod,
    };

    try {
      if (selectedFile) {
        // Use FormData for file upload
        const formDataUpload = new FormData();
        formDataUpload.append("date", expenseData.date);
        formDataUpload.append("categoryId", expenseData.categoryId);
        formDataUpload.append("amount", expenseData.amount);
        formDataUpload.append("description", expenseData.description);
        formDataUpload.append("merchant", expenseData.merchant);
        formDataUpload.append("paymentMethod", expenseData.paymentMethod);
        formDataUpload.append("receiptFile", selectedFile); // Assuming API expects "receipt" as key

        await axios.post(`${import.meta.env.VITE_API_URL}/api/Expense`, formDataUpload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-API-KEY": apiKey,
          },
        });
      } else {
        // JSON payload
        await axios.post(`${import.meta.env.VITE_API_URL}/api/Expense`, expenseData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      }
      //console.log(typeof formData.category, formData.category);
      alert("Expense saved successfully!");
      setShowExpenseModal(false);
      setFormData({
        date: '',
        category: '',
        amount: '',
        description: '',
        merchant: '',
        paymentMethod: '',
        project: '',
        receiptNumber: '',
        taxAmount: '',
        tags: []
      });
      setSelectedFile(null);
      // Refetch expenses to update the list
      const fetchExpenses = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Expense/by-user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setExpenses(res.data);
        } catch (err) {
          console.error("Error refetching expenses", err);
        }
      };
      fetchExpenses();
    } catch (error) {
      alert("Failed to save expense: " + (error.response?.data?.message || error.message));
    }
  };

  useApiInterceptor();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Expense/by-user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const fetchExpenseCategories = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ExpenseCategory/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenseCategories(res.data);
    } catch (err) {
      console.error("Error fetching expense categories", err);
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
    fetchUserProfile();
  }, []);

  // Calculate stats from expenses data
  useEffect(() => {
    if (expenses.length > 0) {
      const totalExpenses = expenses.length;
      const pendingApproval = expenses.filter(exp => exp.expenseStatus === 1).length;
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthAmount = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      setStats({
        totalExpenses,
        pendingApproval,
        totalAmount,
        thisMonthAmount,
        totalExpensesPercentage: 0, // Placeholder, no historical data
        thisMonthPercentage: 0, // Placeholder, no historical data
      });
    }
  }, [expenses]);

  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      openModal={() => setShowModal(true)}
      isModalOpen={showModal}
      closeModal={() => setShowModal(false)}
      handleSignOut={handleSignOut}
      toggleSidebar={() => {}}
      isSidebarOpen={true}
      dialogProps={{
        openChangeImageDialog: () => setIsChangeImageDialogOpen(true),
        openChangePasswordDialog: () => setIsChangePasswordDialogOpen(true),
        isChangeImageDialogOpen,
        closeChangeImageDialog: () => setIsChangeImageDialogOpen(false),
        handleFileChange,
        handleUpload,
        isChangePasswordDialogOpen,
        closeChangePasswordDialog: () => {
          setIsChangePasswordDialogOpen(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        },
        currentPassword,
        newPassword,
        confirmNewPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,
        handleChangePassword,
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-gray-500 mt-1">Track and manage your expenses efficiently</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="font-medium">{getFlagEmoji(countryCode)} {country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Total Expenses</span>
                <Receipt className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalExpenses}</div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{stats.totalExpensesPercentage}% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Pending Approval</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.pendingApproval}</div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Awaiting review</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Total Amount</span>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">GH₵{formatNumber(stats.totalAmount)}</div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>All time</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">This Month</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">GH₵{formatNumber(stats.thisMonthAmount)}</div>
              <div className="flex items-center mt-2 text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                <span>{stats.thisMonthPercentage}% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => setActiveTab('expenses')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'expenses'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Expenses
                  </button> */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, description, merchant..."
                      className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 whitespace-nowrap font-medium cursor-pointer"
                  >
                    <Plus className="w-4 h-4 cursor-pointer" />
                    Create Expense
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {filterOpen && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.name}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>All Methods</option>
                        <option>Mobile Money</option>
                        <option>Credit Card</option>
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900">
                      Expense ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500">Loading expenses...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-red-500">Error: {error}</td>
                    </tr>
                  ) : expenses.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500">No expenses found.</td>
                    </tr>
                  ) : (
                    expenses.map((expense) => {
                      const category = expenseCategories.find(c => c.id === expense.categoryId);
                      const categoryName = category ? category.name : expense.categoryId;
                      const categoryInfo = getCategoryInfo(categoryName);
                      return (
                        <tr key={expense.expenseId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">{expense.expenseId}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              <span>{categoryInfo.icon}</span>
                              <span>{categoryName}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">GH₵{expense.amount.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{expense.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{expense.merchant}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{expense.paymentMethod}</td>
                          <td className="px-6 py-4">
                            {getStatusElement(expense.expenseStatus)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                title="View"
                                onClick={() => {
                                  setSelectedExpense(expense);
                                  setShowViewExpenseModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Approve"
                                onClick={() => {
                                  setSelectedExpenseForApproval(expense);
                                  setShowApproveExpenseModal(true);
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              {/* <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button> */}
                              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">Showing 1 to 4 of 47 expenses</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm cursor-pointer">Previous</button>
                <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm cursor-pointer">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Expense Modal */}
        {showExpenseModal && (
<div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Expense Entry</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500"  onClick={() => setShowExpenseModal(false)} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-teal-600 hover:text-teal-800 cursor-pointer mb-1" onClick={() => setShowCategoryModal(true)}>Add new Expense category</p>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label> */}
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: Number (e.target.value) }))}
                    >
                      <option value="">Select category</option>
                      {expenseCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GH₵) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter details..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Merchant *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., Melcom"
                      value={formData.merchant}
                      onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    >
                      <option value="">Select payment method</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveExpense}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                  >
                    Save Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <AddCategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSaved={fetchExpenseCategories}
        />

        {showViewExpenseModal && (
          <ViewExpense
            isOpen={showViewExpenseModal}
            expense={selectedExpense}
            onClose={() => setShowViewExpenseModal(false)}
            expenseCategories={expenseCategories}
            getStatusElement={getStatusElement}
          />
        )}

        {showApproveExpenseModal && (
          <ApproveExpense
            isOpen={showApproveExpenseModal}
            expense={selectedExpenseForApproval}
            onClose={() => setShowApproveExpenseModal(false)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </DashboardLayout>
  );

}
