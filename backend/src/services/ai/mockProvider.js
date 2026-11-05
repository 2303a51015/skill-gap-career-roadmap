const { aiAnalysisResponseSchema } = require('../../validators/aiResponseSchema');

/**
 * High-fidelity deterministic mock analyzer for automated testing,
 * offline development, and capstone presentation fallback.
 *
 * Inspects real text tokens in the uploaded resume and job description
 * to classify matching, partial, and missing skills accurately without
 * invoking external paid APIs.
 */
async function analyzeWithMock({
  resumeText = '',
  jobDescription = '',
  targetRole = 'Software Developer',
  experienceLevel = 'Entry Level',
  dailyHours = 2,
  durationWeeks = 8,
  learningStyle = 'Mixed'
}) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Common catalog of tech skills to cross-examine
  const skillCatalog = [
    { name: 'JavaScript', category: 'Programming Languages', docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'TypeScript', category: 'Programming Languages', docs: 'https://www.typescriptlang.org/docs/' },
    { name: 'Python', category: 'Programming Languages', docs: 'https://docs.python.org/3/' },
    { name: 'Java', category: 'Programming Languages', docs: 'https://docs.oracle.com/en/java/' },
    { name: 'C++', category: 'Programming Languages', docs: 'https://en.cppreference.com/' },
    { name: 'React', category: 'Frameworks & Libraries', docs: 'https://react.dev' },
    { name: 'Node.js', category: 'Frameworks & Libraries', docs: 'https://nodejs.org/docs/' },
    { name: 'Express.js', category: 'Frameworks & Libraries', docs: 'https://expressjs.com/' },
    { name: 'Next.js', category: 'Frameworks & Libraries', docs: 'https://nextjs.org/docs' },
    { name: 'Django', category: 'Frameworks & Libraries', docs: 'https://docs.djangoproject.com/' },
    { name: 'Spring Boot', category: 'Frameworks & Libraries', docs: 'https://spring.io/projects/spring-boot' },
    { name: 'SQL', category: 'Databases & Storage', docs: 'https://www.postgresql.org/docs/' },
    { name: 'PostgreSQL', category: 'Databases & Storage', docs: 'https://www.postgresql.org/docs/' },
    { name: 'MongoDB', category: 'Databases & Storage', docs: 'https://www.mongodb.com/docs/' },
    { name: 'Redis', category: 'Databases & Storage', docs: 'https://redis.io/docs/' },
    { name: 'Docker', category: 'Cloud & DevOps', docs: 'https://docs.docker.com/' },
    { name: 'Kubernetes', category: 'Cloud & DevOps', docs: 'https://kubernetes.io/docs/' },
    { name: 'AWS', category: 'Cloud & DevOps', docs: 'https://aws.amazon.com/documentation/' },
    { name: 'Git', category: 'Tools & Methodologies', docs: 'https://git-scm.com/doc' },
    { name: 'CI/CD', category: 'Cloud & DevOps', docs: 'https://docs.github.com/en/actions' },
    { name: 'REST APIs', category: 'Architecture & Design', docs: 'https://restfulapi.net/' },
    { name: 'GraphQL', category: 'Architecture & Design', docs: 'https://graphql.org/learn/' },
    { name: 'Data Structures & Algorithms', category: 'Core Computer Science', docs: 'https://cs50.harvard.edu/' },
    { name: 'System Design', category: 'Architecture & Design', docs: 'https://github.com/donnemartin/system-design-primer' }
  ];

  const matchingSkills = [];
  const partialSkills = [];
  const missingOrUnverifiedSkills = [];
  const additionalSkills = [];

  // Evaluate catalog against JD and Resume
  skillCatalog.forEach((item) => {
    const term = item.name.toLowerCase();
    const inJd = jdLower.includes(term);
    const inResume = resumeLower.includes(term);

    if (inJd && inResume) {
      matchingSkills.push({
        skill: item.name,
        category: item.category,
        evidenceInResume: `Found verifiable reference to ${item.name} in resume text.`,
        jobRequirementContext: `Job description explicitly specifies ${item.name}.`,
        relevance: 'High'
      });
    } else if (inJd && !inResume) {
      // Check for partial related evidence
      if ((term === 'typescript' && resumeLower.includes('javascript')) ||
          (term === 'next.js' && resumeLower.includes('react')) ||
          (term === 'postgresql' && resumeLower.includes('sql')) ||
          (term === 'docker' && resumeLower.includes('linux'))) {
        partialSkills.push({
          skill: item.name,
          category: item.category,
          evidenceInResume: `Found related foundational technology, but explicit production depth with ${item.name} is missing.`,
          missingAspect: `Target role demands specific experience with ${item.name}.`,
          bridgingAction: `Build a concrete portfolio project integrating ${item.name}.`,
          relevance: 'High'
        });
      } else {
        missingOrUnverifiedSkills.push({
          skill: item.name,
          category: item.category,
          importance: 'High',
          rationale: `Job description mandates ${item.name}, but no verifiable evidence was detected in resume.`
        });
      }
    } else if (!inJd && inResume) {
      additionalSkills.push({
        skill: item.name,
        category: item.category,
        note: `Complementary skill demonstrated in resume that enhances technical profile.`
      });
    }
  });

  // Guarantee at least some items if JD was very custom
  if (matchingSkills.length === 0 && partialSkills.length === 0 && missingOrUnverifiedSkills.length === 0) {
    missingOrUnverifiedSkills.push({
      skill: `${targetRole} Core Competencies`,
      category: 'Core Engineering',
      importance: 'High',
      rationale: 'Requirements outlined in job posting require dedicated study and demonstration.'
    });
  }

  // Qualifications Evaluation
  const hasDegree = resumeLower.includes('bachelor') || resumeLower.includes('b.tech') || resumeLower.includes('b.e') || resumeLower.includes('degree') || resumeLower.includes('computer science');
  const jdRequiresDegree = jdLower.includes('degree') || jdLower.includes('bachelor') || jdLower.includes('computer science');

  const qualificationEvaluation = {
    required: jdRequiresDegree ? 'B.S. / B.Tech in Computer Science or equivalent technical degree' : 'Relevant technical background or degree',
    candidateStatus: hasDegree ? 'Technical Degree / Coursework documented' : 'Self-taught / non-traditional background evidenced',
    meetsRequirement: hasDegree || !jdRequiresDegree,
    gapDetails: hasDegree ? 'Candidate possesses documented technical educational background.' : 'Job posting prefers a formal CS degree; emphasize practical projects and technical certifications.'
  };

  const qualificationGaps = qualificationEvaluation.meetsRequirement ? [] : ['Formal Computer Science or technical degree preferred by employer'];

  // Experience Evaluation
  const jdRequiresExp = jdLower.includes('years') || jdLower.includes('experience') || jdLower.includes('senior');
  const experienceEvaluation = {
    required: jdRequiresExp ? 'Documented industry or internship experience' : 'Entry-level proficiency',
    candidateStatus: `Candidate stage declared as ${experienceLevel}`,
    meetsRequirement: experienceLevel !== 'Student' || !jdLower.includes('3+ years'),
    gapDetails: experienceLevel === 'Student' || experienceLevel === 'Fresher'
      ? 'Candidate is at entry level; bridging with production-grade portfolio projects will offset formal tenure gaps.'
      : 'Demonstrated experience corresponds to expected seniority.'
  };

  const experienceGaps = experienceEvaluation.meetsRequirement ? [] : ['Practical tenure gap for roles demanding multiple years of commercial experience'];

  // Resume Improvements
  const resumeImprovements = [
    {
      section: 'Impact & Metrics',
      currentObservation: 'Project and experience bullets focus on task descriptions rather than quantifiable business impact.',
      suggestedImprovement: 'Adopt the Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]" with measurable figures (e.g., latency, throughput, users).',
      rationale: 'Technical recruiters and ATS screeners prioritize proven outcomes over passive duty lists.'
    },
    {
      section: 'Targeted Technology Keywords',
      currentObservation: `Missing prominent keywords directly requested by ${targetRole} descriptions.`,
      suggestedImprovement: `Highlight missing/partial skills like ${partialSkills.map(s => s.skill).slice(0, 2).join(', ') || 'Docker, CI/CD'} in project tech-stack tags.`,
      rationale: 'Ensures immediate alignment during initial 6-second recruiter scanning.'
    },
    {
      section: 'Portfolio & Deployment Proof',
      currentObservation: 'Resume lists projects but lacks verifiable live deployment links or architecture diagrams.',
      suggestedImprovement: 'Add live URLs, GitHub repositories with clear READMEs, and test coverage badges for top 2 projects.',
      rationale: 'Demonstrates end-to-end software delivery readiness.'
    }
  ];

  // Strengths
  const strengths = [
    `Strong foundational proficiency evidenced in ${matchingSkills.map(s => s.skill).slice(0, 3).join(', ') || 'core software development'}.`,
    `Declared commitment to ${dailyHours} hours/day across ${durationWeeks} weeks provides ample velocity for targeted upskilling.`,
    'Active engagement with modern software engineering methodologies and problem-solving.'
  ];

  // Dynamic Personalized Roadmap Generation
  const roadmapGaps = [...missingOrUnverifiedSkills, ...partialSkills];
  const totalWeeks = Math.max(2, durationWeeks);
  const weeksPerMilestone = Math.max(1, Math.floor(totalWeeks / Math.max(1, Math.min(5, roadmapGaps.length || 3))));

  const roadmap = [];
  let currentWeek = 1;

  const milestoneThemes = [
    { stage: 'High-Priority Foundational Skills', priority: 'High', type: 'Foundational' },
    { stage: 'Role-Specific Technical Skills', priority: 'High', type: 'Core Technical' },
    { stage: 'Practical Projects & System Architecture', priority: 'Medium', type: 'Portfolio Development' },
    { stage: 'Interview Preparation & System Design', priority: 'Medium', type: 'Interview Preparation' },
    { stage: 'Final Readiness Review & Mock Evaluation', priority: 'High', type: 'Readiness & Capstone' }
  ];

  for (let i = 0; i < Math.min(5, Math.max(3, roadmapGaps.length)); i++) {
    const endWeek = Math.min(totalWeeks, currentWeek + weeksPerMilestone - 1);
    const theme = milestoneThemes[i] || milestoneThemes[milestoneThemes.length - 1];
    const targetSkill = roadmapGaps[i] ? roadmapGaps[i].skill : `${targetRole} Advanced Engineering`;
    const weeklyHours = dailyHours * 7;
    const milestoneHours = Math.round(weeklyHours * Math.max(1, (endWeek - currentWeek + 1)));

    roadmap.push({
      milestoneIndex: i + 1,
      weekRange: `Week ${currentWeek}${endWeek > currentWeek ? ` - ${endWeek}` : ''}`,
      skill: targetSkill,
      category: theme.stage,
      whyItMatters: `Crucial requirement for ${targetRole}; directly addresses identified gap between resume and employer expectations.`,
      priority: theme.priority,
      estimatedHours: milestoneHours,
      learningObjectives: [
        `Master fundamental principles and core patterns of ${targetSkill}.`,
        `Build a working micro-service or production module applying ${targetSkill}.`,
        `Write unit tests and integrate CI/CD automation for the solution.`
      ],
      resources: [
        {
          title: `${targetSkill} Official Documentation & Guides`,
          type: 'Documentation',
          url: 'https://developer.mozilla.org/',
          description: `Authoritative reference documentation and quickstart tutorials for ${targetSkill}.`
        },
        {
          title: `Roadmap.sh Developer Guide for ${targetRole}`,
          type: 'Tutorial',
          url: 'https://roadmap.sh',
          description: 'Community-driven visual learning roadmap and recommended practices.'
        }
      ],
      practicalProject: {
        title: `${targetSkill} Production Capstone Component`,
        description: `Design, implement, and deploy a full-featured module highlighting ${targetSkill} best practices and error handling.`,
        deliverables: [
          'GitHub repository with modular code structure',
          'Automated test suite with >80% code coverage',
          'Live deployment on Vercel/Railway/Render with API docs'
        ]
      },
      completionCriteria: [
        `Pass technical assessment quiz on ${targetSkill} fundamentals with >= 85% score.`,
        `Successfully run all automated test suites and verify zero lint errors.`,
        `Complete a peer code review or simulated viva demonstration.`
      ]
    });

    currentWeek = endWeek + 1;
    if (currentWeek > totalWeeks) break;
  }

  const limitations = [
    'Assessment is strictly bounded by textual evidence extracted from the supplied resume and job description.',
    'Non-standard project acronyms or unlisted personal accomplishments cannot be inferred automatically.',
    'Scoring reflects relative documented alignment, not an absolute hiring probability.'
  ];

  return aiAnalysisResponseSchema.parse({
    targetRole,
    matchingSkills,
    partialSkills,
    missingOrUnverifiedSkills,
    additionalSkills,
    qualificationEvaluation,
    experienceEvaluation,
    qualificationGaps,
    experienceGaps,
    strengths,
    resumeImprovements,
    roadmap,
    limitations
  });
}

module.exports = {
  analyzeWithMock
};
