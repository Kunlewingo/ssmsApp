const router = require('express').Router();
const courseController = require('../controllers/courseController');

router.post('/', courseController.addCourse);
router.get('/', courseController.getCourses);

module.exports = router;