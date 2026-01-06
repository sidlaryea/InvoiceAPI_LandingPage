import { useState, useEffect,useCallback } from "react";
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
    items: [{ productId: '', name: '', quantity: 1, unitPrice: 0, description: '' }],
    amount: 0,
    currency: 'GHS',
    tax: 0,
    notes: '',
    totalTaxAmount: 0,
    isActive: true,
    discountPercent: 0
  });



  ///////Function for Fetching the Recurring Invoices/////////
  const fetchRecurringInvoices = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/RecurringInvoice/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecurringInvoices(response.data);
      console.log("Fetched recurring invoices:", response.data);
    } catch (error) {
      console.error("Error fetching recurring invoices:", error);
      setError("Failed to fetch recurring invoices");
    }
  };



  useEffect(() => {
    fetchRecurringInvoices();
    fetchUserProfile();
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

  // Set customer details from embedded customer object when invoice is selected
  useEffect(() => {
    if (selectedInvoice && selectedInvoice.customer) {
      setSelectedInvoice(prev => ({
        ...prev,
        customerName: selectedInvoice.customer.fullName,
        customerEmail: selectedInvoice.customer.email,
        customerPhone: selectedInvoice.customer.phone,
        customerAddress: selectedInvoice.customer.address
      }));
    }
  }, [selectedInvoice?.id]);
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
  const [taxComponents, setTaxComponents] = useState([]); // Holds list of tax items from DB 

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

 // 🧭 Fetch taxes by country
  useEffect(() => {
    const fetchTaxesByCountry = async () => {
      const country = localStorage.getItem("country");
      if (!country) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Tax/by-country/${country}`);
        const data = await res.json();
        console.log("Fetched taxes on load:", data);
        setTaxComponents(data);
      } catch (err) {
        console.error("Error fetching tax components:", err);
        setTaxComponents([]);
      }
    };

    fetchTaxesByCountry();
  }, [formData.country]);

  // 💰 Subtotal
  const calculateSubtotal = useCallback(() => {
    return formData.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
  }, [formData.items]);

  // 🎁 Discount
  const calculateDiscount = useCallback(() => {
    return (calculateSubtotal() * (formData.discountPercent ?? 0)) / 100;
  }, [calculateSubtotal, formData.discountPercent]);

  // 🧮 Tax for form
  const calculateTax = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const discountedSubtotal = subtotal - discount;
    const totalTaxRate = taxComponents.reduce((sum, tax) => sum + Number(tax.rate || 0), 0);
    return (discountedSubtotal * totalTaxRate) / 100;
  }, [calculateSubtotal, calculateDiscount, taxComponents]);

  const calculateTaxForInvoice = useCallback((invoice) => {
    if (!invoice) return 0;
    const subtotal = Number(
      invoice.subtotal ??
        (invoice.items?.reduce((s, it) => s + (Number(it.unitPrice || 0) * Number(it.quantity || 0)), 0) ?? 0)
    );
    const discountPercent = Number(invoice.discountPercent ?? 0);
    const discountedSubtotal = subtotal - (subtotal * discountPercent) / 100;
    const totalTaxRate = taxComponents.reduce((sum, tax) => sum + Number(tax.rate || 0), 0);
    return (discountedSubtotal * totalTaxRate) / 100;
  }, [taxComponents]);

  // 🧮 Total
  const calculateTotal = useCallback(() => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  }, [calculateSubtotal, calculateDiscount, calculateTax]);

  // 💵 Currency formatter
  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: currency || "GHS",
      }).format(amount);
    } catch {
      // Fallback to GHS if currency is invalid
      return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(amount);
    }
  };

 

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };


  const fetchProducts = async (query) => {
  if (!query) return [];

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Product/search?query=${encodeURIComponent(query)}`);
    return await res.json(); // expected: array of { id, name, price, description }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const mapInterval = (intervalString) => {
  switch (intervalString.toLowerCase()) {
    case "daily": return 0;
    case "weekly": return 1;
    case "monthly": return 2;
    case "yearly": return 3;
    default: return 2; // Monthly as default
  }
};

const formatIntervalDisplay = (interval, frequency, dayOfWeek, dayOfMonth) => {
  // Map integer interval to string if needed
  const intervalMap = {
    0: "Day",
    1: "Week",
    2: "Month",
    3: "Year"
  };
  const intervalString = intervalMap[interval] || interval.toLowerCase();

  const pluralMap = {
    Day: "Days",
    Week: "Weeks",
    Month: "Months",
    Year: "Years"
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let display = "";

  if (frequency === 1) {
    display = `Every 1 ${intervalString}`;
  } else {
    display = `Every ${frequency} ${pluralMap[intervalString] || intervalString}`;
  }

  // Add day of week for weekly intervals
  if (interval === 1 && dayOfWeek !== null && dayOfWeek !== undefined) {
    display += ` On ${dayNames[dayOfWeek]}`;
  }

  // Add day of month for monthly intervals
  if (interval === 2 && dayOfMonth) {
    display += ` On Day ${dayOfMonth}`;
  }

  return display;
};

  ////////Handle Form Submission////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    const apiKey = localStorage.getItem("apiKey");


    try {
      const intervalInt = mapInterval(formData.interval);
      const mockInvoice = {
        interval: intervalInt,
        frequency: Number(formData.frequency),
        dayOfWeek: formData.dayOfWeek || null,
        dayOfMonth: formData.dayOfMonth || null,
        startDate: formData.startDate,
        lastGeneratedAt: null
      };
      const nextDate = getNextGenerationDateObject(mockInvoice);
      const payload = {
  customerId: Number(formData.customerId),
  notes: formData.notes,
  startDate: new Date(formData.startDate).toISOString(),
  endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
  nextGenerationDate: nextDate ? nextDate.toISOString() : new Date(formData.startDate).toISOString(),
  currency: formData.currency,
  taxComponentIds: taxComponents.map(tax => tax.id), // should be numeric IDs
  interval: intervalInt, // helper function to convert string → int
  frequency: Number(formData.frequency),
  dayOfWeek: formData.dayOfWeek || null,
  dayOfMonth: formData.dayOfMonth || null,
  isActive: formData.isActive,
  discountPercent: formData.discountPercent || 0,
  items: formData.items.map(item => ({
    productId: Number(item.productId),
    name: item.name,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice)
  }))
};

      await axios.post(`${import.meta.env.VITE_API_URL}/api/RecurringInvoice`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        }
      });
        
      setSuccess("Recurring invoice created successfully!");
      fetchRecurringInvoices(); // Refresh the list
      console.log("Recurring invoice created with payload:", payload);
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
        items: [{ productId: '', name: '', quantity: 1, unitPrice: 0, description: '' }],
        amount: 0,
        currency: 'GHS',
        tax: 0,
        notes: '',
        totalTaxAmount: 0,
        isActive: true,
        discountPercent: 0
      });
      setSelectedCustomer(null);
      setIsCreating(false);

    } catch (error) {
      console.error("Error creating recurring invoice:", error);
      setError(error.response?.data?.message || "An error occurred while creating the recurring invoice");
    } finally {
      setLoading(false);
    }
  };

