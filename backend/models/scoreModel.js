const db = require('../config/db');

class Score {
        static async getScores({ MaNamHoc, MaLop, MaMonHoc, MaHocKy }) {
        const connection = await db.getConnection();
        try {
            // First ensure all students have necessary records
            const [students] = await connection.query(`
                SELECT DISTINCT
                    ct.MaCT_DSL,
                    ct.MaHocSinh
                FROM CT_DSL ct 
                JOIN DANHSACHLOP dsl ON dsl.MaDanhSachLop = ct.MaDanhSachLop
                WHERE dsl.MaNamHoc = ? AND dsl.MaLop = ?
            `, [MaNamHoc, MaLop]);

            for (const student of students) {
                try {
                    // Get or create BANGDIEM
                    const [[existingBangDiem]] = await connection.query(
                        'SELECT MaBangDiem FROM BANGDIEM WHERE MaCT_DSL = ? AND MaHocKy = ?',
                        [student.MaCT_DSL, MaHocKy]
                    );

                    let bangDiemId;
                    if (existingBangDiem) {
                        bangDiemId = existingBangDiem.MaBangDiem;
                    } else {
                        const [result] = await connection.query(
                            'INSERT INTO BANGDIEM (MaCT_DSL, MaHocKy, DTBHK) VALUES (?, ?, 0)',
                            [student.MaCT_DSL, MaHocKy]
                        );
                        bangDiemId = result.insertId;
                    }

                    // Get or create BD_MONHOC
                    const [[existingBD_MonHoc]] = await connection.query(
                        'SELECT MaBD_MH FROM BD_MONHOC WHERE MaBangDiem = ? AND MaMonHoc = ?',
                        [bangDiemId, MaMonHoc]
                    );

                    if (!existingBD_MonHoc) {
                        await connection.query(
                            'INSERT INTO BD_MONHOC (MaBangDiem, MaMonHoc, DTBMH) VALUES (?, ?, 0)',
                            [bangDiemId, MaMonHoc]
                        );
                    }
                } catch (error) {
                    console.error(`Error processing student ${student.MaHocSinh}:`, error);
                }
            }

            // Get scores with a properly structured query to avoid duplicates
            const [scores] = await connection.query(`
                SELECT DISTINCT
                    hs.MaHocSinh,
                    hs.TenHocSinh,
                    bdmh.MaBD_MH,
                    (
                        SELECT KetQua 
                        FROM BD_THANHPHAN 
                        WHERE MaBD_MH = bdmh.MaBD_MH AND MaLKT = 1
                        LIMIT 1
                    ) AS Diem15Phut,
                    (
                        SELECT KetQua 
                        FROM BD_THANHPHAN 
                        WHERE MaBD_MH = bdmh.MaBD_MH AND MaLKT = 2
                        LIMIT 1
                    ) AS Diem1Tiet,
                    (
                        SELECT KetQua 
                        FROM BD_THANHPHAN 
                        WHERE MaBD_MH = bdmh.MaBD_MH AND MaLKT = 3
                        LIMIT 1
                    ) AS DiemHocKy,
                    bdmh.DTBMH,
                    bd.DTBHK
                FROM DANHSACHLOP dsl
                JOIN CT_DSL ct ON dsl.MaDanhSachLop = ct.MaDanhSachLop
                JOIN HOCSINH hs ON ct.MaHocSinh = hs.MaHocSinh
                LEFT JOIN BANGDIEM bd ON bd.MaCT_DSL = ct.MaCT_DSL AND bd.MaHocKy = ?
                LEFT JOIN BD_MONHOC bdmh ON bdmh.MaBangDiem = bd.MaBangDiem AND bdmh.MaMonHoc = ?
                WHERE dsl.MaNamHoc = ? AND dsl.MaLop = ?
                ORDER BY hs.TenHocSinh
            `, [MaHocKy, MaMonHoc, MaNamHoc, MaLop]);

            return scores;
        } catch (err) {
            throw new Error(`Error fetching scores: ${err.message}`);
        } finally {
            connection.release();
        }
    }

    static async updateAverages({ MaBangDiem, MaBD_MH }) {
        const connection = await db.getConnection();
        try {
            await connection.query('SET innodb_lock_wait_timeout = 10');
            
            if (MaBD_MH) {
                const [[dtbmhResult]] = await connection.query(`
                    SELECT 
                        COALESCE(
                            SUM(COALESCE(tp.KetQua, 0) * lkt.HeSo) / NULLIF(SUM(lkt.HeSo), 0),
                            0
                        ) AS DTBMH
                    FROM BD_THANHPHAN tp
                    JOIN LOAIKIEMTRA lkt ON tp.MaLKT = lkt.MaLKT
                    WHERE tp.MaBD_MH = ?
                `, [MaBD_MH]);

                await connection.query(`
                    UPDATE BD_MONHOC
                    SET DTBMH = ?
                    WHERE MaBD_MH = ?
                `, [dtbmhResult.DTBMH || 0, MaBD_MH]);

                if (!MaBangDiem) {
                    const [[bdResult]] = await connection.query(
                        'SELECT MaBangDiem FROM BD_MONHOC WHERE MaBD_MH = ?',
                        [MaBD_MH]
                    );
                    
                    if (bdResult) {
                        MaBangDiem = bdResult.MaBangDiem;
                    }
                }
            }

            if (MaBangDiem) {
                const [[dtbhkResult]] = await connection.query(`
                    SELECT 
                        COALESCE(
                            AVG(NULLIF(DTBMH, 0)),
                            0
                        ) AS DTBHK
                    FROM BD_MONHOC
                    WHERE MaBangDiem = ?
                `, [MaBangDiem]);

                await connection.query(`
                    UPDATE BANGDIEM
                    SET DTBHK = ?
                    WHERE MaBangDiem = ?
                `, [dtbhkResult.DTBHK || 0, MaBangDiem]);
            }
        } catch (err) {
            console.error('Error in updateAverages:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    static async addOrUpdateScore({ MaBD_MH, MaLKT, KetQua }) {
        const connection = await db.getConnection();
        try {
            // First check if the record exists
            const [[existingScore]] = await connection.query(
                'SELECT MaBD_TP FROM BD_THANHPHAN WHERE MaBD_MH = ? AND MaLKT = ?',
                [MaBD_MH, MaLKT]
            );

            if (existingScore) {
                // Update existing score
                await connection.query(
                    'UPDATE BD_THANHPHAN SET KetQua = ? WHERE MaBD_MH = ? AND MaLKT = ?',
                    [KetQua, MaBD_MH, MaLKT]
                );
            } else {
                // Insert new score
                await connection.query(
                    'INSERT INTO BD_THANHPHAN (MaBD_MH, MaLKT, KetQua) VALUES (?, ?, ?)',
                    [MaBD_MH, MaLKT, KetQua]
                );
            }

            // Update averages after score is saved
            await this.updateAverages({ MaBD_MH });
            
            return true;
        } catch (err) {
            console.error('Error in addOrUpdateScore:', err);
            throw new Error(`Error adding or updating score: ${err.message}`);
        } finally {
            connection.release();
        }
    }
}

module.exports = Score;
