import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

 
  const [selectedModels, setSelectedModels] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

 
  const phoneModels = [
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Pro", "iPhone 13", 
    "Samsung S24 Ultra", "Samsung S23 Ultra", "Google Pixel 8", 
    "OnePlus 12", "Nothing Phone 2", "Xiaomi 14", "Realme GT 5", "Vivo X100"
  ];

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/get-cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCart(res.data.cart || []);
        } catch (err) { console.log("Error fetching cart"); }
      }
    };
    fetchCart();
  }, []);

  const toggleCart = async (item) => {
  const model = selectedModels[item.id];
  if (!cart.some(c => c.id === item.id) && !model) {
    alert("Please select a model!");
    return;
  }

  const isInCart = cart.some((c) => c.id === item.id);
  const updatedCart = isInCart 
    ? cart.filter((c) => c.id !== item.id) 
    : [...cart, { ...item, model, cartId: Date.now() }];

  
  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await axios.post("http://localhost:5000/api/auth/save-cart", 
        { cart: updatedCart }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.error("Rate limit hit! Cart sync delayed.");
        
      }
    }
  }
};
  const handleModelChange = (id, val) => {
    setSelectedModels(prev => ({ ...prev, [id]: val }));
  };

  const uniqueQuotes = ["King", "Queen", "Sigma", "Elite", "Leader", "Stay Wild", "Onyx", "Alpha", "Pure", "Royal", "Legend", "Aura", "Zenith", "Spirit", "Power", "Soul", "Vision", "Master", "Unique", "Legacy", "Ghost", "Mystic", "Shadow", "Titan", "Glow", "Noble", "Prime", "Void", "Glory", "Icon"];
  const allDesigns = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `SIGMA DESIGN ${i + 1}`,
    quote: uniqueQuotes[i],
    url: `https://loremflickr.com/300/600/abstract,texture?lock=${i + 5000}`, 
  }));

  const currentDesigns = allDesigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={pageStyle}>
      <div style={headerBrandingStyle}>DESIGN YOUR VIBE</div>
      
      <div style={navContainerStyle}>
        <Link to="/customize" style={navBtn}>CUSTOMIZE</Link>
        <Link to="/cart" style={navBtn}>CART ({cart.length})</Link>
        <Link to="/orders" style={navBtn}>ORDERS</Link>
      </div>

      <h1 style={mainHeadingStyle}>BORN TO BE UNIQUE</h1>

      <div style={gridStyle}>
        {currentDesigns.map((item) => {
          const added = cart.some(c => c.id === item.id);
          return (
            <div key={item.id} style={cardWrapper}>
              <div onClick={() => navigate("/customize", { state: { selectedImg: item.url, quote: item.quote } })} style={caseStyle(item.url)}>
                <div style={cameraModule}><div style={lens}></div><div style={lens}></div><div style={lens}></div></div>
                <h2 style={cursiveText}>{item.quote}</h2>
              </div>
              
              <p style={designLabelStyle}>{item.name}</p>

              
              <select 
                style={modelSelectStyle} 
                value={selectedModels[item.id] || ""} 
                onChange={(e) => handleModelChange(item.id, e.target.value)}
                disabled={added}
              >
                <option value="">SELECT MODEL</option>
                {phoneModels.map(m => <option key={m} value={m} style={{color: "#000"}}>{m}</option>)}
              </select>

              <button onClick={(e) => { e.stopPropagation(); toggleCart(item); }} style={sigmaToggleBtn(added)}>
                {added ? "REMOVE FROM CART" : "ADD TO CART"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={paginationStyle}>
        {[1, 2, 3].map(num => (
          <button key={num} onClick={() => {setCurrentPage(num); window.scrollTo(0,0);}} style={pageBtnStyle(currentPage === num)}>0{num}</button>
        ))}
      </div>
      <Link to="/profile" style={profileBtnStyle}>PROFILE <span style={{ marginLeft: "8px" }}>👤</span></Link>

      <Link to="/logout" style={logoutBtnStyle}>LOGOUT <span style={{ marginLeft: "8px" }}>⎋</span></Link>
    </div>
  );
}


const cardWrapper = { width: "190px", marginBottom: "40px", display: "flex", flexDirection: "column", gap: "10px" };

const modelSelectStyle = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: "10px",
  padding: "8px",
  borderRadius: "4px",
  outline: "none",
  cursor: "pointer",
  backdropFilter: "blur(5px)"
};


const pageStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundAttachment: "fixed", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "20px" };
const headerBrandingStyle = { position: "absolute", top: "40px", left: "40px", fontSize: "22px", letterSpacing: "3px", fontWeight: "900", borderBottom: "3px solid #fff", textTransform: "uppercase" };
const navContainerStyle = { position: "absolute", top: "40px", right: "40px", display: "flex", gap: "15px", zIndex: 100 };
const navBtn = { textDecoration: "none", color: "#fff", fontSize: "12px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "20px", background: "rgba(0,0,0,0.4)" };
const mainHeadingStyle = { fontSize: "clamp(30px, 5vw, 45px)", fontWeight: "900", margin: "130px 0 60px", textAlign: "center" };
const gridStyle = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px", maxWidth: "1200px" };
const caseStyle = (url) => ({ cursor: "pointer", borderRadius: "35px", aspectRatio: "9/18.5", border: "4px solid #111", background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${url})`, backgroundSize: "cover", position: "relative", boxShadow: "0 15px 30px rgba(0,0,0,0.8)" });
const cameraModule = { position: "absolute", top: "15px", left: "15px", width: "40px", height: "40px", backgroundColor: "#000", borderRadius: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", padding: "4px", gap: "2px" };
const lens = { background: "#111", borderRadius: "50%" };
const cursiveText = { position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", textAlign: "center", fontFamily: "'Dancing Script', cursive", fontSize: "32px", textShadow: "2px 2px 15px #000", margin: 0 };
const designLabelStyle = { margin: "5px 0 0", fontSize: "10px", letterSpacing: "2px", fontWeight: "bold", opacity: 0.5, textTransform: "uppercase" };
const sigmaToggleBtn = (added) => ({ background: "transparent", color: added ? "#ff4d4d" : "#fff", border: `1px solid ${added ? "#ff4d4d" : "#fff"}`, padding: "10px", fontSize: "10px", fontWeight: "bold", cursor: "pointer", borderRadius: "2px", width: "100%" });
const paginationStyle = { margin: "60px 0", display: "flex", gap: "30px" };
const pageBtnStyle = (active) => ({ background: "transparent", border: "none", color: "#fff", cursor: "pointer", opacity: active ? 1 : 0.4, fontSize: "18px", fontWeight: active ? "900" : "300" });
const logoutBtnStyle = { position: "fixed", bottom: "30px", right: "30px", background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", border: "1px solid rgba(255, 77, 77, 0.5)", padding: "12px 25px", borderRadius: "30px", textDecoration: "none", fontSize: "12px", fontWeight: "bold", zIndex: 1000 };
const profileBtnStyle = { 
  position: "fixed", 
  bottom: "85px", 
  right: "30px", 
  background: "rgba(255, 255, 255, 0.1)", 
  color: "#fff", 
  border: "1px solid rgba(255, 255, 255, 0.5)", 
  padding: "12px 25px", 
  borderRadius: "30px", 
  textDecoration: "none", 
  fontSize: "12px", 
  fontWeight: "bold", 
  zIndex: 1000 
};