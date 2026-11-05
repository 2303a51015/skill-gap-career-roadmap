const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { v4: uuidv4 } = require('uuid');
const db = require('../src/database/connection');
const analysisRepository = require('../src/database/repositories/analysisRepository');
const milestoneRepository = require('../src/database/repositories/milestoneRepository');

describe('SQLite Database Repositories', () => {
  before(() => {
    // Ensure DB connection is active
    db.getInstance();
  });

  test('creates, retrieves, and deletes an analysis with linked milestones', () => {
    const testId = `test-${uuidv4()}`;

    // 1. Create analysis
    const analysisData = {
      id: testId,
      targetRole: 'Test QA Engineer',
      experienceLevel: 'Entry Level',
      dailyHours: 2,
      durationWeeks: 4,
      learningStyle: 'Reading',
      matchScore: 85,
      scoreExplanation: { method: 'test' },
      matchingSkills: [{ skill: 'Jest' }],
      partialSkills: [],
      missingSkills: [{ skill: 'Cypress' }],
      additionalSkills: [],
      qualificationGaps: [],
      experienceGaps: [],
      strengths: ['Great testing foundation'],
      resumeImprovements: [],
      limitations: [],
      extractedResumePreview: 'Test preview',
      jobDescriptionSnippet: 'Test JD'
    };

    const created = analysisRepository.create(analysisData);
    assert.strictEqual(created.id, testId);
    assert.strictEqual(created.targetRole, 'Test QA Engineer');

    // 2. Create milestones
    const milestoneId = `m-${uuidv4()}`;
    const milestones = [
      {
        id: milestoneId,
        analysisId: testId,
        milestoneIndex: 1,
        weekRange: 'Week 1',
        skill: 'Cypress End-to-End',
        category: 'Testing',
        whyItMatters: 'Automation testing',
        priority: 'High',
        estimatedHours: 10,
        learningObjectives: ['Write first test'],
        resources: [],
        practicalProject: { title: 'Test suite' },
        completionCriteria: ['All tests pass'],
        status: 'not_started'
      }
    ];

    milestoneRepository.createMany(milestones);

    // 3. Retrieve milestones
    const retrievedMilestones = milestoneRepository.findByAnalysisId(testId);
    assert.strictEqual(retrievedMilestones.length, 1);
    assert.strictEqual(retrievedMilestones[0].skill, 'Cypress End-to-End');

    // 4. Update milestone status
    const updated = milestoneRepository.updateStatus(milestoneId, testId, 'completed');
    assert.strictEqual(updated.status, 'completed');
    assert.ok(updated.completedAt);

    // 5. Delete analysis (should cascade)
    const deleted = analysisRepository.deleteById(testId);
    assert.strictEqual(deleted, true);

    const postDeleteAnalysis = analysisRepository.findById(testId);
    assert.strictEqual(postDeleteAnalysis, null);

    const postDeleteMilestones = milestoneRepository.findByAnalysisId(testId);
    assert.strictEqual(postDeleteMilestones.length, 0);
  });
});
