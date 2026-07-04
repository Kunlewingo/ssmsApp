const router = require('express').Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth.middleware');

// GET RESULTS
router.get('/', auth, async (req, res) => {
  const results = await Result.find().populate('studentId');
  res.json(results);
});

// ADD RESULT + AUTO GRADE
router.post('/', auth, async (req, res) => {
  const { studentId, score } = req.body;

  let grade = "F";
  if (score >= 70) grade = "A";
  else if (score >= 60) grade = "B";
  else if (score >= 50) grade = "C";

  const result = await Result.create({
    studentId,
    score,
    grade
  });

  res.json(result);
});

module.exports = router;