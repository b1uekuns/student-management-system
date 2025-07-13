const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    sumCredit: {
      type: Number,
      required: true,
      min: 0,
      max: 158,
    },
    cpa: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
    },
    status: {
      type: String,
      enum: ["Không", "Cảnh báo mức 1", "Cảnh báo mức 2", "Cảnh báo mức 3"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
