const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudentById);
router.delete('/:id', studentController.deleteStudentById);

module.exports = router;
