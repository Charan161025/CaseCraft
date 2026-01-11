require('dotenv').config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, 
  },
});


const sendOrderEmail = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: `"SIGMA CASES" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: "Order Confirmed - Your Sigma Case is in Production!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 30px; border-radius: 15px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; border-bottom: 2px solid #fff; padding-bottom: 10px;">SIGMA CASES</h1>
        <p>Your payment was successful!</p>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Amount Paid:</strong> ₹${orderDetails.amount}</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Nodemailer Error:", error);
  }
};



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
        name, 
        email, 
        password: hashedPassword,
        cart: [],
        orders: []
    });
    
    await user.save();

   
    res.status(201).json({ message: "Registration successful!" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};



exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

exports.saveCart = async (req, res) => {
  try {
    const { cart } = req.body;
    await User.findByIdAndUpdate(req.user.id, { cart });
    res.json({ message: "Cart synced successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save cart" });
  }
};



exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Razorpay Order creation failed" });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    const user = await User.findById(req.user.id);

    const newOrder = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: amount,
      items: user.cart,
      createdAt: new Date()
    };

    await User.findByIdAndUpdate(req.user.id, {
      $push: { orders: newOrder },
      $set: { cart: [] } 
    });

    await sendOrderEmail(user.email, newOrder);
    res.status(200).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Order recording failed" });
  }
};






exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    
    if (user.resetOTP && user.resetOTPExpires > new Date()) {
        return res.status(200).json({ message: "OTP already sent. Please check email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 Min expiry
    await user.save();

    await transporter.sendMail({
      from: `"SIGMA CASES" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<h3>Your OTP is: ${otp}</h3><p>Valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Reset password request for:", email);

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: new Date() }, 
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Reset failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};


exports.getOrders = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      orders: user.orders 
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error while fetching orders" });
  }
};