const { test, describe } = require('node:test');
const assert = require('node:assert');
const { calculateDeterministicScore } = require('../src/services/scoringService');

describe('Deterministic Scoring Engine', () => {
  test('returns 100% when all requirements match and qualifications/experience are met', () => {
    const matchingSkills = [
      { skill: 'React', category: 'Frameworks' },
      { skill: 'Node.js', category: 'Frameworks' },
      { skill: 'PostgreSQL', category: 'Databases' }
    ];

    const result = calculateDeterministicScore({
      matchingSkills,
      partialSkills: [],
      missingSkills: [],
      qualificationEvaluation: { meetsRequirement: true, required: 'Degree' },
      experienceEvaluation: { meetsRequirement: true, required: '2 years' },
      experienceLevel: 'Entry Level'
    });

    assert.strictEqual(result.finalScore, 100);
    assert.strictEqual(result.band, 'Strong Match');
    assert.strictEqual(result.scoreExplanation.componentScores.technicalSkills, 100);
    assert.strictEqual(result.scoreExplanation.componentScores.qualifications, 100);
    assert.strictEqual(result.scoreExplanation.componentScores.experience, 100);
  });

  test('weights partial skills at 50% technical credit', () => {
    const matchingSkills = [{ skill: 'JavaScript', category: 'Languages' }];
    const partialSkills = [{ skill: 'TypeScript', category: 'Languages' }]; // 0.5
    const missingSkills = [];

    const result = calculateDeterministicScore({
      matchingSkills,
      partialSkills,
      missingSkills,
      qualificationEvaluation: { meetsRequirement: true },
      experienceEvaluation: { meetsRequirement: true },
      experienceLevel: 'Entry Level'
    });

    // Total required = 2. Tech points = 1.0 + 0.5 = 1.5. Tech score = (1.5 / 2) * 100 = 75%.
    // Weighted = 75 * 0.70 (52.5) + 95 * 0.15 (14.25) + 100 * 0.15 (15) = 81.75 -> 81.8
    assert.strictEqual(result.scoreExplanation.componentScores.technicalSkills, 75);
    assert.strictEqual(result.finalScore, 81.8);
  });

  test('bounds score strictly between 0 and 100 when all skills are missing', () => {
    const missingSkills = [
      { skill: 'Kubernetes', category: 'DevOps' },
      { skill: 'Go', category: 'Languages' },
      { skill: 'GraphQL', category: 'Architecture' }
    ];

    const result = calculateDeterministicScore({
      matchingSkills: [],
      partialSkills: [],
      missingSkills,
      qualificationEvaluation: { meetsRequirement: false, required: 'PhD' },
      experienceEvaluation: { meetsRequirement: false, required: '10 years' },
      experienceLevel: 'Student'
    });

    assert.ok(result.finalScore >= 0 && result.finalScore <= 100);
    assert.strictEqual(result.scoreExplanation.componentScores.technicalSkills, 0);
    assert.strictEqual(result.band, 'Foundational Preparation Needed');
  });

  test('generates aggregated category breakdown correctly for charts', () => {
    const matchingSkills = [
      { skill: 'React', category: 'Frontend' },
      { skill: 'Vue', category: 'Frontend' }
    ];
    const partialSkills = [
      { skill: 'Next.js', category: 'Frontend' },
      { skill: 'Postgres', category: 'Database' }
    ];
    const missingSkills = [
      { skill: 'MongoDB', category: 'Database' }
    ];

    const result = calculateDeterministicScore({
      matchingSkills,
      partialSkills,
      missingSkills,
      qualificationEvaluation: {},
      experienceEvaluation: {},
      experienceLevel: 'Fresher'
    });

    assert.ok(Array.isArray(result.categoryBreakdown));
    const frontendCat = result.categoryBreakdown.find((c) => c.category === 'Frontend');
    assert.ok(frontendCat);
    assert.strictEqual(frontendCat.matching, 2);
    assert.strictEqual(frontendCat.partial, 1);
    assert.strictEqual(frontendCat.total, 3);

    const dbCat = result.categoryBreakdown.find((c) => c.category === 'Database');
    assert.ok(dbCat);
    assert.strictEqual(dbCat.partial, 1);
    assert.strictEqual(dbCat.missing, 1);
    assert.strictEqual(dbCat.total, 2);
  });
});
