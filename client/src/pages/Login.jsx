import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUser, clearError } from "../redux/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const { loading, error, token } = useSelector((state) => state.auth);

 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
   
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
   
    dispatch(authUser({ data: formData, endpoint: "/auth/login" }));
  };


  const containerStyle = {
    minHeight: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
  };

  const watermarkStyle = {
    position: "absolute",
    top: "40px",
    left: "40px",
    zIndex: 10,
    fontSize: "24px",
    fontWeight: "300",
    letterSpacing: "4px",
    color: "#fff",
    textTransform: "uppercase",
    borderBottom: "1px solid #fff",
  };

  const formBoxStyle = {
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    zIndex: 5,
    textAlign: "left",
    padding: "20px",
  };

  const headerStyle = {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "8px",
    color: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 0",
    marginBottom: "30px",
    border: "none",
    borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
    backgroundColor: "transparent",
    outline: "none",
    fontSize: "16px",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <div style={watermarkStyle}>Design Your Vibe</div>

      <div style={formBoxStyle}>
        <h1 style={{ fontSize: "70px", fontWeight: "200", textAlign: "center", marginBottom: "10px", letterSpacing: "-3px" }}>
          Sign In
        </h1>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "60px" }}>
          Welcome Back
        </p>

        
        {error && (
          <p style={{ color: "#ff4d4d", textAlign: "center", fontSize: "13px", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={headerStyle}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              style={inputStyle}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={headerStyle}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              style={inputStyle}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "20px",
              backgroundColor: loading ? "#ccc" : "#fff",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "4px",
              marginTop: "20px",
              transition: "0.3s",
            }}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", fontSize: "11px", color: "rgba(255,255,255,0.8)", letterSpacing: "1px" }}>
          <span onClick={() => navigate("/register")} style={{ cursor: "pointer", fontWeight: "600", borderBottom: "1px solid #fff" }}>
            REGISTER ACCOUNT
          </span>
          <span onClick={() => navigate("/forgot")} style={{ cursor: "pointer", fontWeight: "600", borderBottom: "1px solid #fff" }}>
            FORGOT PASSWORD?
          </span>
        </div>
      </div>
    </div>
  );
}