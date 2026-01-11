import { useEffect } from "react";
import axios from "axios";

export default function Logout() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          
          await axios.post("http://localhost:5000/api/auth/logout", {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.log("Backend logout notified or already expired");
      } finally {
        
        localStorage.removeItem("token");
        window.location.href = "/"; 
      }
    };

    performLogout();
  }, []);

  return null;
}