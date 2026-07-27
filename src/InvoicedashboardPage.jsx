// InvoiceDashboardPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import axios from "axios";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";
import {API_BASE} from "./config/api"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Country code mapping: ISO 3166-1 alpha-3 → alpha-2
const alpha3ToAlpha2 = {
  'GHA': 'GH', 'NGA': 'NG', 'USA': 'US', 'GBR': 'GB', 'CAN': 'CA',
  'ZAF': 'ZA', 'KEN': 'KE', 'UGA': 'UG', 'TZA': 'TZ', 'RWA': 'RW',
  'BWA': 'BW', 'ZMB': 'ZM', 'ZWE': 'ZW', 'MWI': 'MW', 'MOZ': 'MZ',
  'AGO': 'AO', 'NAM': 'NA', 'LSO': 'LS', 'SWZ': 'SZ', 'MDG': 'MG',
  'SLE': 'SL', 'LBR': 'LR', 'CIV': 'CI', 'GIN': 'GN', 'SEN': 'SN',
  'MLI': 'ML', 'BFA': 'BF', 'NER': 'NE', 'TGO': 'TG', 'BEN': 'BJ',
  'MRT': 'MR', 'GMB': 'GM', 'CMR': 'CM', 'GAB': 'GA', 'COG': 'CG',
  'COD': 'CD', 'CAF': 'CF', 'STP': 'ST', 'GNQ': 'GQ', 'BDI': 'BI',
  'SOM': 'SO', 'DJI': 'DJ', 'ERI': 'ER', 'ETH': 'ET', 'SDN': 'SD',
  'SSD': 'SS', 'EGY': 'EG', 'LBY': 'LY', 'TUN': 'TN', 'DZA': 'DZ',
  'MAR': 'MA', 'ESH': 'EH', 'MUS': 'MU', 'SYC': 'SC', 'COM': 'KM',
  'CPV': 'CV', 'GNB': 'GW',
  'AUS': 'AU', 'NZL': 'NZ', 'FJI': 'FJ', 'PNG': 'PG', 'SLB': 'SB',
  'VUT': 'VU', 'WSM': 'WS', 'TON': 'TO', 'PLW': 'PW', 'FSM': 'FM',
  'MHL': 'MH', 'KIR': 'KI', 'TUV': 'TV', 'NRU': 'NR',
  'CHN': 'CN', 'JPN': 'JP', 'KOR': 'KR', 'PRK': 'KP', 'MNG': 'MN',
  'TWN': 'TW', 'HKG': 'HK', 'MAC': 'MO',
  'IND': 'IN', 'PAK': 'PK', 'BGD': 'BD', 'LKA': 'LK', 'NPL': 'NP',
  'BTN': 'BT', 'MDV': 'MV',
  'THA': 'TH', 'VNM': 'VN', 'PHL': 'PH', 'IDN': 'ID', 'MYS': 'MY',
  'SGP': 'SG', 'MMR': 'MM', 'KHM': 'KH', 'LAO': 'LA', 'BRN': 'BN',
  'TLS': 'TL',
  'IRN': 'IR', 'IRQ': 'IQ', 'SAU': 'SA', 'YEM': 'YE', 'OMN': 'OM',
  'ARE': 'AE', 'QAT': 'QA', 'BHR': 'BH', 'KWT': 'KW', 'JOR': 'JO',
  'LBN': 'LB', 'SYR': 'SY', 'ISR': 'IL', 'PSE': 'PS',
  'AFG': 'AF', 'TKM': 'TM', 'UZB': 'UZ', 'KAZ': 'KZ', 'KGZ': 'KG',
  'TJK': 'TJ',
  'TUR': 'TR', 'CYP': 'CY',
  'FRA': 'FR', 'DEU': 'DE', 'ITA': 'IT', 'ESP': 'ES', 'PRT': 'PT',
  'NLD': 'NL', 'BEL': 'BE', 'CHE': 'CH', 'AUT': 'AT', 'POL': 'PL',
  'CZE': 'CZ', 'SVK': 'SK', 'HUN': 'HU', 'ROU': 'RO', 'BGR': 'BG',
  'GRC': 'GR', 'DNK': 'DK', 'SWE': 'SE', 'NOR': 'NO', 'FIN': 'FI',
  'ISL': 'IS', 'IRL': 'IE', 'LUX': 'LU', 'MLT': 'MT', 'HRV': 'HR',
  'BIH': 'BA', 'SRB': 'RS', 'MNE': 'ME', 'ALB': 'AL', 'MKD': 'MK',
  'SVN': 'SI', 'LTU': 'LT', 'LVA': 'LV', 'EST': 'EE', 'BLR': 'BY',
  'UKR': 'UA', 'MDA': 'MD', 'AZE': 'AZ', 'GEO': 'GE', 'ARM': 'AM',
  'RUS': 'RU',
  'MEX': 'MX', 'BRA': 'BR', 'ARG': 'AR', 'CHL': 'CL', 'COL': 'CO',
  'PER': 'PE', 'VEN': 'VE', 'ECU': 'EC', 'BOL': 'BO', 'PRY': 'PY',
  'URY': 'UY', 'GUY': 'GY', 'SUR': 'SR', 'TTO': 'TT', 'JAM': 'JM',
  'CUB': 'CU', 'DOM': 'DO', 'HTI': 'HT', 'BHS': 'BS', 'BRB': 'BB',
  'GRD': 'GD', 'LCA': 'LC', 'VCT': 'VC', 'DMA': 'DM', 'KNA': 'KN',
  'ATG': 'AG', 'BLZ': 'BZ', 'SLV': 'SV', 'GTM': 'GT', 'HND': 'HN',
  'NIC': 'NI', 'CRI': 'CR', 'PAN': 'PA',
};

