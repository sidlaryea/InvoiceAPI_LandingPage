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
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 w-full h-full overflow-auto">
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">

        <div className="grid lg:grid-cols-2 grid-cols-1">

          {/* LEFT PANEL */}
          <div className="bg-slate-950 text-white p-12 lg:p-16 flex flex-col justify-between">

            <div>
              <div className="flex items-center gap-3 mb-10">
                <img
                  src="./logo.png"
                  alt="InvoiceAPI"
                  className="w-10 h-10"
                />

                <div>
                  <h2 className="font-bold text-xl">
                    InvoiceAPI
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Developer Billing Platform
                  </p>
                </div>
              </div>

              <h1 className="text-5xl lg:text-5xl font-bold leading-tight">
                Invoice
                <span className="text-blue-400"> Infrastructure </span>
                for Modern Businesses
              </h1>

              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Generate invoices, automate billing workflows,
                manage customers, and integrate payments through
                a secure API platform designed for developers,
                startups, and growing companies.
              </p>

             

              <div className="mt-12 space-y-6">

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

            <div className="mt-16 border-t border-slate-800 pt-8 grid grid-cols-3 gap-8">

              <Stat
                value="10K+"
                label="Invoices Generated"
              />

              <Stat
                value="99.9%"
                label="API Uptime"
              />

              <Stat
                value="5+"
                label="Currencies"
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex items-center justify-center p-10 lg:p-16">

            <div className="w-full max-w-md">

              

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Access Your Billing Platform
              </h2>

              <p className="text-slate-500 mb-10">
                Sign in or create an account to start
                generating invoices and managing your
                billing workflows.
              </p>

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
            //console.log("Full API Key Response:", apiRes.data);
            
            const apiKey = apiRes.data.key;
            if (!apiKey) {
            console.warn("API key missing in response.");
            //setError("API key not returned.");
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

              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-slate-200"></div>

                <span className="px-4 text-slate-400 text-sm">
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
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue with Email
              </button>

              <button
                type="button"
                onClick={() => navigate("/registration")}
                className="cursor-pointer mt-4 w-full border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-4 rounded-xl transition-all duration-200"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-slate-500 mt-8 leading-6">
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
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-slate-400 text-sm mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      <p className="text-slate-400 uppercase tracking-wider text-xs mt-2">
        {label}
      </p>
    </div>
  );
}

