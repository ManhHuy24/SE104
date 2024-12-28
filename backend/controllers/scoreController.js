const Score = require('../models/scoreModel');

exports.getScores = async (req, res) => {
    try {
        const { MaNamHoc, MaLop, MaMonHoc, MaHocKy } = req.body;
        
        // Log the received data
        console.log('Received request with data:', { MaNamHoc, MaLop, MaMonHoc, MaHocKy });

        // Validate required fields
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
        
        // Always return JSON
        res.json({
            success: true,
            data: scores
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching scores', 
            error: error.message 
        });
    }
};

exports.addOrUpdateScore = async (req, res) => {
  try {
    // Extract parameters for adding or updating a score
    const { MaBD_MH, MaLKT, KetQua } = req.body;

    // Check if all required parameters are provided
    if (!MaBD_MH || !MaLKT || KetQua === undefined) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Add or update the score
    const result = await Score.addOrUpdateScore({ MaBD_MH, MaLKT, KetQua });
    res.json({ message: 'Score updated successfully', affectedRows: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
