import React from "react";
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
  LogOut
} from "lucide-react";





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
      <Link to="/invoicedashboard" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <LayoutDashboard size={18} /> Dashboard
</Link>

<Link to="/customer" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Users size={18} /> Customer Registration
</Link>

<Link to="/expense" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <FileText size={18} /> Record Expenses <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/invoices" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <FileText size={18} /> Generate Invoice
</Link>

<Link to="#" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Repeat size={18} />  Recurring Invoices
</Link>

<Link to="/payment" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <CreditCard size={18} /> Payments
</Link>

<Link to="/reports" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <BarChart3 size={18} /> Reports <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/settings" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Settings size={18} /> Settings <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/userprofile" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <User size={18} /> User Profile <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="/ProductItemPage" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Package size={18} /> Products & Items
</Link>

<Link to="#" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <Percent size={18} /> Tax Rates
</Link>

<Link to="#" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <CircleDollarSign size={18} /> Currency Management <Lock size={14} className="ml-auto opacity-60" />
</Link>

<Link to="#" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <FileLock size={18} /> Audit Log <Lock size={14} className="ml-auto opacity-60" />
</Link>


<Link to="#" className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 rounded">
  <LogOut size={18} /> Sign Out<Lock size={14} className="ml-auto opacity-60" />
</Link>
      
    </nav>
  </div>
  );
}