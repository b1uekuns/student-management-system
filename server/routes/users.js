const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Lấy danh sách tài khoản sinh viên
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo tài khoản sinh viên mới
router.post("/students", async (req, res) => {
  try {
    const { username, password, studentId } = req.body;

    // Kiểm tra studentId đã tồn tại trong bảng User chưa
    const existingUser = await User.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ message: "MSSV đã được sử dụng cho tài khoản khác" });
    }

    // Kiểm tra studentId có tồn tại trong bảng Student không
    const Student = require('../models/Student');
    const studentInfo = await Student.findOne({ studentId });
    if (!studentInfo) {
      return res.status(400).json({ message: "MSSV không tồn tại trong hệ thống" });
    }

    // Tạo tài khoản mới
    const student = new User({
      username,
      password,
      role: "student",
      studentId
    });

    await student.save();
    
    // Trả về thông tin không bao gồm password
    const { password: _, ...studentData } = student.toObject();
    res.status(201).json(studentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật tài khoản sinh viên
router.put("/students/:id", async (req, res) => {
  try {
    const { username, password, studentId } = req.body;
    const updateData = { username, studentId };

    // Nếu có password mới thì hash password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const student = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa tài khoản sinh viên
router.delete("/students/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    res.json({ message: "Đã xóa tài khoản" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 