<<<<<<< HEAD
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

=======
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to generate Token
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

<<<<<<< HEAD
const normalizeRole = (role) => {
  return String(role || "user")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Public registration (user/vendor/admin only)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = normalizeRole(role);

    // Field agent cannot self-register publicly
    const allowedRoles = ["user", "vendor", "admin"];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        message:
          "Field agents cannot self-register. Only vendors can create field agents.",
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
=======
// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

<<<<<<< HEAD
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
      address: String(address || "").trim(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please login with email, password and OTP.",
      user: {
=======
    // Create user (password is hashed automatically by our Model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "seller", // Default to seller if no role provided
    });

    if (user) {
      res.status(201).json({
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
<<<<<<< HEAD
        address: user.address,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor-only registration for field agent
// @route   POST /api/auth/register-agent
const registerFieldAgentByVendor = async (req, res) => {
  try {
    const vendor = req.user;

    if (!vendor || vendor.role !== "vendor") {
      return res.status(403).json({
        message: "Only a vendor can register a field agent.",
      });
    }

    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({
        message: "Name, email, password and address are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (
        existingUser.role === "field_agent" &&
        existingUser.vendorOwnerEmail &&
        existingUser.vendorOwnerEmail !== String(vendor.email).toLowerCase()
      ) {
        return res.status(400).json({
          message:
            "This field agent is already registered under another vendor.",
        });
      }

      return res.status(400).json({
        message: "A user with this email already exists.",
      });
    }

    const fieldAgent = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: "field_agent",
      address: String(address).trim(),
      vendorOwnerId: vendor._id,
      vendorOwnerEmail: String(vendor.email || "").trim().toLowerCase(),
      vendorOwnerName: String(vendor.name || "Vendor").trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Field agent registered successfully.",
      user: {
        _id: fieldAgent._id,
        name: fieldAgent.name,
        email: fieldAgent.email,
        role: fieldAgent.role,
        address: fieldAgent.address,
        vendorOwnerId: fieldAgent.vendorOwnerId,
        vendorOwnerEmail: fieldAgent.vendorOwnerEmail,
        vendorOwnerName: fieldAgent.vendorOwnerName,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Step 1 login - verify email/password/role and send OTP to email
// @route   POST /api/auth/request-otp
const requestLoginOtp = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = normalizeRole(role);

    const user = await User.findOne({
      email: normalizedEmail,
      role: normalizedRole,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email, password or role",
      });
    }

    const passwordMatched = await user.matchPassword(password);
    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid email, password or role",
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    user.otpHash = otpHash;
    user.otpExpiresAt = expiresAt;
    user.otpVerifiedAt = null;
    user.otpLastSentAt = new Date();
    user.otpAttempts = 0;

    await user.save();

    const subject = "Your ScrapRoute login OTP";
    const text = `Your OTP for ScrapRoute login is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>ScrapRoute Login OTP</h2>
        <p>Hello ${user.name},</p>
        <p>Your OTP for login is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not try to login, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${user.email}`,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Step 2 login - verify OTP and issue token
// @route   POST /api/auth/verify-otp
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        message: "OTP not requested or invalid login session",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "OTP expired. Please request a new OTP",
      });
    }

    const otpMatched = await user.matchOtp(String(otp));
    if (!otpMatched) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpVerifiedAt = new Date();
    user.otpAttempts = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || "",
      vendorOwnerId: user.vendorOwnerId || null,
      vendorOwnerEmail: user.vendorOwnerEmail || "",
      vendorOwnerName: user.vendorOwnerName || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  registerFieldAgentByVendor,
  requestLoginOtp,
  verifyLoginOtp,
};
=======
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
