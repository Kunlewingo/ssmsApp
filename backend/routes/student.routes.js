const express = require('express');
const router = express.Router();

// GET all students
router.get('/', (req, res) => {
  res.json([
    {
      name: 'John Doe',
      regNumber: 'SSMS001'
    }
  ]);
});

module.exports = router;