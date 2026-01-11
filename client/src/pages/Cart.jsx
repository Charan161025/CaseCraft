import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/"); return; }
      try {
        const res = await axios.get("http://localhost:5000/api/auth/get-cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.cart || []);
      } catch (err) { console.error("Error fetching cart"); }
      finally { setLoading(false); }
    };
    fetchCart();
  }, [navigate]);

  const updateBackend = async (updated) => {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("http://localhost:5000/api/auth/save-cart", { cart: updated }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  const removeItem = (cartId) => {
    const updated = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateBackend(updated);
  };

  const calculateTotal = () => cartItems.length * 499;

  if (loading) return <div style={pageStyle}>SYNCING CART...</div>;

  return (
    <div style={pageStyle}>
      
      <div style={headerBrandingStyle}>DESIGN YOUR VIBE</div>

     
      <div style={topNavStyle}>
        <Link to="/home" style={navBtn}>BACK</Link>
      </div>

      <div style={cartContainer}>
        <h1 style={titleStyle}>YOUR SELECTIONS</h1>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ opacity: 0.6 }}>Your cart is empty.</p>
            <Link to="/home" style={shopBtn}>START DESIGNING</Link>
          </div>
        ) : (
          <div style={cartWrapper}>
            <div style={itemsSection}>
              {cartItems.map((item) => (
                <div key={item.cartId} style={itemCard}>
                  <div style={miniPreview(item.selectedImg || item.url)}>
                    <div style={miniCamera}></div>
                    <span style={miniCursive}>{item.quote}</span>
                  </div>
                  <div style={detailsStyle}>
                    <h3 style={itemName}>{item.name || "Custom Case"}</h3>
                    <p style={itemMeta}>{item.model} | {item.color}</p>
                    {item.requirements && <p style={reqText}>{item.requirements}</p>}
                    <button onClick={() => removeItem(item.cartId)} style={removeBtn}>REMOVE</button>
                  </div>
                  <div style={priceTag}>₹499</div>
                </div>
              ))}
            </div>
            <div style={summaryBox}>
              <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>ORDER SUMMARY</h2>
              <div style={summaryRow}><span>Items:</span> <span>{cartItems.length}</span></div>
              <div style={summaryRow}><span>Subtotal:</span> <span>₹{calculateTotal()}</span></div>
              <div style={totalRow}><span>Total:</span> <span>₹{calculateTotal()}</span></div>
              <button onClick={() => navigate("/checkout")} style={checkoutBtn}>PROCEED TO CHECKOUT</button>
              <Link to="/home" style={continueLink}>Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const pageStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundAttachment: "fixed", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "100px 20px 40px" };
const headerBrandingStyle = { position: "absolute", top: "40px", left: "40px", fontSize: "22px", letterSpacing: "3px", fontWeight: "900", borderBottom: "3px solid #fff", textTransform: "uppercase" };

const topNavStyle = { position: "absolute", top: "40px", right: "40px", zIndex: 100 };
const navBtn = { textDecoration: "none", color: "#fff", fontSize: "12px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "20px", background: "rgba(0,0,0,0.4)" };

const cartContainer = { width: "100%", maxWidth: "1100px", background: "rgba(0,0,0,0.75)", padding: "40px", borderRadius: "30px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" };
const titleStyle = { fontSize: "32px", fontWeight: "900", letterSpacing: "2px", marginBottom: "40px", textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "20px" };
const cartWrapper = { display: "flex", gap: "40px", flexWrap: "wrap" };
const itemsSection = { flex: 2, display: "flex", flexDirection: "column", gap: "20px", minWidth: "300px" };
const itemCard = { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "15px", border: "1px solid #333" };
const miniPreview = (img) => ({ width: "70px", height: "140px", borderRadius: "12px", border: "2px solid #000", background: `url(${img})`, backgroundSize: "cover", position: "relative", marginRight: "20px" });
const miniCamera = { position: "absolute", top: "5px", left: "5px", width: "15px", height: "15px", background: "#000", borderRadius: "3px" };
const miniCursive = { position: "absolute", top: "50%", width: "100%", textAlign: "center", fontSize: "8px", fontFamily: "'Dancing Script', cursive" };
const detailsStyle = { flex: 1 };
const itemName = { fontSize: "16px", fontWeight: "bold", margin: "0 0 5px" };
const itemMeta = { fontSize: "12px", opacity: 0.6, margin: "0 0 10px" };
const reqText = { fontSize: "11px", color: "#aaa", fontStyle: "italic", background: "#111", padding: "5px", borderRadius: "4px" };
const removeBtn = { background: "transparent", border: "none", color: "#ff4d4d", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" };
const priceTag = { fontSize: "18px", fontWeight: "bold" };
const summaryBox = { flex: 1, background: "rgba(255,255,255,0.08)", padding: "30px", borderRadius: "20px", height: "fit-content", minWidth: "280px", border: "1px solid #444" };
const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", opacity: 0.8 };
const totalRow = { display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "900", marginBottom: "25px" };
const checkoutBtn = { width: "100%", background: "#fff", color: "#000", border: "none", padding: "15px", fontWeight: "900", cursor: "pointer", borderRadius: "5px", fontSize: "14px" };
const continueLink = { display: "block", textAlign: "center", marginTop: "15px", fontSize: "12px", color: "#fff", opacity: 0.5 };
const shopBtn = { display: "inline-block", background: "#fff", color: "#000", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold", marginTop: "20px" };