import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { MedicineList } from './components/MedicineList';
import { AddMedicine } from './components/AddMedicine';
import { SellMedicine } from './components/SellMedicine';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // THE TRIGGER: This counter goes up by 1 every time we add or sell a medicine.
  // Because MedicineList is watching this counter, it automatically repaints the screen!
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false); 
  }

  // The Dashboard Layout
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Pharmacy Management Dashboard (React 1.0)</h1>
      
      {!isAuthenticated ? (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div>
          <button onClick={handleLogout} style={{float: "right", background: '#ff6b6b', color: 'white'}}>Logout</button>
          <p>Welcome to your complete React frontend!</p>
          <hr />
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <AddMedicine onMedicineAdded={() => setRefreshCounter(c => c + 1)} />
            </div>
            <div style={{ flex: 1 }}>
              <SellMedicine onMedicineSold={() => setRefreshCounter(c => c + 1)} />
            </div>
          </div>
          
          <hr />
          <MedicineList refreshTrigger={refreshCounter} />
        </div>
      )}
      
    </div>
  );
}
