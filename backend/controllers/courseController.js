const Course = require('../models/courseModel');
const sendServerError = require('../utils/sendServerError');

exports.addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    sendServerError(res, err);
  }
};

// ADMIN-ONLY: edit an existing course's details.
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, courseCode, description, department, level, type, units, semester } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, courseCode, description, department, level, type, units, semester },
      { new: true, runValidators: true }
    ).populate('department');

    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    sendServerError(res, err);
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('department');
    res.json(courses);
  } catch (err) {
    sendServerError(res, err);
  }
};

// Filtered fetch used by the student registration flow and admin result entry:
// only the courses relevant to a given department/level/semester.
exports.getCoursesByDepartment = async (req, res) => {
  try {
    const { departmentId, level, semester } = req.query;
    const filter = { department: departmentId };
    if (level) filter.level = level;
    if (semester) filter.semester = semester;
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    sendServerError(res, err);
  }
};
