const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  { timestamps: true }
)

UserSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs')
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)