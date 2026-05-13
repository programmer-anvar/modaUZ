const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

const bcrypt = require('bcryptjs')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan!' })
    }

    // Parolni bu yerda shifrlаymiz
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    console.log('Yangi foydalanuvchi:', user.name)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.log('Register xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Email yoki parol noto\'g\'ri!' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Email yoki parol noto\'g\'ri!' })
    }

    console.log('Login muvaffaqiyatli:', user.name)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (error) {
    console.log('Login xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login, getProfile }