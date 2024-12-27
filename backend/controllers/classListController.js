const ClassList = require('../models/classListModel');
const Student = require('../models/studentModel');

class ClassController {
    static async addStudentsToClass(req, res) {
        const { MaNamHoc, MaLop, students } = req.body;

        if (!MaNamHoc || !MaLop || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        try {
            // Check if the class-year mapping exists
            let classExists = await ClassList.isClassAvailable(MaNamHoc, MaLop);

            if (!classExists) {
                // Create the class-year mapping if it doesn't exist
                await ClassList.createClass(MaNamHoc, MaLop);
            }

            // Add each student to the class
            for (const student of students) {
                await Student.addToClass(student.MaHocSinh, MaNamHoc, MaLop);
            }

            // Update the class size (SiSo) by recounting students in the database
            await ClassList.updateSiSo(MaNamHoc, MaLop);

            res.status(200).json({ message: 'Students added successfully' });
        } catch (error) {
            console.error('Error in addStudentsToClass:', error);
            res.status(500).json({ message: 'An error occurred while adding students' });
        }
    }

    static async getAssignments(req, res) {
        try {
          const assignments = await ClassList.getAssignments();
          res.status(200).json(assignments);
        } catch (error) {
          console.error('Error fetching student assignments:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = ClassController;
