// src/utils/ensurePaystack.js
export function ensurePaystack() {
  return new Promise((resolve, reject) => {
    // Only run in the browser
    if (typeof window === "undefined") {
      reject(new Error("Paystack can only load in the browser"));
      return;
    }

    // Already loaded?
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }

    // Already being added?
    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existing) {
      existing.addEventListener("load", () =>
        window.PaystackPop ? resolve(window.PaystackPop) : reject(new Error("Paystack SDK loaded but object missing"))
      );
      existing.addEventListener("error", () => reject(new Error("Paystack SDK script error")));
      return;
    }

    // Inject script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () =>
      window.PaystackPop ? resolve(window.PaystackPop) : reject(new Error("Paystack SDK loaded but object missing"));
    script.onerror = () => reject(new Error("Paystack SDK script error"));
    document.head.appendChild(script);
  });
}
