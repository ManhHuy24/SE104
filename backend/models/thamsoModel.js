const db = require('../config/db');

class ThamSo {
    static async getAll() {
        try {
            const [results] = await db.query('SELECT * FROM THAMSO LIMIT 1');
            return results.length > 0 ? results : [];
        } catch (err) {
            throw err;
        }
    }

    static async checkNamHocExists(Nam1) {
        try {
            const [results] = await db.query('SELECT * FROM NAMHOC WHERE Nam1 = ?', [Nam1]);
            return results.length > 0; // Return boolean instead of results
        } catch (err) {
            console.error('Error checking school year:', err);
            throw new Error('Database error checking school year');
        }
    }
    
    static async addNamHoc(nam1) {
        const { MaNamHoc, Nam1, Nam2 } = nam1;
        
        // Validate inputs
        if (!MaNamHoc || !Nam1 || !Nam2) {
            throw new Error('Missing required fields');
        }
        
        try {
            const [results] = await db.query(
                'INSERT INTO NAMHOC (MaNamHoc, Nam1, Nam2) VALUES (?, ?, ?)',
                [MaNamHoc, Nam1, Nam2]
            );
            return results;
        } catch (err) {
            console.error('Error adding school year:', err);
            throw new Error('Database error adding school year');
        }
    }

    static async addThamSo(thamso) {
        const { TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu, DiemDat } = thamso;
        try {
            const [results] = await db.query(
                'INSERT INTO THAMSO (TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu, DiemDat) VALUES (?, ?, ?, ?, ?, ?)',
                [TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu, DiemDat]
            );
            return results;
        }
        catch (err) {
            throw err;
        }
    }

    static async updateThamSo(thamso) {
        const { TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu, DiemDat } = thamso;
        try {
            const [results] = await db.query(
                'UPDATE THAMSO SET TuoiHocSinhToiThieu = ?, TuoiHocSinhToiDa = ?, SoLuongHocSinhToiDa = ?, DiemToiDa = ?, DiemToiThieu = ?, DiemDat = ?',
                [TuoiHocSinhToiThieu, TuoiHocSinhToiDa, SoLuongHocSinhToiDa, DiemToiDa, DiemToiThieu, DiemDat]
            );
            return results;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ThamSo;