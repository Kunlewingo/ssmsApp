const Result = require('../models/resultModel');
const sendServerError = require('../utils/sendServerError');

exports.addResult = async (req, res) => {
  try {
    const { student, course, session, level, semester, score, units } = req.body;

    const result = new Result({ student, course, session, level, semester, score, units });
    await result.save();

    const { grade, point } = Result.gradeFromScore(score);
    res.status(201).json({ ...result.toObject(), grade, point });
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getResults = async (req, res) => {
  try {
    const { session, semester, level, studentId } = req.query;
    const filter = {};
    if (session) filter.session = session;
    if (semester) filter.semester = semester;
    if (level) filter.level = level;

    // Students may only ever see their own results
    if (req.user.role === 'student') {
      filter.student = req.user.id;
    } else if (studentId) {
      filter.student = studentId;
    }

    const results = await Result.find(filter)
      .populate('student', 'name email')
      .populate('course', 'courseName courseCode units');

    const withGrades = results.map(r => {
      const { grade, point } = Result.gradeFromScore(r.score);
      return { ...r.toObject(), grade, point };
    });

    res.json(withGrades);
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ message: 'Result deleted successfully' });
  } catch (err) {
    sendServerError(res, err);
  }
};
