const { predictPrice } = require("../ml/services/pricePredictor");
const { scoreAnomaly } = require("../ml/services/anomalyDetector");

const predictPriceApi = async (req, res) => {
  try {
    const result = predictPrice(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const anomalyScoreApi = async (req, res) => {
  try {
    const result = scoreAnomaly(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  predictPriceApi,
  anomalyScoreApi,
};