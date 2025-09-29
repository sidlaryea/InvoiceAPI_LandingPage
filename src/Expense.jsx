import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Save, Eye, Edit3, X, MoveRight, Send } from "lucide-react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import AutocompleteSearch from './components/AutocompleteSearch';
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";
import SuccessModal from "./components/Ui/SuccessModal";
//import { toast } from "react-hot-toast";

export default function ExpensesPage() {
  // // const [formData, setFormData] = useState({
  //   expenseId: 0,
  //   date: '',
  //   category: '',
  //   Amount: '',
  //   currency: 'GHS',
  //   status: 'Ghana',
  //   description: '',

  //   //For mileage Registration
  //   mileageId: '',
  //   from: '',
  //   to: '',
  //   distance: '',
  //   rate: '',
  //   totalCost: '',
  //   purpose: '',
  //   // status: 'Draft',
  //   createdBy: 'user.name||System',
  // });

  // Various states
  // const [notification, setNotification] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [notification, ] = useState(null);
  const [loading, ] = useState(false);
  const [success, ] = useState(null);
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

  // New states for tab and search
  const [currentTab, setCurrentTab] = useState('expenses');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal form states
  const [expenseFormData, setExpenseFormData] = useState({
    date: '',
    category: '',
    amount: '',
    status: 'pending',
    description: '',
    receiptFile: null,
  });

  const [mileageFormData, setMileageFormData] = useState({
    date: '',
    startLocation: '',
    endLocation: '',
    distance: '',
    ratePerKm: 2.50,
    calculatedCost: 0,
    purpose: '',
  });
  
  // Calculate total cost based on distance and ratePerKm
  useEffect(() => {
    const distance = parseFloat(mileageFormData.distance) || 0;
    const rate = parseFloat(mileageFormData.ratePerKm) || 0;
    const totalCost = distance * rate;
    setMileageFormData(prev => ({ ...prev, calculatedCost: totalCost.toFixed(2) }));
  }, [mileageFormData.distance, mileageFormData.ratePerKm]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForms();
  };

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
    const file = e.target.files[0];
    setSelectedFile(file);
    setExpenseFormData(prev => ({ ...prev, receiptFile: file }));
  };

  // Flag helper function
  const getFlagEmoji = (code) => {
    return code
      ?.toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };
  const country = localStorage.getItem('country');
  const countryCode = localStorage.getItem('countryCode');

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

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  // Reset forms
  const resetForms = () => {
    setExpenseFormData({
      date: '',
      category: '',
      amount: '',
      status: 'pending',
      description: '',
      receiptFile: null,
    });
    setMileageFormData({
      date: '',
      startLocation: '',
      endLocation: '',
      distance: '',
      ratePerKm: 2.50,
      calculatedCost: 0,
      purpose: '',
    });
  };

  // Tab switching handler
  const switchTab = (tab) => {
    setCurrentTab(tab);
    resetForms();
    setSelectedExpense(null);
  };

  // Calculate mileage cost
  useEffect(() => {
    const distance = parseFloat(mileageFormData.distance) || 0;
    const rate = parseFloat(mileageFormData.ratePerKm) || 0;
    const cost = distance * rate;
    setMileageFormData(prev => ({ ...prev, calculatedCost: cost.toFixed(2) }));
  }, [mileageFormData.distance, mileageFormData.ratePerKm]);

  // Save record handler
  const saveRecord = () => {
    if (currentTab === 'expenses') {
      const { date, category, amount } = expenseFormData;
      if (!date || !category || !amount) {
        alert('Please fill in all required fields');
        return;
      }
      alert('Expense saved successfully!');
    } else {
      const { date, startLocation, endLocation, distance, purpose } = mileageFormData;
      if (!date || !startLocation || !endLocation || !distance || !purpose) {
        alert('Please fill in all required fields');
        return;
      }
      alert('Mileage entry saved successfully!');
    }
    closeModal();
  };

  // Filtered expenses and mileage data (static for now)
  const expensesData = [
    { id: 'EXP-001234', date: '15/09/2025', category: 'Office Supplies', amount: 'GH₵245.50', status: 'Pending', description: 'Printer ink and paper' },
    { id: 'EXP-001233', date: '14/09/2025', category: 'Travel', amount: 'GH₵1,250.00', status: 'Approved', description: 'Flight to Kumasi for client meeting' },
    { id: 'EXP-001232', date: '13/09/2025', category: 'Utilities', amount: 'GH₵850.75', status: 'Approved', description: 'Office electricity bill' },
    { id: 'EXP-001231', date: '12/09/2025', category: 'Meals & Entertainment', amount: 'GH₵425.00', status: 'Rejected', description: 'Client lunch meeting' },
  ];

  const mileageData = [
    { id: 'MIL-001125', date: '15/09/2025', from: 'Accra', to: 'Tema', distance: 25.5, rate: 'GH₵2.50', totalCost: 'GH₵63.75', purpose: 'Client visit' },
    { id: 'MIL-001124', date: '14/09/2025', from: 'Accra', to: 'Kumasi', distance: 270.0, rate: 'GH₵2.50', totalCost: 'GH₵675.00', purpose: 'Business meeting' },
  ];

  // Filter rows based on search term
  const filteredExpenses = expensesData.filter(exp =>
    exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMileage = mileageData.filter(mil =>
    mil.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Expense Management</h1>
              <p className="text-gray-600">Track and manage your expenses and mileage efficiently</p>
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
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
            <div className="text-3xl font-bold text-gray-900">47</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Approval</h3>
            <div className="text-3xl font-bold text-gray-900">12</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h3>
            <div className="text-3xl font-bold text-gray-900">GH₵189,420.50</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
            <div className="text-3xl font-bold text-gray-900">GH₵3,847.20</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Expense List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search Input */}
                <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search expense by ID..."
                  id="searchInput"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>

                {/* Tab Buttons */}
                <div className="tab-buttons flex space-x-2 mt-4 md:mt-0">
                  <button
                    className={`tab-btn px-4 py-2 rounded ${currentTab === 'expenses' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => switchTab('expenses')}
                    id="expensesTab"
                  >
                    Expenses
                  </button>
                  <button
                    className={`tab-btn px-4 py-2 rounded ${currentTab === 'mileage' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => switchTab('mileage')}
                    id="mileageTab"
                  >
                    Mileage
                  </button>
                </div>

                <button
                  className="create-btn bg-teal-600 text-white px-4 py-2 rounded mt-4 md:mt-0"
                  onClick={() => setIsCreating(true)}
                >
                  + Create {currentTab === 'expenses' ? 'Expense' : 'Mileage'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : currentTab === 'expenses' && filteredExpenses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No Expenses found. Create your first expense!
                </div>
              ) : currentTab === 'mileage' && filteredMileage.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No Mileage entries found. Create your first mileage entry!
                </div>
              ) : (
                <table className="w-full ">
                  <thead className="bg-gray-50">
                    <tr>
                      {currentTab === 'expenses' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                         
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTab === 'expenses'
                      ? filteredExpenses.map((exp) => (
                          <tr key={exp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.date}</td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  exp.status.toLowerCase() === 'pending'
                                    ? 'status-pending'
                                    : exp.status.toLowerCase() === 'approved'
                                    ? 'status-approved'
                                    : 'status-rejected'
                                }`}
                              >
                                {exp.status}
                              </span>
                            </td>
                            <td>{exp.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                          </tr>
                        ))
                      : filteredMileage.map((mil) => (
                          <tr key={mil.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.from}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.to}</td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.totalCost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mil.purpose}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick
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
          </div>
          {/* Right Column - Detail / Expense and Mileage Form */}
          <div className="bg-white rounded-lg shadow-sm ">

            {(isCreating || selectedExpense) && (
              
              <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {isCreating
                    ? `Create ${currentTab === "expenses" ? "Expense" : "Mileage"} Entry`
                    : `${currentTab === "expenses" ? "Expense" : "Mileage"} Details`}
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedExpense(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            
            )}

{isCreating ? (
              <div className="p-6">
                <div className="space-y-4">
                  {currentTab === "expenses" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium">Date *</label>
                        <input
                          type="date"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={expenseFormData.date}
                          onChange={(e) =>
                            setExpenseFormData((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Category *</label>
                        <select
                          required
                          className="w-full border rounded px-3 py-2"
                          value={expenseFormData.category}
                          onChange={(e) =>
                            setExpenseFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select category</option>
                          <option value="office-supplies">Office Supplies</option>
                          <option value="travel">Travel</option>
                          <option value="rent">Rent</option>
                          <option value="utilities">Utilities</option>
                          <option value="meals">Meals & Entertainment</option>
                          <option value="equipment">Equipment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Amount (GH₵) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          className="w-full border rounded px-3 py-2"
                          value={expenseFormData.amount}
                          onChange={(e) =>
                            setExpenseFormData((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                          className="w-full border rounded px-3 py-2"
                          placeholder="Enter details..."
                          value={expenseFormData.description}
                          onChange={(e) =>
                            setExpenseFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Upload Receipt</label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="w-full border rounded px-3 py-2"
                          onChange={(e) =>
                            setExpenseFormData((prev) => ({
                              ...prev,
                              receiptFile: e.target.files[0],
                            }))
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium">Date *</label>
                          <input
                            type="date"
                            required
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.date}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Start Location */}
                        <div>
                          <label className="block text-sm font-medium">Start Location *</label>
                          <input
                            type="text"
                            placeholder="e.g., Accra"
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.startLocation}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                startLocation: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* End Location */}
                        <div>
                          <label className="block text-sm font-medium">End Location *</label>
                          <input
                            type="text"
                            placeholder="e.g., Tema"
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.endLocation}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                endLocation: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Distance */}
                        <div>
                          <label className="block text-sm font-medium">Distance (km) *</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            required
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.distance}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                distance: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Rate Per Km */}
                        <div>
                          <label className="block text-sm font-medium">Rate per Km *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.ratePerKm}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                ratePerKm: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Purpose */}
                        <div>
                          <label className="block text-sm font-medium">Purpose</label>
                          <textarea
                            placeholder="e.g., Client meeting"
                            className="w-full border rounded px-3 py-2"
                            value={mileageFormData.purpose}
                            onChange={(e) =>
                              setMileageFormData((prev) => ({
                                ...prev,
                                purpose: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* UserId (hidden or pre-filled if user is logged in) */}
                        <input
                          type="hidden"
                          value={mileageFormData.userId}
                          onChange={(e) =>
                            setMileageFormData((prev) => ({
                              ...prev,
                              userId: e.target.value,
                            }))
                          }
                        />

                        {/* Auto-calculated Total Cost */}
                        <div>
                          <label className="block text-sm font-medium">Total Cost</label>
                          <input
                            type="text"
                            readOnly
                            className="w-full border rounded px-3 py-2 bg-gray-100"
                            value={
                              mileageFormData.distance && mileageFormData.ratePerKm
                                ? (parseFloat(mileageFormData.distance) *
                                    parseFloat(mileageFormData.ratePerKm)).toFixed(2)
                                : "0.00"
                            }
                          />
                        </div>
                      </>
                  )}

                  {/* Footer buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
                      onClick={saveRecord}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedExpense ? (
              selectedExpense.category ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expense ID:</span>
                          <span className="font-medium">{selectedExpense.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{selectedExpense.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{selectedExpense.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">{selectedExpense.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedExpense.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : selectedExpense.status.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedExpense.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <div className="font-medium">{selectedExpense.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Mileage Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage ID:</span>
                          <span className="font-medium">{selectedExpense.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{selectedExpense.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">From:</span>
                          <span className="font-medium">{selectedExpense.from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">To:</span>
                          <span className="font-medium">{selectedExpense.to}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedExpense.distance} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate:</span>
                          <span className="font-medium">{selectedExpense.rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="font-medium">{selectedExpense.totalCost}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Purpose:</span>
                          <div className="font-medium">{selectedExpense.purpose}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a record from the left, or Create a new one.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
