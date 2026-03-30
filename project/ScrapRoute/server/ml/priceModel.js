const fs = require("fs");
const path = require("path");

const MODEL_PATH = path.join(__dirname, "artifacts", "priceModel.json");

let model = null;

function loadModel() {
  if (!fs.existsSync(MODEL_PATH)) {
    console.log(" ML model not found. Run training.");
    return null;
  }

  model = JSON.parse(fs.readFileSync(MODEL_PATH));
  console.log(" ML model loaded");
  return model;
}

function predictPrice(input) {
  if (!model) loadModel();
  if (!model) return { available: false };

  const key = `${input.scrapType}_${input.city}_${input.condition}`;
  const price = model[key] || 60;

  return {
    available: true,
    predictedPricePerKg: 70,
    totalEstimatedPrice: 70 * input.weightKg,
  };
}

module.exports = { predictPrice };