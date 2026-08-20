const router = require('express').Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), courseController.addCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);
router.get('/', courseController.getCourses);
router.get('/filter', courseController.getCoursesByDepartment);

module.exports = router;