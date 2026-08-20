const router = require('express').Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), resultController.addResult);
router.get('/', authMiddleware, resultController.getResults); // students see only their own (enforced in controller)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), resultController.deleteResult);

module.exports = router;
