// controllers/classController.js
const ClassList = require('../models/classListModel');
const Student = require('../models/studentModel');

class ClassController {
    static async addStudentsToClass(req, res) {
        const { MaNamHoc, MaLop, students } = req.body;

        if (!MaNamHoc || !MaLop || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        try {
            // Validate the school year and class
            const classExists = await ClassList.isClassAvailable(MaNamHoc, MaLop);
            if (!classExists) {
                return res.status(404).json({ message: 'Class not found' });
            }

            // Add each student to the class
            for (const student of students) {
                await Student.addToClass(student.MaHocSinh, MaNamHoc, MaLop);
            }

            res.status(200).json({ message: 'Students added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while adding students' });
        }
    }
}

module.exports = ClassController;
