process.env.NODE_ENV = 'test';
process.env.AI_PROVIDER = 'mock';

const env = require('../src/config/env');
env.NODE_ENV = 'test';
env.AI_PROVIDER = 'mock';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

describe('Backend REST API Endpoints', () => {
  let createdAnalysisId = null;
  let sampleMilestoneId = null;

  test('GET /api/health returns 200 with system diagnostics', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'ok');
    assert.strictEqual(res.body.data.database.status, 'healthy');
  });

  test('POST /api/analyses successfully creates analysis using mock AI', async () => {
    const resumeTextContent = `
      John Doe
      Education: B.Tech in Computer Science
      Skills: JavaScript, React, Node.js, Express.js, SQL, Git
      Experience: Built e-commerce web platform using React and Node.js REST API with SQL database.
    `;

    const jobDescriptionContent = `
      We are hiring a Full Stack Developer!
      Requirements:
      - JavaScript, React, Node.js, Express.js
      - PostgreSQL or SQL databases
      - Docker containerization
      - CI/CD deployment pipelines
      - B.Tech or B.S. degree in Computer Science
    `;

    const res = await request(app)
      .post('/api/analyses')
      .field('targetRole', 'Full Stack Developer')
      .field('experienceLevel', 'Fresher')
      .field('dailyHours', '3')
      .field('durationWeeks', '8')
      .field('learningStyle', 'Mixed')
      .field('jobDescription', jobDescriptionContent)
      .field('userConsent', 'true')
      .attach('resume', Buffer.from(resumeTextContent), 'john_doe_resume.txt');

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.analysis);
    assert.ok(res.body.data.analysis.id);
    assert.ok(typeof res.body.data.analysis.matchScore === 'number');
    assert.ok(Array.isArray(res.body.data.milestones));
    assert.ok(res.body.data.milestones.length > 0);

    createdAnalysisId = res.body.data.analysis.id;
    sampleMilestoneId = res.body.data.milestones[0].id;
  });

  test('GET /api/analyses retrieves saved analysis list', async () => {
    const res = await request(app).get('/api/analyses');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.some((a) => a.id === createdAnalysisId));
  });

  test('GET /api/analyses/:id retrieves complete analysis record', async () => {
    const res = await request(app).get(`/api/analyses/${createdAnalysisId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.analysis.id, createdAnalysisId);
    assert.ok(Array.isArray(res.body.data.milestones));
  });

  test('PATCH /api/analyses/:id/roadmap/:milestoneId updates milestone status', async () => {
    const res = await request(app)
      .patch(`/api/analyses/${createdAnalysisId}/roadmap/${sampleMilestoneId}`)
      .send({ status: 'in_progress' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'in_progress');
  });

  test('GET /api/analyses/:id/report returns downloadable PDF', async () => {
    const res = await request(app)
      .get(`/api/analyses/${createdAnalysisId}/report`)
      .responseType('blob');

    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('application/pdf'));
  });

  test('GET /api/analyses/:id/export-json returns downloadable structured JSON', async () => {
    const res = await request(app).get(`/api/analyses/${createdAnalysisId}/export-json`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('application/json'));
    assert.strictEqual(res.body.analysis.id, createdAnalysisId);
  });

  test('DELETE /api/analyses/:id removes the analysis', async () => {
    const res = await request(app).delete(`/api/analyses/${createdAnalysisId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const getRes = await request(app).get(`/api/analyses/${createdAnalysisId}`);
    assert.strictEqual(getRes.status, 404);
  });
});
