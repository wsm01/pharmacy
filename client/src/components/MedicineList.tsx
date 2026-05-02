import { useState, useEffect } from 'react';
import { t } from '../utils/i18n';

// === MINIMALIST SVG ICONS ===
const SearchIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}}>
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
    </svg>
);
const EditIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
);
const PlusIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
);

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export function MedicineList({ refreshTrigger, onAddNew }: { refreshTrigger: number, onAddNew: () => void }) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  // NEW STATE: Search & Filter Memory
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); 
  
  const API_URL = "http://localhost:3000";

  async function loadMedicines() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL}/medicines`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) {
      alert("Session expired or error fetching data. Please refresh.");
      return;
    }

    const data = await res.json();
    setMedicines(data);
  }

  useEffect(() => { loadMedicines(); }, [refreshTrigger]);

  async function deleteMed(id: number) {
    if (window.confirm("Are you sure you want to permanently delete this medicine record?")) {
        await fetch(`${API_URL}/medicines/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadMedicines();
    }
  }

  // === LOCAL SEARCH ALGORITHM ===
  const filteredMedicines = medicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'low' ? m.stock <= 5 : true;
      return matchesSearch && matchesFilter;
  });

  return (
    <div className="card">
        
       {/* SAAS HEADER CONTROLS (Improved Padding & Alignment) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "16px", flexWrap: "wrap" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "300px" }}>
                {/* Search Bar */}
                <div style={{ position: "relative", maxWidth: "320px", flex: 1 }}>
                    <SearchIcon />
                    <input 
                        type="text" 
                        placeholder={t('search_inventory')} 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px 10px 40px", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text-main)", borderRadius: "6px", marginBottom: 0, height: "42px" }}
                    />
                </div>
                
                {/* Dropdown Filter */}
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)}
                    style={{ height: "42px", padding: "0 16px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "var(--input-bg)", color: "var(--text-main)", outline: "none", cursor: "pointer", fontSize: "14px" }}
                >
                    <option value="all">{t('current_inventory')}</option>
                    <option value="low">{t('stock_low')}</option>
                </select>
            </div>

            {/* Smart Action Routing Button */}
            <button onClick={onAddNew} className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "8px", height: "42px" }}>
                <PlusIcon />
                {t('add_new_medicine')}
            </button>
        </div>

      {/* RENDER TABLE LOGIC */}
      {medicines.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>{t('db_empty')}</p>
      ) : filteredMedicines.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>{t('no_medicines_found')}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
            {/* HTML constraints removed to rely purely on CSS Framework rules! */}
            <table className="data-table">
                <thead>
                    <tr>
                    <th style={{ width: "40%", textAlign: "left" }}>{t('medicine_name')}</th>
                    <th style={{ textAlign: "center" }}>{t('unit_price')}</th>
                    <th style={{ textAlign: "center" }}>{t('stock_ok')}</th>
                    <th style={{ textAlign: "right" }}>{t('edit')} / {t('delete')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMedicines.map((m) => (
                    <tr key={m.id} style={{ transition: "background 0.2s" }}>
                        
                        <td style={{ fontWeight: 600, color: "var(--text-main)", textAlign: "left" }}>{m.name}</td>
                        
                        <td style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 500 }}>
                            ${Number(m.price).toFixed(2)}
                        </td>
                        
                        <td style={{ textAlign: "center" }}>
                            <span className={`badge ${m.stock <= 5 ? 'low' : 'ok'}`}>
                                {m.stock <= 5 ? 'Warning: Low (' + m.stock + ')' : m.stock + ' Un.'}
                            </span>
                        </td>
                        
                        <td style={{ textAlign: "right", paddingRight: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", alignItems: "center" }}>
                                <button 
                                    onClick={() => alert('Editing not implemented yet.')} 
                                    style={{ display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "none", padding: "6px 10px", color: "var(--primary)", fontWeight: 600, fontSize: "13px", cursor: "pointer", borderRadius: "4px", transition: "background 0.2s" }}
                                    onMouseOver={e => e.currentTarget.style.background = "var(--surface-bg)"}
                                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                                    title={t('edit')}
                                >
                                    <EditIcon /> {t('edit')}
                                </button>
                                
                                <button 
                                    onClick={() => deleteMed(m.id)} 
                                    style={{ display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "none", padding: "6px 10px", color: "var(--danger)", fontWeight: 600, fontSize: "13px", cursor: "pointer", borderRadius: "4px", transition: "background 0.2s" }} 
                                    onMouseOver={e => e.currentTarget.style.background = "var(--surface-bg)"}
                                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                                    title={t('delete')}
                                >
                                    <TrashIcon /> {t('delete')}
                                </button>
                            </div>
                        </td>
                        
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}
