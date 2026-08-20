const Result = require('../models/resultModel');

function calculateGPA(results) {
  let totalPoints = 0;
  let totalUnits = 0;
  for (const r of results) {
    const { point } = Result.gradeFromScore(r.score);
    totalPoints += point * r.units;
    totalUnits += r.units;
  }
  return totalUnits === 0 ? 0 : +(totalPoints / totalUnits).toFixed(2);
}

async function getOutstandingCarryovers(studentId) {
  const allResults = await Result.find({ student: studentId }).populate('course');
  const latestByCourse = {};
  for (const r of allResults) {
    const key = r.course._id.toString();
    if (!latestByCourse[key] || r.session > latestByCourse[key].session) {
      latestByCourse[key] = r;
    }
  }
  return Object.values(latestByCourse).filter(r => Result.gradeFromScore(r.score).point === 0);
}

module.exports = { calculateGPA, getOutstandingCarryovers };
