const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: false // legacy field — no longer populated by the new registration flow
  },
  dateRegistered: {
    type: Date,
    default: Date.now
  },

  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  level: { type: Number, required: true },           // 100, 200, 300, 400, 500
  currentSession: { type: String, required: true },  // e.g. "2025/2026"

  // True until the student changes their admin-issued temporary password.
  mustChangePassword: { type: Boolean, default: true }
});

// SAFE MODEL (prevents overwrite error)
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
