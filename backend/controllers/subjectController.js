const Subject = require('../models/subjectModel');

exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.getAll();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addSubject = async (req, res) => {
    try {
        const result = await Subject.add(req.body);
        res.json({ message: 'Subject added', subjectId: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateSubject = async (req, res) => {
    try {
        const result = await Subject.update(req.body);
        res.json({ message: 'Subject updated', affectedRows: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSubject = async (req, res) => {
    try {
        const result = await Subject.delete(req.body.MaMonHoc);
        res.json({ message: 'Subject deleted', affectedRows: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}