const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const logger = require('../utils/logger');

/**
 * Safely unlinks a file from disk if it exists.
 */
function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.debug(`Cleaned up temporary file: ${filePath}`);
    }
  } catch (err) {
    logger.warn(`Failed to clean up temporary file ${filePath}: ${err.message}`);
  }
}

/**
 * Normalizes extracted text: converts CRLF to LF, removes unprintable chars, trims excessive whitespace.
 */
function normalizeText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts plain text from an uploaded file (PDF, DOCX, or TXT).
 * Automatically cleans up the temporary file on disk afterwards.
 *
 * @param {Object} file - Multer file object
 * @returns {Promise<{ text: string, charCount: number, wordCount: number, pageCount?: number }>}
 */
async function extractTextFromFile(file) {
  if (!file || !file.path) {
    throw new Error('No valid file provided for text extraction.');
  }

  const filePath = file.path;
  const originalName = file.originalname || '';
  const ext = path.extname(originalName).toLowerCase();
  const mimeType = file.mimetype || '';

  try {
    let extractedText = '';
    let pageCount = null;

    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text || '';
      pageCount = pdfData.numpages || 1;
    } else if (
      ext === '.docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value || '';
    } else if (ext === '.txt' || mimeType === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error(
        `Unsupported file format "${ext}". Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.`
      );
    }

    const cleanText = normalizeText(extractedText);

    if (!cleanText || cleanText.length < 20) {
      throw new Error(
        'The document contains insufficient readable text. If you uploaded a scanned image PDF, please provide a document with selectable, machine-readable text.'
      );
    }

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return {
      text: cleanText,
      charCount: cleanText.length,
      wordCount,
      pageCount
    };
  } finally {
    // Crucial requirement: always clean up temporary files immediately!
    safeUnlink(filePath);
  }
}

module.exports = {
  extractTextFromFile,
  normalizeText,
  safeUnlink
};
