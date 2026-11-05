const { z } = require('zod');

const matchingSkillSchema = z.object({
  skill: z.string().min(1),
  category: z.string().default('General'),
  evidenceInResume: z.string().default('Identified in resume skills/projects'),
  jobRequirementContext: z.string().default('Required by job specification'),
  relevance: z.enum(['High', 'Medium', 'Low']).default('High')
});

const partialSkillSchema = z.object({
  skill: z.string().min(1),
  category: z.string().default('General'),
  evidenceInResume: z.string().default('Mentioned or related skill present'),
  missingAspect: z.string().default('Needs deeper evidence or advanced proficiency'),
  bridgingAction: z.string().default('Build a focused project or study advanced topics'),
  relevance: z.enum(['High', 'Medium', 'Low']).default('High')
});

const missingSkillSchema = z.object({
  skill: z.string().min(1),
  category: z.string().default('General'),
  importance: z.enum(['High', 'Medium', 'Low']).default('High'),
  rationale: z.string().default('Explicitly listed in job requirements but absent from resume')
});

const additionalSkillSchema = z.object({
  skill: z.string().min(1),
  category: z.string().default('Other'),
  note: z.string().default('Valuable complementary skill found on resume')
});

const resourceSchema = z.object({
  title: z.string().default('Learning Resource'),
  type: z.string().default('Documentation').transform(val => {
    const valid = ['Documentation', 'Course', 'Tutorial', 'Book', 'Practice'];
    return valid.includes(val) ? val : 'Documentation';
  }),
  url: z.string().default('https://developer.mozilla.org/'),
  description: z.string().default('Recommended verified learning resource')
});

const practicalProjectSchema = z.object({
  title: z.string().default('Practical Hands-on Exercise'),
  description: z.string().default('Implement a working sample demonstrating this concept.'),
  deliverables: z.array(z.string()).default([])
});

const milestoneSchema = z.object({
  milestoneIndex: z.number().int().default(1),
  weekRange: z.string().default('Week 1'),
  skill: z.string().default('Core Skill'),
  category: z.string().default('Technical'),
  whyItMatters: z.string().default('Crucial skill for achieving proficiency in the target role.'),
  priority: z.string().default('Medium').transform(val => {
    const valid = ['High', 'Medium', 'Low'];
    return valid.includes(val) ? val : 'Medium';
  }),
  estimatedHours: z.number().default(10),
  learningObjectives: z.array(z.string()).default([]),
  resources: z.array(resourceSchema).default([]),
  practicalProject: practicalProjectSchema.default({
    title: 'Practical Hands-on Exercise',
    description: 'Implement a working sample demonstrating this concept.',
    deliverables: ['Working codebase on GitHub', 'README documentation']
  }),
  completionCriteria: z.array(z.string()).default([])
});

const resumeImprovementSchema = z.object({
  section: z.string().default('General'),
  currentObservation: z.string().default('Current resume presentation'),
  suggestedImprovement: z.string().default('Enhance impact metrics and clarity'),
  rationale: z.string().default('Improves ATS parsing and recruiter readability')
});

const qualificationEvaluationSchema = z.object({
  required: z.string().default('Not explicitly specified'),
  candidateStatus: z.string().default('Not identified'),
  meetsRequirement: z.boolean().default(true),
  gapDetails: z.string().default('No major qualification gap identified')
});

const experienceEvaluationSchema = z.object({
  required: z.string().default('Not explicitly specified'),
  candidateStatus: z.string().default('Not identified'),
  meetsRequirement: z.boolean().default(true),
  gapDetails: z.string().default('Experience level aligns reasonably with target role')
});

const aiAnalysisResponseSchema = z.object({
  targetRole: z.string().min(1),
  matchingSkills: z.array(matchingSkillSchema).default([]),
  partialSkills: z.array(partialSkillSchema).default([]),
  missingOrUnverifiedSkills: z.array(missingSkillSchema).default([]),
  additionalSkills: z.array(additionalSkillSchema).default([]),
  qualificationEvaluation: qualificationEvaluationSchema.default({
    required: 'Standard degree or equivalent',
    candidateStatus: 'Degree noted in resume',
    meetsRequirement: true,
    gapDetails: 'No significant qualification gap detected'
  }),
  experienceEvaluation: experienceEvaluationSchema.default({
    required: 'Role-appropriate experience',
    candidateStatus: 'Background evaluated',
    meetsRequirement: true,
    gapDetails: 'Aligns reasonably with target level'
  }),
  qualificationGaps: z.array(z.string()).default([]),
  experienceGaps: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  resumeImprovements: z.array(resumeImprovementSchema).default([]),
  roadmap: z.array(milestoneSchema).default([]),
  limitations: z.array(z.string()).default([])
});

module.exports = {
  aiAnalysisResponseSchema,
  milestoneSchema,
  matchingSkillSchema,
  partialSkillSchema,
  missingSkillSchema,
  additionalSkillSchema,
  resumeImprovementSchema
};
