const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Put the year route BEFORE the :id route to prevent conflicts
router.get('/year/:year', studentController.getStudentsByYear);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudentById);
router.delete('/:id', studentController.deleteStudentById);

module.exports = router;