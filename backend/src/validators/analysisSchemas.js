const { z } = require('zod');

const experienceLevels = ['Student', 'Fresher', 'Entry Level', 'Experienced'];
const learningStyles = ['Reading', 'Video', 'Hands-on Projects', 'Mixed'];

const createAnalysisInputSchema = z.object({
  targetRole: z
    .string()
    .min(2, 'Target job title must be at least 2 characters')
    .max(100, 'Target job title cannot exceed 100 characters'),
  experienceLevel: z.enum(experienceLevels, {
    errorMap: () => ({
      message: `Experience level must be one of: ${experienceLevels.join(', ')}`
    })
  }),
  dailyHours: z.coerce
    .number()
    .min(0.5, 'Daily learning time must be at least 30 minutes (0.5 hours)')
    .max(16, 'Daily learning time cannot exceed 16 hours'),
  durationWeeks: z.coerce
    .number()
    .int()
    .min(1, 'Target preparation duration must be at least 1 week')
    .max(52, 'Target preparation duration cannot exceed 52 weeks'),
  learningStyle: z.enum(learningStyles, {
    errorMap: () => ({
      message: `Learning style must be one of: ${learningStyles.join(', ')}`
    })
  }),
  jobDescription: z
    .string()
    .max(25000, 'Job description cannot exceed 25,000 characters')
    .optional(),
  userConsent: z.coerce
    .boolean()
    .refine((val) => val === true, {
      message: 'You must provide consent for AI skill-gap processing to proceed.'
    })
});

const updateMilestoneStatusSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed'], {
    errorMap: () => ({
      message: 'Status must be one of: not_started, in_progress, completed'
    })
  })
});

module.exports = {
  createAnalysisInputSchema,
  updateMilestoneStatusSchema,
  experienceLevels,
  learningStyles
};
