const ClassList = require('../models/classListModel');
const Student = require('../models/studentModel');

class ClassController {
    static async addStudentsToClass(req, res) {
        const { MaNamHoc, MaLop, students } = req.body;
    
        if (!/^\d{4}-\d{4}$/.test(MaNamHoc) || !MaLop || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
    
        try {
            let classExists = await ClassList.isClassAvailable(MaNamHoc, MaLop);
    
            if (!classExists) {
                await ClassList.createClass(MaNamHoc, MaLop);
            }
    
            for (const student of students) {
                await Student.addToClass(student.MaHocSinh, MaNamHoc, MaLop);
            }
    
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

    static async removeStudentFromClass(req, res) {
        const { MaHocSinh, MaNamHoc, MaLop } = req.body;
    
        if (!MaHocSinh || !MaLop || !/^\d{4}-\d{4}$/.test(MaNamHoc)) {
            return res.status(400).json({ message: 'MaHocSinh, MaNamHoc, and MaLop are required' });
        }
    
        try {
            await ClassList.removeStudentFromClass(MaHocSinh, MaNamHoc, MaLop);
            res.status(200).json({ message: 'Student removed from class successfully' });
        } catch (error) {
            console.error('Error in removeStudentFromClass:', error);
            res.status(500).json({ message: 'An error occurred while removing the student' });
        }
    }    
}

module.exports = ClassController;
