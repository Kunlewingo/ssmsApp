const mongoose = require('mongoose');

const courseRegistrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  session: { type: String, required: true },
  level: { type: Number, required: true },
  semester: { type: String, enum: ['first', 'second'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  courses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    type: { type: String, enum: ['compulsory', 'elective', 'carryover'], required: true },
    units: { type: Number, required: true } // snapshot at time of registration
  }],
  totalUnits: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

courseRegistrationSchema.index({ student: 1, session: 1, semester: 1 }, { unique: true });

module.exports = mongoose.models.CourseRegistration || mongoose.model('CourseRegistration', courseRegistrationSchema);
