const Product = require("../models/Product");
<<<<<<< HEAD
const { predictPrice } = require("../ml/services/pricePredictor");
const { scoreAnomaly } = require("../ml/services/anomalyDetector");
=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

// @desc    Create a product (Seller only)
// @route   POST /api/products
const createProduct = async (req, res) => {
<<<<<<< HEAD
  const {
    title,
    description,
    price,
    condition,
    images,
    scrapType,
    weightKg,
    city,
    pickupDistanceKm,
    demandIndex,
    sellerRating,
  } = req.body;

  try {
    const prediction = predictPrice({
      scrapType,
      city,
      condition,
      weightKg,
      pickupDistanceKm,
      demandIndex,
      sellerRating,
    });

    const anomaly = scoreAnomaly({
      scrapType,
      city,
      condition,
      weightKg,
      pickupDistanceKm,
      demandIndex,
      sellerRating,
      declaredPricePerKg: price,
    });

    const product = new Product({
      seller: req.user._id,
=======
  const { title, description, price, condition, images } = req.body;

  try {
    const product = new Product({
      seller: req.user._id, // Gets ID from the token (authMiddleware)
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      title,
      description,
      price,
      condition,
      images,
<<<<<<< HEAD
      scrapType,
      weightKg,
      city,
      pickupDistanceKm,
      demandIndex,
      sellerRating,
      verificationStatus: "pending",
      aiEstimatedPricePerKg: prediction.available
        ? prediction.predictedPricePerKg
        : null,
      aiEstimatedTotal: prediction.available
        ? prediction.totalEstimatedPrice
        : null,
      anomalyScore: anomaly.available ? anomaly.score : null,
      anomalyRisk: anomaly.available ? anomaly.riskLevel : null,
      anomalyReasons: anomaly.available ? anomaly.reasons : [],
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res
=======
      verificationStatus: "pending", // Default status
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      .status(500)
      .json({ message: "Product creation failed", error: error.message });
  }
};

<<<<<<< HEAD
// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { status, risk } = req.query;

    const query = {};
    if (status) query.verificationStatus = status;
    if (risk) query.anomalyRisk = risk;

    const products = await Product.find(query).populate("seller", "name email");
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
=======
// @desc    Get all products (For Admin & Vendor)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // If user is Admin, they see ALL products (including pending)
    // If user is Vendor, they ONLY see 'verified' products
    // We handle this logic here or via query params.
    // For simplicity now: Admin dashboard calls with ?status=pending
    // Vendor dashboard calls with ?status=verified

    const { status } = req.query;

    let query = {};
    if (status) {
      query.verificationStatus = status;
    }

    // Populate adds the Seller's name and email to the result
    const products = await Product.find(query).populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  }
};

// @desc    Verify or Reject a product (Admin only)
// @route   PUT /api/products/verify/:id
const verifyProduct = async (req, res) => {
<<<<<<< HEAD
  const { status } = req.body;
=======
  const { status } = req.body; // Expecting 'verified' or 'rejected'
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  try {
    const product = await Product.findById(req.params.id);

<<<<<<< HEAD
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.verificationStatus = status;
    const updatedProduct = await product.save();

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  verifyProduct,
};
=======
    if (product) {
      product.verificationStatus = status;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = { createProduct, getProducts, verifyProduct };
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
