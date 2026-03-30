import axios from "axios";

const API_BASE = "http://localhost:5000/api/ml";

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeScrapType(category = "") {
  const c = String(category).trim().toLowerCase();

  if (
    ["laptop", "mobile phone", "charger", "battery", "mouse", "keyboard", "tv"].includes(c)
  ) {
    return "ewaste";
  }

  if (["plastic"].includes(c)) return "plastic";
  if (["paper", "cardboard"].includes(c)) return "paper";
  if (["metal", "iron", "aluminium", "copper"].includes(c)) return "metal";
  if (["glass"].includes(c)) return "glass";

  return "mixed";
}

export function extractCityFromAddress(address = "") {
  const raw = String(address).trim();
  if (!raw) return "delhi";

  const lower = raw.toLowerCase();

  if (lower.includes("delhi")) return "delhi";
  if (lower.includes("mumbai")) return "mumbai";
  if (lower.includes("bangalore") || lower.includes("bengaluru")) return "bangalore";
  if (lower.includes("hyderabad")) return "hyderabad";
  if (lower.includes("kochi")) return "bangalore";
  if (lower.includes("chennai")) return "hyderabad";
  if (lower.includes("pune")) return "mumbai";

  return "delhi";
}

function estimateWeightKg(form = {}) {
  const category = String(form.category || "").trim().toLowerCase();
  const model = String(form.model || "").trim().toLowerCase();
  const description = String(form.description || "").trim().toLowerCase();
  const currentYear = new Date().getFullYear();
  const purchaseYear = safeNumber(form.year, currentYear);
  const ageYears = Math.max(0, currentYear - purchaseYear);

  let weightKg = 5;

  if (category === "tv") weightKg = 12;
  else if (category === "laptop") weightKg = 3;
  else if (category === "battery") weightKg = 6;
  else if (category === "charger") weightKg = 1;
  else if (category === "mobile phone") weightKg = 1;
  else if (category === "keyboard") weightKg = 1;
  else if (category === "mouse") weightKg = 1;

  if (description.includes("large") || description.includes("heavy")) weightKg += 2;
  if (description.includes("small") || description.includes("compact")) weightKg -= 0.5;
  if (model.includes("pro") || model.includes("plus")) weightKg += 0.5;
  if (ageYears > 8) weightKg += 1;

  return Math.max(0.5, Number(weightKg.toFixed(1)));
}

function estimatePickupDistanceKm(address = "", city = "delhi") {
  const lower = String(address || "").toLowerCase();

  if (lower.includes("near") || lower.includes("metro") || lower.includes("station")) {
    return 3;
  }

  if (lower.includes("phase") || lower.includes("sector")) {
    return 6;
  }

  if (lower.includes("village") || lower.includes("outskirts")) {
    return 11;
  }

  if (city === "mumbai") return 7;
  if (city === "bangalore") return 6;
  if (city === "hyderabad") return 5;

  return 5;
}

function estimateDemandIndex(form = {}, city = "delhi") {
  const scrapType = normalizeScrapType(form.category);
  const condition = String(form.condition || "Good").trim();

  let demand = 1;

  if (scrapType === "ewaste") demand += 0.35;
  if (scrapType === "metal") demand += 0.15;
  if (scrapType === "paper") demand -= 0.1;

  if (condition === "Good") demand += 0.12;
  if (condition === "Poor") demand -= 0.08;
  if (condition === "Very Poor") demand -= 0.14;

  if (city === "mumbai") demand += 0.1;
  if (city === "bangalore") demand += 0.08;
  if (city === "hyderabad") demand += 0.04;

  return Number(Math.max(0.75, Math.min(1.6, demand)).toFixed(2));
}

function estimateSellerRating(form = {}, imageViews = {}) {
  let score = 3.6;

  if (String(form.description || "").trim().length > 30) score += 0.2;
  if (String(form.pickupAddress || "").trim().length > 10) score += 0.1;
  if (String(form.model || "").trim().length > 2) score += 0.1;

  const imageCount = ["front", "rear", "back"].filter((k) => imageViews?.[k]).length;
  score += imageCount * 0.2;

  if (String(form.condition || "").trim() === "Good") score += 0.1;
  if (String(form.condition || "").trim() === "Poor") score -= 0.1;
  if (String(form.condition || "").trim() === "Very Poor") score -= 0.15;

  return Number(Math.max(2.5, Math.min(4.9, score)).toFixed(1));
}

function estimateImageScore(imageViews = {}) {
  const imageCount = ["front", "rear", "back"].filter((k) => imageViews?.[k]).length;

  if (imageCount === 3) return 1.06;
  if (imageCount === 2) return 1.03;
  if (imageCount === 1) return 1.0;

  return 0.97;
}

export function buildMlPayload(form = {}, imageViews = {}) {
  const currentYear = new Date().getFullYear();
  const purchaseYear = safeNumber(form.year, currentYear);
  const ageYears = Math.max(0, currentYear - purchaseYear);
  const city = extractCityFromAddress(form.pickupAddress);

  const conditionMap = {
    "Very Poor": "Poor",
    Poor: "Poor",
    Fair: "Fair",
    Good: "Good",
    Excellent: "Excellent",
  };

  return {
    scrapType: normalizeScrapType(form.category),
    city,
    condition: conditionMap[form.condition] || "Good",
    weightKg: estimateWeightKg(form),
    pickupDistanceKm: estimatePickupDistanceKm(form.pickupAddress, city),
    demandIndex: estimateDemandIndex(form, city),
    sellerRating: estimateSellerRating(form, imageViews),
    ageYears,
    imageScore: estimateImageScore(imageViews),
  };
}

export async function fetchPricePrediction(payload) {
  try {
    const { data } = await axios.post(`${API_BASE}/predict-price`, payload);
    return data;
  } catch (error) {
    return {
      available: false,
      message: error.response?.data?.message || "Price prediction unavailable",
    };
  }
}

export async function fetchAnomalyScore(payload, declaredPricePerKg) {
  try {
    const { data } = await axios.post(`${API_BASE}/anomaly-score`, {
      ...payload,
      declaredPricePerKg,
    });
    return data;
  } catch (error) {
    return {
      available: false,
      message: error.response?.data?.message || "Anomaly scoring unavailable",
    };
  }
}

export async function getAiInsightsForUpload(form = {}, imageViews = {}) {
  const payload = buildMlPayload(form, imageViews);

  const [prediction, anomaly] = await Promise.all([
    fetchPricePrediction(payload),
    fetchAnomalyScore(payload, 0),
  ]);

  return {
    payload,
    prediction,
    anomaly,
  };
}