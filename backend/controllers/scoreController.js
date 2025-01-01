const Score = require('../models/scoreModel');

// Hàm lấy điểm học sinh
exports.getScores = async (req, res) => {
    try {
        const { MaNamHoc, MaLop, MaMonHoc, MaHocKy } = req.body;

        if (!MaNamHoc || !MaLop || !MaMonHoc || !MaHocKy) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const scores = await Score.getScores({
            MaNamHoc,
            MaLop,
            MaMonHoc,
            MaHocKy
        });

        res.json({
            success: true,
            data: scores
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scores',
            error: error.message
        });
    }
};

// Hàm thêm hoặc cập nhật điểm
exports.addOrUpdateScore = async (req, res) => {
    try {
        const { MaBD_MH, MaLKT, KetQua } = req.body;

        if (!MaBD_MH || !MaLKT || KetQua === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters.'
            });
        }

        const result = await Score.addOrUpdateScore({ MaBD_MH, MaLKT, KetQua });
        res.json({
            success: true,
            message: 'Score updated successfully',
            affectedRows: result
        });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
