const express = require('express');
const router = express.Router();
const { makecall } = require('../controllers/twilioController');

router.post('/makecall', makecall);

module.exports = router;
