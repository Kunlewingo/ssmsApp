const router = require('express').Router();
const authController = require('../controllers/authController');

// LOGIN ADMIN
router.post('/login', authController.loginAdmin);

// REGISTER ADMIN (optional but useful)
router.post('/register', authController.registerAdmin);

module.exports = router;