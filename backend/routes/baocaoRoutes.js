const express = require('express');
const { getReportTKMH, getReportTKHK, getSemesters, getSubjects, getYears } = require('../controllers/baocaoController');
const router = express.Router();

// Routes for fetching the reports
router.get('/tkmh', getReportTKMH); // Subject Summary Report
router.get('/tkhk', getReportTKHK); // Semester Summary Report
router.get('/semesters', getSemesters); // Available Semesters
router.get('/subjects', getSubjects); // Available Subjects
router.get('/years', getYears); // Available Years

module.exports = router;
