const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteOne({ username: "admin" });

    const admin = new User({
      username: "admin",
      password: "admin123",
      role: "teacher"
    });

    await admin.save();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createTeacher(); 