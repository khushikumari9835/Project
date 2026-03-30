<<<<<<< HEAD
=======
// server/config/db.js
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
<<<<<<< HEAD
=======
    // You'll put your MONGO_URI in a .env file later
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

<<<<<<< HEAD
module.exports = connectDB;
=======
module.exports = connectDB;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
