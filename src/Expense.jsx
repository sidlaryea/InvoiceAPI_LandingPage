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
  // const [selectedExpense, setSelectedExpense] = useState(null);
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
                <input
                  type="text"
                  className="flex-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search expense by ID..."
                  id="searchInput"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

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
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {currentTab === 'expenses' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate/km</th>
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
                            <td>{exp.id}</td>
                            <td>{exp.date}</td>
                            <td>{exp.category}</td>
                            <td>{exp.amount}</td>
                            <td>
                              <span
                                className={`status-badge ${
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
                            <td className="actions space-x-2">
                              <button className="action-btn" title="View">👁</button>
                              <button className="action-btn" title="Edit">✏️</button>
                              <button className="action-btn" title="Delete">🗑️</button>
                            </td>
                          </tr>
                        ))
                      : filteredMileage.map((mil) => (
                          <tr key={mil.id} className="hover:bg-gray-50">
                            <td>{mil.id}</td>
                            <td>{mil.date}</td>
                            <td>{mil.from}</td>
                            <td>{mil.to}</td>
                            <td>{mil.distance}</td>
                            <td>{mil.rate}</td>
                            <td>{mil.totalCost}</td>
                            <td>{mil.purpose}</td>
                            <td className="actions space-x-2">
                              <button className="action-btn" title="View">👁</button>
                              <button className="action-btn" title="Edit">✏️</button>
                              <button className="action-btn" title="Delete">🗑️</button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">
    {isCreating
      ? `Create ${currentTab === "expenses" ? "Expense" : "Mileage"} Entry`
      : `${currentTab === "expenses" ? "Expenses" : "Mileage"} Overview`}
  </h3>

  {/* If creating, show form */}
  {isCreating ? (
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
        </>
      ) : (
        <>
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
          <div>
            <label className="block text-sm font-medium">Distance (km) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
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
  ) : (
    <p className="text-gray-500">
      Select a record from the left, or click **New** to add one.
    </p>
  )}
</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
