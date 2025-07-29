const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const lang = req.query.language || 'javascript';
    const filePath = path.join(__dirname, `../data/snippets_${lang}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Language not found' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const snippets = JSON.parse(data);
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    
    res.json(randomSnippet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get snippet' });
  }
} 