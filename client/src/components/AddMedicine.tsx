import { useState } from 'react';
import { t } from '../utils/i18n';

export function AddMedicine({ onMedicineAdded }: { onMedicineAdded: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [prescription, setPrescription] = useState(false);
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); 
    const token = localStorage.getItem('token');
    
    // Formatting Payload to prevent database crashing
    const payload = {
        name,
        price: Number(price),
        description,
        expiry_date: expiryDate === "" ? null : expiryDate, // Fixing the silent database crash
        prescription,
        stock: Number(stock),
        barcode: barcode.trim() === "" ? null : barcode.trim()
    };

    try {
        const res = await fetch('http://localhost:3000/add-medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(`System Error: Could not add medicine. Validation failed: ${errorText}`);
            return;
        }
        
        // Success! Clear the form
        setName(""); setPrice(""); setDescription(""); setExpiryDate(""); setPrescription(false); setStock(""); setBarcode("");
        onMedicineAdded();
        
    } catch (err) {
        alert("Network error: Could not reach the server.");
    }
  }

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <form onSubmit={handleSubmit}>
        <label>{t('medicine_name')}</label>
        <input type="text" placeholder="e.g. Ibuprofen 200mg" value={name} onChange={e => setName(e.target.value)} required />
        
        <label>{t('unit_price')}</label>
        <input type="number" step="0.01" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
        
        <label>{t('description')}</label>
        <input type="text" placeholder="Optional details..." value={description} onChange={e => setDescription(e.target.value)} />
        
        <label>{t('expiry_date')}</label>
        <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        
        <label className="checkbox-group">
          <input type="checkbox" checked={prescription} onChange={e => setPrescription(e.target.checked)} />
          {t('prescription_required')}
        </label>
        
        <label>{t('initial_stock')}</label>
        <input type="number" placeholder="Enter batch quantity" value={stock} onChange={e => setStock(e.target.value)} required />
        
        <label>{t('barcode')}</label>
        <input type="text" placeholder="Scan or type barcode..." value={barcode} onChange={e => setBarcode(e.target.value)} />
        
        <button type="submit" className="btn btn-primary" style={{width: "100%", marginTop: "10px"}}>
            {t('add_to_inventory')}
        </button>
      </form>
    </div>
  );
}
