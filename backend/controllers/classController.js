const Class = require('../models/Class');

class ClassController {
  // Get all classes
  static async getAllClasses(req, res) {
    try {
      const classes = await Class.getAll();
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Get class by ID
  static async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classData = await Class.getById(id);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json(classData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Add a new class
  static async addClass(req, res) {
    try {
      const { TenLop, TenKhoi } = req.body;

      // Validate the input data
      if (!TenLop || !TenKhoi) {
        return res.status(400).json({ error: 'Missing required fields: TenLop, TenKhoi' });
      }

      const result = await Class.create({ TenLop, TenKhoi });
      res.status(201).json({ message: 'Class added successfully', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update class by ID
  static async updateClass(req, res) {
    try {
      const { id } = req.params;
      const classData = req.body;
      const result = await Class.updateById(id, classData);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete class by ID
  static async deleteClass(req, res) {
    try {
      const { id } = req.params;
      const result = await Class.deleteById(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ClassController;
