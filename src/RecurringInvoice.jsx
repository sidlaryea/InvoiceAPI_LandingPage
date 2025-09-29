import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Save, Eye, Edit3, X, MoveRight, Send } from "lucide-react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import AutocompleteSearch from './components/AutocompleteSearch';
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";
import SuccessModal from "./components/Ui/SuccessModal";
//import { toast } from "react-hot-toast";

export default function RecurringInvoicePage() {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    startDate: '',
    endDate: '',
    interval: 'Monthly',
    frequency: 1,
    dayOfWeek: '',
    dayOfMonth: '',
    amount: 0,
    currency: 'GHS',
    tax: 0,
    notes: '',
    isActive: true
  });

  // Mock data for recurring invoices
  const mockRecurringInvoices = [
    {
      id: 1,
      invoiceNumber: 'REC-001',
      customerId: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      startDate: '2023-01-01',
      endDate: null,
      interval: 'Monthly',
      frequency: 1,
      dayOfMonth: 15,
      amount: 500,
      currency: 'GHS',
      tax: 50,
      totalAmount: 550,
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
      lastGeneratedAt: '2023-12-15T00:00:00Z',
      notes: 'Monthly subscription'
    },
    {
      id: 2,
      invoiceNumber: 'REC-002',
      customerId: '2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      startDate: '2023-02-01',
      endDate: '2024-02-01',
      interval: 'Weekly',
      frequency: 2,
      dayOfWeek: 'Monday',
      amount: 200,
      currency: 'USD',
      tax: 20,
      totalAmount: 220,
      isActive: true,
      createdAt: '2023-02-01T00:00:00Z',
      lastGeneratedAt: '2023-12-18T00:00:00Z',
      notes: 'Bi-weekly service'
    },
    {
      id: 3,
      invoiceNumber: 'REC-003',
      customerId: '3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      startDate: '2023-03-01',
      endDate: null,
      interval: 'Yearly',
      frequency: 1,
      amount: 1200,
      currency: 'EUR',
      tax: 120,
      totalAmount: 1320,
      isActive: false,
      createdAt: '2023-03-01T00:00:00Z',
      lastGeneratedAt: '2023-03-01T00:00:00Z',
      notes: 'Annual maintenance'
    }
  ];

  ///////Function for Fetching the Recurring Invoices/////////
  const fetchRecurringInvoices = async () => {
    // Mock fetch - in real app, this would call the API
    setTimeout(() => {
      setRecurringInvoices(mockRecurringInvoices);
    }, 500); // Simulate loading
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const filteredInvoices = recurringInvoices.filter(inv =>
    inv.invoiceNumber.toString().includes(search) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");
  //const [showSuccess, setShowSuccess] = useState(false);

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

  const country = localStorage.getItem('country');
  const countryCode = localStorage.getItem('countryCode');

  // Flag helper function
  const getFlagEmoji = (code) => {
    return code
      ?.toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
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
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
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

  ////////Handle Form Submission////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      // Mock submission - in real app, this would call the API
      const newInvoice = {
        ...formData,
        id: recurringInvoices.length + 1,
        invoiceNumber: `REC-${String(recurringInvoices.length + 1).padStart(3, '0')}`,
        totalAmount: formData.amount + formData.tax,
        createdAt: new Date().toISOString(),
        lastGeneratedAt: null
      };

      setRecurringInvoices(prev => [newInvoice, ...prev]);
      setSuccess("Recurring invoice created successfully!");

      // Reset form
      setFormData({
        customerId: '',
        customerName: '',
        customerEmail: '',
        startDate: '',
        endDate: '',
        interval: 'Monthly',
        frequency: 1,
        dayOfWeek: '',
        dayOfMonth: '',
        amount: 0,
        currency: 'GHS',
        tax: 0,
        notes: '',
        isActive: true
      });
      setSelectedCustomer(null);
      setIsCreating(false);

    } catch (error) {
      console.error("Error creating recurring invoice:", error);
      alert("An error occurred while creating the recurring invoice");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.amount + formData.tax;
  };

  const formatCurrency = (amount, currency = 'GHS') => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Indefinite';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getNextGenerationDate = (invoice) => {
    if (!invoice.lastGeneratedAt) return formatDate(invoice.startDate);
    // Simple calculation - in real app, this would be more complex
    const lastDate = new Date(invoice.lastGeneratedAt);
    let nextDate = new Date(lastDate);

    switch (invoice.interval) {
      case 'Daily':
        nextDate.setDate(lastDate.getDate() + invoice.frequency);
        break;
      case 'Weekly':
        nextDate.setDate(lastDate.getDate() + (invoice.frequency * 7));
        break;
      case 'Monthly':
        nextDate.setMonth(lastDate.getMonth() + invoice.frequency);
        if (invoice.dayOfMonth) nextDate.setDate(invoice.dayOfMonth);
        break;
      case 'Yearly':
        nextDate.setFullYear(lastDate.getFullYear() + invoice.frequency);
        break;
    }

    return formatDate(nextDate.toISOString().split('T')[0]);
  };

  const handleDelete = (id) => {
    setRecurringInvoices(prev => prev.filter(inv => inv.id !== id));
    showNotification('Recurring invoice deleted', 'success');
  };

  const handleToggleActive = (id) => {
    setRecurringInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, isActive: !inv.isActive } : inv
    ));
    showNotification('Recurring invoice status updated', 'success');
  };

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
        handleChangePassword,
      }}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Recurring Invoice Management</h1>
              <p className="text-gray-600">Create and manage your recurring invoices efficiently</p>
            </div>

            {/* Country Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Country:</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50">
                <span className="text-xl">{getFlagEmoji(countryCode)}</span>
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>

        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Recurring Invoices</h3>
            <div className="text-3xl font-bold text-gray-900">{recurringInvoices.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Recurring Invoices</h3>
            <div className="text-3xl font-bold text-gray-900">
              {recurringInvoices.filter(inv => inv.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Monthly Value</h3>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(recurringInvoices.filter(inv => inv.isActive).reduce((sum, inv) => sum + inv.totalAmount, 0))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Recurring Invoice List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search recurring invoice by ID or customer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Recurring Invoice
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : currentInvoices.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No recurring invoices found. Create your first recurring invoice!
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Generation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.totalAmount, invoice.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.frequency > 1 ? `Every ${invoice.frequency} ${invoice.interval}s` : `${invoice.interval}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getNextGenerationDate(invoice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(invoice.id)}
                              className={`hover:text-gray-900 ${invoice.isActive ? 'text-yellow-600' : 'text-green-600'}`}
                            >
                              {invoice.isActive ? 'Pause' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex justify-center items-center mt-3 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Column - Invoice Details or Create Form */}
          <div className="bg-white rounded-lg shadow-sm">
            {isCreating ? (
              <div>
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Create Recurring Invoice</h2>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer
                      </label>
                      <AutocompleteSearch
                        placeholder="Search Customer by name or ID"
                        value={selectedCustomer}
                        fetchData={async (query) => {
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Customer/search?query=${encodeURIComponent(query)}`);
                          return await res.json(); // array of { id, name, email }
                        }}
                        getOptionLabel={(customer) => `${customer.name}`}
                        onSelect={(customer) => {
                          console.log("Selected customer:", customer);
                          setSelectedCustomer(customer);
                          setFormData((prev) => ({
                            ...prev,
                            customerId: customer.id,
                            customerName: customer.name,
                            customerEmail: customer.email,
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interval
                      </label>
                      <select
                        value={formData.interval}
                        onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: parseInt(e.target.value) || 1 }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    {formData.interval === 'Weekly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day of Week
                        </label>
                        <select
                          value={formData.dayOfWeek}
                          onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    )}

                    {formData.interval === 'Monthly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day of Month
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={formData.dayOfMonth}
                          onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) || '' }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.tax}
                        onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="GHS">GHS</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      rows="3"
                    />
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(formData.amount, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="font-medium">{formatCurrency(formData.tax, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal(), formData.currency)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <span>💾</span>
                      )}
                      Create Recurring Invoice
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedInvoice ? (
              <div>
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Recurring Invoice Details</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(selectedInvoice.id)}
                        className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                          selectedInvoice.isActive ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {selectedInvoice.isActive ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-4 font-bold">Recurring Invoice Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice Number:</span>
                          <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{formatDate(selectedInvoice.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">{formatDate(selectedInvoice.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interval:</span>
                          <span className="font-medium">
                            {selectedInvoice.frequency > 1 ? `Every ${selectedInvoice.frequency} ${selectedInvoice.interval}s` : `${selectedInvoice.interval}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedInvoice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedInvoice.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Generation:</span>
                          <span className="font-medium">{getNextGenerationDate(selectedInvoice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedInvoice.totalAmount, selectedInvoice.currency)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <div className="font-medium">{selectedInvoice.customerName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium">{selectedInvoice.customerEmail}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Notes:</span>
                          <div className="font-medium">{selectedInvoice.notes || 'No notes'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a recurring invoice to view details or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
