import { useState } from 'react';

interface AuthProps {
  // We use this to tell the main App that we successfully got a token!
  onLoginSuccess: () => void; 
}

export function Auth({ onLoginSuccess }: AuthProps) {
  // 1. THE STATE: This entirely replaces `document.getElementById`
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");

  const API_URL = "http://localhost:3000";

  // 2. THE LOGIC
  async function handleAuth(type: 'login' | 'register') {
      try {
          const res = await fetch(`${API_URL}/${type}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              // We don't read the HTML elements. We just use the React state variables!
              body: JSON.stringify({ username, password })
          });

          const data = await res.json();

          if (res.ok) {
              if (type === 'login') {
                  localStorage.setItem('token', data.token);
                  onLoginSuccess(); // Trigger the success function passed from the parent
              } else {
                  setAuthMsg("Registered! Now try logging in.");
              }
          } else {
              alert(data.message || "Login failed");
          }
      } catch (err) {
          console.error("Connection error:", err);
          alert("Could not connect to server. Is the backend running?");
      }
  }

  // 3. THE JSX (HTML mixed with JavaScript)
  return (
    <div className="box" style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0", borderRadius: "5px" }}>
        <h3>Login or Register</h3>
        
        <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
        />
        <br/><br/>
        
        <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
        />
        <br/><br/>
        
        <button onClick={() => handleAuth('login')}>Login</button>
        <button onClick={() => handleAuth('register')}>Register</button>
        
        <p>{authMsg}</p>
    </div>
  );
}
