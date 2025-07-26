const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient('https://myrsirdrsmbxjaawmjmw.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnNpcmRyc21ieGphYXdtam13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDc5MDMsImV4cCI6MjA2ODcyMzkwM30.wptTO7MZdBGyudIjZkYSpJAthxFb8aiPaLOnoBX54Lo'
);

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: password
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ user: data.user });  
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ user: data.user, access_token: data.session.access_token });
});

app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user });
});

const snippetRoute = require('./routes/snippet');
app.use('/api/snippet', snippetRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
