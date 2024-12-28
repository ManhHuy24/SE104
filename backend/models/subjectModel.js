const db = require('../config/db'); // MySQL connection pool

class Subject {
  // Fetch all subjects
  static async getAll() {
    try {
      const query = `
        SELECT * FROM MONHOC;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching subjects: ${err.message}`);
    }
  }

  // Add a new subject
  static async add(subject) {
    try {
      const query = `
        INSERT INTO MONHOC (TenMonHoc, DiemDatMonHoc) VALUES (?, ?);
      `;
      const [result] = await db.query(query, [subject.TenMonHoc, subject.DiemDatMonHoc]);
      return result.insertId;
    } catch (err) {
      throw new Error(`Error adding subject: ${err.message}`);
    }
  }

  // Update a subject
  static async update(subject) {
    try {
      const query = `
        UPDATE MONHOC SET TenMonHoc = ?, DiemDatMonHoc = ? WHERE MaMonHoc = ?;
      `;
      const [result] = await db.query(query, [subject.TenMonHoc, subject.DiemDatMonHoc, subject.MaMonHoc]);
      return result.affectedRows;
    } catch (err) {
      throw new Error(`Error updating subject: ${err.message}`);
    }
  }

  // Delete a subject
  static async delete(subjectId) {
    try {
      const query = `
        DELETE FROM MONHOC WHERE MaMonHoc = ?;
      `;
      const [result] = await db.query(query, [subjectId]);
      return result.affectedRows;
    } catch (err) {
      throw new Error(`Error deleting subject: ${err.message}`);
    }
  }
}

module.exports = Subject;
