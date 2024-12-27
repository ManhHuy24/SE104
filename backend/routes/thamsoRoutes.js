const express = require('express');
const router = express.Router();
const thamsoController = require('../controllers/thamsoController');

router.get('/', thamsoController.getThamSo);
router.put('/', thamsoController.updateThamSo);
router.post('/', thamsoController.addNamHoc);

module.exports = router;