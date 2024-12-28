const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/', subjectController.getSubjects);
router.post('/', subjectController.addSubject);
router.put('/', subjectController.updateSubject);
router.delete('/', subjectController.deleteSubject);

module.exports = router;