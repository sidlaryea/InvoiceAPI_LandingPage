// hooks/useApiInterceptor.jsx
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useApiInterceptor = () => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const errorData = error.response.data;

          // Handle both plain string and JSON
          const message =
            typeof errorData === "string"
              ? errorData
              : errorData?.message || "Unknown error";

          console.log(
            `Interceptor caught error [${error.response.status}]:`,
            message
          );

          // // ✅ Always show toast with status + message
          // toast.error(`Error ${error.response.status}: ${message}`, {
          //   duration: 6000,
          // });

          // 🔴 Special case: API usage exceeded
          if (message.toLowerCase().includes("usage exceeded")) {
            toast.error(
              <span>
                {message}{" "}
                <a
                  href="/InvoiceAPI_LandingPage/UpgradePage"
                  className="underline text-blue-600 font-semibold"
                >
                  Upgrade Now
                </a>
              </span>,
              { duration: 8000 }
            );
          }

          // 🔴 Special case: expired token
          if (
            error.response.status === 401 &&
            !message.toLowerCase().includes("usage exceeded")
          ) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            
          }
        } else {
          // ✅ If no response at all (network error)
          toast.error("Network error. Please try again later.");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
};
