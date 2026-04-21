import { useState } from 'react';

export function SellMedicine({ onMedicineSold }: { onMedicineSold: () => void }) {
  // STATE
  const [buyerName, setBuyerName] = useState("");
  const [medName, setMedName] = useState("");
  const [quantity, setQuantity] = useState("");

  async function handleSell(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const res = await fetch('http://localhost:3000/sell-medicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: buyerName,
        med: medName,
        quantity: Number(quantity)
      })
    });

    if (res.ok) {
       // Clear form
       setBuyerName(""); setMedName(""); setQuantity("");
       // Tell parent to refresh the MedicineList so the stock instantly goes down!
       onMedicineSold(); 
    } else {
       alert("Sale failed! Check medicine name and stock.");
    }
  }

  return (
    <div className="box" style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
      <h3>Sell Medicine</h3>
      <form onSubmit={handleSell}>
        <input type="text" placeholder="Buyer Name" value={buyerName} onChange={e => setBuyerName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Medicine Name" value={medName} onChange={e => setMedName(e.target.value)} required /><br/><br/>
        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required /><br/><br/>
        <button type="submit" style={{background: 'lightblue'}}>Submit Sale</button>
      </form>
    </div>
  );
}
