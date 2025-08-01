import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const totalTabs = 3;

  const nextTab = () => {
    if (activeTab < totalTabs - 1) {
      setActiveTab((prev) => prev + 1);
    } else {
      navigate("/login");
    }
  };

  const tabTitles = ["Business Info", "Tax Setup", "Payment Options"];

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-bold text-center text-blue-700 mb-6">Complete Your Setup</h2>

      <div className="flex justify-center mb-6 space-x-3">
        {tabTitles.map((title, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === index
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        {activeTab === 0 && (
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" placeholder="Business Name" className="input" />
            <input type="text" placeholder="Industry" className="input" />
            <input type="text" placeholder="Address" className="input" />
            <input type="text" placeholder="Country" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="tel" placeholder="Telephone" className="input" />
            <input type="text" placeholder="Tax ID Number" className="input" />
            <input type="file" className="input" />
          </form>
        )}

        {activeTab === 1 && (
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" placeholder="Tax Name" className="input" />
            <input type="number" placeholder="Rate (%)" className="input" />
            <input type="text" placeholder="Currency" className="input" />
            <input type="text" placeholder="Country" className="input" />
            <input type="text" placeholder="Region / Province / State" className="input" />
          </form>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {["Stripe", "Visa", "MasterCard", "MTN Mobile Money"].map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-6 text-center">
        <button
          onClick={nextTab}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {activeTab < totalTabs - 1 ? "Next" : "Finish & Login"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
