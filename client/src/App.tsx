import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { MedicineList } from './components/MedicineList';
import { AddMedicine } from './components/AddMedicine';
import { SellMedicine } from './components/SellMedicine';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'sell'>('inventory');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="sidebar-brand">
          💊 Pulse Pharmacy
        </div>
        <div className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Dashboard
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Receive Stock
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
          >
            Point of Sale
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }}>Sign Out</button>
        </div>
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="main-content">
        {activeTab === 'inventory' && (
           <>
             <h2 className="page-title">Current Inventory</h2>
             <MedicineList 
                refreshTrigger={refreshCounter} 
                onAddNew={() => setActiveTab('add')}
             />
           </>
        )}
        
        {activeTab === 'add' && (
           <>
             <h2 className="page-title">Receive New Stock</h2>
             <AddMedicine onMedicineAdded={() => {
               setRefreshCounter(c => c + 1);
               setActiveTab('inventory'); 
             }} />
           </>
        )}
        
        {activeTab === 'sell' && (
           <>
             <h2 className="page-title">Point of Sale (POS)</h2>
             <SellMedicine onMedicineSold={() => {
                setRefreshCounter(c => c + 1);
                setActiveTab('inventory'); 
             }} />
           </>
        )}
      </div>
    </div>
  );
}
