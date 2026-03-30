const NUMERIC_FIELDS = [
  "weightKg",
  "pickupDistanceKm",
  "demandIndex",
  "sellerRating",
];

const CATEGORICAL_FIELDS = ["scrapType", "city", "condition"];

const DEFAULT_INPUT = {
  weightKg: 1,
  pickupDistanceKm: 1,
  demandIndex: 1,
  sellerRating: 3,
  scrapType: "mixed",
  city: "delhi",
  condition: "Good",
};

module.exports = {
  NUMERIC_FIELDS,
  CATEGORICAL_FIELDS,
  DEFAULT_INPUT,
};