import { useEffect, useState } from "react";
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function CreateInvoice() {
  const [client, setClient] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen,setIsModalOpen]= useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const handleItemChange = (idx, field, value) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, [field]: field === "description" ? value : Number(value) } : item
      )
    );
  };

 //user Profile States
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profilePic: '',
    email: '',
    plan: 'Free',
});

const profileImageUrl = userProfile.profilePic
  ? `${import.meta.env.VITE_API_URL}/${userProfile.profilePic.replace(/\\/g, '/')}`
  : '/user-placeholder.png'; 


    const handleSignOut = () => {
    localStorage.clear();
    window.location.replace ("/InvoiceAPI_LandingPage/login") // Redirect to home page after sign out
    
    
  };

  const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const openChangeImageDialog = () => {
  setIsChangeImageDialogOpen(true);
};

const closeChangeImageDialog = () => {
  setIsChangeImageDialogOpen(false);
};

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};


// Function to handle file upload
// This function will be called when the user clicks the upload button
const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }



//prepare the form data
  const formData = new FormData();
  formData.append('imageFile', selectedFile);


  //call the API to upload the image
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error("User is not authenticated. Token not found.");
    return;
  }
try {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Let axios set the Content-Type to multipart/form-data with boundary
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Success
    alert("Profile image updated successfully!");
    await fetchUserProfile();
    
    // Re-fetch profile to get updated image
   

    // Update profile state
    // setUserProfile((prevProfile) => ({
    //   ...prevProfile,
    //   profilePic: data.profileImageUrl, // Or adjust if the field is different
    // }));

    // Optionally reset input or close modal
    setSelectedFile(null);
    setIsChangeImageDialogOpen(false);

  } catch (error) {
    console.error("Error uploading profile image:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload profile image. Please try again.";
    alert(`Upload failed: ${message}`);
  }
};


const openChangePasswordDialog = () => {
  setIsChangePasswordDialogOpen(true);
};
const closeChangePasswordDialog = () => {
  setIsChangePasswordDialogOpen(false);
  // Reset password fields
  setCurrentPassword("");
  setNewPassword("");
  setConfirmNewPassword("");
};

 const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All password fields are required.");
      return;
  }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
  const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }
    try {
      const response = await axios.put(
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
      if (response.status === 200) {
        alert("Password changed successfully!");
        closeChangePasswordDialog();
      } else {
        alert(`Error changing password: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error changing password: ${error.response?.data?.message || error.message}`);
    }
  }





  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Replace with your API call
    setTimeout(() => {
      alert("Invoice submitted!");
      setSubmitting(false);
    }, 1000);
  };

