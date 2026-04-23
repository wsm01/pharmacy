import { useState } from 'react';

// Using inline SVGs for the icons inside the inputs!
const UserIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" height="20" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" height="20" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const LogoPlaceholder = () => (
   <div style={{
       width: "48px", height: "48px", 
       background: "var(--primary)", color: "white",
       borderRadius: "12px", display: "flex", 
       alignItems: "center", justifyContent: "center",
       margin: "0 auto 16px auto", fontSize: "24px", fontWeight: "bold"
   }}>
       💊
   </div>
);

export function Auth({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  // NEW STATE: Are we currently trying to register or login?
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");

  const API_URL = "http://localhost:3000";

  async function handleAuth() {
      // 1. Empty field validation
      if (!username.trim() || !password.trim()) {
          setAuthMsg("❌ Please fill in all fields.");
          return;
      }

      // 2. Password mismatch validation (Only needed if registering!)
      if (isRegistering && password !== confirmPassword) {
          setAuthMsg("❌ The passwords do not match!");
          return;
      }

      // 3. Determine if we are hitting /register or /login route!
      const type = isRegistering ? 'register' : 'login';

      try {
          const res = await fetch(`${API_URL}/${type}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
          });

          const data = await res.json();

          if (res.ok) {
              if (type === 'login') {
                  localStorage.setItem('token', data.token);
                  onLoginSuccess();
              } else {
                  // Registration Success Flow
                  setAuthMsg("✅ Registered successfully! Please sign in.");
                  setIsRegistering(false); // Automatically flip view back to "Sign In" mode!
                  setPassword("");
                  setConfirmPassword("");
              }
          } else {
              setAuthMsg(`❌ Error: ${data.message || "Failed"}`);
          }
      } catch (err) {
          setAuthMsg("❌ Connection error. Is the backend running?");
      }
  }

  return (
    <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", 
        minHeight: "100vh", backgroundColor: "#f0f4f8" 
    }}>
      <div className="card" style={{
          width: "100%", maxWidth: "420px", 
          padding: "40px", 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        
        <LogoPlaceholder />
        <h2 style={{ textAlign: "center", color: "var(--text-main)", marginBottom: "32px", fontSize: "24px" }}>
            {/* Dynamic Title based on state */}
            {isRegistering ? "Create an Account" : "Sign in to Pulse Pharmacy"}
        </h2>

        {/* Validation Feedback UI */}
        {authMsg && (
            <div style={{
                padding: "12px", marginBottom: "20px", borderRadius: "6px", fontSize: "14px", fontWeight: "500",
                backgroundColor: authMsg.includes("✅") ? "var(--badge-ok-bg)" : "var(--badge-low-bg)",
                color: authMsg.includes("✅") ? "var(--badge-ok-text)" : "var(--badge-low-text)",
                border: `1px solid ${authMsg.includes("✅") ? "#34d399" : "#f87171"}`
            }}>
                {authMsg}
            </div>
        )}
        
        <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4B5563", marginBottom: "8px" }}>Username</label>
            <div style={{ position: "relative" }}>
                <UserIcon />
                <input 
                    type="text" 
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ paddingLeft: "40px", marginBottom: 0, width: "100%" }}
                />
            </div>
        </div>
        
        <div style={{ marginBottom: isRegistering ? "20px" : "30px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4B5563", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
                <LockIcon />
                <input 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ paddingLeft: "40px", marginBottom: 0, width: "100%" }}
                />
            </div>
        </div>

        {/* This Third Box ONLY EXISTS when isRegistering state is true! */}
        {isRegistering && (
            <div style={{ marginBottom: "30px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4B5563", marginBottom: "8px" }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                    <LockIcon />
                    <input 
                        type="password" 
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={{ paddingLeft: "40px", marginBottom: 0, width: "100%" }}
                    />
                </div>
            </div>
        )}
        
        <button 
            className="btn btn-primary" 
            onClick={handleAuth} 
            style={{ width: "100%", padding: "12px", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}
        >
            {/* Dynamic Button Name */}
            {isRegistering ? "Securely Register" : "Sign In"}
        </button>
        
        <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                {/* Dynamic Sub-text */}
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering); // FLIP THE BOOLEAN TOGGLE!
                    setAuthMsg(""); // Clear errors so they don't carry over
                    setPassword(""); // Security reset
                    setConfirmPassword(""); // Security reset
                }} 
                style={{ 
                    background: "transparent", color: "var(--primary)", 
                    border: "none", padding: 0, fontSize: "14px", fontWeight: "600", cursor: "pointer" 
                }}
            >
                {/* Dynamic text linkage */}
                {isRegistering ? "Sign in here" : "Register here"}
            </button>
        </div>
        
      </div>
    </div>
  );
}
