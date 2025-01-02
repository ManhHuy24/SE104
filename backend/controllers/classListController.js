const ClassList = require('../models/classListModel');
const Student = require('../models/studentModel');

class ClassController {
    static async addStudentsToClass(req, res) {
        const { MaNamHoc, MaLop, students } = req.body;
    
        // Validate input
        if (!/^\d{4}-\d{4}$/.test(MaNamHoc) || !MaLop || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
    
        try {
            // Check if the class exists, create if not
            let classExists = await ClassList.isClassAvailable(MaNamHoc, MaLop);
            if (!classExists) {
                await ClassList.createClass(MaNamHoc, MaLop);
            }
    
            // Get current SiSo and max SiSo
            const currentSiSo = await ClassList.getClassSiSo(MaNamHoc, MaLop);
            const maxSiSo = await ClassList.getMaxSiSo();
    
            if (currentSiSo + students.length > maxSiSo) {
                return res.status(400).json({
                    message: `Sĩ số cập nhật vượt quá giới hạn cho phép (${maxSiSo}).`,
                });
            }            
    
            // Add students
            for (const student of students) {
                await Student.addToClass(student.MaHocSinh, MaNamHoc, MaLop);
            }
    
            // Update SiSo
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
