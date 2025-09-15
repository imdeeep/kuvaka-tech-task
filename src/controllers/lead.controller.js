const fs = require('fs/promises');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const aiService = require('../services/ai.service');
const scoringService = require('../services/scoring.service');
const { Parser } = require('json2csv')

// Define paths to our temporary data files
const OFFER_PATH = path.join(__dirname, '..', 'data', 'offer.json');
const LEADS_PATH = path.join(__dirname, '..', 'data', 'leads.json');
const RESULTS_PATH = path.join(__dirname, '..', 'data', 'results.json');

// POST /offer
async function saveOffer(req, res) {
  try {
    const offerData = req.body;
    await fs.writeFile(OFFER_PATH, JSON.stringify(offerData, null, 2));
    res.status(200).send({ message: 'Offer details saved.' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving offer.', error: error.message });
  }
}

// POST /leads/upload
async function uploadLeads(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded.' });
    }

    const leads = [];
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => leads.push(row))
      .on('end', async () => {
        await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2));
        res.status(200).send({ message: `${leads.length} leads uploaded successfully.` });
      });
  } catch (error) {
    res.status(500).send({ message: 'Error processing CSV.', error: error.message });
  }
}

// POST /score
async function scoreLeads(req, res) {
  try {
    // Read offer and leads data from files
    const offer = JSON.parse(await fs.readFile(OFFER_PATH, 'utf8'));
    const leads = JSON.parse(await fs.readFile(LEADS_PATH, 'utf8'));

    const results = [];

    for (const lead of leads) {
      // 1. Calculate rule-based score
      const ruleScore = scoringService.calculateRuleScore(lead, offer);

      // 2. Get AI insight and score
      const aiInsight = await aiService.getAiInsight(offer, lead);
      const aiScore = aiInsight.points;
      
      // 3. Calculate final score and assign intent
      const finalScore = ruleScore + aiScore;

      results.push({
        name: lead.name,
        role: lead.role,
        company: lead.company,
        intent: aiInsight.intent,
        score: finalScore,
        reasoning: aiInsight.reasoning,
      });
    }

    // Save results to a file
    await fs.writeFile(RESULTS_PATH, JSON.stringify(results, null, 2));
    res.status(200).send({ message: 'Scoring complete. Results are ready.' });
  } catch (error) {
    res.status(500).send({ message: 'Error during scoring.', error: error.message });
  }
}

// GET /results
async function getResults(req, res) {
  try {
    const results = JSON.parse(await fs.readFile(RESULTS_PATH, 'utf8'));
    res.status(200).json(results);
  } catch (error) {
    res.status(404).send({ message: 'Results not found. Run the scoring process first.', error: error.message });
  }
}

// GET /results/export
async function exportResults(req, res) {
  try {
    // 1. Read the JSON results file
    const resultsJson = JSON.parse(await fs.readFile(RESULTS_PATH, 'utf8'));

    // 2. Define the columns for the CSV
    const fields = ['name', 'role', 'company', 'intent', 'score', 'reasoning'];
    const opts = { fields };

    // 3. Convert JSON to CSV
    const parser = new Parser(opts);
    const csv = parser.parse(resultsJson);

    // 4. Set headers to trigger a file download in the browser
    res.header('Content-Type', 'text/csv');
    res.attachment('results.csv');

    // 5. Send the CSV data as the response
    res.status(200).send(csv);

  } catch (error) {
    res.status(404).send({ message: 'Results not found. Run the scoring process first.', error: error.message });
  }
}


module.exports = {
  saveOffer,
  uploadLeads,
  scoreLeads,
  getResults,
  exportResults
};