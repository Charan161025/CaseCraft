import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUser, clearError } from "../redux/authSlice";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (message === "OTP sent to your email!" || message === "OTP already sent. Please check email.") {
      setStep(2);
    }
    if (message === "Password updated successfully!") {
      alert("Success! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    }
    return () => dispatch(clearError());
  }, [message, navigate, dispatch]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    dispatch(authUser({ data: { email }, endpoint: "/auth/forgot-password" }));
  };

  const handleVerifyAndReset = (e) => {
    e.preventDefault();
    dispatch(authUser({ 
      data: { email, otp, newPassword }, 
      endpoint: "/auth/reset-password-otp" 
    }));
  };

  const containerStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Inter, sans-serif" };
  const inputStyle = { width: "100%", padding: "12px 0", marginBottom: "20px", border: "none", borderBottom: "2px solid rgba(255,255,255,0.5)", backgroundColor: "transparent", outline: "none", color: "#fff" };
  const buttonStyle = { width: "100%", padding: "18px", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "50px", fontWeight: "bold", cursor: "pointer", letterSpacing: "2px" };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: "200" }}>
            {step === 1 ? "Recover" : "Verify"}
        </h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "10px", letterSpacing: "2px", marginBottom: "30px" }}>
            {step === 1 ? "ENTER EMAIL ADDRESS" : "ENTER OTP & NEW PASSWORD"}
        </p>
        
        {error && <p style={{ color: "#ff4d4d", textAlign: "center", fontSize: "12px" }}>{error}</p>}
        {message && <p style={{ color: "#4BB543", textAlign: "center", fontSize: "12px" }}>{message}</p>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <input type="email" placeholder="EMAIL ADDRESS" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" style={buttonStyle}>{loading ? "SENDING..." : "GET OTP"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset}>
           
            <input type="text" placeholder="6-DIGIT OTP" style={inputStyle} value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input type="password" placeholder="NEW PASSWORD" style={inputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" style={buttonStyle}>{loading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
          </form>
        )}
        <p onClick={() => navigate("/")} style={{ textAlign: "center", marginTop: "20px", cursor: "pointer", fontSize: "11px", borderBottom: "1px solid #fff", display: "inline-block" }}>BACK TO LOGIN</p>
      </div>
    </div>
  );
}