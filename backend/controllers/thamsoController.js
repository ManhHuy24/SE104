const ThamSo = require('../models/thamsoModel');

exports.getThamSo = async (req, res) => {
    try {
        const thamso = await ThamSo.getAll();
        res.json(thamso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateThamSo = async (req, res) => {
    try {
        await ThamSo.update(req.body);
        const updatedThamSo = await ThamSo.getAll();
        res.json(updatedThamSo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
