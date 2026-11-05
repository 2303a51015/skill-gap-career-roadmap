const db = require('../connection');

const milestoneRepository = {
  createMany: (milestones) => {
    if (!milestones || milestones.length === 0) return [];

    const sql = `
      INSERT INTO milestones (
        id, analysis_id, milestone_index, week_range, skill, category,
        why_it_matters, priority, estimated_hours, learning_objectives,
        resources, practical_project, completion_criteria, status,
        completed_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    for (const m of milestones) {
      db.run(sql, [
        m.id,
        m.analysisId,
        m.milestoneIndex,
        m.weekRange,
        m.skill,
        m.category || 'Technical',
        m.whyItMatters,
        m.priority || 'Medium',
        m.estimatedHours || 0,
        JSON.stringify(m.learningObjectives || []),
        JSON.stringify(m.resources || []),
        JSON.stringify(m.practicalProject || {}),
        JSON.stringify(m.completionCriteria || []),
        m.status || 'not_started',
        m.completedAt || null,
        m.createdAt || now
      ]);
    }

    return milestoneRepository.findByAnalysisId(milestones[0].analysisId);
  },

  findByAnalysisId: (analysisId) => {
    const rows = db.query(
      'SELECT * FROM milestones WHERE analysis_id = ? ORDER BY milestone_index ASC',
      [analysisId]
    );

    return rows.map((row) => ({
      id: row.id,
      analysisId: row.analysis_id,
      milestoneIndex: row.milestone_index,
      weekRange: row.week_range,
      skill: row.skill,
      category: row.category,
      whyItMatters: row.why_it_matters,
      priority: row.priority,
      estimatedHours: Number(row.estimated_hours),
      learningObjectives: JSON.parse(row.learning_objectives || '[]'),
      resources: JSON.parse(row.resources || '[]'),
      practicalProject: JSON.parse(row.practical_project || '{}'),
      completionCriteria: JSON.parse(row.completion_criteria || '[]'),
      status: row.status,
      completedAt: row.completed_at,
      createdAt: row.created_at
    }));
  },

  updateStatus: (milestoneId, analysisId, status) => {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const result = db.run(
      'UPDATE milestones SET status = ?, completed_at = ? WHERE id = ? AND analysis_id = ?',
      [status, completedAt, milestoneId, analysisId]
    );

    if (result.changes === 0) return null;

    const row = db.get('SELECT * FROM milestones WHERE id = ?', [milestoneId]);
    if (!row) return null;

    return {
      id: row.id,
      analysisId: row.analysis_id,
      milestoneIndex: row.milestone_index,
      weekRange: row.week_range,
      skill: row.skill,
      category: row.category,
      whyItMatters: row.why_it_matters,
      priority: row.priority,
      estimatedHours: Number(row.estimated_hours),
      learningObjectives: JSON.parse(row.learning_objectives || '[]'),
      resources: JSON.parse(row.resources || '[]'),
      practicalProject: JSON.parse(row.practical_project || '{}'),
      completionCriteria: JSON.parse(row.completion_criteria || '[]'),
      status: row.status,
      completedAt: row.completed_at,
      createdAt: row.created_at
    };
  },

  deleteByAnalysisId: (analysisId) => {
    const result = db.run('DELETE FROM milestones WHERE analysis_id = ?', [analysisId]);
    return result.changes;
  }
};

module.exports = milestoneRepository;
