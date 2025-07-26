const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataDir = path.join(__dirname, '../data');
    const files = fs.readdirSync(dataDir);
    
    const langs = files
      .filter(f => f.startsWith('snippets_') && f.endsWith('.json'))
      .map(f => f.replace('snippets_', '').replace('.json', ''));
    
    res.json(langs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list languages' });
  }
} 