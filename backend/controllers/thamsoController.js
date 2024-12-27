const ThamSo = require('../models/thamsoModel');

exports.getThamSo = async (req, res) => {
    try {
        const thamso = await ThamSo.getAll();
        res.json(thamso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addNamHoc = async (req, res) => {
    const { nam1 } = req.body;
    const nam2 = parseInt(nam1) + 1;

    if (!nam1 || isNaN(nam1)) {
        return res.status(400).json({ message: 'Vui lòng nhập một năm hợp lệ' });
    }
    
    if (nam1 < 2000 || nam1 > 2100) {
        return res.status(400).json({ message: 'Năm học phải nằm trong khoảng 2000-2100' });
    }

    try {
        const exists = await ThamSo.checkNamHocExists(nam1);
        if (exists) {
            return res.status(409).json({ message: 'Năm học này đã tồn tại' });
        }
    
        const namhoc = {
            MaNamHoc: `${nam1}-${nam2}`,
            Nam1: nam1,
            Nam2: nam2,
        };
    
        const result = await ThamSo.addNamHoc(namhoc);
        if (result.affectedRows) {
            return res.status(201).json({ message: 'Thêm năm học thành công', namhoc });
        }
        return res.status(400).json({ message: 'Thêm năm học không thành công' });
    
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi!'});
    }
};

exports.updateThamSo = async (req, res) => {
    try {
        const existingThamSo = await ThamSo.getAll();

        if (existingThamSo.length === 0) {
            const result = await ThamSo.addThamSo(req.body);
            if (result.affectedRows) {
                return res.status(201).json({ message: "Thêm tham số thành công" });
            } else {
                return res.status(400).json({ message: "Thêm tham số không thành công" });
            }
        } else {
            await ThamSo.updateThamSo(req.body);
            const updatedThamSo = await ThamSo.getAll();
            return res.status(200).json({ message: "Cập nhật tham số thành công", data: updatedThamSo });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật tham số:", error);
        res.status(500).json({ message: error.message });
    }
};
