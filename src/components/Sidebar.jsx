import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import {
  LayoutDashboard,
  Users,
  FileText,
  Repeat,
  CreditCard,
  BarChart3,
  Settings,
  User,
  Package,
  Percent,
  CircleDollarSign,
  FileLock,
  HelpCircle,
  Lock,
  LogOut,
  TrainTrack,
  Bike
} from "lucide-react";





export default function Sidebar({ isSidebarOpen,currentPlan }) {
  const [userProfile, setUserProfile] = React.useState({ firstName: "User" });

  const [showModal, setShowModal] = useState(false);

const handleClick = (e) => {
    if (currentPlan !== "Enterprise") {
      e.preventDefault(); // stop navigation
      setShowModal(true);
    }
  };


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
      <Link to="/invoicedashboard" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <LayoutDashboard size={18} /> Dashboard
</Link>

<Link to="/customer" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Users size={18} /> Customer Registration
</Link>

<Link to={currentPlan === "Enterprise" ? "/expense" : "#"}  className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <FileText size={18} /> Record Expenses{" "}
        {currentPlan !== "Enterprise" && (
          <Lock size={14} className="ml-auto opacity-60" />
        )}
</Link>

{/* Modal for locked feature */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Feature Locked 🔒
            </h3>
            <p className="text-gray-600 mb-4">
              To view this add-on, contact the Sales Team.
            </p>
            <a
              href="mailto:sales@SidConsult.com?subject=Enterprise Add-on Access Request"
              className="text-blue-600 font-medium underline mb-4 block"
            >
              sales@SidConsult.com
            </a>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}





<Link to="/invoices" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <FileText size={18} /> Generate Invoice
</Link>

<Link to={currentPlan === "Enterprise" ? "/recurringInvoice" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <Repeat size={18} />  Recurring Invoices <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/payment" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <CreditCard size={18} /> Payments
</Link>

<Link to={currentPlan === "Enterprise" ? "/trackDelivery" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <Bike size={18} /> Track Deliveries <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to={currentPlan === "Enterprise" ? "/reports" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <BarChart3 size={18} /> Reports <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/Settings" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Settings size={18} /> Settings 
</Link>



<Link to="/ProductItemPage" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Package size={18} /> Products & Items
</Link>

<Link to={currentPlan === "Enterprise" ? "#" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <Percent size={18} /> Tax Rates <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to={currentPlan === "Enterprise" ? "#" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <CircleDollarSign size={18} /> Currency Management <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to={currentPlan === "Enterprise" ? "#" : "#"} className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded" onClick={handleClick}>
  <FileLock size={18} /> Audit Log <Lock size={14} className="ml-auto opacity-60" />
</Link>


<Link to="/login" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <LogOut size={18} /> Sign Out
</Link>
      
    </nav>
  </div>
  );
}