require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
console.log("MONGO_URI:", process.env.MONGO_URI);

async function createStudent() {
  try {
    await mongoose.connect("mongodb+srv://admin:b1uekuns3333@cluster0.dkm1v.mongodb.net/student-management?retryWrites=true&w=majority");

    let studentInfo = await Student.findOne({ studentId: "20231631" });

    if (!studentInfo) {
      studentInfo = new Student({
        studentId: "20020001",
        fullName: "Nguyễn Văn A",
        birthDate: "2005-01-01",
        gender: "Nam",
        phone: "0123456789",
        address: "Hà Nội",
        class: "ED01-K68",
        sumCredit: 30,
        cpa: 3.2,
        status: "Không",
      });
      await studentInfo.save();
    }

    await User.deleteOne({ username: "student" });

    const student = new User({
      username: "student",
      password: "student123",
      role: "student",
      studentId: "20020001",
    });

    await student.save();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createStudent();
