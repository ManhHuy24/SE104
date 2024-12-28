const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.post('/get-scores', scoreController.getScores);
router.post('/add-or-update-score', scoreController.addOrUpdateScore);

module.exports = router;
