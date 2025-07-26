import { useState } from 'react';

export default function Register({ onRegistered }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.error || 'Registration failed');
      } else {
        setMessage('Registration successful! Check your email for confirmation.');
        setEmail('');
        setPassword('');
        if (onRegistered) onRegistered();
      }
    } catch (err) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} style={{ margin: '2rem auto', maxWidth: 320 }}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      {message && <div style={{ color: message.startsWith('Registration successful') ? 'green' : 'red', marginTop: 8 }}>{message}</div>}
    </form>
  );
} 