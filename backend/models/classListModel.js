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

    static async removeStudentFromClass(MaHocSinh, MaNamHoc, MaLop) {

        const connection = await db.getConnection(); 
        try {
            await connection.beginTransaction();

            console.log('Checking student assignment...');
            const [results] = await connection.query(
                `
                SELECT CT.MaCT_DSL
                FROM CT_DSL CT
                JOIN DANHSACHLOP DS ON CT.MaDanhSachLop = DS.MaDanhSachLop
                WHERE CT.MaHocSinh = ? AND DS.MaLop = ? AND DS.MaNamHoc = ?
                `,
                [MaHocSinh, MaLop, MaNamHoc]
            );

            if (results.length === 0) {
                throw new Error('Học sinh không thuộc lớp này.');
            }

            const MaCT_DSL = results[0].MaCT_DSL;

            console.log('Deleting related records from BD_THANHPHAN...');
            await connection.query(
                `
                DELETE BD_TP
                FROM BD_THANHPHAN BD_TP
                JOIN BD_MONHOC BD_MH ON BD_TP.MaBD_MH = BD_MH.MaBD_MH
                JOIN BANGDIEM BD ON BD_MH.MaBangDiem = BD.MaBangDiem
                WHERE BD.MaCT_DSL = ?
                `,
                [MaCT_DSL]
            );

            console.log('Deleting related records from BD_MONHOC...');
            await connection.query(
                `
                DELETE BD_MH
                FROM BD_MONHOC BD_MH
                JOIN BANGDIEM BD ON BD_MH.MaBangDiem = BD.MaBangDiem
                WHERE BD.MaCT_DSL = ?
                `,
                [MaCT_DSL]
            );

            console.log('Deleting records from BANGDIEM...');
            await connection.query(
                `
                DELETE BD
                FROM BANGDIEM BD
                WHERE BD.MaCT_DSL = ?
                `,
                [MaCT_DSL]
            );

            console.log('Deleting records from CT_DSL...');
            await connection.query(
                `
                DELETE CT
                FROM CT_DSL CT
                WHERE CT.MaCT_DSL = ?
                `,
                [MaCT_DSL]
            );

            console.log('Updating SiSo...');
            await connection.query(
                `
                UPDATE DANHSACHLOP DS
                SET SiSo = SiSo - 1
                WHERE DS.MaLop = ? AND DS.MaNamHoc = ?
                `,
                [MaLop, MaNamHoc]
            );

            await connection.commit();
            return { message: 'Học sinh đã được xóa khỏi lớp thành công.' };
        } catch (err) {
            console.error('Error during transaction:', err.message);
            await connection.rollback();
            throw new Error(`Lỗi khi xóa học sinh khỏi lớp: ${err.message}`);
        } finally {
            connection.release();
        }
    }    
}

module.exports = ClassList;
