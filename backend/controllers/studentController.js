const Student = require('../models/studentModel');

const studentController = {
  // Fetch all students
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.getAll();
      res.status(200).json(students);
    } catch (error) {
      console.error(`Error fetching students: ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch students' });
    }
  },

  // Fetch students by year
  getStudentsByYear: async (req, res) => {
    try {
      const { year } = req.params;
      console.log('Received year parameter:', year);

      if (!year || !year.includes('-')) {
        return res.status(400).json({
          message: 'Invalid year format. Expected format: YYYY-YYYY'
        });
      }

      const students = await Student.getByYear(year);
      console.log('Found students:', students.length);

      if (!students || students.length === 0) {
        return res.status(404).json({
          message: `No students found for the school year ${year}`
        });
      }

      res.status(200).json(students);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  },


  // Fetch a student by ID
  getStudentById: async (req, res) => {
    try {
      const student = await Student.getById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json(student);
    } catch (error) {
      console.error(`Error fetching student: ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch student' });
    }
  },

  // Add a new student
  createStudent: async (req, res) => {
    try {
      const newStudent = req.body;
      const result = await Student.create(newStudent);
      res.status(201).json({ id: result.insertId, message: 'Student added successfully' });
    } catch (error) {
      console.error(`Error adding student: ${error.message}`);
      res.status(500).json({ message: 'Failed to add student' });
    }
  },

  // Update student details
  updateStudentById: async (req, res) => {
    try {
      const updatedStudent = req.body;
      const result = await Student.updateById(req.params.id, updatedStudent);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
      console.error(`Error updating student: ${error.message}`);
      res.status(500).json({ message: 'Failed to update student' });
    }
  },

  // Delete a student
  deleteStudentById: async (req, res) => {
    try {
      const result = await Student.deleteById(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error(`Error deleting student: ${error.message}`);
      res.status(500).json({ message: 'Failed to delete student' });
    }
  },
};

module.exports = studentController;
