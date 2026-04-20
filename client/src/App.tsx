import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';

export default function App() {
  // 1. App State: Are we logged in?
  // By default, we say "false".
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. The useEffect Hook: This runs ONE time when the user opens the page.
  // This acts exactly like the line of code you had at the bottom of your HTML! 
  // It checks if you left a token in the browser yesterday.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 3. The Logout function
  // We don't need location.reload() anymore, React instantly repaints the screen!
  function handleLogout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false); 
  }

  // 4. The Master JSX (The Architect)
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Pharmacy Management</h1>
      
      {/* This is a "Ternary Operator". It means: 
          if (!isAuthenticated) draw the Auth box. 
          : (else) draw the Dashboard! */}
          
      {!isAuthenticated ? (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <h2 style={{color: "green"}}>Welcome to the Dashboard! (We will build this next!)</h2>
        </div>
      )}
      
    </div>
  );
}
