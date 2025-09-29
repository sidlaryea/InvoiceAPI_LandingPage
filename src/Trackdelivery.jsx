import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/194/194938.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function TrackDeliveryPage() {
  const [formData, setFormData] = useState({
    trackingNumber: "",
    invoiceId: "",
    customerId: "",
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    dropoffAddress: "",
    dropoffLatitude: 0,
    dropoffLongitude: 0,
    riderId: "",
    notes: "",
  });

  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showMap, setShowMap] = useState(false);

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

  // Mock data for deliveries and riders
  const mockDeliveries = [
    {
      id: 1,
      trackingNumber: "DEL-001",
      invoiceId: 101,
      customerId: "CUST-001",
      customerName: "John Doe",
      customerPhone: "+1234567890",
      pickupAddress: "Warehouse A",
      dropoffAddress: "123 Main St",
      dropoffLatitude: 40.7128,
      dropoffLongitude: -74.0060,
      riderId: 1,
      rider: { id: 1, fullName: "Rider One", phoneNumber: "+0987654321", vehicleNumber: "VHC-001" },
      status: "Assigned",
      createdAt: "2023-10-01T10:00:00Z",
      pickedUpAt: null,
      deliveredAt: null,
      notes: "Handle with care",
    },
    {
      id: 2,
      trackingNumber: "DEL-002",
      invoiceId: 102,
      customerId: "CUST-002",
      customerName: "Jane Smith",
      customerPhone: "+1234567891",
      pickupAddress: "Warehouse B",
      dropoffAddress: "456 Elm St",
      dropoffLatitude: 40.7589,
      dropoffLongitude: -73.9851,
      riderId: null,
      rider: null,
      status: "Pending",
      createdAt: "2023-10-02T11:00:00Z",
      pickedUpAt: null,
      deliveredAt: null,
      notes: "",
    },
  ];

  const mockRiders = [
    {
      id: 1,
      fullName: "Rider One",
      phoneNumber: "+0987654321",
      vehicleNumber: "VHC-001",
      currentLatitude: 40.7128,
      currentLongitude: -74.0060,
      lastLocationUpdate: "2023-10-01T12:00:00Z",
      isAvailable: true,
    },
    {
      id: 2,
      fullName: "Rider Two",
      phoneNumber: "+0987654322",
      vehicleNumber: "VHC-002",
      currentLatitude: 40.7589,
      currentLongitude: -73.9851,
      lastLocationUpdate: "2023-10-01T12:30:00Z",
      isAvailable: false,
    },
  ];

  const fetchDeliveries = async () => {
    // Mock fetch
    setTimeout(() => {
      setDeliveries(mockDeliveries);
    }, 500);
  };

  const fetchRiders = async () => {
    // Mock fetch
    setTimeout(() => {
      setRiders(mockRiders);
    }, 500);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchDeliveries();
    fetchRiders();
  },);

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setFormData({
      trackingNumber: delivery.trackingNumber || "",
      invoiceId: delivery.invoiceId || "",
      customerId: delivery.customerId || "",
      customerName: delivery.customerName || "",
      customerPhone: delivery.customerPhone || "",
      pickupAddress: delivery.pickupAddress || "",
      dropoffAddress: delivery.dropoffAddress || "",
      dropoffLatitude: delivery.dropoffLatitude || 0,
      dropoffLongitude: delivery.dropoffLongitude || 0,
      riderId: delivery.riderId || "",
      notes: delivery.notes || "",
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

    const isEditing = selectedDelivery !== null;

    try {
      // Mock submission
      const newDelivery = {
        ...formData,
        id: isEditing ? selectedDelivery.id : deliveries.length + 1,
        status: isEditing ? selectedDelivery.status : "Pending",
        createdAt: isEditing ? selectedDelivery.createdAt : new Date().toISOString(),
        rider: riders.find(r => r.id == formData.riderId) || null,
      };

      if (isEditing) {
        setDeliveries(prev => prev.map(d => d.id === selectedDelivery.id ? newDelivery : d));
        setSuccess("Delivery updated successfully!");
      } else {
        setDeliveries(prev => [...prev, newDelivery]);
        setSuccess("Delivery created successfully!");
      }

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      // Clear form
      setFormData({
        trackingNumber: "",
        invoiceId: "",
        customerId: "",
        customerName: "",
        customerPhone: "",
        pickupAddress: "",
        dropoffAddress: "",
        dropoffLatitude: 0,
        dropoffLongitude: 0,
        riderId: "",
        notes: "",
      });
      setSelectedDelivery(null);
    } catch (error) {
      console.error(error);
      setError("An error occurred while submitting the delivery.");
    }
  };

  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(prev => prev.map(d =>
      d.id === id ? { ...d, status: newStatus, pickedUpAt: newStatus === "PickedUp" ? new Date().toISOString() : d.pickedUpAt, deliveredAt: newStatus === "Delivered" ? new Date().toISOString() : d.deliveredAt } : d
    ));
  };

  const assignRider = (deliveryId, riderId) => {
    const rider = riders.find(r => r.id == riderId);
    setDeliveries(prev => prev.map(d =>
      d.id === deliveryId ? { ...d, riderId, rider, status: "Assigned" } : d
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "PickedUp": return "bg-orange-100 text-orange-800";
      case "InTransit": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // KPI Calculations
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(d => d.status === "Pending").length;
  const assignedDeliveries = deliveries.filter(d => d.status === "Assigned").length;
  const inTransitDeliveries = deliveries.filter(d => d.status === "InTransit").length;
  const deliveredDeliveries = deliveries.filter(d => d.status === "Delivered").length;

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
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dispatch Tracking</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Deliveries</p>
            <h2 className="text-2xl font-bold text-gray-800">{totalDeliveries}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Pending Deliveries</p>
            <h2 className="text-2xl font-bold text-gray-800">{pendingDeliveries}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Assigned Deliveries</p>
            <h2 className="text-2xl font-bold text-gray-800">{assignedDeliveries}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">In Transit Deliveries</p>
            <h2 className="text-2xl font-bold text-gray-800">{inTransitDeliveries}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Delivered Deliveries</p>
            <h2 className="text-2xl font-bold text-gray-800">{deliveredDeliveries}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Delivery List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Tracking Number</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Rider</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(delivery => (
                    <tr key={delivery.id} className="border-t">
                      <td className="px-4 py-2">{delivery.trackingNumber}</td>
                      <td className="px-4 py-2">{delivery.customerName}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{delivery.rider ? delivery.rider.fullName : "Not Assigned"}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEditDelivery(delivery)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowMap(!showMap)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          View
                        </button>
                        <select
                          value={delivery.status}
                          onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Assigned">Assigned</option>
                          <option value="PickedUp">PickedUp</option>
                          <option value="InTransit">InTransit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {!delivery.rider && (
                          <select
                            onChange={(e) => assignRider(delivery.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                            defaultValue=""
                          >
                            <option value="" disabled>Assign Rider</option>
                            {riders.filter(r => r.isAvailable).map(rider => (
                              <option key={rider.id} value={rider.id}>{rider.fullName}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showMap ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Track Deliveries</h2>
              <MapContainer center={[40.7128, -74.0060]} zoom={10} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {deliveries.map(delivery => (
                  <Marker key={delivery.id} position={[delivery.dropoffLatitude, delivery.dropoffLongitude]}>
                    <Popup>
                      <div>
                        <p><strong>Tracking:</strong> {delivery.trackingNumber}</p>
                        <p><strong>Customer:</strong> {delivery.customerName}</p>
                        <p><strong>Status:</strong> {delivery.status}</p>
                        <p><strong>Rider:</strong> {delivery.rider ? delivery.rider.fullName : "Not Assigned"}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {riders.map(rider => (
                  <Marker key={rider.id} position={[rider.currentLatitude, rider.currentLongitude]} icon={riderIcon}>
                    <Popup>
                      <div>
                        <p><strong>Rider:</strong> {rider.fullName}</p>
                        <p><strong>Vehicle:</strong> {rider.vehicleNumber}</p>
                        <p><strong>Available:</strong> {rider.isAvailable ? "Yes" : "No"}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {selectedDelivery ? "Edit Delivery" : "Create New Delivery"}
              </h2>

              {success && <p className="text-green-600 mb-4">{success}</p>}
              {error && <p className="text-red-600 mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "trackingNumber", label: "Tracking Number", type: "text" },
                  { name: "invoiceId", label: "Invoice ID", type: "number" },

                  // { name: "pickupAddress", label: "Pickup Address", type: "text" },
                  { name: "dropoffAddress", label: "Dropoff Address", type: "text" },
                  // { name: "dropoffLatitude", label: "Dropoff Latitude", type: "number", step: "any" },
                  // { name: "dropoffLongitude", label: "Dropoff Longitude", type: "number", step: "any" },
                  { name: "notes", label: "Notes", type: "textarea" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-600 capitalize">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.name !== "notes" && field.name !== "riderId"}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-600">Assign Rider</label>
                  <select
                    name="riderId"
                    value={formData.riderId}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Rider</option>
                    {riders.filter(r => r.isAvailable).map(rider => (
                      <option key={rider.id} value={rider.id}>
                        {rider.fullName} ({rider.vehicleNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedDelivery ? "Update Delivery" : "Create Delivery"}
                </button>
              </form>
            </div>
          )}
        </div>


      </div>
    </DashboardLayout>
  );
}

