const router = require('express').Router();
const gpaController = require('../controllers/gpaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/semester', authMiddleware, roleMiddleware(['admin', 'student']), gpaController.getSemesterGPA);
router.get('/session', authMiddleware, roleMiddleware(['admin', 'student']), gpaController.getSessionCGPA);
router.get('/cumulative', authMiddleware, roleMiddleware(['admin', 'student']), gpaController.getCumulativeCGPA);

module.exports = router;
