import React, { useState } from 'react';
import Register from './Register';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('access_token', data.access_token);
      setLoading(false);
      if (onLogin) onLogin();
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <>
        <Register onRegistered={() => setShowRegister(false)} />
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => setShowRegister(false)} style={{ marginTop: 8 }}>
            Already have an account? Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleLogin} style={{ margin: '2rem auto', maxWidth: 320 }}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />  ``
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ textAlign: 'center' }}>
        <button type="button" onClick={() => setShowRegister(true)} style={{ marginTop: 8 }}>
          Don&apos;t have an account? Register
        </button>
        <button type="button" onClick={() => onLogin && onLogin({ isGuest: true })} style={{ marginTop: 8, marginLeft: 8 }}>
          Play as Guest
        </button>
      </div>
    </>
  );
}

export default Login; 