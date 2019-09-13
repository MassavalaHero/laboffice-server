const express = require('express');
const router = express.Router();

const ImageCtrl = require('../controllers/images');

router.post('/upload-image', ImageCtrl.UploadImage);

module.exports = router;
