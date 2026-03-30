const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, minlength: 6 },

=======
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    role: {
      type: String,
      enum: ["user", "vendor", "admin", "field_agent"],
      default: "user",
    },
<<<<<<< HEAD

    // Common profile info
    address: { type: String, default: "", trim: true },

    // Field-agent ownership: once set, agent belongs to one vendor only
    vendorOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    vendorOwnerEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    vendorOwnerName: {
      type: String,
      default: "",
      trim: true,
    },

    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpVerifiedAt: { type: Date, default: null },
    otpLastSentAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  },
  { timestamps: true }
);

<<<<<<< HEAD
// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

=======
// 1. Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

<<<<<<< HEAD
// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Compare OTP
userSchema.methods.matchOtp = async function (enteredOtp) {
  if (!this.otpHash) return false;
  return bcrypt.compare(String(enteredOtp), this.otpHash);
};

module.exports = mongoose.model("User", userSchema);
=======
// 2. Helper method to check if password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
