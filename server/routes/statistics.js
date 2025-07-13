const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Student.distinct('class').length;

    res.json({
      totalStudents,
      totalClasses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;