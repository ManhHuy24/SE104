const db = require('../config/db');

class ThamSo {
    static async getAll() {
        try {
            const [results] = await db.query('SELECT * FROM THAMSO LIMIT 1');
            return results[0];
        } catch (err) {
            throw err;
        }
    }

    static async update(thamso) {
        const { TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu } = thamso;
        try {
            const [results] = await db.query(
                'UPDATE THAMSO SET TuoiHocSinhToiThieu = ?, TuoiHocSinhToiDa = ?, SoLuongHocSinhToiDa = ?, DiemToiDa = ?, DiemToiThieu = ?',
                [TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu]
            );
            return results;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ThamSo;