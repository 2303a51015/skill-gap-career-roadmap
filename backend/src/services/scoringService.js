/**
 * Deterministic Backend Scoring Service
 *
 * Implements a transparent, reproducible scoring methodology combining:
 * 1. Technical Skill Coverage (70%)
 * 2. Qualification & Educational Alignment (15%)
 * 3. Experience & Seniority Level Alignment (15%)
 *
 * Guaranteed bounding between 0 and 100.
 */

function calculateDeterministicScore({
  matchingSkills = [],
  partialSkills = [],
  missingSkills = [],
  qualificationEvaluation = {},
  experienceEvaluation = {},
  experienceLevel = 'Entry Level'
}) {
  const matchCount = matchingSkills.length;
  const partialCount = partialSkills.length;
  const missingCount = missingSkills.length;
  const totalRequiredSkills = matchCount + partialCount + missingCount;

  // 1. Technical Skills Score (Weight: 70%)
  let techScore = 0;
  let techExplanation = '';

  if (totalRequiredSkills > 0) {
    const rawTechPoints = (matchCount * 1.0) + (partialCount * 0.5);
    techScore = Math.min(100, Math.max(0, (rawTechPoints / totalRequiredSkills) * 100));
    techExplanation = `${matchCount} full matches (1.0x) and ${partialCount} partial matches (0.5x) out of ${totalRequiredSkills} identified requirements.`;
  } else {
    // If no explicit technical skills were identified in the job description
    techScore = 50;
    techExplanation = 'No explicit technical skills could be extracted from the target job description; default neutral baseline assigned.';
  }

  // 2. Qualifications Score (Weight: 15%)
  let qualScore = 100;
  let qualExplanation = '';
  const meetsQual = qualificationEvaluation.meetsRequirement;
  const qualRequired = qualificationEvaluation.required || '';

  if (!qualRequired || qualRequired.toLowerCase().includes('not explicitly') || qualRequired.toLowerCase().includes('standard')) {
    qualScore = 95;
    qualExplanation = 'No stringent degree/certification requirements specified; baseline eligibility granted.';
  } else if (meetsQual === true) {
    qualScore = 100;
    qualExplanation = 'Candidate credentials satisfy the documented educational and certification requirements.';
  } else {
    qualScore = 40;
    qualExplanation = `Identified qualification gap: ${qualificationEvaluation.gapDetails || 'Target role mandates specific credentials not verified on resume.'}`;
  }

  // 3. Experience Score (Weight: 15%)
  let expScore = 100;
  let expExplanation = '';
  const meetsExp = experienceEvaluation.meetsRequirement;
  const expRequired = experienceEvaluation.required || '';

  if (experienceLevel === 'Student' || experienceLevel === 'Fresher') {
    if (expRequired.toLowerCase().includes('senior') || expRequired.toLowerCase().includes('lead') || expRequired.toLowerCase().includes('5+')) {
      expScore = 30;
      expExplanation = 'Candidate is at student/fresher stage while target role expects significant industry tenure.';
    } else {
      expScore = 90;
      expExplanation = 'Candidate stage aligns with entry-level / foundational career opportunities.';
    }
  } else if (meetsExp === true) {
    expScore = 100;
    expExplanation = 'Candidate demonstrated experience satisfies target position tenure expectations.';
  } else {
    expScore = 50;
    expExplanation = `Experience tenure gap: ${experienceEvaluation.gapDetails || 'Target role seeks more practical domain experience.'}`;
  }

  // Weights
  const weights = {
    technicalSkills: 70,
    qualifications: 15,
    experience: 15
  };

  const weightedTotal =
    (techScore * (weights.technicalSkills / 100)) +
    (qualScore * (weights.qualifications / 100)) +
    (expScore * (weights.experience / 100));

  const finalScore = Math.min(100, Math.max(0, Math.round(weightedTotal * 10) / 10));

  // Determine score classification band
  let band = 'Foundational Preparation Needed';
  let bandDescription = 'Substantial technical skill acquisition and project building required prior to application.';
  if (finalScore >= 85) {
    band = 'Strong Match';
    bandDescription = 'High technical alignment with core requirements; ready for application with targeted polish.';
  } else if (finalScore >= 70) {
    band = 'Moderate-High Match';
    bandDescription = 'Solid foundation with manageable skill gaps that can be bridged within the planned duration.';
  } else if (finalScore >= 50) {
    band = 'Moderate Skill Gap';
    bandDescription = 'Promising potential with several essential technical requirements requiring dedicated study.';
  }

  // Aggregate category breakdown for visualization
  const categoryStats = {};
  const addCategoryItem = (item, type) => {
    const cat = item.category || 'General';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { category: cat, matching: 0, partial: 0, missing: 0, total: 0 };
    }
    categoryStats[cat][type] += 1;
    categoryStats[cat].total += 1;
  };

  matchingSkills.forEach((s) => addCategoryItem(s, 'matching'));
  partialSkills.forEach((s) => addCategoryItem(s, 'partial'));
  missingSkills.forEach((s) => addCategoryItem(s, 'missing'));

  const categories = Object.values(categoryStats);

  return {
    finalScore,
    band,
    bandDescription,
    scoreExplanation: {
      method: 'Weighted skill coverage and qualification alignment',
      weights,
      componentScores: {
        technicalSkills: Math.round(techScore * 10) / 10,
        qualifications: Math.round(qualScore * 10) / 10,
        experience: Math.round(expScore * 10) / 10
      },
      componentExplanations: {
        technicalSkills: techExplanation,
        qualifications: qualExplanation,
        experience: expExplanation
      },
      totalIdentifiedRequirements: totalRequiredSkills,
      disclaimer: 'This score is an analytical estimate based on verifiable resume evidence versus explicit job criteria, not a guarantee of hiring or interview selection.'
    },
    categoryBreakdown: categories
  };
}

module.exports = {
  calculateDeterministicScore
};
