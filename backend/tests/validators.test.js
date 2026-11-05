const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  createAnalysisInputSchema,
  updateMilestoneStatusSchema
} = require('../src/validators/analysisSchemas');
const { aiAnalysisResponseSchema } = require('../src/validators/aiResponseSchema');

describe('Input and Output Validators', () => {
  test('createAnalysisInputSchema accepts valid form payload', () => {
    const valid = {
      targetRole: 'Full Stack Engineer',
      experienceLevel: 'Entry Level',
      dailyHours: 2.5,
      durationWeeks: 12,
      learningStyle: 'Hands-on Projects',
      jobDescription: 'Looking for a developer with React, Node, and SQL experience.',
      userConsent: true
    };

    const parsed = createAnalysisInputSchema.parse(valid);
    assert.strictEqual(parsed.targetRole, 'Full Stack Engineer');
    assert.strictEqual(parsed.dailyHours, 2.5);
  });

  test('createAnalysisInputSchema rejects missing consent', () => {
    const invalid = {
      targetRole: 'DevOps Engineer',
      experienceLevel: 'Experienced',
      dailyHours: 2,
      durationWeeks: 8,
      learningStyle: 'Mixed',
      userConsent: false
    };

    assert.throws(() => {
      createAnalysisInputSchema.parse(invalid);
    }, /consent/i);
  });

  test('updateMilestoneStatusSchema accepts valid status values', () => {
    assert.strictEqual(updateMilestoneStatusSchema.parse({ status: 'in_progress' }).status, 'in_progress');
    assert.strictEqual(updateMilestoneStatusSchema.parse({ status: 'completed' }).status, 'completed');
    assert.strictEqual(updateMilestoneStatusSchema.parse({ status: 'not_started' }).status, 'not_started');

    assert.throws(() => {
      updateMilestoneStatusSchema.parse({ status: 'invalid_status' });
    });
  });

  test('aiAnalysisResponseSchema validates and sets default fallbacks', () => {
    const rawAiPayload = {
      targetRole: 'Backend Developer',
      matchingSkills: [{ skill: 'Node.js', category: 'Backend' }],
      partialSkills: [],
      missingOrUnverifiedSkills: [],
      additionalSkills: [],
      roadmap: [
        {
          milestoneIndex: 1,
          weekRange: 'Week 1 - 2',
          skill: 'Redis Caching',
          category: 'Databases',
          whyItMatters: 'High performance throughput',
          priority: 'High',
          estimatedHours: 12,
          learningObjectives: ['Learn key-value operations'],
          resources: [{ title: 'Redis Docs', type: 'Documentation', url: 'https://redis.io' }],
          completionCriteria: ['Deploy Redis container']
        }
      ]
    };

    const parsed = aiAnalysisResponseSchema.parse(rawAiPayload);
    assert.strictEqual(parsed.targetRole, 'Backend Developer');
    assert.strictEqual(parsed.roadmap.length, 1);
    assert.ok(Array.isArray(parsed.limitations));
  });
});
