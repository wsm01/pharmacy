import { useState, useEffect } from 'react';
import { t } from '../utils/i18n';

export function Settings() {
  // User Profile State
  const [profile, setProfile] = useState({ display_name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Pharmacy Details State
  const [pharmacy, setPharmacy] = useState({ name: '', address: '', contact_number: '' });
  const [isPharmacyUpdating, setIsPharmacyUpdating] = useState(false);

  // Appearance State
  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains('dark-mode'));
  const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'English');

  const API_URL = "http://localhost:3000";

  // Load Initial Data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function loadData() {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch User Profile
        const profileRes = await fetch(`${API_URL}/user-profile`, { headers });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile({ display_name: profileData.display_name || '', email: profileData.email || '' });
        }

        // Fetch Pharmacy Details
        const pharmacyRes = await fetch(`${API_URL}/pharmacy-details`, { headers });
        if (pharmacyRes.ok) {
          const pharmacyData = await pharmacyRes.json();
          setPharmacy({ 
            name: pharmacyData.name || '', 
            address: pharmacyData.address || '', 
            contact_number: pharmacyData.contact_number || '' 
          });
        }
      } catch (err) {
        console.error("Error loading settings data:", err);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/user-profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(profile)
        });
        if (res.ok) alert('Profile updated successfully');
        else alert('Failed to update profile');
    } catch (err) {
        console.error(err);
    }
    setIsProfileUpdating(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordUpdating(true);
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/user-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(passwordForm)
        });
        if (res.ok) {
            alert('Password changed successfully');
            setPasswordForm({ oldPassword: '', newPassword: '' });
        } else {
            const err = await res.json();
            alert(`Error: ${err.message}`);
        }
    } catch (err) {
        console.error(err);
    }
    setIsPasswordUpdating(false);
  };

  const handlePharmacyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPharmacyUpdating(true);
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/pharmacy-details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(pharmacy)
        });
        if (res.ok) alert('Pharmacy details updated successfully');
        else alert('Failed to update pharmacy details');
    } catch (err) {
        console.error(err);
    }
    setIsPharmacyUpdating(false);
  };

  const toggleDarkMode = () => {
    const willBeDark = !isDarkMode;
    setIsDarkMode(willBeDark);
    if (willBeDark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  };

  // CSV Export utility
  const exportCSV = async (endpoint: string, filename: string) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch data for export");
        
        const data = await res.json();
        if (data.length === 0) return alert("No data to export");

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row: any) => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error(err);
        alert("Error exporting CSV");
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
      
      {/* USER PROFILE CARD */}
      <div className="glass-card">
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>👤 {t('user_profile')}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{profile.display_name || 'Admin User'}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Administrator</p>
            </div>
        </div>

        <form onSubmit={handleProfileUpdate} style={{ marginBottom: '24px' }}>
            <label>{t('display_name')}</label>
            <input type="text" value={profile.display_name} onChange={e => setProfile({...profile, display_name: e.target.value})} placeholder="Your Name" />
            
            <label>{t('email_address')}</label>
            <input type="text" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="admin@pharmacy.com" />
            
            <button type="submit" className="btn btn-primary" disabled={isProfileUpdating}>
                {isProfileUpdating ? 'Saving...' : t('update_profile')}
            </button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

        <form onSubmit={handlePasswordChange}>
            <h4 style={{ margin: '0 0 16px 0' }}>{t('change_password')}</h4>
            <label>{t('current_password')}</label>
            <input type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} required />
            
            <label>{t('new_password')}</label>
            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required />
            
            <button type="submit" className="btn" style={{ background: 'var(--sidebar-bg)' }} disabled={isPasswordUpdating}>
                {isPasswordUpdating ? 'Changing...' : t('change_password')}
            </button>
        </form>
      </div>

      {/* PHARMACY INFO CARD */}
      <div className="glass-card">
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🏥 {t('pharmacy_info')}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>This information appears on receipts and invoices.</p>
        
        <form onSubmit={handlePharmacyUpdate}>
            <label>{t('pharmacy_name')}</label>
            <input type="text" value={pharmacy.name} onChange={e => setPharmacy({...pharmacy, name: e.target.value})} placeholder="Pulse Pharmacy" />
            
            <label>{t('official_address')}</label>
            <input type="text" value={pharmacy.address} onChange={e => setPharmacy({...pharmacy, address: e.target.value})} placeholder="123 Health Ave, Medical District" />
            
            <label>{t('contact_number')}</label>
            <input type="text" value={pharmacy.contact_number} onChange={e => setPharmacy({...pharmacy, contact_number: e.target.value})} placeholder="+1 (555) 123-4567" />
            
            <button type="submit" className="btn btn-primary" disabled={isPharmacyUpdating} style={{ width: '100%' }}>
                {isPharmacyUpdating ? 'Saving details...' : t('save_pharmacy_details')}
            </button>
        </form>
      </div>

      {/* APPEARANCE CARD */}
      <div className="glass-card">
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>✨ {t('appearance_regional')}</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
                <strong style={{ display: 'block' }}>{t('dark_mode')}</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toggle dark interface theme</span>
            </div>
            <button 
                onClick={toggleDarkMode}
                className="btn" 
                style={{ background: isDarkMode ? 'var(--primary)' : 'var(--surface-disabled)', color: isDarkMode ? 'white' : 'var(--text-main)' }}
            >
                {isDarkMode ? '🌙 Enabled' : '☀️ Disabled'}
            </button>
        </div>

        <div style={{ paddingTop: '20px' }}>
            <label>{t('interface_language')}</label>
            <select 
                value={language} 
                onChange={e => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    localStorage.setItem('appLanguage', newLang);
                    window.location.reload();
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '14px' }}
            >
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="Arabic">العربية (Arabic)</option>
            </select>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Applies instantly across the application.</p>
        </div>
      </div>

      {/* DATA MANAGEMENT CARD */}
      <div className="glass-card">
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>📊 {t('data_management')}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>Export your database tables to CSV format for external analysis.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
                onClick={() => exportCSV('medicines', 'inventory_export.csv')} 
                className="btn" 
                style={{ background: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <span>📦 {t('export_inventory')}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>

            <button 
                onClick={() => exportCSV('sales-history', 'sales_history_export.csv')} 
                className="btn" 
                style={{ background: '#3B82F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <span>🧾 {t('export_sales')}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
        </div>
      </div>

    </div>
  );
}
