import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const pricePerCase = 499;

  useEffect(() => {
    const fetchOrderData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");
      
      try {
        const res = await axios.get("/api/auth/get-cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.cart || []);
        setTotalAmount((res.data.cart || []).length * pricePerCase);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchOrderData();
  }, [navigate]);

  const handlePayment = async () => {
    if (totalAmount === 0) return alert("Cart is empty!");
    const token = localStorage.getItem("token");

    try {
      
      const orderRes = await axios.post(
        "/api/auth/create-razorpay-order",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: razorpay_order_id, currency } = orderRes.data;

      
      const options = {
        key: "rzp_test_RznJewYRNEZ9bt", 
        amount: totalAmount * 100,
        currency: currency,
        name: "SIGMA CASES",
        description: `Payment for ${cartItems.length} Custom Cases`,
        order_id: razorpay_order_id,
        handler: async function (response) {
         
          try {
            await axios.post(
              "/api/auth/place-order",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: totalAmount
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            
            localStorage.setItem("cart", JSON.stringify([]));
            alert("Order Placed Successfully!");
            navigate("/home"); 
          } catch (err) {
            alert("Payment recorded by Razorpay, but DB update failed. Contact Support.");
          }
        },
        prefill: {
          name: "Sigma Customer",
          email: "customer@example.com",
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Init Failed", error);
      alert("Could not start payment. Check backend console.");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={sloganStyle}>DESIGN YOUR VIBE</div>
      
      <div style={topNavStyle}>
        <Link to="/cart" style={navBtn}>BACK TO CART</Link>
      </div>

      <div style={formWrapperStyle}>
        <h1 style={headingStyle}>Checkout</h1>
        <p style={subheadingStyle}>Total Items: {cartItems.length}</p>

        <div style={paymentCardStyle}>
            <label style={labelHeaderStyle}>Total Amount Payable</label>
            <div style={amountStyle}>₹{totalAmount}</div>
            <p style={{fontSize: '10px', opacity: 0.4, marginTop: '10px'}}>GST & Shipping Included</p>
        </div>

        <button onClick={handlePayment} style={payButtonStyle}>
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
}


const pageStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: "'Inter', sans-serif", color: "#fff" };
const sloganStyle = { position: "absolute", top: "40px", left: "40px", fontSize: "22px", fontWeight: "300", letterSpacing: "5px", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.6)", paddingBottom: "5px" };
const topNavStyle = { position: "absolute", top: "40px", right: "40px", zIndex: 100 };
const navBtn = { textDecoration: "none", color: "#fff", fontSize: "12px", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "20px", background: "rgba(0,0,0,0.4)" };
const formWrapperStyle = { width: "100%", maxWidth: "450px", textAlign: "center", padding: "40px", background: "rgba(0,0,0,0.8)", borderRadius: "30px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" };
const headingStyle = { fontSize: "60px", fontWeight: "100", marginBottom: "0px", letterSpacing: "-3px" };
const subheadingStyle = { fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "40px", opacity: 0.7 };
const paymentCardStyle = { textAlign: "left", marginBottom: "40px", borderTop: "1px solid #333", paddingTop: "20px" };
const labelHeaderStyle = { fontSize: "10px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.5)", marginBottom: "5px" };
const amountStyle = { fontSize: "42px", fontWeight: "200", letterSpacing: "-1px" };
const payButtonStyle = { width: "100%", padding: "20px", borderRadius: "50px", border: "none", backgroundColor: "#fff", color: "#000", fontWeight: "bold", letterSpacing: "4px", textTransform: "uppercase", cursor: "pointer" };