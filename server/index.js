const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const rateLimit=require("express-rate-limit");


const app = express();
const path= require("path");

dotenv.config();

app.use((req, res, next) => {
 

  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );

  
  next();
});






const limiter = rateLimit({
 windowMs: 15 * 60 *1000,
 max: 60,
 skip: (req) => req.method === 'OPTIONS',
 standardHeaders: true,
 legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(limiter);


app.use(express.json());
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));


app.use("/api/auth", require("./routes/authRoute"));
app.get("*index", (req, res) => {res.sendFile(path.join(__dirname, "../client/dist/index.html"))});


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log("Mongo Error:", err));


const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});