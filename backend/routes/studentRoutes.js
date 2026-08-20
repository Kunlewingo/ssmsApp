const router = require('express').Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), studentController.addStudent);
router.get('/', authMiddleware, roleMiddleware(['admin']), studentController.getStudents);
router.get('/:id', authMiddleware, studentController.getStudentById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), studentController.updateStudent);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), studentController.deleteStudent);

module.exports = router;
