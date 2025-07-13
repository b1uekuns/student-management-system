const Student = require('../models/Student')

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên' })
  }
}

// Create student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body)
    const newStudent = await student.save()
    res.status(201).json(newStudent)
  } catch (error) {
    console.error('Create student error:', error)
    if (error.code === 11000) {
      res.status(400).json({ message: 'MSSV đã tồn tại' })
    } else {
      res.status(500).json({ message: 'Lỗi khi thêm sinh viên' })
    }
  }
}

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
    }
    res.json({ message: 'Xóa sinh viên thành công' })
  } catch (error) {
    console.error('Delete student error:', error)
    res.status(500).json({ message: 'Lỗi khi xóa sinh viên' })
  }
}

module.exports = studentController