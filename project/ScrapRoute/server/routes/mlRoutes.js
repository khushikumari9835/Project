const express = require("express");
const router = express.Router();

// ✅ CORRECT PATHS
const { predictPrice } = require("../ml/services/pricePredictor");
const { scoreAnomaly } = require("../ml/services/anomalyDetector");

// Price Prediction
router.post("/predict-price", (req, res) => {
  try {
    console.log("ML REQUEST:", req.body);

    const result = predictPrice(req.body);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

// Anomaly Detection
router.post("/anomaly-score", (req, res) => {
  try {
    const result = scoreAnomaly(req.body);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;