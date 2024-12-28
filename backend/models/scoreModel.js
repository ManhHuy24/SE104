const db = require('../config/db');

class Score {
  // Fetch all scores for a given subject, class, year, and semester
  static async getScores({ MaNamHoc, MaLop, MaMonHoc, MaHocKy }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // First verify that the HocKy exists
      const [hocKyExists] = await connection.query(
        'SELECT MaHocKy FROM HOCKY WHERE MaHocKy = ?',
        [MaHocKy]
      );

      if (hocKyExists.length === 0) {
        throw new Error(`Invalid MaHocKy: ${MaHocKy}`);
      }

      // Get students with existing records or create new ones
      const [students] = await connection.query(`
        SELECT 
          ct.MaCT_DSL,
          ct.MaHocSinh,
          bd.MaBangDiem
        FROM CT_DSL ct
        JOIN DANHSACHLOP dsl ON dsl.MaDanhSachLop = ct.MaDanhSachLop
        LEFT JOIN BANGDIEM bd ON bd.MaCT_DSL = ct.MaCT_DSL AND bd.MaHocKy = ?
        WHERE dsl.MaNamHoc = ? AND dsl.MaLop = ?
      `, [MaHocKy, MaNamHoc, MaLop]);

      // Process each student
      for (const student of students) {
        if (!student.MaBangDiem) {
          // Create BANGDIEM record if it doesn't exist
          const [result] = await connection.query(`
            INSERT INTO BANGDIEM (MaCT_DSL, MaHocKy)
            SELECT ?, ? 
            FROM dual 
            WHERE NOT EXISTS (
              SELECT 1 FROM BANGDIEM 
              WHERE MaCT_DSL = ? AND MaHocKy = ?
            )
          `, [student.MaCT_DSL, MaHocKy, student.MaCT_DSL, MaHocKy]);

          if (result.insertId) {
            student.MaBangDiem = result.insertId;
          } else {
            // Get the existing MaBangDiem if insert didn't occur
            const [[existing]] = await connection.query(
              'SELECT MaBangDiem FROM BANGDIEM WHERE MaCT_DSL = ? AND MaHocKy = ?',
              [student.MaCT_DSL, MaHocKy]
            );
            student.MaBangDiem = existing.MaBangDiem;
          }
        }

        // Create BD_MONHOC record if it doesn't exist
        await connection.query(`
          INSERT INTO BD_MONHOC (MaBangDiem, MaMonHoc)
          SELECT ?, ?
          FROM dual
          WHERE NOT EXISTS (
            SELECT 1 FROM BD_MONHOC 
            WHERE MaBangDiem = ? AND MaMonHoc = ?
          )
        `, [student.MaBangDiem, MaMonHoc, student.MaBangDiem, MaMonHoc]);
      }

      await connection.commit();

      // Finally, fetch all scores
      const [scores] = await connection.query(`
        SELECT 
          hs.MaHocSinh,
          hs.TenHocSinh,
          COALESCE(tp15.KetQua, NULL) AS Diem15Phut,
          COALESCE(tp1t.KetQua, NULL) AS Diem1Tiet,
          COALESCE(tphk.KetQua, NULL) AS DiemHocKy
        FROM DANHSACHLOP dsl
        JOIN CT_DSL ct ON dsl.MaDanhSachLop = ct.MaDanhSachLop
        JOIN HOCSINH hs ON ct.MaHocSinh = hs.MaHocSinh
        LEFT JOIN BANGDIEM bd ON bd.MaCT_DSL = ct.MaCT_DSL AND bd.MaHocKy = ?
        LEFT JOIN BD_MONHOC bdmh ON bdmh.MaBangDiem = bd.MaBangDiem AND bdmh.MaMonHoc = ?
        LEFT JOIN BD_THANHPHAN tp15 ON tp15.MaBD_MH = bdmh.MaBD_MH AND tp15.MaLKT = 1
        LEFT JOIN BD_THANHPHAN tp1t ON tp1t.MaBD_MH = bdmh.MaBD_MH AND tp1t.MaLKT = 2
        LEFT JOIN BD_THANHPHAN tphk ON tphk.MaBD_MH = bdmh.MaBD_MH AND tphk.MaLKT = 3
        WHERE dsl.MaNamHoc = ? AND dsl.MaLop = ?
        ORDER BY hs.TenHocSinh
      `, [MaHocKy, MaMonHoc, MaNamHoc, MaLop]);

      return scores;

    } catch (err) {
      await connection.rollback();
      throw new Error(`Error fetching scores: ${err.message}`);
    } finally {
      connection.release();
    }
  }
  
  // Add or update a score component
  static async addOrUpdateScore({ MaBD_MH, MaLKT, KetQua }) {
    try {
      const query = `
        INSERT INTO BD_THANHPHAN (MaBD_MH, MaLKT, KetQua) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE KetQua = VALUES(KetQua);
      `;
      const [result] = await db.query(query, [MaBD_MH, MaLKT, KetQua]);
      return result.affectedRows;
    } catch (err) {
      throw new Error(`Error adding or updating score: ${err.message}`);
    }
  }
}

module.exports = Score;
