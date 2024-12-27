const db = require('../config/db');

class ClassList {
    static async isClassAvailable(MaNamHoc, MaLop) {
        try {
            const [results] = await db.query(
                'SELECT COUNT(*) as count FROM DANHSACHLOP WHERE MaNamHoc = ? AND MaLop = ?',
                [MaNamHoc, MaLop]
            );
            return results[0].count > 0;
        } catch (err) {
            throw err;
        }
    }

    static async createClass(MaNamHoc, MaLop, SiSo = 0) {
        try {
            const [results] = await db.query(
                'INSERT INTO DANHSACHLOP (MaNamHoc, MaLop, SiSo) VALUES (?, ?, ?)',
                [MaNamHoc, MaLop, SiSo]
            );
            return results.insertId; // Return the ID of the created row
        } catch (err) {
            throw err;
        }
    }

    static async updateSiSo(MaNamHoc, MaLop) {
        try {
            // Recalculate SiSo by counting students in the class
            const [countResult] = await db.query(
                `
                SELECT COUNT(*) as SiSo
                FROM HOCSINHLOP
                WHERE MaNamHoc = ? AND MaLop = ?
                `,
                [MaNamHoc, MaLop]
            );

            const newSiSo = countResult[0].SiSo;

            // Update the SiSo in the DANHSACHLOP table
            await db.query(
                'UPDATE DANHSACHLOP SET SiSo = ? WHERE MaNamHoc = ? AND MaLop = ?',
                [newSiSo, MaNamHoc, MaLop]
            );
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ClassList;
