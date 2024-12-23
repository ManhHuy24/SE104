const db = require('../config/db'); // MySQL connection pool

const Student = {
  // Fetch all students
  getAll: async () => {
    try {
      const query = `
        SELECT 
          hs.MaHocSinh, hs.TenHocSinh, DATE_FORMAT(hs.NgaySinh, '%d/%m/%Y') AS NgaySinh, hs.DiaChi, hs.Email,
          l.TenLop, kl.TenKhoi, dsl.SiSo
        FROM HOCSINH hs
        JOIN CT_DSL ct ON hs.MaHocSinh = ct.MaHocSinh
        JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
        JOIN LOP l ON dsl.MaLop = l.MaLop
        JOIN KHOILOP kl ON l.MaKhoi = kl.MaKhoi;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      throw new Error('Error fetching students: ' + err.message);
    }
  },

  // Fetch a student by ID
  getById: async (id) => {
    try {
      const query = 'SELECT * FROM HOCSINH WHERE MaHocSinh = ?';
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error fetching student: ' + err.message);
    }
  },

  // Add a new student
  create: async (student) => {
    try {
      const query =
        'INSERT INTO HOCSINH (MaHocSinh, TenHocSinh, NgaySinh, DiaChi, Email) VALUES (?, ?, ?, ?, ?)';
      const [result] = await db.query(query, [
        student.MaHocSinh,
        student.TenHocSinh,
        student.NgaySinh,
        student.DiaChi,
        student.Email,
      ]);
      return result;
    } catch (err) {
      throw new Error('Error adding student: ' + err.message);
    }
  },

  // Update student details
  updateById: async (id, student) => {
    try {
      const query = `
        UPDATE HOCSINH 
        SET TenHocSinh = ?, NgaySinh = ?, DiaChi = ?, Email = ? 
        WHERE MaHocSinh = ?`;
      const [result] = await db.query(query, [
        student.TenHocSinh,
        student.NgaySinh,
        student.DiaChi,
        student.Email,
        id,
      ]);
      return result;
    } catch (err) {
      throw new Error('Error updating student: ' + err.message);
    }
  },

  // Delete a student
  deleteById: async (id) => {
    try {
      const query = 'DELETE FROM HOCSINH WHERE MaHocSinh = ?';
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw new Error('Error deleting student: ' + err.message);
    }
  },
};

module.exports = Student;
