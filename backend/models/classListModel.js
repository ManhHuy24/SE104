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
            // Count the number of students in the given class
            const [countResult] = await db.query(
                `
                SELECT COUNT(CT.MaHocSinh) AS SiSo
                FROM CT_DSL CT
                JOIN DANHSACHLOP DS ON CT.MaDanhSachLop = DS.MaDanhSachLop
                WHERE DS.MaNamHoc = ? AND DS.MaLop = ?
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

    // Fetch mappings of students to their current classes
    static async getAssignments() {
        const query = `
            SELECT 
                CT.MaHocSinh, 
                DS.MaLop
            FROM CT_DSL CT
            JOIN DANHSACHLOP DS ON CT.MaDanhSachLop = DS.MaDanhSachLop;
        `;
        const [rows] = await db.query(query);
        return rows.reduce((acc, { MaHocSinh, MaLop }) => {
            acc[MaHocSinh] = MaLop; // Grouping MaHocSinh to its MaLop
            return acc;
        }, {});
    }
}

module.exports = ClassList;
