const { optimizeRoute } = require("../services/routeOptimizer");

const optimizeAgentRoute = async (req, res) => {
  try {
    const result = await optimizeRoute(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Route optimization failed",
    });
  }
};

module.exports = {
  optimizeAgentRoute,
};