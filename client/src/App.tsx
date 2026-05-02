import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { MedicineList } from './components/MedicineList';
import { AddMedicine } from './components/AddMedicine';
import { SellMedicine } from './components/SellMedicine';
import { QuickPriceCheck } from './components/QuickPriceCheck';
import { Feedback } from './components/Feedback';
import { Settings } from './components/Settings';
import { t } from './utils/i18n';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'sell' | 'price-check' | 'feedback' | 'settings'>('inventory');

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
      {/* COLLAPSING SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">💊</span> 
          <span className="brand-text">Pulse Pharmacy</span>
        </div>
        
        <div className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
            title={t('inventory_dashboard')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="sidebar-text">{t('inventory_dashboard')}</span>
          </button>
          
          <button 
            className={`sidebar-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
            title={t('receive_stock')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="sidebar-text">{t('receive_stock')}</span>
          </button>
          
          <button 
            className={`sidebar-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
            title={t('point_of_sale')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="sidebar-text">{t('point_of_sale')}</span>
          </button>
          
          <button 
            className={`sidebar-btn ${activeTab === 'price-check' ? 'active' : ''}`}
            onClick={() => setActiveTab('price-check')}
            title={t('quick_price_check')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span className="sidebar-text">{t('quick_price_check')}</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button 
            className={`sidebar-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
            title={t('feedback')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="sidebar-text">{t('feedback')}</span>
          </button>
          
          <button 
            className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            title={t('settings')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span className="sidebar-text">{t('settings')}</span>
          </button>

          <button 
            className="sidebar-btn danger" 
            title={t('sign_out')}
            onClick={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className="sidebar-text">{t('sign_out')}</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="main-content">
        {activeTab === 'inventory' && (
           <>
             <h2 className="page-title">{t('current_inventory')}</h2>
             <MedicineList 
                refreshTrigger={refreshCounter} 
                onAddNew={() => setActiveTab('add')}
             />
           </>
        )}
        
        {activeTab === 'add' && (
           <>
             <h2 className="page-title">{t('receive_new_stock')}</h2>
             <AddMedicine onMedicineAdded={() => {
               setRefreshCounter(c => c + 1);
               setActiveTab('inventory'); 
             }} />
           </>
        )}
        
        {activeTab === 'sell' && (
           <>
             <h2 className="page-title">{t('point_of_sale')}</h2>
             <SellMedicine onMedicineSold={() => {
                setRefreshCounter(c => c + 1);
                setActiveTab('inventory'); 
             }} />
           </>
        )}
        
        {activeTab === 'price-check' && (
           <>
             <h2 className="page-title">{t('quick_price_check')}</h2>
             <QuickPriceCheck onMedicineSold={() => {
                setRefreshCounter(c => c + 1);
                setActiveTab('inventory'); 
             }} />
           </>
        )}

        {activeTab === 'feedback' && (
           <Feedback />
        )}

        {activeTab === 'settings' && (
           <>
             <h2 className="page-title">{t('settings_configuration')}</h2>
             <Settings />
           </>
        )}
      </div>
    </div>
  );
}
