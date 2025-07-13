const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username });

    // Tìm user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    // So sánh password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    // Tạo token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        studentId: user.studentId
      },
      process.env.JWT_SECRET || 'student_management_secret_key_123',
      { expiresIn: "1d" }
    );

    // Trả về response
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        studentId: user.studentId
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
