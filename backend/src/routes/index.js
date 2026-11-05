const express = require('express');
const healthRoutes = require('./healthRoutes');
const analysisRoutes = require('./analysisRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/analyses', analysisRoutes);

module.exports = router;