const addItem = () => {
  setFormData((prev) => ({
    ...prev,
    items: [...prev.items, { productId: '',name:'', quantity: 1, unitPrice: 0, description: '' }],
  }));
};

const removeItem = (index) => {
  setFormData((prev) => ({
    ...prev,
    items: prev.items.filter((_, i) => i !== index),
  }));
};

const updateItem = (index, field, value) => {
  setFormData((prev) => ({
    ...prev,
    items: prev.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ),
  }));
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

  const getNextGenerationDateObject = (invoice) => {
    try {
      // Use startDate as the base if no lastGeneratedAt, otherwise use lastGeneratedAt
      const baseDate = invoice.lastGeneratedAt ? new Date(invoice.lastGeneratedAt) : new Date(invoice.startDate);
      if (isNaN(baseDate.getTime())) {
        throw new Error('Invalid base date');
      }
      let nextDate = new Date(baseDate);

      switch (invoice.interval) {
        case 0: // Daily
        case 'Daily':
          nextDate.setDate(baseDate.getDate() + invoice.frequency);
          break;
        case 1: // Weekly
        case 'Weekly':
          if (invoice.dayOfWeek !== null && invoice.dayOfWeek !== undefined) {
            // Calculate next occurrence of the specified day of the week
            const daysUntilTarget = (invoice.dayOfWeek - baseDate.getDay() + 7) % 7;
            nextDate.setDate(baseDate.getDate() + daysUntilTarget);
            // If the calculated date is not after baseDate, add another week
            if (nextDate <= baseDate) {
              nextDate.setDate(nextDate.getDate() + 7);
            }
            // Then add (frequency - 1) weeks
            nextDate.setDate(nextDate.getDate() + (invoice.frequency - 1) * 7);
          } else {
            // Default to adding frequency * 7 days if no dayOfWeek specified
            nextDate.setDate(baseDate.getDate() + (invoice.frequency * 7));
          }
          break;
        case 2: // Monthly
        case 'Monthly':
          if (invoice.dayOfMonth) {
            let targetDay = invoice.dayOfMonth;
            let baseDay = baseDate.getDate();
            let baseMonth = baseDate.getMonth();
            let baseYear = baseDate.getFullYear();
            let daysInBaseMonth = new Date(baseYear, baseMonth + 1, 0).getDate();
            if (baseDay <= targetDay && targetDay <= daysInBaseMonth) {
              nextDate.setDate(targetDay);
            } else {
              nextDate.setMonth(baseMonth + invoice.frequency);
              if (isNaN(nextDate.getTime())) {
                throw new Error('Invalid date calculation');
              }
              let daysInNewMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
              nextDate.setDate(Math.min(targetDay, daysInNewMonth));
              if (isNaN(nextDate.getTime())) {
                throw new Error('Invalid date calculation');
              }
            }
          } else {
            nextDate.setMonth(baseDate.getMonth() + invoice.frequency);
            if (isNaN(nextDate.getTime())) {
              throw new Error('Invalid date calculation');
            }
          }
          break;
        case 3: // Yearly
        case 'Yearly':
          nextDate.setFullYear(baseDate.getFullYear() + invoice.frequency);
          break;
        default:
          // Fallback to daily
          nextDate.setDate(baseDate.getDate() + invoice.frequency);
      }

      if (isNaN(nextDate.getTime())) {
        throw new Error('Invalid calculated date');
      }

      return nextDate;
    } catch (error) {
      console.error('Error calculating next generation date:', error);
      return null;
    }
  };

  const getNextGenerationDate = (invoice) => {
    const nextDate = getNextGenerationDateObject(invoice);
    if (!nextDate) return 'Invalid Date';
    return formatDate(nextDate.toISOString().split('T')[0]);
  };

  const handleDelete = (id) => {
    setRecurringInvoices(prev => prev.filter(inv => inv.id !== id));
    showNotification('Recurring invoice deleted', 'success');
  };

  const handleToggleActive = async (id, isActive) => {
  try {
    if (isActive) {
      // 🔹 Pause recurring invoice
      await fetch(`${import.meta.env.VITE_API_URL}/api/RecurringInvoice/${id}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      showNotification('Recurring invoice paused successfully', 'success');
    } else {
      // 🔹 Reactivate recurring invoice
      await fetch(`${import.meta.env.VITE_API_URL}/api/RecurringInvoice/${id}/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      showNotification('Recurring invoice activated successfully', 'success');
    }

    // 🔄 Update local UI state
    setRecurringInvoices(prev =>
      prev.map(inv =>
        inv.id === id ? { ...inv, isActive: !inv.isActive } : inv
      )
    );

  } catch (error) {
    console.error('Error toggling recurring invoice:', error);
    showNotification('Failed to update recurring invoice status', 'error');
  }
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
              {formatCurrency(recurringInvoices.filter(inv => inv.isActive).reduce((sum, inv) => sum + inv.balanceDue, 0))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Recurring Invoice List */}
          <div className="bg-white rounded-lg shadow-sm ">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
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
                          {invoice.customer.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.balanceDue, invoice.currency)}
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
                        min={new Date().toISOString().split('T')[0]}
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
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
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
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  dayOfWeek: e.target.value ? parseInt(e.target.value) : null,
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                              <option value="">Select Day</option>
                              <option value="0">Sunday</option>
                              <option value="1">Monday</option>
                              <option value="2">Tuesday</option>
                              <option value="3">Wednesday</option>
                              <option value="4">Thursday</option>
                              <option value="5">Friday</option>
                              <option value="6">Saturday</option>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discountPercent}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          discountPercent: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-grow text-center">
                          <h3 className="text-lg font-medium text-gray-900"><b>Add Invoice Items</b></h3>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={addItem}
                            className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Item
                          </button>
                        </div>
                      </div>
                    
                      {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Item/Product
                            </label>
                            <AutocompleteSearch
                                placeholder="Search product by name or ID"
                                value={item?.product || null}
                                fetchData={fetchProducts}
                                getOptionLabel={(product) => `${product.name}`}
                                onSelect={(product) => {
                                  updateItem(index, "product", product);
                                  updateItem(index, "productId", product.id);
                                  updateItem(index, "name", product.name);
                                  updateItem(index, "description", product.description);
                                  updateItem(index, "unitPrice", product.price);
                                }}
                              />
                    
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              required
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                              disabled={formData.items.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              rows="2"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal(), formData.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Discount ({formData.discountPercent ?? 0}%):</span>
                  <span className="font-medium">
                    -{formatCurrency((calculateSubtotal() * (formData.discountPercent ?? 0)) / 100, formData.currency)}
                  </span>
                </div>



                  <div className="mb-2">
                    {taxComponents.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-sm text-gray-600">
                        <span>{tax.name} ({tax.rate}%):</span>
                        <span>{formatCurrency(((calculateSubtotal() - calculateDiscount()) * tax.rate) / 100, formData.currency)}</span>
                      </div>
                    ))}

                    

                    <div className="flex justify-between font-medium mt-1">
                      <span>Total Tax ({taxComponents.reduce((sum, t) => sum + t.rate, 0)}%):</span>
                      <span>{formatCurrency(calculateTax(), formData.currency)}</span>
                    </div>
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
                            onClick={() => handleToggleActive(selectedInvoice.id, selectedInvoice.isActive)}
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
                            {formatIntervalDisplay(selectedInvoice.interval, selectedInvoice.frequency, selectedInvoice.dayOfWeek, selectedInvoice.dayOfMonth)}
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
                        <span className="text-gray-600">Balance Due:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.balanceDue, selectedInvoice.currency)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.amountPaid, selectedInvoice.currency)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
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
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium">{selectedInvoice.customerPhone}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="font-medium">{selectedInvoice.customerAddress}</div>
                      </div>
                      </div>
                    </div>
                  </div>
<div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Items</h3>
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Description   
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th> 
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Total 
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (  
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice * item.quantity, selectedInvoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Discount ({selectedInvoice.discountPercent ?? 0}%):</span>
                    <span className="font-medium">
                      -{formatCurrency((selectedInvoice.subtotal * (selectedInvoice.discountPercent ?? 0)) / 100, selectedInvoice.currency)}
                    </span>
                  </div>
                  <div className="mb-2">
  {taxComponents.map((tax) => (
    <div key={tax.id} className="flex justify-between text-sm text-gray-600">
      <span>{tax.name} ({tax.rate}%):</span>
      <span>
        {formatCurrency(((selectedInvoice.subtotal - (selectedInvoice.subtotal * (selectedInvoice.discountPercent ?? 0)) / 100) * tax.rate) / 100, selectedInvoice.currency)}
      </span>
    </div>
  ))}


  <div className="flex justify-between font-medium mt-1">
    <span>
      Total Tax  ({taxComponents.reduce((sum, t) => sum + Number(t.rate), 0)}%):
    </span>
    <span>
       {formatCurrency(calculateTaxForInvoice(selectedInvoice), selectedInvoice?.currency || formData.currency)}
    </span>
  </div>
</div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
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
