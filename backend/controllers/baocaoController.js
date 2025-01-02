const db = require('../config/db');

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
const getReportTKMH = async (req, res) => {
    const { hocKy, monHoc, namHoc } = req.query;

    try {
        // First check if the report exists
        const [existing] = await db.execute(`
            SELECT * FROM BC_TKMH
            WHERE MaNamHoc = ? AND MaMonHoc = ? AND MaHocKy = ?;
        `, [namHoc, monHoc, hocKy]);

        let reportData;

        if (existing.length === 0) {
            // Generate the report data only if it doesn't exist
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

            // Insert the report
            await db.execute(`
                INSERT INTO BC_TKMH (MaNamHoc, MaMonHoc, MaHocKy)
                VALUES (?, ?, ?);
            `, [namHoc, monHoc, hocKy]);

            reportData = data;
        } else {
            // If report exists, fetch the existing data
            const [data] = await db.execute(`
                SELECT 
                    l.TenLop,
                    dsl.SiSo,
                    COUNT(DISTINCT CASE WHEN bm.DTBMH >= ts.DiemDat THEN bm.MaBD_MH END) AS SoLuongDat
                FROM BC_TKMH bc
                INNER JOIN BD_MONHOC bm ON bc.MaMonHoc = bm.MaMonHoc
                INNER JOIN BANGDIEM bd ON bm.MaBangDiem = bd.MaBangDiem
                INNER JOIN CT_DSL ct ON bd.MaCT_DSL = ct.MaCT_DSL
                INNER JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
                INNER JOIN LOP l ON dsl.MaLop = l.MaLop
                INNER JOIN THAMSO ts ON 1 = 1
                WHERE bc.MaNamHoc = ? AND bc.MaMonHoc = ? AND bc.MaHocKy = ?
                GROUP BY l.TenLop, dsl.SiSo
                ORDER BY l.TenLop;
            `, [namHoc, monHoc, hocKy]);
            
            reportData = data;
        }

        res.json(reportData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Report for BCTKHK - Semester Summary Report
const getReportTKHK = async (req, res) => {
    const { hocKy, namHoc } = req.query;

    try {
        // First check if the report exists
        const [existing] = await db.execute(`
            SELECT COUNT(*) AS count
            FROM BC_TKHK
            WHERE MaHocKy = ? AND MaDanhSachLop = ?;
        `, [hocKy, namHoc]);

        let reportData;

        if (existing[0].count === 0) {
            // Generate the report data only if it doesn't exist
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

            // Insert the report data
            for (const row of data) {
                const { MaDanhSachLop, SoLuongDat, SiSo } = row;
                if (MaDanhSachLop && SoLuongDat !== undefined && SiSo) {
                    const TiLe = SoLuongDat / SiSo;
                    await db.execute(`
                        INSERT INTO BC_TKHK (MaHocKy, MaDanhSachLop, SoLuongDat, TiLe)
                        VALUES (?, ?, ?, ?);
                    `, [hocKy, MaDanhSachLop, SoLuongDat, TiLe]);
                }
            }

            reportData = data;
        } else {
            // If report exists, fetch the existing data
            const [data] = await db.execute(`
                SELECT 
                    l.TenLop,
                    dsl.MaDanhSachLop,
                    dsl.SiSo,
                    bc.SoLuongDat
                FROM BC_TKHK bc
                INNER JOIN DANHSACHLOP dsl ON bc.MaDanhSachLop = dsl.MaDanhSachLop
                INNER JOIN LOP l ON dsl.MaLop = l.MaLop
                INNER JOIN THAMSO ts ON 1 = 1
                WHERE bc.MaHocKy = ? AND dsl.MaNamHoc = ?
                ORDER BY l.TenLop;
            `, [hocKy, namHoc]);

            reportData = data;
        }

        res.json(reportData);
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
