const Course = require('../models/courseModel');

exports.addCourse = async (req, res) => {

  const course = new Course(req.body);

  await course.save();

  res.json(course);
};
exports.getCourses = async (req, res) => {

  const courses = await Course.find();

  res.json(courses);
};