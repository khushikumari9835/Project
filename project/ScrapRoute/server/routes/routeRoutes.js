const express = require("express");
const router = express.Router();
const { optimizeAgentRoute } = require("../controllers/routeController");

router.post("/optimize", optimizeAgentRoute);

module.exports = router;