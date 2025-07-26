const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// List available languages
router.get('/languages', (req, res) => {
  const dataDir = path.join(__dirname, '../data');
  fs.readdir(dataDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to list languages' });
    const langs = files
      .filter(f => f.startsWith('snippets_') && f.endsWith('.json'))
      .map(f => f.replace('snippets_', '').replace('.json', ''));
    res.json(langs);
  });
});

// Get random snippet for a language
router.get('/random', (req, res) => {
  const lang = req.query.language || 'javascript';
  const filePath = path.join(__dirname, `../data/snippets_${lang}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'Language not found' });
    let snippets;
    try {
      snippets = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid snippet file' });
    }
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    res.json(randomSnippet);
  });
});

module.exports = router;