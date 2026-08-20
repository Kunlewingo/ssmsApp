const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  session: { type: String, required: true },     // e.g. "2025/2026"
  level: { type: Number, required: true },
  semester: { type: String, enum: ['first', 'second'], required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  units: { type: Number, required: true }
});

resultSchema.index({ student: 1, course: 1, session: 1, semester: 1 }, { unique: true });

// Derive grade + grade point from score — not stored redundantly, so it can
// never drift out of sync with the score, and grade boundaries can change
// without needing a data migration.
resultSchema.statics.gradeFromScore = function (score) {
  if (score >= 70) return { grade: 'A', point: 5 };
  if (score >= 60) return { grade: 'B', point: 4 };
  if (score >= 50) return { grade: 'C', point: 3 };
  if (score >= 45) return { grade: 'D', point: 2 };
  if (score >= 40) return { grade: 'E', point: 1 };
  return { grade: 'F', point: 0 };
};

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);
