import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile");
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const containerStyle = {
    minHeight: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  };

  const cardStyle = {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    width: "300px"
  };

  if (!user) return <div style={containerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ letterSpacing: "2px", fontWeight: "200" }}>PROFILE</h2>
        <div style={{ margin: "20px 0", height: "1px", background: "rgba(255,255,255,0.2)" }}></div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>NAME</p>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{user.name}</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>EMAIL</p>
        <p style={{ fontSize: "18px" }}>{user.email}</p>
        <button 
          onClick={() => navigate("/home")} 
          style={{ marginTop: "30px", background: "#fff", color: "#000", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}
        >
          BACK HOME
        </button>
      </div>
    </div>
  );
}