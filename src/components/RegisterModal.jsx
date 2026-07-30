/* eslint-disable no-unused-vars */
import React from "react";

import { useNavigate } from "react-router-dom";
import {
  FileText,
  CreditCard,
  Globe,
  ShieldCheck,
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "../config/api"

export default function InvoiceApiRegisterModal() {
  const navigate = useNavigate();

  

return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 w-full min-h-[100dvh] overflow-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="w-full bg-white shadow-2xl overflow-hidden">

        <div className="grid lg:grid-cols-2 grid-cols-1 min-h-[100dvh]">

          {/* LEFT PANEL */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 lg:p-16 flex flex-col justify-between order-2 lg:order-1">

            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-10">
                <img
                  src="./logo.png"
                  alt="InvoiceAPI"
                  className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"
                />

                <div>
                  <h2 className="font-bold text-lg sm:text-xl">
                    InvoiceAPI
                  </h2>

                  <p className="text-slate-400 text-xs sm:text-sm">
                    Developer Billing Platform
                  </p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Invoice
                <span className="text-blue-400"> Infrastructure </span>
                for Modern Businesses
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
                Generate invoices, automate billing workflows,
                manage customers, and integrate payments through
                a secure API platform designed for developers,
                startups, and growing companies.
              </p>

              <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">

                <Feature
                  icon={FileText}
                  title="Invoice Generation API"
                  description="Create invoices programmatically through REST APIs."
                />

                <Feature
                  icon={CreditCard}
                  title="Payment Tracking"
                  description="Monitor payments, balances and settlements."
                />

                <Feature
                  icon={Globe}
                  title="Multi-Currency Support"
                  description="GHS, USD, CAD, NGN and more."
                />

                <Feature
                  icon={ShieldCheck}
                  title="Secure Authentication"
                  description="JWT, API Keys and role-based access."
                />
              </div>
            </div>

           
          </div>

          {/* RIGHT PANEL */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16 order-1 lg:order-2">

            <div className="w-full max-w-md">

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                Access Your Billing Platform
              </h2>

              <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-10">
                Sign in or create an account to start
                generating invoices and managing your
                billing workflows.
              </p>

              <div className="w-full overflow-hidden">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    const result = await axios.post(
                      `${API_BASE}/api/Login/google-login`,
                      {
                        idToken: credentialResponse.credential,
                      }
                    );

                    console.log(result.data);
                    //SaveJWT token
                    const decodedToken = jwtDecode(result.data.token);

                    localStorage.setItem("userId", decodedToken.userId);
                    localStorage.setItem("firstname", decodedToken.FirstName);
                    localStorage.setItem("country", decodedToken.CountryName);
                    localStorage.setItem("countryCode", decodedToken.CountryCode);

                    localStorage.setItem("jwtToken", result.data.token);
                    localStorage.setItem("firstName", result.data.firstName);

                    const token = localStorage.getItem("jwtToken");
                    // Fetch API key info
                    const apiRes = await axios.get(
                      `${API_BASE}/api/ApiKey`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                      }
                    );

                    const apiKey = apiRes.data.key;
                    if (!apiKey) {
                      console.warn("API key missing in response.");
                      return;
                    }

                    localStorage.setItem("apiKey", apiKey);

                    // Redirect logic
                    if (result.data.proposalSetupComplete) {
                      navigate("/dashboard");
                    } else {
                      navigate("/OnboardPage");
                    }
                    console.log(localStorage.getItem("token"));
                  }}
                  onError={() => console.log("Login Failed")}
                />
              </div>

              <div className="flex items-center my-3 sm:my-4">
                <div className="flex-1 h-px bg-slate-200"></div>

                <span className="px-4 text-slate-400 text-xs sm:text-sm whitespace-nowrap">
                  or continue with
                </span>

                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log("RegisterModal: navigating to /login");
                  navigate("/login");
                }}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                style={{ touchAction: 'manipulation' }}
              >
                Continue with Email
              </button>

              <button
                type="button"
                onClick={() => navigate("/registration")}
                className="cursor-pointer mt-3 sm:mt-4 w-full border border-slate-300 hover:border-slate-400 active:border-slate-500 text-slate-700 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200 active:scale-[0.98] text-sm sm:text-base"
                style={{ touchAction: 'manipulation' }}
              >
                Create Account
              </button>

              <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8 leading-5 sm:leading-6">
                By continuing, you agree to our Terms of Service
                and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
        <Icon size={20} className="sm:size-[22px]" />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-base sm:text-lg">
          {title}
        </h3>

        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-2xl sm:text-3xl font-bold">
        {value}
      </h3>

      <p className="text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs mt-1 sm:mt-2">
        {label}
      </p>
    </div>
  );
}

