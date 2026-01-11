import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Customize() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [design, setDesign] = useState(location.state || { selectedImg: "", quote: "Your Quote", name: "Custom" });
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [requirements, setRequirements] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(savedCart.length);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesign({ ...design, selectedImg: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    if (!model || !color) return alert("Please select Phone Model and Case Color");
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = {
      ...design,
      cartId: Date.now(),
      model,
      color,
      requirements,
      selectedImg: design.selectedImg 
    };
    
    const updatedCart = [...cart, newItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post("http://localhost:5000/api/auth/save-cart", 
          { cart: updatedCart }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) { console.error("DB Sync Failed"); }
    }
    alert("Item added to cart successfully!");
  };

  return (
    <div style={pageStyle}>
      
      <div style={headerBrandingStyle}>DESIGN YOUR VIBE</div>
      
      <div style={topNavStyle}>
        <Link to="/cart" style={navBtn}>CART ({cartCount})</Link>
      </div>
      
      <div style={containerStyle}>
       
        <div style={{ textAlign: "center" }}>
          <div style={casePreviewWrapper(design.selectedImg)}>
            <div style={cameraModule}>
              <div style={lens}></div><div style={lens}></div><div style={lens}></div>
            </div>
            <h2 style={cursiveText}>{design.quote}</h2>
          </div>
          <button onClick={() => fileInputRef.current.click()} style={uploadBtnStyle}>
             UPLOAD FROM GALLERY
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{display: 'none'}} accept="image/*" />
        </div>

        
        <div style={formStyle}>
          <h2 style={formTitleStyle}>CUSTOMIZE</h2>
          
          <div style={inputGroup}>
            <label style={labelStyle}>PHONE MODEL</label>
            <select value={model} onChange={e => setModel(e.target.value)} style={selectStyle}>
              <option value="" style={optionStyle}>SELECT MODEL</option>
              {["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Pro", "iPhone 13", "Samsung S24 Ultra", "Samsung S23 Ultra", "Google Pixel 8", "OnePlus 12", "Nothing Phone 2", "Xiaomi 14"].map(m => (
                <option key={m} value={m} style={optionStyle}>{m}</option>
              ))}
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>CASE COLOR</label>
            <select value={color} onChange={e => setColor(e.target.value)} style={selectStyle}>
              <option value="" style={optionStyle}>SELECT COLOR</option>
              {["Midnight Black", "Titanium Gray", "Deep Blue", "Forest Green", "Crimson Red", "Royal Gold", "Pure White"].map(c => (
                <option key={c} value={c} style={optionStyle}>{c}</option>
              ))}
            </select>
          </div>

          <button onClick={handleAddToCart} style={sigmaAddBtn}>ADD TO CART</button>
          <button onClick={() => navigate("/home")} style={sigmaCancelBtn}>BACK TO HOME</button>
        </div>

        <div style={requirementsContainer}>
          <label style={labelStyle}>YOUR REQUIREMENTS</label>
          <textarea 
            placeholder="Tell us about any specific placement or text changes..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            style={textAreaStyle}
          />
        </div>
      </div>
    </div>
  );
}


const pageStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundAttachment: "fixed", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", padding: "20px" };

const headerBrandingStyle = { position: "absolute", top: "40px", left: "40px", fontSize: "22px", letterSpacing: "3px", fontWeight: "900", borderBottom: "3px solid #fff", textTransform: "uppercase" };


const topNavStyle = { position: "absolute", top: "40px", right: "40px", zIndex: 100 };

const navBtn = { textDecoration: "none", color: "#fff", fontSize: "12px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "20px", background: "rgba(0,0,0,0.4)" };

const containerStyle = { display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center", alignItems: "flex-start", background: "rgba(0,0,0,0.7)", padding: "40px", borderRadius: "30px", backdropFilter: "blur(15px)", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "1100px", marginTop: "40px" };

const casePreviewWrapper = (url) => ({ width: "200px", borderRadius: "35px", aspectRatio: "9/18.5", border: "4px solid #111", background: url ? `url(${url})` : "#222", backgroundSize: "cover", backgroundPosition: "center", position: "relative", boxShadow: "0 15px 30px rgba(0,0,0,0.8)" });

const cameraModule = { position: "absolute", top: "15px", left: "15px", width: "40px", height: "40px", backgroundColor: "#000", borderRadius: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", padding: "4px", gap: "2px" };

const lens = { background: "#111", borderRadius: "50%" };

const cursiveText = { position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", textAlign: "center", fontFamily: "'Dancing Script', cursive", fontSize: "28px", textShadow: "2px 2px 15px #000" };

const formStyle = { width: "280px", display: "flex", flexDirection: "column", gap: "15px" };

const formTitleStyle = { fontSize: "24px", fontWeight: "900", letterSpacing: "2px", borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "10px" };

const selectStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid #555", color: "#fff", padding: "12px", borderRadius: "5px", outline: "none", cursor: "pointer" };

const optionStyle = { background: "#1a1a1a", color: "#fff" };

const requirementsContainer = { width: "280px", height: "100%", display: "flex", flexDirection: "column" };

const textAreaStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid #555", color: "#fff", padding: "12px", borderRadius: "5px", outline: "none", minHeight: "200px", resize: "none", fontSize: "13px", lineHeight: "1.5" };

const uploadBtnStyle = { background: "transparent", border: "1px solid #fff", color: "#fff", padding: "8px 12px", fontSize: "10px", marginTop: "15px", cursor: "pointer", fontWeight: "bold", letterSpacing: "1px" };

const sigmaAddBtn = { background: "#fff", color: "#000", border: "none", padding: "15px", fontWeight: "900", cursor: "pointer", borderRadius: "2px", fontSize: "12px", marginTop: "10px" };

const sigmaCancelBtn = { background: "transparent", color: "#fff", border: "1px solid #444", padding: "15px", fontWeight: "bold", cursor: "pointer", borderRadius: "2px", fontSize: "12px" };

const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };

const labelStyle = { fontSize: "10px", fontWeight: "bold", opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" };