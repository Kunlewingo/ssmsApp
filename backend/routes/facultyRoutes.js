const router = require('express').Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), facultyController.addFaculty);
router.get('/', facultyController.getFaculties); // public read — needed for login/registration dropdowns
router.get('/:id', facultyController.getFacultyById);

module.exports = router;
