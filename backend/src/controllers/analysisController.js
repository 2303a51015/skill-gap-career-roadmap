const { v4: uuidv4 } = require('uuid');
const { extractTextFromFile, safeUnlink } = require('../services/textExtractor');
const { createAnalysisInputSchema } = require('../validators/analysisSchemas');
const { performSkillGapAnalysis } = require('../services/ai/aiService');
const { calculateDeterministicScore } = require('../services/scoringService');
const analysisRepository = require('../database/repositories/analysisRepository');
const milestoneRepository = require('../database/repositories/milestoneRepository');
const logger = require('../utils/logger');

const analysisController = {
  /**
   * Quick text extraction preview endpoint.
   * Allows candidate to inspect what the parser reads from their resume.
   */
  extractPreview: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'Please upload a resume file (PDF, DOCX, or TXT) to extract text preview.'
          }
        });
      }

      const extractionResult = await extractTextFromFile(req.file);

      return res.status(200).json({
        success: true,
        data: {
          textPreview: extractionResult.text.slice(0, 1500),
          totalCharacters: extractionResult.charCount,
          totalWords: extractionResult.wordCount,
          pageCount: extractionResult.pageCount,
          isTruncated: extractionResult.text.length > 1500
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Full Skill Gap Analysis endpoint.
   */
  createAnalysis: async (req, res, next) => {
    // Multer files: req.files['resume'] and optional req.files['jobDescriptionFile']
    const resumeFile = req.files && req.files['resume'] ? req.files['resume'][0] : req.file;
    const jdFile = req.files && req.files['jobDescriptionFile'] ? req.files['jobDescriptionFile'][0] : null;

    try {
      // 1. Verify resume file is provided
      if (!resumeFile) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_RESUME',
            message: 'A resume file (PDF, DOCX, or TXT) is required for analysis.'
          }
        });
      }

      // 2. Validate form inputs
      const validatedInput = createAnalysisInputSchema.parse(req.body);

      // 3. Extract text from resume
      logger.info(`Extracting text from resume file: ${resumeFile.originalname}`);
      const resumeExtraction = await extractTextFromFile(resumeFile);
      const resumeText = resumeExtraction.text;

      // 4. Extract or read job description text
      let jobDescriptionText = validatedInput.jobDescription || '';
      if (jdFile) {
        logger.info(`Extracting text from job description file: ${jdFile.originalname}`);
        const jdExtraction = await extractTextFromFile(jdFile);
        jobDescriptionText = jdExtraction.text;
      }

      if (!jobDescriptionText || jobDescriptionText.trim().length < 30) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_JOB_DESCRIPTION',
            message: 'Please provide a meaningful job description (at least 30 characters) either by pasting text or uploading a document.'
          }
        });
      }

      // 5. Perform AI analysis (Gemini or Mock)
      logger.info(`Invoking AI engine for target role: ${validatedInput.targetRole}`);
      const aiResult = await performSkillGapAnalysis({
        resumeText,
        jobDescription: jobDescriptionText,
        targetRole: validatedInput.targetRole,
        experienceLevel: validatedInput.experienceLevel,
        dailyHours: validatedInput.dailyHours,
        durationWeeks: validatedInput.durationWeeks,
        learningStyle: validatedInput.learningStyle
      });

      // 6. Compute deterministic, transparent score using verified backend scoring engine
      const scoring = calculateDeterministicScore({
        matchingSkills: aiResult.matchingSkills,
        partialSkills: aiResult.partialSkills,
        missingSkills: aiResult.missingOrUnverifiedSkills,
        qualificationEvaluation: aiResult.qualificationEvaluation,
        experienceEvaluation: aiResult.experienceEvaluation,
        experienceLevel: validatedInput.experienceLevel
      });

      // 7. Persist analysis record
      const analysisId = uuidv4();
      const analysisRecord = {
        id: analysisId,
        targetRole: validatedInput.targetRole,
        experienceLevel: validatedInput.experienceLevel,
        dailyHours: validatedInput.dailyHours,
        durationWeeks: validatedInput.durationWeeks,
        learningStyle: validatedInput.learningStyle,
        matchScore: scoring.finalScore,
        scoreExplanation: scoring.scoreExplanation,
        matchingSkills: aiResult.matchingSkills,
        partialSkills: aiResult.partialSkills,
        missingSkills: aiResult.missingOrUnverifiedSkills,
        additionalSkills: aiResult.additionalSkills,
        qualificationGaps: aiResult.qualificationGaps,
        experienceGaps: aiResult.experienceGaps,
        strengths: aiResult.strengths,
        resumeImprovements: aiResult.resumeImprovements,
        limitations: aiResult.limitations,
        extractedResumePreview: resumeText.slice(0, 300) + '...',
        jobDescriptionSnippet: jobDescriptionText.slice(0, 300) + '...'
      };

      analysisRepository.create(analysisRecord);

      // 8. Persist roadmap milestones
      const milestones = (aiResult.roadmap || []).map((m, index) => ({
        id: uuidv4(),
        analysisId,
        milestoneIndex: m.milestoneIndex || index + 1,
        weekRange: m.weekRange || `Week ${index + 1}`,
        skill: m.skill,
        category: m.category || 'Core Technical',
        whyItMatters: m.whyItMatters,
        priority: m.priority || 'Medium',
        estimatedHours: m.estimatedHours || 10,
        learningObjectives: m.learningObjectives || [],
        resources: m.resources || [],
        practicalProject: m.practicalProject || {},
        completionCriteria: m.completionCriteria || [],
        status: 'not_started'
      }));

      const savedMilestones = milestoneRepository.createMany(milestones);

      logger.info(`Successfully completed analysis [${analysisId}] with match score: ${scoring.finalScore}%`);

      return res.status(201).json({
        success: true,
        data: {
          analysis: {
            ...analysisRecord,
            scoreBand: scoring.band,
            scoreBandDescription: scoring.bandDescription,
            categoryBreakdown: scoring.categoryBreakdown
          },
          milestones: savedMilestones
        }
      });
    } catch (err) {
      next(err);
    } finally {
      // Ensure any lingering multer temp files are cleaned
      if (resumeFile && resumeFile.path) safeUnlink(resumeFile.path);
      if (jdFile && jdFile.path) safeUnlink(jdFile.path);
    }
  },

  /**
   * Retrieves summary history of all past saved analyses.
   */
  getAllAnalyses: async (req, res, next) => {
    try {
      const analyses = analysisRepository.findAll();
      return res.status(200).json({
        success: true,
        data: analyses
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Retrieves single analysis by ID with full details and roadmap milestones.
   */
  getAnalysisById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const analysis = analysisRepository.findById(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No analysis found with ID "${id}".`
          }
        });
      }

      const milestones = milestoneRepository.findByAnalysisId(id);

      // Re-calculate category breakdown for chart visualization
      const scoring = calculateDeterministicScore({
        matchingSkills: analysis.matchingSkills,
        partialSkills: analysis.partialSkills,
        missingSkills: analysis.missingSkills,
        qualificationEvaluation: {},
        experienceEvaluation: {},
        experienceLevel: analysis.experienceLevel
      });

      return res.status(200).json({
        success: true,
        data: {
          analysis: {
            ...analysis,
            scoreBand: scoring.band,
            scoreBandDescription: scoring.bandDescription,
            categoryBreakdown: scoring.categoryBreakdown
          },
          milestones
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Deletes a saved analysis by ID.
   */
  deleteAnalysis: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = analysisRepository.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Analysis with ID "${id}" could not be found or was already deleted.`
          }
        });
      }

      logger.info(`Deleted analysis record: ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Analysis record and associated roadmap milestones were permanently deleted.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = analysisController;
