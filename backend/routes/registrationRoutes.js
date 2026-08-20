const router = require('express').Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['student']), registrationController.registerCourses);
router.get('/', authMiddleware, registrationController.getRegistration);
router.get('/all', authMiddleware, roleMiddleware(['admin']), registrationController.getAllRegistrations);

module.exports = router;
