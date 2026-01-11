import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Customize from "./pages/Customize";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Logout from "./pages/Logout"; 
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
       
        <Route path="/home" element={<Home />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/forgot" element={<ForgotPassword />} />
       
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;