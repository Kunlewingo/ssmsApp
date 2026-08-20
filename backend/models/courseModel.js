const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseCode: String,
  description: String,

  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  level: { type: Number, required: true },        // 100, 200, 300, 400, 500
  type: { type: String, enum: ['compulsory', 'elective'], required: true },
  units: { type: Number, required: true },
  semester: { type: String, enum: ['first', 'second'], required: true }
});

// SAFE MODEL
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
