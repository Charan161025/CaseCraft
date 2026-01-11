const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique: true },
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
  resetOTP: { type : String},
  resetOTPExpires: { type : Date },
  
 orders: {
  type: [
    {
      orderId: String,
      paymentId: String,
      signature: String,
      amount: Number,
      items: Array,
      status: { type: String, default: "Success" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  default: []
}
}, { timestamps: true,
     autoIndex: true,
 });
 mongoose.models={};

module.exports = mongoose.model("User", UserSchema);