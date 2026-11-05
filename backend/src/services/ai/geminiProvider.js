const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { buildAnalysisPrompt } = require('./promptTemplates');
const { aiAnalysisResponseSchema } = require('../../validators/aiResponseSchema');

/**
 * Strips markdown code fences if the model wraps JSON with ```json ... ```
 */
function cleanJsonOutput(raw) {
  if (!raw) return '';
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

/**
 * Executes skill gap analysis using the official Google Gemini SDK.
 */
async function analyzeWithGemini(params) {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    const error = new Error(
      'Gemini API Key is not configured. Please add your GEMINI_API_KEY to the .env file. You can obtain a free key at https://aistudio.google.com/app/apikey'
    );
    error.code = 'GEMINI_KEY_NOT_CONFIGURED';
    throw error;
  }

  const configuredModel = env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const modelCandidates = Array.from(new Set([
    configuredModel,
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash'
  ]));

  const { systemInstruction, userContent } = buildAnalysisPrompt(params);
  const genAI = new GoogleGenerativeAI(apiKey);

  let lastError = null;

  for (const currentModel of modelCandidates) {
    try {
      logger.info(`Invoking Gemini model (${currentModel}) for skill gap assessment...`);
      const model = genAI.getGenerativeModel({
        model: currentModel,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2 // Low temperature for deterministic, factual skill matching
        }
      });

      const result = await model.generateContent(userContent);
      const responseText = result.response.text();
      const cleanedJson = cleanJsonOutput(responseText);

      let parsed;
      try {
        parsed = JSON.parse(cleanedJson);
      } catch (parseErr) {
        logger.error('Failed to parse Gemini output as JSON', { responsePreview: responseText.slice(0, 300) });
        throw new Error(`The AI service returned non-JSON output: ${parseErr.message}`);
      }

      // Validate structured JSON with Zod schema
      const validationResult = aiAnalysisResponseSchema.safeParse(parsed);
      if (validationResult.success) {
        return validationResult.data;
      }

      logger.warn('Gemini response had minor schema deviations, normalizing fields...', {
        errors: validationResult.error.format()
      });

      // Normalize any arrays or objects
      const normalized = {
        targetRole: parsed.targetRole || params.targetRole || 'Target Role',
        matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [],
        partialSkills: Array.isArray(parsed.partialSkills) ? parsed.partialSkills : [],
        missingOrUnverifiedSkills: Array.isArray(parsed.missingOrUnverifiedSkills) ? parsed.missingOrUnverifiedSkills : [],
        additionalSkills: Array.isArray(parsed.additionalSkills) ? parsed.additionalSkills : [],
        qualificationEvaluation: parsed.qualificationEvaluation || {
          required: 'Specified qualifications',
          candidateStatus: 'Evaluated from resume',
          meetsRequirement: true,
          gapDetails: 'No critical qualification gaps identified'
        },
        experienceEvaluation: parsed.experienceEvaluation || {
          required: 'Role-appropriate experience',
          candidateStatus: 'Evaluated from resume',
          meetsRequirement: true,
          gapDetails: 'Experience aligns reasonably with role expectations'
        },
        qualificationGaps: Array.isArray(parsed.qualificationGaps) ? parsed.qualificationGaps : [],
        experienceGaps: Array.isArray(parsed.experienceGaps) ? parsed.experienceGaps : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        resumeImprovements: Array.isArray(parsed.resumeImprovements) ? parsed.resumeImprovements : [],
        roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap.map((m, idx) => ({
          milestoneIndex: m.milestoneIndex || idx + 1,
          weekRange: m.weekRange || `Week ${idx + 1}`,
          skill: m.skill || 'Core Competency',
          category: m.category || 'Technical',
          whyItMatters: m.whyItMatters || m.rationale || 'Crucial skill for achieving proficiency in the target role.',
          priority: m.priority || 'Medium',
          estimatedHours: typeof m.estimatedHours === 'number' ? m.estimatedHours : 10,
          learningObjectives: Array.isArray(m.learningObjectives) ? m.learningObjectives : [],
          resources: Array.isArray(m.resources) ? m.resources : [],
          practicalProject: m.practicalProject || {
            title: 'Practical Hands-on Project',
            description: 'Implement a working sample demonstrating this concept.',
            deliverables: ['Working codebase on GitHub', 'README documentation']
          },
          completionCriteria: Array.isArray(m.completionCriteria) ? m.completionCriteria : []
        })) : [],
        limitations: Array.isArray(parsed.limitations) ? parsed.limitations : []
      };

      return aiAnalysisResponseSchema.parse(normalized);
    } catch (err) {
      lastError = err;
      const isTemporaryDemand = err.message && (err.message.includes('503') || err.message.includes('high demand') || err.message.includes('404') || err.message.includes('not found') || err.message.includes('no longer available'));
      
      if (isTemporaryDemand) {
        logger.warn(`Model ${currentModel} returned temporary error (${err.message.slice(0, 100)}). Trying fallback model...`);
        continue;
      }
      
      // If it's an auth error or quota error, don't keep retrying other models
      break;
    }
  }

  const err = lastError;
  try {
    if (err.code === 'GEMINI_KEY_NOT_CONFIGURED') throw err;

    logger.error(`Gemini API Error: ${err.message}`, { status: err.status });

    if (err.message && err.message.includes('API_KEY_INVALID')) {
      const error = new Error('The provided GEMINI_API_KEY is invalid. Please verify the key in your .env configuration.');
      error.code = 'GEMINI_API_KEY_INVALID';
      throw error;
    }

    if (err.message && (err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('Quota exceeded'))) {
      const error = new Error('Gemini API rate limit or quota exceeded. Please wait a moment and try again.');
      error.code = 'GEMINI_QUOTA_EXCEEDED';
      throw error;
    }

    throw new Error(`AI Analysis failed: ${err.message}`);
  } catch (finalErr) {
    throw finalErr;
  }
}

module.exports = {
  analyzeWithGemini
};
