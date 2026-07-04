const router = require('express').Router();
const studentController = require('../controllers/studentController');

// CREATE
router.post('/', studentController.addStudent);

// READ
router.get('/', studentController.getStudents);

// UPDATE
router.put('/:id', studentController.updateStudent);

// DELETE
router.delete('/:id', studentController.deleteStudent);

module.exports = router;