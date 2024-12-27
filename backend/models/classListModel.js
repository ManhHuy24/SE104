// models/class.js
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
}

module.exports = ClassList;
