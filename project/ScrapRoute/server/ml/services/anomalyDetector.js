function scoreAnomaly(input) {
  let score = 0;
  let reasons = [];

  if ((input.weightKg || 0) > 30) {
    score += 0.5;
    reasons.push("High weight detected");
  }

  if ((input.sellerRating || 0) < 2) {
    score += 0.3;
    reasons.push("Low seller rating");
  }

  let riskLevel = "low";
  if (score > 0.7) riskLevel = "high";
  else if (score > 0.3) riskLevel = "medium";

  return {
    available: true,
    score,
    riskLevel,
    reasons,
  };
}

module.exports = { scoreAnomaly };