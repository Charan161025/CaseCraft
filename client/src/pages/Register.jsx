import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUser, clearError } from "../redux/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const { loading, error, message, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (message === "Registration successful!") {
      navigate("/");
      dispatch(clearError()); 
    }

    
    if (token) {
      navigate("/customize");
    }

    
    return () => dispatch(clearError());
  }, [message, token, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
   
    dispatch(authUser({ data: formData, endpoint: "/auth/register" }));
  };

 
  const containerStyle = { 
    minHeight: "100vh", 
    backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontFamily: "'Inter', sans-serif", 
    color: "#fff" 
  };

  const inputStyle = { 
    width: "100%", 
    padding: "12px 0", 
    marginBottom: "25px", 
    border: "none", 
    borderBottom: "2px solid rgba(255, 255, 255, 0.5)", 
    backgroundColor: "transparent", 
    outline: "none", 
    fontSize: "16px", 
    color: "#fff" 
  };

  const buttonStyle = { 
    width: "100%", 
    padding: "20px", 
    backgroundColor: "#fff", 
    color: "#000",
    borderRadius: "50px", 
    fontWeight: "bold", 
    border: "none",
    letterSpacing: "4px", 
    cursor: loading ? "not-allowed" : "pointer",
    transition: "0.3s"
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <h1 style={{ fontSize: "60px", fontWeight: "200", textAlign: "center", marginBottom: "10px" }}>Join Us</h1>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "12px", letterSpacing: "3px", marginBottom: "40px" }}>CREATE YOUR ACCOUNT</p>
        
        {error && (
          <p style={{ color: "#ff4d4d", textAlign: "center", fontSize: "12px", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <input 
            name="name" 
            placeholder="FULL NAME" 
            style={inputStyle} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            style={inputStyle} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="PASSWORD" 
            style={inputStyle} 
            onChange={handleChange} 
            required 
          />
          
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "CREATING..." : "REGISTER"}
          </button>
        </form>

        <p 
          onClick={() => navigate("/")} 
          style={{ 
            textAlign: "center", 
            marginTop: "30px", 
            fontSize: "11px", 
            cursor: "pointer", 
            borderBottom: "1px solid #fff", 
            display: "inline-block" 
          }}
        >
          ALREADY HAVE AN ACCOUNT? LOGIN
        </p>
      </div>
    </div>
  );
}