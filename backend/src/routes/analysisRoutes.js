const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const analysisController = require('../controllers/analysisController');
const milestoneController = require('../controllers/milestoneController');
const reportController = require('../controllers/reportController');

const router = express.Router();

// Preview resume text extraction without triggering full AI analysis
router.post('/preview', upload.single('resume'), analysisController.extractPreview);

// Create new analysis (accepts resume file + optional JD file + form fields)
router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescriptionFile', maxCount: 1 }
  ]),
  analysisController.createAnalysis
);

// Get all previous analyses
router.get('/', analysisController.getAllAnalyses);

// Get single analysis by ID with complete details & roadmap
router.get('/:id', analysisController.getAnalysisById);

// Delete an analysis record (cascades to milestones)
router.delete('/:id', analysisController.deleteAnalysis);

// Update milestone progress status
router.patch('/:id/roadmap/:milestoneId', milestoneController.updateStatus);

// Download PDF report
router.get('/:id/report', reportController.downloadPdfReport);

// Export structured JSON
router.get('/:id/export-json', reportController.exportJson);

module.exports = router;
