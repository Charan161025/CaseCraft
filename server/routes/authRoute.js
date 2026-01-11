const router = require("express").Router();

const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/get-cart", auth, authController.getCart);
router.post("/save-cart", auth, authController.saveCart);
router.post("/create-razorpay-order", authController.createRazorpayOrder);
router.post("/place-order", auth, authController.placeOrder);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password-otp", authController.resetPasswordWithOTP);
router.get("/me", auth, authController.getMe);
router.get("/get-orders", auth, authController.getOrders);

module.exports = router;