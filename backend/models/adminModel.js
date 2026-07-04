const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// SAFE MODEL (prevents overwrite error)
module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);