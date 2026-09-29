const express = require('express');
const router = express.Router();

const { careerForm } = require('../controller/careerController');
const { upload } = require('../utils/awsS3');

router.post(
  '/career-form',
  upload.single('cv'),
  careerForm
);

module.exports = router;