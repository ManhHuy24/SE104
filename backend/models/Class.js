const db = require('../config/db'); // MySQL connection pool

const Class = {
  // Fetch all classes with details
  getAll: async () => {
    const query = `
      SELECT 
        l.MaLop, l.TenLop, kl.TenKhoi, dsl.MaNamHoc, nh.Nam1, nh.Nam2, dsl.SiSo
      FROM LOP l
      JOIN KHOILOP kl ON l.MaKhoi = kl.MaKhoi
      LEFT JOIN DANHSACHLOP dsl ON l.MaLop = dsl.MaLop
      LEFT JOIN NAMHOC nh ON dsl.MaNamHoc = nh.MaNamHoc;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Fetch a single class by ID with details
  getById: async (id) => {
    const query = `
      SELECT 
        l.MaLop, l.TenLop, kl.TenKhoi, dsl.MaNamHoc, nh.Nam1, nh.Nam2, dsl.SiSo
      FROM LOP l
      JOIN KHOILOP kl ON l.MaKhoi = kl.MaKhoi
      LEFT JOIN DANHSACHLOP dsl ON l.MaLop = dsl.MaLop
      LEFT JOIN NAMHOC nh ON dsl.MaNamHoc = nh.MaNamHoc
      WHERE l.MaLop = ?;
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  // Add a new class
  create: async (classData) => {
    // Step 1: Find or create TenKhoi in KHOILOP
    const khoiQuery = 'SELECT MaKhoi FROM KHOILOP WHERE TenKhoi = ?';
    const [khoiResult] = await db.query(khoiQuery, [classData.TenKhoi]);

    let MaKhoi;
    if (khoiResult.length > 0) {
      // If TenKhoi exists, use its MaKhoi
      MaKhoi = khoiResult[0].MaKhoi;
    } else {
      // Otherwise, insert new TenKhoi and retrieve its MaKhoi
      const insertKhoiQuery = 'INSERT INTO KHOILOP (TenKhoi) VALUES (?)';
      const [insertResult] = await db.query(insertKhoiQuery, [classData.TenKhoi]);
      MaKhoi = insertResult.insertId; // Assuming MaKhoi is auto-incremented
    }

    // Step 2: Insert class into LOP
    const classQuery = 'INSERT INTO LOP (TenLop, MaKhoi) VALUES (?, ?)';
    const [result] = await db.query(classQuery, [classData.TenLop, MaKhoi]);

    return result;
  },

  // Update class details by ID
  updateById: async (id, classData) => {
    const query = 'UPDATE LOP SET TenLop = ?, MaKhoi = ? WHERE MaLop = ?';
    const [result] = await db.query(query, [
      classData.TenLop,
      classData.MaKhoi,
      id,
    ]);
    return result;
  },

  // Delete a class by ID
  deleteById: async (id) => {
    const query = 'DELETE FROM LOP WHERE MaLop = ?';
    const [result] = await db.query(query, [id]);
    return result;
  },

  // Get class roster (students in a class)
  getClassRoster: async (classId) => {
    const query = `
      SELECT 
        hs.MaHocSinh, hs.TenHocSinh, DATE_FORMAT(hs.NgaySinh, '%d/%m/%Y') AS NgaySinh, hs.DiaChi, hs.Email
      FROM HOCSINH hs
      JOIN CT_DSL ct ON hs.MaHocSinh = ct.MaHocSinh
      JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
      WHERE dsl.MaLop = ?;
    `;
    const [rows] = await db.query(query, [classId]);
    return rows;
  },
};

module.exports = Class;
