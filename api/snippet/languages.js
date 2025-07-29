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