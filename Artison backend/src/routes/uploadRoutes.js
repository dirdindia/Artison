const express = require('express');
const multer = require('multer');
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Single file upload (image, video, or doc)
router.post('/single', upload.single('file'), uploadSingle);

// Multiple files upload (images, videos, or docs)
router.post('/multiple', upload.array('files', 10), uploadMultiple);

module.exports = router;
