const CourseRegistration = require('../models/CourseRegistration');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
const { LEVEL_UNIT_CAPS } = require('../utils/unitCaps');
const { getOutstandingCarryovers } = require('../utils/gradeCalculator');
const sendServerError = require('../utils/sendServerError');

// STUDENT registers courses for a semester.
// studentId is ALWAYS taken from the verified token (req.user.id), never
// from the request body — prevents a student from registering on someone
// else's behalf by tampering with the payload.
exports.registerCourses = async (req, res) => {
  try {
    const { session, semester, electiveCourseIds } = req.body;
    const studentId = req.user.id;

    const student = await Student.findById(studentId).populate('department');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const department = student.department;
    const level = student.level;
    const maxUnits = LEVEL_UNIT_CAPS[level];

    if (!maxUnits) {
      return res.status(400).json({ message: `No unit cap configured for level ${level}.` });
    }

    const compulsory = await Course.find({ department: department._id, level, semester, type: 'compulsory' });
    const electives = await Course.find({
      _id: { $in: electiveCourseIds || [] }, department: department._id, level, semester, type: 'elective'
    });

    if (electives.length !== (electiveCourseIds || []).length) {
      return res.status(400).json({ message: 'One or more electives are invalid for this level/semester.' });
    }

    const { min, max } = department.electiveRules; // e.g. 2–3
    if ((electiveCourseIds || []).length < min || (electiveCourseIds || []).length > max) {
      return res.status(400).json({ message: `Choose between ${min} and ${max} electives.` });
    }

    const carryovers = (await getOutstandingCarryovers(studentId))
      .filter(r => r.course.semester === semester);

    const courses = [
      ...compulsory.map(c => ({ course: c._id, type: 'compulsory', units: c.units })),
      ...electives.map(c => ({ course: c._id, type: 'elective', units: c.units })),
      ...carryovers.map(r => ({ course: r.course._id, type: 'carryover', units: r.units }))
    ];

    const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);
    const overCap = totalUnits > maxUnits;

    // Only carryovers are allowed to push past the cap (a student can't
    // refuse a carryover). If over cap with no carryovers involved, block it.
    if (overCap && carryovers.length === 0) {
      return res.status(400).json({
        message: `Total units (${totalUnits}) exceed the ${maxUnits}-unit cap for level ${level}.`
      });
    }

    const registration = await CourseRegistration.findOneAndUpdate(
      { student: studentId, session, semester },
      { level, department: department._id, courses, totalUnits },
      { upsert: true, new: true }
    ).populate('courses.course department');

    res.status(200).json({
      registration,
      warning: overCap ? `Total units (${totalUnits}) exceed the ${maxUnits}-unit cap due to carryovers.` : null
    });
  } catch (err) {
    sendServerError(res, err);
  }
};

// Get a single registration. Students may only fetch their own; admins may
// pass any studentId as a query param.
exports.getRegistration = async (req, res) => {
  try {
    const { session, semester } = req.query;
    const studentId = req.user.role === 'student' ? req.user.id : req.query.studentId;

    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const registration = await CourseRegistration.findOne({ student: studentId, session, semester })
      .populate('courses.course department');
    res.json(registration);
  } catch (err) {
    sendServerError(res, err);
  }
};

// ADMIN-ONLY: list/filter all registrations across all students.
// Now also supports filtering by a single studentId — used by the new
// student-profile admin view to show one student's full registration history.
exports.getAllRegistrations = async (req, res) => {
  try {
    const { session, semester, department, level, studentId } = req.query;
    const filter = {};
    if (session) filter.session = session;
    if (semester) filter.semester = semester;
    if (department) filter.department = department;
    if (level) filter.level = level;
    if (studentId) filter.student = studentId;

    const registrations = await CourseRegistration.find(filter)
      .populate('student', 'name email')
      .populate('department', 'name')
      .populate('courses.course', 'courseName courseCode units')
      .sort({ session: -1, semester: 1 });

    res.json(registrations);
  } catch (err) {
    sendServerError(res, err);
  }
};
