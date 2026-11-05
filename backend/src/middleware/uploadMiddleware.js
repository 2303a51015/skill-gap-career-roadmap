const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');

const allowedExtensions = ['.pdf', '.docx', '.txt'];
const allowedMimes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/msword'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `upload-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) || allowedMimes.includes(mime)) {
    cb(null, true);
  } else {
    const err = new Error(
      `Invalid file format "${ext}". Only PDF (.pdf), Word (.docx), and plain text (.txt) files are supported.`
    );
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 // e.g. 5MB
  }
});

module.exports = upload;
