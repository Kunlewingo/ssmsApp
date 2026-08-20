const Student = require('../models/studentModel');
const bcrypt = require('bcryptjs');
const sendServerError = require('../utils/sendServerError');
const generateTempPassword = require('../utils/generateTempPassword');

// ADD STUDENT
// The admin no longer sets the student's password directly — a random
// temporary password is generated here, returned once in the response so
// the admin can hand it to the student, and the student is required to
// change it on first login (see mustChangePassword on the model + the
// change-password flow in authController).
exports.addStudent = async (req, res) => {
  try {
    const { password: _ignoredAdminPassword, ...rest } = req.body;

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const student = new Student({ ...rest, password: hashedPassword, mustChangePassword: true });
    await student.save();

    const { password: _pw, ...studentWithoutPassword } = student.toObject();
    res.status(201).json({ ...studentWithoutPassword, temporaryPassword: tempPassword });
  } catch (err) {
    sendServerError(res, err);
  }
};

// GET ALL STUDENTS
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password').populate('department');
    res.json(students);
  } catch (err) {
    sendServerError(res, err);
  }
};

// GET STUDENT BY ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password').populate('department');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    sendServerError(res, err);
  }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
      // A manually-reset password should also be treated as temporary.
      updateData.mustChangePassword = true;
    } else {
      delete updateData.password;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    sendServerError(res, err);
  }
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    sendServerError(res, err);
  }
};
