<<<<<<< HEAD
=======
// server/models/Product.js
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "User",
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  // Existing field - treat this as seller entered price per kg
  price: { type: Number, required: true },

  images: [String],
  condition: {
    type: String,
    required: true,
    enum: ["Poor", "Fair", "Good", "Excellent"],
    default: "Good",
  },

  // New ML-friendly fields
  scrapType: {
    type: String,
    enum: [
      "plastic",
      "paper",
      "metal",
      "ewaste",
      "glass",
      "mixed"
    ],
    default: "mixed",
  },

  weightKg: { type: Number, default: 1 },
  city: { type: String, default: "delhi" },
  pickupDistanceKm: { type: Number, default: 1 },
  demandIndex: { type: Number, default: 1 }, // 0.5 to 2 is reasonable
  sellerRating: { type: Number, default: 3 }, // 1 to 5

  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  // AI outputs
  aiEstimatedPricePerKg: { type: Number, default: null },
  aiEstimatedTotal: { type: Number, default: null },
  anomalyScore: { type: Number, default: null },
  anomalyRisk: {
    type: String,
    enum: ["low", "medium", "high", null],
    default: null,
  },
  anomalyReasons: [{ type: String }],

=======
    ref: "User", // Links to the User who sold it
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String], // Array of image URLs
  condition: { type: String, required: true }, // e.g., 'Good', 'Fair'

  // This is the heart of ScrapRoute:
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending", // Default is ALWAYS pending until Admin sees it
  },

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  isSold: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

<<<<<<< HEAD
module.exports = mongoose.model("Product", productSchema);
=======
module.exports = mongoose.model("Product", productSchema);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
