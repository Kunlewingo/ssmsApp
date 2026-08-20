const Result = require('../models/resultModel');
const { calculateGPA } = require('../utils/gradeCalculator');
const sendServerError = require('../utils/sendServerError');

// Students may only ever query their own GPA. Admins may pass any studentId.
function resolveStudentId(req) {
  return req.user.role === 'student' ? req.user.id : req.query.studentId;
}

exports.getSemesterGPA = async (req, res) => {
  try {
    const studentId = resolveStudentId(req);
    const { session, semester } = req.query;
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const results = await Result.find({ student: studentId, session, semester });
    res.json({ gpa: calculateGPA(results), unitsTaken: results.reduce((s, r) => s + r.units, 0) });
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getSessionCGPA = async (req, res) => {
  try {
    const studentId = resolveStudentId(req);
    const { session } = req.query;
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const results = await Result.find({ student: studentId, session });
    res.json({ cgpa: calculateGPA(results) });
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getCumulativeCGPA = async (req, res) => {
  try {
    const studentId = resolveStudentId(req);
    const { uptoLevel } = req.query;
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const filter = { student: studentId };
    if (uptoLevel) filter.level = { $lte: Number(uptoLevel) };

    const results = await Result.find(filter);
    res.json({ cgpa: calculateGPA(results) });
  } catch (err) {
    sendServerError(res, err);
  }
};
