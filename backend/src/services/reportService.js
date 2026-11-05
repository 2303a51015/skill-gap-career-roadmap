const PDFDocument = require('pdfkit');

/**
 * Generates a clean, professional PDF report for a given analysis and roadmap.
 *
 * @param {Object} analysis - The full analysis object from DB
 * @param {Array} milestones - List of milestones for this analysis
 * @returns {PDFKit.PDFDocument} - Streaming PDFDocument instance
 */
function generatePdfReport(analysis, milestones = []) {
  const doc = new PDFDocument({
    margin: 45,
    size: 'A4',
    bufferPages: true,
    info: {
      Title: `Career Roadmap & Skill Gap Report - ${analysis.targetRole}`,
      Author: 'AI Skill Gap Career Roadmap System',
      Subject: 'Academic Capstone Project Career Evaluation',
      Keywords: 'Skill Gap, Career Roadmap, Resume Analysis, Gemini AI'
    }
  });

  const navy = '#0F172A';
  const blue = '#2563EB';
  const darkGray = '#334155';
  const lightGray = '#64748B';
  const green = '#16A34A';
  const amber = '#D97706';
  const red = '#DC2626';

  // --- HEADER BANNER ---
  doc
    .rect(0, 0, doc.page.width, 95)
    .fill(navy);

  doc
    .fillColor('#FFFFFF')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('CAREER INTELLIGENCE & SKILL GAP REPORT', 45, 25);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#94A3B8')
    .text('AI-Based Skill Gap Analysis and Personalized Career Roadmap Generation System', 45, 48);

  doc
    .fontSize(9)
    .fillColor('#CBD5E1')
    .text(`Target Role: ${analysis.targetRole}  |  Generated: ${new Date(analysis.createdAt).toLocaleDateString()}  |  ID: ${analysis.id}`, 45, 68);

  doc.y = 115;

  // --- SCORE & EXECUTIVE SUMMARY ---
  doc
    .fillColor(navy)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('1. Executive Compatibility Score', 45, doc.y);

  doc.moveDown(0.4);

  // Score Box
  const scoreBoxY = doc.y;
  doc
    .roundedRect(45, scoreBoxY, doc.page.width - 90, 80, 6)
    .fillAndStroke('#F8FAFC', '#E2E8F0');

  // Match Score Circle / Text
  doc
    .fillColor(blue)
    .fontSize(32)
    .font('Helvetica-Bold')
    .text(`${Math.round(analysis.matchScore)}%`, 65, scoreBoxY + 18);

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor(darkGray)
    .text(`Compatibility Match Score`, 140, scoreBoxY + 18);

  const exp = analysis.scoreExplanation || {};
  const weights = exp.weights || { technicalSkills: 70, qualifications: 15, experience: 15 };
  const comp = exp.componentScores || { technicalSkills: analysis.matchScore, qualifications: 100, experience: 100 };

  doc
    .fontSize(8.5)
    .font('Helvetica')
    .fillColor(lightGray)
    .text(`Weighted Scoring: Technical Skills (${weights.technicalSkills}%) = ${comp.technicalSkills || 0}%  |  Qualifications (${weights.qualifications}%) = ${comp.qualifications || 0}%  |  Experience (${weights.experience}%) = ${comp.experience || 0}%`, 140, scoreBoxY + 36)
    .text(`Experience Stage: ${analysis.experienceLevel}  |  Available Time: ${analysis.dailyHours} hrs/day  |  Duration: ${analysis.durationWeeks} weeks`, 140, scoreBoxY + 52);

  doc.y = scoreBoxY + 95;

  // --- SKILL MATRIX ---
  doc
    .fillColor(navy)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('2. Comprehensive Skill Gap Breakdown', 45, doc.y);

  doc.moveDown(0.4);

  const matching = analysis.matchingSkills || [];
  const partial = analysis.partialSkills || [];
  const missing = analysis.missingSkills || [];
  const additional = analysis.additionalSkills || [];

  // Matching Skills Section
  doc
    .fontSize(10.5)
    .font('Helvetica-Bold')
    .fillColor(green)
    .text(`Verified Matching Skills (${matching.length})`);
  doc.moveDown(0.2);

  if (matching.length === 0) {
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightGray).text('No direct matching skills identified from resume.');
  } else {
    matching.forEach((item) => {
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(darkGray)
        .text(`• ${item.skill} `, { continued: true })
        .font('Helvetica')
        .fillColor(lightGray)
        .text(`[${item.category || 'Tech'}]: ${item.evidenceInResume || 'Evidenced in resume'}`);
    });
  }
  doc.moveDown(0.5);

  // Partially Matching Skills Section
  doc
    .fontSize(10.5)
    .font('Helvetica-Bold')
    .fillColor(amber)
    .text(`Partially Evidenced Skills (${partial.length})`);
  doc.moveDown(0.2);

  if (partial.length === 0) {
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightGray).text('No partial skill gaps identified.');
  } else {
    partial.forEach((item) => {
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(darkGray)
        .text(`• ${item.skill} `, { continued: true })
        .font('Helvetica')
        .fillColor(lightGray)
        .text(`[${item.category || 'Tech'}]: ${item.missingAspect || item.evidenceInResume || 'Needs deeper proof'}`);
    });
  }
  doc.moveDown(0.5);

  // Missing Skills Section
  doc
    .fontSize(10.5)
    .font('Helvetica-Bold')
    .fillColor(red)
    .text(`Missing or Unverified Skills (${missing.length})`);
  doc.moveDown(0.2);

  if (missing.length === 0) {
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightGray).text('No critical skills missing from target role description.');
  } else {
    missing.forEach((item) => {
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(darkGray)
        .text(`• ${item.skill} `, { continued: true })
        .font('Helvetica')
        .fillColor(lightGray)
        .text(`[Priority: ${item.importance || 'High'}]: ${item.rationale || 'Explicitly required by job description'}`);
    });
  }
  doc.moveDown(0.5);

  // Additional Skills Section
  if (additional.length > 0) {
    doc
      .fontSize(10.5)
      .font('Helvetica-Bold')
      .fillColor(blue)
      .text(`Complementary Skills on Resume (${additional.length})`);
    doc.moveDown(0.2);
    const addNames = additional.map(a => a.skill).join(', ');
    doc.fontSize(9).font('Helvetica').fillColor(darkGray).text(addNames);
    doc.moveDown(0.6);
  }

  // --- QUALIFICATIONS & EXPERIENCE GAPS ---
  if (doc.y > 660) doc.addPage();

  doc
    .fillColor(navy)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('3. Qualification & Experience Assessment', 45, doc.y);
  doc.moveDown(0.4);

  const qualGaps = analysis.qualificationGaps || [];
  const expGaps = analysis.experienceGaps || [];

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor(darkGray)
    .text(`• Educational / Certification Status: ${qualGaps.length === 0 ? 'Satisfies documented role prerequisites.' : qualGaps.join('; ')}`)
    .text(`• Experience Seniority Alignment: ${expGaps.length === 0 ? 'Experience stage satisfies role tenure.' : expGaps.join('; ')}`);

  doc.moveDown(0.8);

  // --- ROADMAP MILESTONES ---
  if (doc.y > 640) doc.addPage();

  doc
    .fillColor(navy)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('4. Personalized Career Learning Roadmap', 45, doc.y);
  doc.moveDown(0.4);

  if (milestones.length === 0) {
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightGray).text('No roadmap milestones generated.');
  } else {
    milestones.forEach((m, idx) => {
      if (doc.y > 680) doc.addPage();

      const mBoxY = doc.y;
      doc
        .roundedRect(45, mBoxY, doc.page.width - 90, 68, 4)
        .fillAndStroke('#F1F5F9', '#CBD5E1');

      const statusColor = m.status === 'completed' ? green : m.status === 'in_progress' ? blue : lightGray;
      const statusLabel = m.status === 'completed' ? 'COMPLETED' : m.status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED';

      doc
        .fillColor(blue)
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .text(`${m.weekRange}: ${m.skill} (${m.category || 'Core'})`, 55, mBoxY + 8);

      doc
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .fillColor(statusColor)
        .text(`[${statusLabel}] Priority: ${m.priority}  |  Est. Time: ${m.estimatedHours} hrs`, 55, mBoxY + 22);

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(darkGray)
        .text(`Objective: ${m.whyItMatters || 'Core competency for target role'}`, 55, mBoxY + 34, { width: doc.page.width - 110, height: 16 });

      const prj = m.practicalProject || {};
      doc
        .fontSize(7.5)
        .font('Helvetica-Oblique')
        .fillColor(lightGray)
        .text(`Project Deliverable: ${prj.title || 'Hands-on exercise'} - ${prj.description ? prj.description.slice(0, 95) + '...' : 'Complete exercise'}`, 55, mBoxY + 50, { width: doc.page.width - 110 });

      doc.y = mBoxY + 75;
    });
  }

  doc.moveDown(0.8);

  // --- RESUME IMPROVEMENTS ---
  if (doc.y > 640) doc.addPage();

  doc
    .fillColor(navy)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('5. Role-Tailored Resume Optimization Suggestions', 45, doc.y);
  doc.moveDown(0.4);

  const suggestions = analysis.resumeImprovements || [];
  if (suggestions.length === 0) {
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightGray).text('No specific resume suggestions generated.');
  } else {
    suggestions.forEach((s) => {
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(darkGray)
        .text(`• ${s.section || 'General'}: `, { continued: true })
        .font('Helvetica')
        .fillColor(darkGray)
        .text(`${s.suggestedImprovement}`)
        .font('Helvetica-Oblique')
        .fillColor(lightGray)
        .text(`   Rationale: ${s.rationale}`);
      doc.moveDown(0.3);
    });
  }

  doc.moveDown(0.8);

  // --- DISCLAIMER & ACADEMIC NOTICE ---
  if (doc.y > 680) doc.addPage();

  doc
    .rect(45, doc.y, doc.page.width - 90, 48)
    .fill('#F8FAFC');

  doc
    .fillColor(lightGray)
    .fontSize(7.5)
    .font('Helvetica')
    .text('ACADEMIC CAPSTONE DISCLAIMER & PRIVACY NOTICE:', 55, doc.y - 42)
    .text(
      'This report is generated by an academic capstone assessment system. The compatibility score and roadmap recommendations are deterministic analytics derived from machine-readable resume text and explicit job specifications. They do not constitute employment advice or guarantees of hiring. No personal resume data is permanently stored on external servers.',
      55,
      doc.y - 32,
      { width: doc.page.width - 110 }
    );

  // Add page numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor(lightGray)
      .text(`Page ${i + 1} of ${pages.count}  -  AI-Based Skill Gap Career Roadmap System`, 45, doc.page.height - 30, {
        align: 'center',
        width: doc.page.width - 90
      });
  }

  doc.end();
  return doc;
}

module.exports = {
  generatePdfReport
};
