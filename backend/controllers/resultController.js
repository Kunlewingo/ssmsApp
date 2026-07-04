const Result = require('../models/resultModel');

function calculateGrade(score) {

  if (score >= 80) return 'A';
  else if (score >= 70) return 'B';
  else if (score >= 60) return 'C';
  else if (score >= 50) return 'D';
  else return 'F';
}

exports.addResult = async (req, res) => {

  const grade = calculateGrade(req.body.score);
   const result = new Result({
    student: req.body.student,
    course: req.body.course,
    score: req.body.score,
    grade
  });

  await result.save();

  res.json(result);
};
exports.getResults = async (req, res) => {

  const results = await Result.find();

  res.json(results);
};