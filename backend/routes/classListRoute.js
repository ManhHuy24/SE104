// routes/class.js
const express = require('express');
const ClassListController = require('../controllers/classListController');

const router = express.Router();

// Route for adding students to a class
router.post('/add-students', ClassListController.addStudentsToClass);

// Route to fetch student-to-class assignments
router.get('/assignments', ClassListController.getAssignments);

// Route for removing a student from a class
router.post('/remove-student', ClassListController.removeStudentFromClass);

module.exports = router;
