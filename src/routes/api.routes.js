const express = require('express');
const router = express.Router();
const controller = require('../controllers/lead.controller');
const upload = require('../middleware/upload');

// Input APIs
router.post('/offer', controller.saveOffer);
router.post('/leads/upload', upload.single('leadsFile'), controller.uploadLeads);

// Scoring Pipeline API
router.post('/score', controller.scoreLeads);

// Output API
router.get('/results', controller.getResults);
router.get('/results/export', controller.exportResults);


module.exports = router;