import React from "react";
import jwtDecode from "jwt-decode";
import usePaystackScript from "@/hooks/usePaystackScript"; // adjust path

const PaystackButton = ({ invoice, onSuccess, onError }) => {
  const scriptLoaded = usePaystackScript();
  if (!invoice) return null;

  const handlePaystack = async () => {
    if (!scriptLoaded || !window.PaystackPop) {
      alert("⚠️ Paystack script not loaded yet. Please wait.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) {
        alert("⚠️ Missing authentication. Please log in again.");
        return;
      }

      const { name } = jwtDecode(token) || {};
      const createdBy = name || "Unknown User";

      // 1. Fetch merchant Paystack setup
      const setupRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/PaymentSetup/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!setupRes.ok) throw new Error("❌ Failed to fetch payment setup");
      const setup = await setupRes.json();

      if (!setup?.enablePaystack) {
        alert("❌ Paystack not enabled for this account");
        return;
      }

      // 2. Prepare transaction
      const reference = `INV-${invoice.id}-${Date.now()}`;
      const amountInPesewas = Math.round(invoice.total * 100);

      // 3. Trigger Paystack checkout
      const paystack = new window.PaystackPop();
      paystack.newTransaction({
        key: setup.paystackPublicKey,
        email: invoice.customerEmail,
        amount: amountInPesewas,
        currency: setup.paystackCurrency || "GHS",
        reference,
        metadata: { invoiceId: invoice.id, userId: setup.userId },
        onSuccess: async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/Payment/verify`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-API-KEY": apiKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: setup.userId,
                  invoiceId: invoice.id,
                  reference,
                  createdBy,
                }),
              }
            );

            if (res.ok) {
              alert("✅ Paystack payment verified & recorded");
              if (onSuccess) onSuccess();
            } else {
              alert("❌ Could not verify Paystack payment");
              if (onError) onError("Verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            if (onError) onError(err);
          }
        },
        onCancel: () => {
          alert("❌ Paystack payment cancelled");
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      if (onError) onError(err);
    }
  };

  return (
    <button
      onClick={handlePaystack}
      disabled={!scriptLoaded}
      className={`px-4 py-2 rounded-md text-white ${
        scriptLoaded ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
      }`}
    >
      {scriptLoaded ? "Pay with Paystack" : "Loading Paystack..."}
    </button>
  );
};

export default PaystackButton;
