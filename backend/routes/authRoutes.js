const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// ADMIN
router.post('/login', authController.loginAdmin);
router.post('/register', authController.registerAdmin);

// STUDENT
router.post('/student-login', authController.loginStudent);

// CURRENT USER (admin or student) — frontend uses this instead of localStorage identity
router.get('/me', authMiddleware, authController.getMe);

// SELF-SERVICE PASSWORD CHANGE (used for forced first-login change too)
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
