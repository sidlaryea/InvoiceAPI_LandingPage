import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import AddTaxRateModal from "./components/AddTaxRateModal";


export default function CompleteSetup() {
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    taxId: '',
    logo:'',
    email: '',
    countryId: '',
    IndustryId: '',
    phone: '',
    industryId: '',
    defaultInvoicePrefix: '',
    defaultPaymentInstruction: '',
    paymentTerms: '',
    taxRates: [],
    currency: 'GHS',
    payStackPublicKey: '',
    payStackSecretkey: '',
    paySatckCurrency: 'GHS',
    stripeCurrency: 'USD',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    allowPartialPayments: false,
    allowOfflinePayments: false

  });

  const [newTaxRate, setNewTaxRate] = useState({
    name: '',
    rate: '',
    country: '',
    region: '',
    status: 'Active'
  });

  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [paystackEnabled, setPaystackEnabled] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [logo, setLogo] = useState(null);
  ///const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  

  

  const tabTitles = ["Business Info", "Branding", "Tax Rates & Currency", "Payment Setup"];
  const nextTab = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
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

  const handleNewTaxRateChange = e => {
    setNewTaxRate({ ...newTaxRate, [e.target.name]: e.target.value });
  };

  const addTaxRate = () => {
    if (newTaxRate.name && newTaxRate.rate && newTaxRate.country && newTaxRate.region) {
      setForm({ ...form, taxRates: [...form.taxRates, newTaxRate] });
      setNewTaxRate({ name: '', rate: '', country: newTaxRate.country, region: '', status: 'Active' });
    }
  };

  const removeTaxRate = (index) => {
    const updatedTaxRates = form.taxRates.filter((_, i) => i !== index);
    setForm({ ...form, taxRates: updatedTaxRates });
  };

  useEffect(() => {
    const selectedCountry = countries.find(c => c.id == form.countryId);
    if (selectedCountry) {
      setNewTaxRate(prev => ({ ...prev, country: selectedCountry.name }));
      const matchingCurrency = currencies.find(c => c.countryCode === selectedCountry.code);
      if (matchingCurrency) {
        setForm(prev => ({ ...prev, currency: matchingCurrency.currencyCode }));
      }
    }
  }, [form.countryId, countries, currencies]);

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

      console.log("Upload Logo Response:", uploadLogoResponse.data);
      logoFilePath = uploadLogoResponse.data.logoFilePath || ""; // adjust if backend returns differently
      console.log("Logo File Path:", logoFilePath);
    }
      console.log("Industry ID raw:", form.industryId);
      
      // 2. Check if Business Info exists and Submit/Update Business Info
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
      taxRate: parseFloat(form.taxRate) || 0,
      currency: form.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await axios.post("http://localhost:5214/api/BrandingDetails/Create Brand", brandingPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });



    // 4. Submit Tax Rates
    const selectedCurrency = currencies.find(c => c.currencyCode === form.currency);
    const productCurrencyId = selectedCurrency ? selectedCurrency.id : 0;

    for (const taxRate of form.taxRates) {
      const taxRatePayload = {
        name: taxRate.name,
        rate: parseFloat(taxRate.rate),
        country: taxRate.country,
        region: taxRate.region,
        isActive: taxRate.status === 'Active',
        productCurrencyId
      };
      await axios.post("http://localhost:5214/api/TaxComponent", taxRatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    

    // 5. Submit Payment Setup (only if Paystack is enabled)
    if (paystackEnabled) {
      const paymentPayload = {
        id: 0,
        userId,
        enablePaystack: true,
        paystackPublicKey: form.payStackPublicKey,
        paystackSecretKey: form.payStackSecretkey,
        paystackCurrency: form.paySatckCurrency || "GHS",
        bankAccountNumber: form.accountNumber,
        bankName: form.bankName,
        accountName: form.accountHolderName || "",
        allowPartialPayments: form.allowPartialPayments || false,
        acceptOfflinePayments: form.acceptOfflinePayments || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await axios.post("http://localhost:5214/api/PaymentSetup/Save User Payment Setup", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    //STRIPE
if (stripeEnabled) {
  const stripePayload = {
    id: 0,
    userId,
    enableStripe: true,
    stripeCurrency: form.stripeCurrency || "USD",
    allowPartialPayments: form.allowPartialPayments || false,
    acceptOfflinePayments: form.acceptOfflinePayments || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await axios.post(
    "http://localhost:5214/api/PaymentSetup/Save User Payment Setup",
    stripePayload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
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

  useEffect(() => {
    axios.get("http://localhost:5214/api/Currency/GetAllCurrencies")
      .then((res) => {
        const activeCurrencies = res.data.filter(c => c.isActive);
        setCurrencies(activeCurrencies);
      })
      .catch((err) => console.error("Failed to fetch currencies:", err));
  }, []);


 



    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
        <div className="flex flex-col items-center mb-10">
          <img src="./logo.png" alt="Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700">Complete Your Setup</h2>
          <p className="text-gray-500 text-center max-w-lg">
            Help us personalize your experience by completing these four quick steps.
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
                accept="image/*"
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium"><b>Logo Preview:</b></p>
                    {logo && logo.name && <p className="text-xs text-gray-500">{logo.name}</p>}
                  </div>
                  <img src={preview} alt="Logo Preview" className="h-20 rounded" />
                </div>
              ) }
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tax Rates ({form.taxRates.length})</h3>
                <select name="currency" value={form.currency} onChange={handleChange} className="input bg-white border border-gray-300 rounded-lg px-4 py-3">
                  <option value="">Select Currency</option>
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.currencyCode}>
                      {currency.currencyCode} - {currency.currencyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {form.taxRates.map((tax, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tax.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.rate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tax.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tax.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tax.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => removeTaxRate(index)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Tax Rate
              </button>
            </div>
          )}

          {activeTab === 3 && (
  <div className="space-y-8">

    {/* PAYMENT PROVIDERS */}
    <div className="flex space-x-8">
      
      

      {/* PAYSTACK TOGGLE */}
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={paystackEnabled}
          onChange={() => setPaystackEnabled(!paystackEnabled)}
          className="accent-blue-600"
        />

        <span className="font-medium text-gray-700">
          Enable Paystack (Local Payments)
        </span><img src="./logos/paystack_logo.png" alt="Paystack Logo" className="h-10 w-12 mr-2 rounded" />
      </label>

      {/* STRIPE TOGGLE */}
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={stripeEnabled}
          onChange={() => setStripeEnabled(!stripeEnabled)}
          className="accent-purple-600"
        />

        <span className="font-medium text-gray-700">
          Enable Stripe (International Cards)
        </span><img src="./logos/stripe_new.png" alt="Paystack Logo" className="h-10 w-12 mr-2 rounded" />
      </label>
    </div>

    {/* PAYSTACK CONFIG */}
    {paystackEnabled && (
      <div className="space-y-6  rounded-xl p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-800">
          Paystack Configuration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="payStackPublicKey"
            value={form.payStackPublicKey}
            onChange={handleChange}
            placeholder="Paystack Public Key"
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="payStackSecretkey"
            value={form.payStackSecretkey}
            onChange={handleChange}
            placeholder="Paystack Secret Key (optional)"
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />

          <select
            name="paySatckCurrency"
            value={form.paySatckCurrency}
            onChange={handleChange}
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          >
            <option value="GHS">GHS – Ghana Cedi</option>
            <option value="USD">USD – US Dollar</option>
          </select>

          <a
            href="https://support.paystack.com/en/articles/1006030"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm md:col-span-2"
          >
            Where do I find my Paystack keys?
          </a>

          <input
            type="text"
            name="accountHolderName"
            value={form.accountHolderName}
            onChange={handleChange}
            placeholder="Account Holder Name"
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="Account Number / Wallet Number"
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            placeholder="Bank Name / MoMo Provider"
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>
      </div>
    )}

    {/* STRIPE CONFIG */}
    {stripeEnabled && (
      <div className="space-y-6  rounded-xl p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-800">
          Stripe Configuration
        </h4>

        <select
          name="stripeCurrency"
          value={form.stripeCurrency}
          onChange={handleChange}
          className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
        >
          <option value="USD">USD – US Dollar</option>
          <option value="CAD">CAD – Canadian Dollar</option>
          <option value="GBP">GBP – British Pound</option>
        </select>

        <p className="text-sm text-gray-600">
          Stripe payments are processed securely by our platform.
          No API keys are required.
        </p>
      </div>
    )}

    {/* COMMON PAYMENT RULES */}
    {(paystackEnabled || stripeEnabled) && (
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.allowPartialPayments}
            onChange={(e) =>
              setForm({ ...form, allowPartialPayments: e.target.checked })
            }
            className="accent-blue-600"
          />
          <span className="text-sm">Accept Partial Payments</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.allowOfflinePayments}
            onChange={(e) =>
              setForm({ ...form, allowOfflinePayments: e.target.checked })
            }
            className="accent-blue-600"
          />
          <span className="text-sm">
            Allow Offline Payments (bank/MoMo info appears on invoice)
          </span>
        </label>
      </div>
    )}

    {/* SKIP */}
    <div className="text-center pt-4">
      <button
        onClick={() => navigate("/login")}
        className="text-blue-600 underline text-sm"
      >
        Skip for now → Configure later in dashboard
      </button>
    </div>

  </div>
)}


          <div className="mt-6 text-center">
            <button onClick={nextTab} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {activeTab < 3 ? "Next" : "Finish & Login"}
            </button>
          </div>
        </div>
      </div>
      <AddTaxRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newTaxRate={newTaxRate}
        handleNewTaxRateChange={handleNewTaxRateChange}
        addTaxRate={addTaxRate}
      />
    </div>
  );
}

