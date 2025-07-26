import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TypingArea from './TypingArea';
import Login from './Login';

export function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Navbar({ onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  // Placeholder for stats click
  const handleStats = () => {
    alert('Stats feature coming soon!');
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span
        className="navbar-title"
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer' }}
      >
        CheetahCode
      </span>
      <div style={{ position: 'relative', marginRight: '5rem' }}>
        <button
          className="profile-icon-btn"
          onClick={() => setShowMenu((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 32,
            width: 32,
            borderRadius: '50%',
            transition: 'background 0.18s'
          }}
          aria-label="Profile"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c678dd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
          </svg>
        </button>
        {showMenu && (
          <div
            className="profile-dropdown"
            style={{
              position: 'absolute',
              right: 0,
              top: '2.5rem',
              background: '#23272a',
              border: '1px solid #c678dd',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              padding: '0.5rem 1rem',
              zIndex: 1001,
              minWidth: 120
            }}
          >
            <button
              className="stats-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#c678dd',
                cursor: 'pointer',
                fontSize: '1rem',
                marginBottom: '0.5rem',
                width: '100%',
                padding: '0.5rem 0',
                borderRadius: 4
              }}
              onClick={() => {
                setShowMenu(false);
                handleStats();
              }}
            >
              Stats
            </button>
            <div style={{ borderTop: '1px solid #444', margin: '0.5rem 0' }} />
            <button
              className="logout-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#c678dd',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%',
                padding: '0.5rem 0',
                borderRadius: 4
              }}
              onClick={() => {
                setShowMenu(false);
                onLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Simple check for token presence - no validation to prevent blank screen
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (opts) => {
    console.log('Login called with:', opts);
    if (opts && opts.isGuest) {
      setIsGuest(true);
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      setIsGuest(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  console.log('App render - isAuthenticated:', isAuthenticated, 'isGuest:', isGuest);

  return (
    <>
      <Navbar onLogout={handleLogout} />
      {(isAuthenticated || isGuest) ? <TypingArea isGuest={isGuest} /> : <Login onLogin={handleLogin} />}
    </>
  );
}

export default App;
