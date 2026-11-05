const milestoneRepository = require('../database/repositories/milestoneRepository');
const { updateMilestoneStatusSchema } = require('../validators/analysisSchemas');
const logger = require('../utils/logger');

const milestoneController = {
  updateStatus: async (req, res, next) => {
    try {
      const { id: analysisId, milestoneId } = req.params;
      const validated = updateMilestoneStatusSchema.parse(req.body);

      const updated = milestoneRepository.updateStatus(milestoneId, analysisId, validated.status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Milestone "${milestoneId}" in analysis "${analysisId}" was not found.`
          }
        });
      }

      logger.info(`Updated milestone [${milestoneId}] status to: ${validated.status}`);

      return res.status(200).json({
        success: true,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = milestoneController;
