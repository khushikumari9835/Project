const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  verifyProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.route("/").get(getProducts).post(protect, createProduct);
router.route("/verify/:id").put(protect, adminOnly, verifyProduct);

module.exports = router;
=======
// Route for Listing/Creating items
router
  .route("/")
  .get(getProducts) // Public (or protected if you prefer)
  .post(protect, createProduct); // Only logged-in users can upload

// Route for Admin Verification
// usage: PUT /api/products/verify/12345
router.route("/verify/:id").put(protect, adminOnly, verifyProduct); // Protected + Admin Only

module.exports = router;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
