const express = require("express");
const router = express.Router();
<<<<<<< HEAD

const {
  registerUser,
  registerFieldAgentByVendor,
  requestLoginOtp,
  verifyLoginOtp,
} = require("../controllers/authController");
const { protect, vendorOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/register-agent", protect, vendorOnly, registerFieldAgentByVendor);
router.post("/request-otp", requestLoginOtp);
router.post("/verify-otp", verifyLoginOtp);

module.exports = router;
=======
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
