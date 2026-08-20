const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  durationYears: { type: Number, enum: [4, 5], default: 4 }, // 5 = has a 500L (e.g. Engineering)
  electiveRules: {
    min: { type: Number, default: 2 },
    max: { type: Number, default: 3 }
  }
  // maxUnitsPerSemester intentionally NOT here — derived globally from LEVEL_UNIT_CAPS by student level
});

departmentSchema.index({ name: 1, faculty: 1 }, { unique: true });

module.exports = mongoose.models.Department || mongoose.model('Department', departmentSchema);
