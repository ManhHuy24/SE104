// routes/class.js
const express = require('express');
const ClassListController = require('../controllers/classListController');

const router = express.Router();

// Route for adding students to a class
router.post('/add-students', ClassListController.addStudentsToClass);

module.exports = router;
