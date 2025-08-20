import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";

export default function Sidebar({ isSidebarOpen }) {
  const [userProfile, setUserProfile] = React.useState({ firstName: "User" });

  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Register/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (profileRes.status === 200) {
          const { firstName } = profileRes.data;
          setUserProfile({
            firstName: firstName || 'User'
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);
 
  return (
    <div
    className={`bg-gray-900 text-white w-64  p-4 pt-16 space-y-4 ${
      isSidebarOpen ? 'block' : 'hidden md:block'
    }`}
  >
    <h2 className="text-2xl font-bold mb-6">Welcome {userProfile.firstName}!</h2>
    <nav className="space-y-2">
      <Link to="/invoicedashboard" className="block hover:bg-gray-700 px-4 py-2 rounded">Dashboard</Link>
      <Link to="/customer" className="block hover:bg-gray-700 px-4 py-2 rounded">Customer Registration</Link>
      <Link to="/invoices" className="block hover:bg-gray-700 px-4 py-2 rounded">Generate Invoice</Link>
      <Link to="/payment" className="block hover:bg-gray-700 px-4 py-2 rounded">Payments</Link>
      <Link to="/ProductItemPage" className="block hover:bg-gray-700 px-4 py-2 rounded">Products & Items</Link>
      
    </nav>
  </div>
  );
}