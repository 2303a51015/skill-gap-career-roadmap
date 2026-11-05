const db = require('../connection');

const analysisRepository = {
  create: (data) => {
    const sql = `
      INSERT INTO analyses (
        id, target_role, experience_level, daily_hours, duration_weeks,
        learning_style, match_score, score_explanation, matching_skills,
        partial_skills, missing_skills, additional_skills, qualification_gaps,
        experience_gaps, strengths, resume_improvements, limitations,
        extracted_resume_preview, job_description_snippet, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    db.run(sql, [
      data.id,
      data.targetRole,
      data.experienceLevel,
      data.dailyHours,
      data.durationWeeks,
      data.learningStyle,
      data.matchScore,
      JSON.stringify(data.scoreExplanation || {}),
      JSON.stringify(data.matchingSkills || []),
      JSON.stringify(data.partialSkills || []),
      JSON.stringify(data.missingSkills || []),
      JSON.stringify(data.additionalSkills || []),
      JSON.stringify(data.qualificationGaps || []),
      JSON.stringify(data.experienceGaps || []),
      JSON.stringify(data.strengths || []),
      JSON.stringify(data.resumeImprovements || []),
      JSON.stringify(data.limitations || []),
      data.extractedResumePreview || '',
      data.jobDescriptionSnippet || '',
      data.createdAt || now,
      data.updatedAt || now
    ]);

    return analysisRepository.findById(data.id);
  },

  findById: (id) => {
    const row = db.get('SELECT * FROM analyses WHERE id = ?', [id]);
    if (!row) return null;

    return {
      id: row.id,
      targetRole: row.target_role,
      experienceLevel: row.experience_level,
      dailyHours: Number(row.daily_hours),
      durationWeeks: Number(row.duration_weeks),
      learningStyle: row.learning_style,
      matchScore: Number(row.match_score),
      scoreExplanation: JSON.parse(row.score_explanation || '{}'),
      matchingSkills: JSON.parse(row.matching_skills || '[]'),
      partialSkills: JSON.parse(row.partial_skills || '[]'),
      missingSkills: JSON.parse(row.missing_skills || '[]'),
      additionalSkills: JSON.parse(row.additional_skills || '[]'),
      qualificationGaps: JSON.parse(row.qualification_gaps || '[]'),
      experienceGaps: JSON.parse(row.experience_gaps || '[]'),
      strengths: JSON.parse(row.strengths || '[]'),
      resumeImprovements: JSON.parse(row.resume_improvements || '[]'),
      limitations: JSON.parse(row.limitations || '[]'),
      extractedResumePreview: row.extracted_resume_preview,
      jobDescriptionSnippet: row.job_description_snippet,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  findAll: (limit = 50) => {
    const rows = db.query(
      `SELECT id, target_role, experience_level, daily_hours, duration_weeks, 
              match_score, created_at, job_description_snippet,
              (SELECT COUNT(*) FROM milestones WHERE analysis_id = analyses.id) as total_milestones,
              (SELECT COUNT(*) FROM milestones WHERE analysis_id = analyses.id AND status = 'completed') as completed_milestones
       FROM analyses 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [limit]
    );

    return rows.map((row) => ({
      id: row.id,
      targetRole: row.target_role,
      experienceLevel: row.experience_level,
      dailyHours: Number(row.daily_hours),
      durationWeeks: Number(row.duration_weeks),
      matchScore: Number(row.match_score),
      jobDescriptionSnippet: row.job_description_snippet,
      totalMilestones: Number(row.total_milestones),
      completedMilestones: Number(row.completed_milestones),
      createdAt: row.created_at
    }));
  },

  deleteById: (id) => {
    // Delete associated milestones first (defensive, even with ON DELETE CASCADE)
    db.run('DELETE FROM milestones WHERE analysis_id = ?', [id]);
    const result = db.run('DELETE FROM analyses WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

module.exports = analysisRepository;