const fetchUserProfile = async () => {
      try {
        // Set loading state
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
       

        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Register/profile`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
             }, "Content-Type": "application/json"}
        );

        if (profileRes.status === 200) {
           const { firstName, lastName, profileImageUrl, email, plan } = profileRes.data;
          setUserProfile({
            firstName: firstName || '',
            lastName: lastName || '',
            profilePic: profileImageUrl || '',
            email: email || '',
            plan: plan || 'Free',
          });
        }

        

       
      } catch (error) {
        console.error("Failed to fetch API data", error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {fetchUserProfile();}, []);

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 ">
        <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
                <nav className=" max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center space-x-3 group">
                    <div className="relative">
                      <img src="./logo.png" alt="InvoiceAPI Logo" className="h-9 w-9 transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    <span className="text-xl font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                      InvoiceAPI by SidConsult
                    </span>
                  </div>
                  {/* Navigation Links */}
                  <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 transition-colors group ml-auto mr-4">
                    <a href="./Dashboard" className="text-blue-600 hover:text-blue-600 transition-colors font-bold ">Dashboard</a>
                    <a href="./Create-invoice" className="text-blue-600 hover:text-blue-600 transition-colors font-bold underline">Generate Invoices</a>
                    <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Billing</a>
                    <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">API Documentation</a>
                    <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Support</a>
                  </div>
                  {/* Profile Section */}
                   <div className="flex items-center space-x-4">
                    
                   <div className="text-l font-bold text-blue-600 transition-colors group-hover:text-blue-700">:</div>
                      <div className="relative group">
                       <div
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
                          <img src={profileImageUrl} alt="User" className="w-10 h-10 rounded-full object-cover ms-3" />
                        </div>
                        
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                           
                            
                            <a
                              href="#/"
                              onClick={openModal}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Manage Account
                            </a>
                            <a
                              href="#/"
                              onClick={handleSignOut}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Sign Out
                            </a>
                          </div>
                        
                      </div>
                    </div>
                </nav>
                <Dialog open={isModalOpen} onClose={closeModal}>
                  <DialogTitle>Manage Account</DialogTitle>
                  <DialogContent>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-blue-600">
                      
                      <li><a href="#/" onClick={openChangeImageDialog}>Change Profile Image</a></li>
                      <li><a href="#/" onClick={openChangePasswordDialog}>Change Password</a></li>
                      <li><a href="#/">Change User Profile Information</a></li>
                      <li><a href="/ManageUsers">Manage Users</a></li>
                    </ul>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeModal} color="primary">Close</Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={isChangeImageDialogOpen} onClose={closeChangeImageDialog}>
                  <DialogTitle>Change Profile Image</DialogTitle>
                  <DialogContent>
                    <input type="file" onChange={handleFileChange} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleUpload} color="primary">Upload</Button>
                    <Button onClick={closeChangeImageDialog} color="secondary">Cancel</Button>
                  </DialogActions>
                </Dialog>
        
        
                <Dialog open={isChangePasswordDialogOpen} onClose={closeChangePasswordDialog}>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Current Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)} />
                    <TextField
                      margin="dense"
                      label="New Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} />
                    <TextField
                      margin="dense"
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleChangePassword} color="primary">Change Password</Button>
                    <Button onClick={closeChangePasswordDialog} color="secondary">Cancel</Button>
                  </DialogActions>
                </Dialog>
        
              </header>


<div className="pt-32">
    <div className="mb-8 text-center text-white"> <h1 className="text-2xl font-bold mb-2">You have Eleven (11) More Invoices To Generate </h1> </div>
      <div className=" max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20 flex flex-col lg:flex-row gap-8  ">
        

        {/* Form */}
        <form className="flex-1 space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Create Invoice</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={client}
              onChange={e => setClient(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={tax}
              min={0}
              onChange={e => setTax(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => handleItemChange(idx, "description", e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="w-20 border rounded px-2 py-1"
                  placeholder="Qty"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="w-24 border rounded px-2 py-1"
                  placeholder="Price"
                  min={0}
                  value={item.price}
                  onChange={e => handleItemChange(idx, "price", e.target.value)}
                  required
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 font-bold px-2"
                    onClick={() => removeItem(idx)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-blue-600 font-semibold hover:underline"
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Invoice"}
          </button>
        </form>

        {/* Live Preview */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Invoice Preview</h3>
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between mb-4">
              <div>
                <div className="font-bold text-lg text-blue-700">Invoice</div>
                <div className="text-sm text-gray-500">To: {client || <span className="italic text-gray-400">Client Name</span>}</div>
                <div className="text-sm text-gray-500">Due: {dueDate || <span className="italic text-gray-400">Due Date</span>}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-700">InvoiceAPI</div>
                <div className="text-xs text-gray-400">Powered by SidConsult</div>
              </div>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Description</th>
                  <th className="py-1">Qty</th>
                  <th className="py-1">Price</th>
                  <th className="py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-1">{item.description || <span className="italic text-gray-400">Item</span>}</td>
                    <td className="py-1">{item.quantity}</td>
                    <td className="py-1">₵{item.price.toFixed(2)}</td>
                    <td className="py-1">₵{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({tax}%):</span>
                  <span className="font-medium">₵{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-700 mt-2">
                  <span>Total:</span>
                  <span>₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        {/* Enhanced Footer */}
      <footer role="contentinfo" aria-label="Footer" lang="en" dir="ltr" className=" text-white py-0.5  bottom-0 left-0 w-full">
  <div className="container mx-auto p-2 md:p-4">
    <div className="text-center">
      <p className="text-gray-400 mb-2">
        &copy; 2025 InvoiceAPI. Powered By Sidconsult. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
} 
