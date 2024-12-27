// routes/class.js
const express = require('express');
const YearController = require('../controllers/yearController');

const router = express.Router();

// Route for adding students to a class
router.get("/", YearController.getAll);

module.exports = router;
