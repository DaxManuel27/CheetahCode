import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="home-container">
      <h1>Welcome to CheetahCode!</h1>
      <p>Sharpen your coding skills. Track your stats. Compete with others.</p>
      <button className="play-now-btn" onClick={() => loginWithRedirect()}>
        Play Now
      </button>
    </div>
  );
}

export default Home; 