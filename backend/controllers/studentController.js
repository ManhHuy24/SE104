const Student = require('../models/studentModel');

const studentController = {
  // Fetch all students
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.getAll();
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
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
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Add a new student
  createStudent: async (req, res) => {
    try {
      const newStudent = req.body;
      const result = await Student.create(newStudent);
      res.status(201).json({ id: result.insertId, message: 'Student added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
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
      console.error(error);
      res.status(500).json({ message: error.message });
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
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = studentController;
