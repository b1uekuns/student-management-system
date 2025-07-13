const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

// Lấy danh sách sinh viên
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Lấy thông tin sinh viên theo ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Tạo mới sinh viên
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body)
    const newStudent = await student.save()
    res.status(201).json(newStudent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Cập nhật thông tin sinh viên
router.put('/:id', async (req, res) => {
  try {
    console.log('Update request for student:', req.params.id)
    console.log('Update data:', req.body)

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedStudent) {
      console.log('Student not found')
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
    }

    console.log('Student updated successfully:', updatedStudent)
    res.json(updatedStudent)
  } catch (error) {
    console.error('Update error:', error)
    res.status(400).json({ 
      message: 'Lỗi khi cập nhật sinh viên',
      error: error.message 
    })
  }
})

// Xóa student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
    }
    res.json({ message: 'Xóa sinh viên thành công' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Lấy thông tin sinh viên theo studentId
router.get('/by-student-id/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin sinh viên' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router