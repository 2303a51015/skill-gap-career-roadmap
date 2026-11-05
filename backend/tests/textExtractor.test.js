const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { extractTextFromFile, normalizeText, safeUnlink } = require('../src/services/textExtractor');

describe('Text Extractor Service', () => {
  test('normalizeText strips control characters and excessive whitespace', () => {
    const raw = 'Hello \r\n World!\x00\x05  This is   a test.\n\n\n\nExtra lines.';
    const normalized = normalizeText(raw);
    assert.ok(!normalized.includes('\x00'));
    assert.ok(!normalized.includes('\r'));
    assert.ok(normalized.includes('Hello \n World!'));
  });

  test('extractTextFromFile extracts text from a plain text file and cleans up temp file', async () => {
    const tempPath = path.resolve(__dirname, 'temp_sample.txt');
    fs.writeFileSync(tempPath, 'Senior Software Engineer with 5 years experience in React, Node.js, and PostgreSQL databases.');

    const file = {
      path: tempPath,
      originalname: 'resume.txt',
      mimetype: 'text/plain'
    };

    const result = await extractTextFromFile(file);

    assert.ok(result.text.includes('Senior Software Engineer'));
    assert.strictEqual(typeof result.wordCount, 'number');
    assert.ok(result.wordCount > 5);

    // Verify file was unlinked/cleaned up
    assert.strictEqual(fs.existsSync(tempPath), false);
  });

  test('extractTextFromFile rejects files with insufficient readable text', async () => {
    const tempPath = path.resolve(__dirname, 'temp_empty.txt');
    fs.writeFileSync(tempPath, 'short');

    const file = {
      path: tempPath,
      originalname: 'empty.txt',
      mimetype: 'text/plain'
    };

    await assert.rejects(
      async () => {
        await extractTextFromFile(file);
      },
      /insufficient readable text/i
    );

    // Verify cleaned up even on failure
    assert.strictEqual(fs.existsSync(tempPath), false);
  });

  test('safeUnlink gracefully handles null or non-existent paths', () => {
    assert.doesNotThrow(() => safeUnlink(null));
    assert.doesNotThrow(() => safeUnlink('non_existent_file_path.pdf'));
  });
});
