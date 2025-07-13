const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Tìm user và check role
    const user = await User.findOne({ 
      username,
      role: 'teacher'
    })

    if (!user) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' })
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' })
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Trả về thông tin user (không bao gồm password)
    const userResponse = {
      id: user._id,
      username: user.username,
      role: user.role
    }

    res.json({ token, user: userResponse })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}