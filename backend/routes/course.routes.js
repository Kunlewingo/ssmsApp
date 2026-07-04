const express = require('express');
const router = express.Router();

// GET all courses
router.get('/', (req, res) => {
  res.json([
    {
      code: 'CSC101',
      title: 'Introduction to Computer Science'
    }
  ]);
});

module.exports = router;