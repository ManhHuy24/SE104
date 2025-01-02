const db = require('../config/db'); // Assuming db.js is the file with the DB connection

// Fetch available years
const getYears = async (req, res) => {
    try {
        const [years] = await db.execute(`
            SELECT MaNamHoc AS id, CONCAT(Nam1, '-', Nam2) AS name
            FROM NAMHOC
            ORDER BY Nam1;
        `);

        res.json(years);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch available semesters
const getSemesters = async (req, res) => {
    try {
        const [semesters] = await db.execute(`
            SELECT MaHocKy AS id, TenHocKy AS name
            FROM HOCKY
            ORDER BY MaHocKy;
        `);
        res.json(semesters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Fetch available subjects
const getSubjects = async (req, res) => {
    try {
        // Query to fetch available subjects
        const [subjects] = await db.execute(`
            SELECT MaMonHoc AS id, TenMonHoc AS name
            FROM MONHOC
            ORDER BY MaMonHoc;
        `);

        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Report for BCTKMH - Subject Summary Report
// Report for BCTKMH - Subject Summary Report
const getReportTKMH = async (req, res) => {
    const { hocKy, monHoc, namHoc } = req.query;

    try {
        // Generate the report
        const [data] = await db.execute(`
            SELECT 
                l.TenLop,
                dsl.SiSo,
                COUNT(DISTINCT CASE WHEN bm.DTBMH >= ts.DiemDat THEN bm.MaBD_MH END) AS SoLuongDat
            FROM BD_MONHOC bm
            INNER JOIN MONHOC mh ON bm.MaMonHoc = mh.MaMonHoc
            INNER JOIN BANGDIEM bd ON bm.MaBangDiem = bd.MaBangDiem
            INNER JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
            INNER JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
            INNER JOIN LOP l ON dsl.MaLop = l.MaLop
            INNER JOIN THAMSO ts ON 1 = 1
            WHERE bd.MaHocKy = ? AND bm.MaMonHoc = ? AND dsl.MaNamHoc = ?
            GROUP BY l.TenLop, dsl.SiSo
            ORDER BY l.TenLop;
        `, [hocKy, monHoc, namHoc]);

        // Update BC_TKMH table
        await db.execute(`
            INSERT INTO BC_TKMH (MaNamHoc, MaMonHoc, MaHocKy)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE MaNamHoc = VALUES(MaNamHoc), MaMonHoc = VALUES(MaMonHoc), MaHocKy = VALUES(MaHocKy);
        `, [namHoc, monHoc, hocKy]);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Report for BCTKHK - Semester Summary Report
const getReportTKHK = async (req, res) => {
    const { hocKy, namHoc } = req.query;

    try {
        // Generate the report
        const [data] = await db.execute(`
            SELECT 
                l.TenLop,
                dsl.MaDanhSachLop,
                dsl.SiSo,
                COUNT(CASE WHEN bd.DTBHK >= ts.DiemDat THEN 1 END) AS SoLuongDat
            FROM BANGDIEM bd
            INNER JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
            INNER JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
            INNER JOIN LOP l ON dsl.MaLop = l.MaLop
            INNER JOIN THAMSO ts ON 1 = 1
            WHERE bd.MaHocKy = ? AND dsl.MaNamHoc = ?
            GROUP BY l.TenLop, dsl.MaDanhSachLop, dsl.SiSo
            ORDER BY l.TenLop;
        `, [hocKy, namHoc]);

        // Log the retrieved data for debugging
        console.log("Report Data:", data);

        // Update BC_TKHK table
        for (const row of data) {
            const { MaDanhSachLop, SoLuongDat, SiSo } = row;

            // Ensure no undefined values are passed
            if (MaDanhSachLop === undefined || SoLuongDat === undefined || SiSo === undefined) {
                console.error("Undefined parameter found in row:", row);
                continue;
            }

            const TiLe = SoLuongDat / SiSo;

            await db.execute(`
                INSERT INTO BC_TKHK (MaHocKy, MaDanhSachLop, SoLuongDat, TiLe)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE SoLuongDat = VALUES(SoLuongDat), TiLe = VALUES(TiLe);
            `, [hocKy, MaDanhSachLop, SoLuongDat, TiLe]);
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getYears,
    getSemesters,
    getSubjects,
    getReportTKMH,
    getReportTKHK,
};