// Normalize country code to 2-letter ISO 3166-1 alpha-2 format
const normalizeCountryCode = (code) => {
  if (!code || typeof code !== 'string') return '';
  const upper = code.trim().toUpperCase();
  // Already a valid 2-letter code
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  // Try 3-letter to 2-letter mapping
  if (/^[A-Z]{3}$/.test(upper)) return alpha3ToAlpha2[upper] || upper;
  return upper;
};

export default function InvoiceDashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState({ code: "GHS", symbol: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("/user-placeholder.png");

  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      await axios.put(`${API_BASE}/api/Register/update-profile-image`, formData, {
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
  

  const formatNumber = (num) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(num);

  // 🔹 Fetch Transactions
  const fetchTransactions = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const res = await axios.get(
        `${API_BASE}/api/Invoice/GetInvoicesByUserId`,
        {
          headers: { Authorization: `Bearer ${token}`
          , "X-API-KEY": apiKey
        },
        }
      );
      console.log("Fetched transactions:", res.data); // Debug log
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  // 🔹 Fetch Expenses
  const fetchExpenses = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get(
        `${API_BASE}/api/Expense/by-user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched expenses:", res.data); // Debug log
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

 // 🔹 Fetch User Profile
const fetchUserProfile = async () => {
  const token = localStorage.getItem("jwtToken");

  try {
    const res = await axios.get(
      `${API_BASE}/api/Register/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile API response:", res.data);

    const profileImageUrl = res.data?.profileImageUrl;

    if (typeof profileImageUrl === "string" && profileImageUrl.trim() !== "") {
      setProfileImageUrl(
        `${API_BASE}/${profileImageUrl.replace(/\\/g, "/")}`
      );
    } else {
      setProfileImageUrl("/user-placeholder.png");
    }

  } catch (err) {
    console.error("Failed to fetch user profile", err);
    setProfileImageUrl("/user-placeholder.png");
  }
};

  // 🔹 Fetch Currencies
  const fetchCurrencies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/Currency/GetAllCurrencies`);
      const normalizedCountryCodes = new Map();
      const mappedCurrencies = res.data.map(c => {
        const normalizedCountry = normalizeCountryCode(c.countryCode);
        // Avoid duplicate normalized codes for flag emoji generation
        if (!normalizedCountryCodes.has(normalizedCountry)) {
          normalizedCountryCodes.set(normalizedCountry, true);
        }
        return {
          id: c.id,
          code: c.currencyCode,
          name: c.currencyName ?? c.currencyCode,
          symbol: c.symbol ?? "",
          flag: getFlagEmoji(normalizedCountry || c.countryCode),
          country: normalizedCountry || c.countryCode,
          rawCountry: c.countryCode
        };
      });
      setCurrencies(mappedCurrencies);
    } catch (error) {
      console.error("Failed to load currencies", error);
    }
  };

  // 🔹 Lifecycle
  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
    fetchExpenses();
    fetchCurrencies();
  }, []);

  // 🔹 Set current currency based on country
  useEffect(() => {
    if (currencies.length > 0) {
      const countryCode = localStorage.getItem('countryCode');
      let currency = currencies.find(c => c.country === countryCode);
      if (!currency) {
        currency = currencies.find(c => c.code === 'GHS'); // Fallback to GHS
      }
      if (!currency) {
        currency = currencies[0]; // Fallback to first available
      }
      setCurrentCurrency({ code: currency.code, symbol: currency.symbol });
    }
  }, [currencies]);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  // 🔹 KPI Calculations
  const groupByDate = transactions.reduce((acc, t) => {
    const dateKey = new Date(t.createdAt).toISOString().slice(0, 10);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const todayTxns = groupByDate[todayKey] || [];
  const yesterdayTxns = groupByDate[yesterdayKey] || [];

  const calcTotal = (txns, field) =>
    txns.reduce((sum, t) => sum + (t[field] || 0), 0);

  const todayPayments = calcTotal(todayTxns, "amountPaid");
  const yesterdayPayments = calcTotal(yesterdayTxns, "amountPaid");

  const totalBalance = calcTotal(transactions, "balanceDue");
  const yesterdayBalance = calcTotal(yesterdayTxns, "balanceDue");

  const todayCustomers = new Set(todayTxns.map((t) => t.customer?.id)).size;
  const yesterdayCustomers = new Set(yesterdayTxns.map((t) => t.customer?.id)).size;

  const percentChange = (today, yesterday) => {
    if (yesterday === 0) return "N/A";
    return (((today - yesterday) / yesterday) * 100).toFixed(1);
  };

  const trend = (today, yesterday) => {
    const change = percentChange(today, yesterday);
    if (change === "N/A")
      return <p className="text-gray-400 text-sm mt-1">No data</p>;
    const isUp = today >= yesterday;
    return (
      <p
        className={`${isUp ? "text-green-500" : "text-red-500"} text-sm mt-1`}
      >
        {isUp ? "↑" : "↓"} {change}% – was {formatNumber(yesterday)}
      </p>
    );
  };


// 🔹 Build last 7 days chart data
const last7days = [...Array(7)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return d.toISOString().slice(0, 10);
}).reverse();

const chartData = last7days.map((dateKey) => {
  const txns = transactions.filter(
    (t) => new Date(t.createdAt).toISOString().slice(0, 10) === dateKey
  );
  return {
    date: dateKey.slice(5), // MM-DD format
    payments: calcTotal(txns, "amountPaid"),
    balance: calcTotal(txns, "balanceDue"),
  };
});

 // Country info for header
  const getFlagEmoji = (code) => {
    if (!code || typeof code !== 'string') return '';
    const upper = code.trim().toUpperCase();
    // Only valid ISO 3166-1 alpha-2 codes (exactly 2 alphabetic chars)
    if (!/^[A-Z]{2}$/.test(upper)) return '';
    return [...upper]
      .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
      .join('');
  };
  const country = localStorage.getItem('country');
  const countryCode = localStorage.getItem('countryCode');

  // Resolve header flag from currencies data (which has proper 2-letter codes from API)
  // Fallback to getFlagEmoji if no match found in currencies
  const resolvedHeaderFlag = (() => {
    if (currencies.length > 0) {
      // Try matching by countryCode from localStorage first
      let match = currencies.find(c => c.country?.toUpperCase() === countryCode?.toUpperCase());
      // Try matching by country name
      if (!match && country) {
        match = currencies.find(c => c.name?.toUpperCase() === country.toUpperCase());
      }
      // Try matching by currency code
      if (!match && countryCode) {
        match = currencies.find(c => c.code?.toUpperCase() === countryCode.toUpperCase());
      }
      if (match?.flag) return match.flag;
    }
    return getFlagEmoji(normalizeCountryCode(countryCode));
  })();

// 🔹 Build last 7 days expenses chart data
const expensesChartData = last7days.map((dateKey) => {
  const exps = expenses.filter(
    (e) => new Date(e.date).toISOString().slice(0, 10) === dateKey
  );
  return {
    date: dateKey.slice(5), // MM-DD format
    expenses: calcTotal(exps, "amount"),
  };
});

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
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Hi. Here’s a glance of your business at All Branches
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Country:</span>
            <span className="font-medium">{resolvedHeaderFlag} {country}</span>
          </div>
        </div>

        {/* 🔹 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Payments Collected Today</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentCurrency.code} {formatNumber(todayPayments)}
            </h2>
            {trend(todayPayments, yesterdayPayments)}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Outstanding Balance</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentCurrency.code} {formatNumber(totalBalance)}
            </h2>
            {trend(totalBalance, yesterdayBalance)}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Customers Served Today</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {todayCustomers}
            </h2>
            {trend(todayCustomers, yesterdayCustomers)}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentCurrency.code} {formatNumber(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </h2>
            <p className="text-gray-400 text-sm mt-1">All time</p>
          </div>
        </div>

        {/* 🔹 Sales Trends Chart */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Sales Trends For{" "}
              <span className="text-teal-500">PAST 7 DAYS</span>
            </h2>

          </div>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${currentCurrency.code} ${formatNumber(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="payments" stroke="#14b8a6" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>

        {/* 🔹 Expenses Trends Chart */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Expenses Trends For{" "}
              <span className="text-teal-500">PAST 7 DAYS</span>
            </h2>

          </div>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expensesChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${currentCurrency.code} ${formatNumber(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>

        {/* 🔹 Last Transactions */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Last Transactions</h2>
            <button className="text-teal-500 text-sm">SEE MORE</button>
          </div>
          <ul className="mt-4 divide-y divide-gray-200">
            {transactions.slice(0, 7).map((txn) => (
              <li
                key={txn.id}
                className="py-2 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {txn.customer?.fullName || "Unknown Customer"}
                  </p>
                  <p className="text-gray-500">
                    Invoice {txn.invoiceNumber} – {txn.status}
                  </p>
                </div>
                <span className="font-semibold text-gray-800">
                  {currentCurrency.code} {formatNumber(txn.amountPaid)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

