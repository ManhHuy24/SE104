const express = require('express');
const { upload, uploadFile } = require('../controllers/importController');

const router = express.Router();

// Route for file upload
router.post('/import', upload.single('file'), uploadFile);

module.exports = router;
