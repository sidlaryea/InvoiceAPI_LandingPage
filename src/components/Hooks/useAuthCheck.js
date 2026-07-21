// hooks/useAuthCheck.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check both possible token keys (Google login stores under "jwtToken")
    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // current time in seconds

      if (decoded.exp < now) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("token");
        localStorage.removeItem("apiKey");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("token has expired", error);
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("token");
      localStorage.removeItem("apiKey");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
};

export default useAuthCheck;
