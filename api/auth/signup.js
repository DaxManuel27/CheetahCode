import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://myrsirdrsmbxjaawmjmw.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnNpcmRyc21ieGphYXdtam13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDc5MDMsImV4cCI6MjA2ODcyMzkwM30.wptTO7MZdBGyudIjZkYSpJAthxFb8aiPaLOnoBX54Lo'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password: password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ user: data.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
} 