import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";


export default function CompleteSetup() {
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    taxId: '',
    email: '',
    countryId: '',
    phone: '',
    industryId: '',
    defaultInvoicePrefix: '',
    defaultPaymentInstruction: '',
    paymentTerms: '',
    payStackPublicKey: '',
    payStackSecretkey: '',
    paySatckCurrency: 'GHS',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    allowPartialPayments: false,
    allowOfflinePayments: false

  });

  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [paystackEnabled, setPaystackEnabled] = useState(false);
  const [logo, setLogo] = useState(null);
  ///const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();


  

  

  const tabTitles = ["Business Info", "Branding", "Payment Setup"];
  const nextTab = () => {
    if (activeTab < 2) setActiveTab(activeTab + 1);
    else handlesubmit();
  };

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const [, a, b, c] = match;
    return !b ? a : `(${a}) ${b}${c ? `-${c}` : ''}`;
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  ////Submitting the form//////////////////////////////////////////
  const handlesubmit = async () => {

  const token = localStorage.getItem("jwtToken");
  if (!token) return alert("You must be logged in.");

  const decodedToken = jwtDecode(token);
  console.log("Decoded Token:", decodedToken);
  const userId = decodedToken.userId;
  if (!userId) return alert("User ID not found in token.");

  try {
    // 1. Upload Logo (if selected)
    let logoFilePath = "";
    if (logo) {
      const logoData = new FormData();
      logoData.append("file", logo);

      const uploadLogoResponse = await axios.post(
        "http://localhost:5214/api/BusinessInfo/upload-logo",
        logoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      logoFilePath = uploadLogoResponse.data.logoFilePath || ""; // adjust if backend returns differently
    }
console.log("Industry ID raw:", form.industryId);
    // 2. Submit Business Info
    const businessInfoPayload = {
      businessName: form.businessName,
      industryId: parseInt(form.industryId) || null,
      countryId:form.countryId ? parseInt(form.countryId): null,
      address: form.address,
      email: form.email,
      phone: form.phone,
      taxIdNumber: form.taxId,
      logoFilePath,
      userId
    };

    await axios.post("http://localhost:5214/api/BusinessInfo", businessInfoPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Submit Branding Info
    const brandingPayload = {
      id: 0,
      userId,
      defaultInvoicePrefix: form.defaultInvoicePrefix,
      paymentTerms: form.paymentTerms,
      defaultPaymentInstructions: form.defaultPaymentInstruction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await axios.post("http://localhost:5214/api/BrandingDetails/Create Brand", brandingPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 4. Submit Payment Setup (only if Paystack is enabled)
    if (paystackEnabled) {
      const paymentPayload = {
        id: 0,
        userId,
        enablePaystack: true,
        paystackPublicKey: form.paystackPublicKey || "",
        paystackSecretKey: form.paystackSecretKey || "",
        paystackCurrency: form.paystackCurrency || "GHS",
        bankAccountNumber: form.bankAccountNumber || "",
        bankName: form.bankName || "",
        accountName: form.accountName || "",
        allowPartialPayments: form.allowPartialPayments || false,
        acceptOfflinePayments: form.acceptOfflinePayments || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await axios.post("http://localhost:5214/api/PaymentSetup/Save User Payment Setup", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    alert("Setup completed successfully!");
    localStorage.setItem("setupComplete", "true");
    navigate("/dashboard");

  } catch (error) {
    console.error("Setup submission failed:", error);
    alert("Something went wrong during setup. Please try again.");
  }
}


  useEffect(() => {
    axios.get("http://localhost:5214/api/Industries")
      .then((res) => {
        const sortedIndustries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setIndustries(sortedIndustries);
      })
      .catch((err) => console.error("Failed to fetch the industries:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5214/api/Country")
      .then((res) => {
        const sortedCountries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);


 



    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
        <div className="flex flex-col items-center mb-10">
          <img src="./logo.png" alt="Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700">Complete Your Setup</h2>
          <p className="text-gray-500 text-center max-w-lg">
            Help us personalize your experience by completing these three quick steps.
          </p>
        </div>

        <div className="flex justify-center mb-6 space-x-4">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-md shadow-inner min-h-[340px] transition-all duration-300">
          {activeTab === 0 && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={form.businessName}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <select
                name="industryId"
                value={form.industryId}
                onChange={(e) =>
                  setForm({ ...form, industryId: e.target.value })
                }
                required
                className="w-full p-4 rounded-xl border-2 border-gray-200"
              >
                <option value="">Select an Industry</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <select
                name="countryId"
                value={form.countryId}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border-2 border-gray-200"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {getFlagEmoji(country.code)} {country.name}
                  </option>
                ))}
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number EX: (123) 456-7890"
                value={form.phone}
                onChange={(e) =>
                  handleChange({ target: { name: "phone", value: formatPhone(e.target.value) } })
                }
                required
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="text"
                name="taxId"
                placeholder="Tax ID Number"
                value={form.taxId}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="file"
                name="logo"
                
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              {preview && <img src={preview} alt="Preview" className="mt-4 h-20" />}
            </form>
          )}

          {activeTab === 1 && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="defaultInvoicePrefix" onChange={handleChange} value={form.defaultInvoicePrefix} placeholder="Default Invoice Prefix (e.g. INV-01)" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
              <select name="paymentTerms" value={form.paymentTerms} onChange={handleChange} className="input bg-white border border-gray-300 rounded-lg px-4 py-3">
                <option value="">Select Payment Terms</option>
                <option value="Net 7">Net 7</option>
                <option value="Net 14">Net 14</option>
                <option value="Net 30">Net 30</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
              <textarea onChange={handleChange} name="defaultPaymentInstruction" placeholder="Default Payment Instructions (e.g. Pay via bank transfer to XYZ)" value={form.defaultPaymentInstruction} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 md:col-span-2" rows="4"></textarea>
            </form>
          )}

          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={paystackEnabled} onChange={() => setPaystackEnabled(!paystackEnabled)} className="accent-blue-600" />
                <label className="text-gray-700 font-medium">Enable Paystack</label>
              </div>

              {paystackEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="payStackPublicKey" onChange={handleChange} value={form.payStackPublicKey} placeholder="Paystack Public Key" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" name="payStackSecretkey" onChange={handleChange} value={form.payStackSecretkey} placeholder="Paystack Secret Key (optional)" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <select className="input  bg-white border border-gray-300 rounded-lg px-4 py-3" value={form.paySatckCurrency} onChange={handleChange} name="currency">
                    <option value="GHS">GHS - Ghana Cedi</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                  <a href="https://support.paystack.com/en/articles/1006030" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm md:col-span-2">Where do I find my Paystack keys?</a>

                  <input type="text" onChange={handleChange} name="accountHolderName" value={form.accountHolderName} placeholder="Account Holder Name" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" onChange={handleChange} name="accountNumber" value={form.accountNumber} placeholder="Account Number / Wallet Number" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" onChange={handleChange} name="bankName" value={form.bankName} placeholder="Bank Name / MoMo Provider" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />

                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input name="allowPartialPayments" type="checkbox" checked={form.allowPartialPayments} onChange={(e) =>
                      setForm({ ...form, allowPartialPayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Accept Partial Payments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input name="allowOfflinePayments" type="checkbox" checked={form.allowOfflinePayments} onChange={(e) =>
                      setForm({ ...form, allowOfflinePayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Allow Offline Payments (bank/MoMo info will appear on invoice)</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="text-center pt-4">
                <button onClick={nextTab} className="text-blue-600 underline text-sm">Skip for now → Configure later in dashboard</button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button onClick={nextTab} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {activeTab < 2 ? "Next" : "Finish & Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

