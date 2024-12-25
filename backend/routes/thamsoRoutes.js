const express = require('express');
const router = express.Router();
const thamsoController = require('../controllers/thamsoController');

router.get('/', thamsoController.getThamSo);
router.put('/', thamsoController.updateThamSo);

module.exports = router;