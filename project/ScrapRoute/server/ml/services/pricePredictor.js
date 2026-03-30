const fs = require("fs");
const path = require("path");

const MODEL_PATH = path.join(__dirname, "../artifacts/priceModel.json");

let model = null;

function loadModel() {
  if (!fs.existsSync(MODEL_PATH)) {
    console.log(" priceModel.json not found");
    return null;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(MODEL_PATH, "utf8"));
    console.log("Price model loaded");
    return parsed;
  } catch (error) {
    console.log("Failed to load price model:", error.message);
    return null;
  }
}

model = loadModel();

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function normalizeCondition(value = "") {
  const raw = String(value).trim().toLowerCase();

  if (raw === "excellent") return "Excellent";
  if (raw === "good") return "Good";
  if (raw === "fair") return "Fair";
  if (raw === "poor") return "Poor";
  if (raw === "very poor") return "Very Poor";

  return "Good";
}

function avg(numbers = []) {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function getBasePrice(input) {
  const scrapType = normalizeText(input.scrapType);
  const city = normalizeText(input.city);
  const condition = normalizeCondition(input.condition);

  // Support current pricingMatrix structure
  if (model?.pricingMatrix && model.pricingMatrix[scrapType]) {
    const scrapBlock = model.pricingMatrix[scrapType];

    // 1. Exact city + exact condition
    if (scrapBlock[city] && Number.isFinite(Number(scrapBlock[city][condition]))) {
      return Number(scrapBlock[city][condition]);
    }

    // 2. Exact city + first available condition fallback
    if (scrapBlock[city]) {
      const cityValues = Object.values(scrapBlock[city]).map(Number).filter(Number.isFinite);
      if (cityValues.length) return avg(cityValues);
    }

    // 3. Same condition across all cities
    const conditionValues = Object.values(scrapBlock)
      .map((cityObj) => Number(cityObj?.[condition]))
      .filter(Number.isFinite);

    if (conditionValues.length) {
      return avg(conditionValues);
    }

    // 4. Any value under same scrap type
    const allValues = Object.values(scrapBlock)
      .flatMap((cityObj) => Object.values(cityObj || {}).map(Number))
      .filter(Number.isFinite);

    if (allValues.length) {
      return avg(allValues);
    }
  }

  // Support legacy flat-key model too
  const legacyKey = `${scrapType}_${city}_${condition}`;
  if (model && Number.isFinite(Number(model[legacyKey]))) {
    return Number(model[legacyKey]);
  }

  return Number(model?.defaultPricePerKg || 50);
}

function predictPrice(input = {}) {
  if (!model) {
    model = loadModel();
  }

  if (!model) {
    return {
      available: false,
      message: "Model not loaded",
    };
  }

  const basePrice = getBasePrice(input);

  const weightKg = Number(input.weightKg || 1);
  const pickupDistanceKm = Number(input.pickupDistanceKm || 0);
  const demandIndex = Number(input.demandIndex || 1);
  const sellerRating = Number(input.sellerRating || 3);
  const ageYears = Number(input.ageYears || 0);
  const imageScore = Number(input.imageScore || 1);

  // Dynamic factors
  const weightFactor =
    weightKg <= 1
      ? 0.9
      : weightKg <= 5
      ? 1
      : weightKg <= 12
      ? 1.08
      : weightKg <= 25
      ? 1.18
      : 1.28;

  const distanceFactor =
    pickupDistanceKm <= 3
      ? 1.04
      : pickupDistanceKm <= 7
      ? 1
      : pickupDistanceKm <= 12
      ? 0.95
      : 0.9;

  const demandFactor = Math.max(0.85, Math.min(1.4, demandIndex));

  const ratingFactor =
    sellerRating >= 4.7
      ? 1.06
      : sellerRating >= 4.2
      ? 1.03
      : sellerRating >= 3.5
      ? 1
      : 0.95;

  const ageFactor =
    ageYears <= 1
      ? 1.08
      : ageYears <= 3
      ? 1.03
      : ageYears <= 6
      ? 1
      : ageYears <= 9
      ? 0.94
      : 0.88;

  const imageFactor = Math.max(0.96, Math.min(1.08, imageScore));

  const finalPrice = Math.max(
    5,
    Math.round(
      basePrice *
        weightFactor *
        distanceFactor *
        demandFactor *
        ratingFactor *
        ageFactor *
        imageFactor
    )
  );

  return {
    available: true,
    basePrice: Number(basePrice.toFixed(2)),
    predictedPricePerKg: finalPrice,
    totalEstimatedPrice: Math.round(finalPrice * Math.max(weightKg, 1)),
    factors: {
      weightFactor: Number(weightFactor.toFixed(2)),
      distanceFactor: Number(distanceFactor.toFixed(2)),
      demandFactor: Number(demandFactor.toFixed(2)),
      ratingFactor: Number(ratingFactor.toFixed(2)),
      ageFactor: Number(ageFactor.toFixed(2)),
      imageFactor: Number(imageFactor.toFixed(2)),
    },
  };
}

module.exports = { predictPrice };