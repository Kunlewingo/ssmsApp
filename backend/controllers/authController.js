const Admin = require('../models/adminModel');
const Student = require('../models/studentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendServerError = require('../utils/sendServerError');

// REGISTER ADMIN
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    sendServerError(res, err);
  }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    sendServerError(res, err);
  }
};

// LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, mustChangePassword: !!student.mustChangePassword });
  } catch (err) {
    sendServerError(res, err);
  }
};

// CHANGE PASSWORD (student or admin, self-service)
// Requires the current password so a forced first-login change still proves
// the person actually knows the temporary password they were handed.
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are both required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const Model = req.user.role === 'student' ? Student : Admin;
    const user = await Model.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

    user.password = await bcrypt.hash(newPassword, 10);
    if (req.user.role === 'student') {
      user.mustChangePassword = false;
    }
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    sendServerError(res, err);
  }
};

// GET CURRENT LOGGED-IN USER (admin or student)
exports.getMe = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id).populate('department').select('-password');
      if (!student) return res.status(404).json({ message: 'Student not found' });
      return res.json({ role: 'student', ...student.toObject() });
    }

    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      return res.json({ role: 'admin', ...admin.toObject() });
    }

    res.status(403).json({ message: 'Unknown role' });
  } catch (err) {
    sendServerError(res, err);
  }
};
