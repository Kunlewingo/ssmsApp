const router = require('express').Router();
const resultController = require('../controllers/resultController');

router.post('/', resultController.addResult);
router.get('/', resultController.getResults);

module.exports = router;