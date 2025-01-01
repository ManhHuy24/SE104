const db = require('../config/db');

class Score {
    // Hàm lấy điểm của học sinh
    static async getScores({ MaNamHoc, MaLop, MaMonHoc, MaHocKy }) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Truy vấn danh sách học sinh và bảng điểm của họ
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

            // Kiểm tra bảng điểm của từng học sinh
            for (const student of students) {
                if (!student.MaBangDiem) {
                    const [result] = await connection.query(`
                        INSERT INTO BANGDIEM (MaCT_DSL, MaHocKy)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM BANGDIEM 
                            WHERE MaCT_DSL = ? AND MaHocKy = ?
                        )
                    `, [student.MaCT_DSL, MaHocKy, student.MaCT_DSL, MaHocKy]);

                    if (result.insertId) {
                        student.MaBangDiem = result.insertId;
                    } else {
                        const [[existing]] = await connection.query(
                            'SELECT MaBangDiem FROM BANGDIEM WHERE MaCT_DSL = ? AND MaHocKy = ?',
                            [student.MaCT_DSL, MaHocKy]
                        );
                        student.MaBangDiem = existing.MaBangDiem;
                    }
                }

                // Chèn vào bảng BD_MONHOC nếu chưa tồn tại
                await connection.query(`
                    INSERT INTO BD_MONHOC (MaBangDiem, MaMonHoc)
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM BD_MONHOC 
                        WHERE MaBangDiem = ? AND MaMonHoc = ?
                    )
                `, [student.MaBangDiem, MaMonHoc, student.MaBangDiem, MaMonHoc]);
            }

            await connection.commit();

            // Truy vấn để lấy điểm của học sinh theo môn học
            const [scores] = await connection.query(`
                SELECT 
                    hs.MaHocSinh,
                    hs.TenHocSinh,
                    COALESCE(tp15.KetQua, NULL) AS Diem15Phut,
                    COALESCE(tp1t.KetQua, NULL) AS Diem1Tiet,
                    COALESCE(tphk.KetQua, NULL) AS DiemHocKy,
                    bdmh.MaBD_MH
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

    // Hàm thêm hoặc cập nhật điểm trong bảng BD_THANHPHAN
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
