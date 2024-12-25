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
    const connection = await db.getConnection();
        
        try {
          await connection.beginTransaction();

          // Log the deletion attempt
          console.log('Starting deletion process for class ID:', id);

          // First verify the class exists
          const [classExists] = await connection.query(
              'SELECT MaLop FROM LOP WHERE MaLop = ?',
              [id]
          );

          if (classExists.length === 0) {
              throw new Error('Class not found');
          }

          // 1. Delete from BD_THANHPHAN
          await connection.query(`
              DELETE bdtp 
              FROM BD_THANHPHAN bdtp
              JOIN BD_MONHOC bdm ON bdtp.MaBD_MH = bdm.MaBD_MH
              JOIN BANGDIEM bd ON bdm.MaBangDiem = bd.MaBangDiem
              JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
              JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
              WHERE dsl.MaLop = ?
          `, [id]);

          // 2. Delete from BD_MONHOC
          await connection.query(`
              DELETE bdm 
              FROM BD_MONHOC bdm
              JOIN BANGDIEM bd ON bdm.MaBangDiem = bd.MaBangDiem
              JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
              JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
              WHERE dsl.MaLop = ?
          `, [id]);

          // 3. Delete from BANGDIEM
          await connection.query(`
              DELETE bd 
              FROM BANGDIEM bd
              JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
              JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
              WHERE dsl.MaLop = ?
          `, [id]);

          // 4. Delete from BC_TKHK
          await connection.query(`
              DELETE bctk 
              FROM BC_TKHK bctk
              JOIN DANHSACHLOP dsl ON bctk.MaDanhSachLop = dsl.MaDanhSachLop
              WHERE dsl.MaLop = ?
          `, [id]);

          // 5. Delete from CT_DSL
          await connection.query(`
              DELETE ct 
              FROM CT_DSL ct
              JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
              WHERE dsl.MaLop = ?
          `, [id]);

          // 6. Delete from DANHSACHLOP
          await connection.query(
              'DELETE FROM DANHSACHLOP WHERE MaLop = ?',
              [id]
          );

          // 7. Finally delete from LOP
          const [result] = await connection.query(
              'DELETE FROM LOP WHERE MaLop = ?',
              [id]
          );

          // If we got here, all deletes were successful
          await connection.commit();
          
          console.log('Successfully deleted class and all related records');
          return result;

        } catch (error) {
          // If anything fails, roll back all changes
          await connection.rollback();
          console.error('Error in deleteById:', error);
          throw error;
        } finally {
          // Always release the connection back to the pool
          connection.release();
        }
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
