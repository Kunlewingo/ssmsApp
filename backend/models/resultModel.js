const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: String,
  course: String,
  score: Number,
  grade: String
});

// SAFE MODEL
module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);