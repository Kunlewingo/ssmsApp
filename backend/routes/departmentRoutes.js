const router = require('express').Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), departmentController.addDepartment);
router.get('/', departmentController.getDepartments);
router.get('/unit-caps', departmentController.getUnitCaps);
router.get('/faculty/:facultyId', departmentController.getDepartmentsByFaculty);

module.exports = router;
