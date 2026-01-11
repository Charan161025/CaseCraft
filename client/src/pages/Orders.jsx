import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders");
      }
    };
    fetchOrders();
  }, []);

  const containerStyle = { minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", display: "flex", flexDirection: "column", alignItems: "center", color: "#fff", fontFamily: "Inter, sans-serif", padding: "40px 20px" };
  const cardStyle = { background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", width: "100%", maxWidth: "500px", marginBottom: "15px" };

  return (
    <div style={containerStyle}>
      <h2 style={{ letterSpacing: "3px", fontWeight: "200", marginBottom: "40px" }}>MY ORDERS</h2>
      {orders.length === 0 ? <p>No orders found.</p> : orders.map((order, index) => (
        <div key={index} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#aaa" }}>ORDER #{index + 1}</span>
            <span style={{ fontSize: "12px", color: "#4BB543" }}>SUCCESS</span>
          </div>
          <p style={{ fontSize: "18px", margin: "10px 0" }}>₹{order.amount}</p>
          <p style={{ fontSize: "11px", color: "#ccc" }}>Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      ))}
      <button onClick={() => navigate("/home")} style={{ marginTop: "20px", background: "transparent", color: "#fff", border: "1px solid #fff", padding: "10px 25px", borderRadius: "20px", cursor: "pointer" }}>BACK</button>
    </div>
  );
}