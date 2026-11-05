const analysisRepository = require('../database/repositories/analysisRepository');
const milestoneRepository = require('../database/repositories/milestoneRepository');
const { generatePdfReport } = require('../services/reportService');
const logger = require('../utils/logger');

const reportController = {
  downloadPdfReport: async (req, res, next) => {
    try {
      const { id } = req.params;
      const analysis = analysisRepository.findById(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Cannot generate report. Analysis "${id}" was not found.`
          }
        });
      }

      const milestones = milestoneRepository.findByAnalysisId(id);

      const safeRole = (analysis.targetRole || 'Career')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const filename = `Career_Roadmap_${safeRole}_${analysis.id.slice(0, 8)}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      logger.info(`Streaming PDF report generation for analysis: ${id}`);
      const pdfStream = generatePdfReport(analysis, milestones);
      pdfStream.pipe(res);
    } catch (err) {
      next(err);
    }
  },

  exportJson: async (req, res, next) => {
    try {
      const { id } = req.params;
      const analysis = analysisRepository.findById(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Analysis "${id}" was not found.`
          }
        });
      }

      const milestones = milestoneRepository.findByAnalysisId(id);

      const payload = {
        metadata: {
          system: 'AI-Based Skill Gap Analysis and Career Roadmap System',
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        },
        analysis,
        milestones
      };

      const safeRole = (analysis.targetRole || 'Career')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const filename = `career_analysis_${safeRole}_${analysis.id.slice(0, 8)}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.status(200).send(JSON.stringify(payload, null, 2));
    } catch (err) {
      next(err);
    }
  }
};

module.exports = reportController;
