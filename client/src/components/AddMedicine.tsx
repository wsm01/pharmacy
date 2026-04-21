import { useState } from 'react';

export function AddMedicine({ onMedicineAdded }: { onMedicineAdded: () => void }) {
  // STATE: Tracking all 6 fields you built earlier!
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [prescription, setPrescription] = useState(false);
  const [stock, setStock] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevents the page from refreshing when you click submit!
    const token = localStorage.getItem('token');
    
    await fetch('http://localhost:3000/add-medicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        price: Number(price), // Format to number
        description,
        expiry_date: expiryDate,
        prescription,
        stock: Number(stock)
      })
    });
    
    // Clear the form boxes automatically!
    setName(""); setPrice(""); setDescription(""); setExpiryDate(""); setPrescription(false); setStock("");
    
    // The Walkie-Talkie: Tell App.tsx we added a medicine so it updates the list!
    onMedicineAdded();
  }

  // JSX: Notice we use <form onSubmit> instead of clicking individual buttons. It's much cleaner!
  return (
    <div className="box" style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
      <h3>Add New Medicine</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br/><br/>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br/><br/>
        <input type="date" placeholder="Expiry Date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} /><br/><br/>
        
        <label>
          <input type="checkbox" checked={prescription} onChange={e => setPrescription(e.target.checked)} />
          Requires Prescription?
        </label><br/><br/>
        
        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required /><br/><br/>
        <button type="submit" style={{background: 'lightgreen'}}>Add Medicine</button>
      </form>
    </div>
  );
}
