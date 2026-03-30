<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const mlRoutes = require("./routes/mlRoutes");
const routeRoutes = require("./routes/routeRoutes");
const { ensureMlArtifacts } = require("./ml/bootstrap");

dotenv.config();

connectDB();
ensureMlArtifacts();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ScrapRoute API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/route", routeRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  return res.status(500).json({
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Load config
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows app to accept JSON data
app.use(cors()); // Allows frontend to talk to backend
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Simple Route to test
app.get("/", (req, res) => {
  res.send("ScrapRoute API is running...");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
// We will add Routes here later, like:
// app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
