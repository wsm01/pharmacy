import { useState } from 'react';

export function SellMedicine({ onMedicineSold }: { onMedicineSold: () => void }) {
  const [buyerName, setBuyerName] = useState("");
  const [medName, setMedName] = useState("");
  const [quantity, setQuantity] = useState("");

  async function handleSell(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
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

        if (!res.ok) {
            const errBody = await res.text();
            alert(`Sale failed! Database error: ${errBody}`);
            return;
        }

        // Sale verified!
        setBuyerName(""); setMedName(""); setQuantity("");
        onMedicineSold(); 
        
    } catch (err) {
        alert("Network Error: Backend unreachable.");
    }
  }

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <form onSubmit={handleSell}>
        <label>Buyer / Patient Name</label>
        <input type="text" placeholder="John Doe" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
        
        <label>Medicine Name</label>
        <input type="text" placeholder="Exact name from inventory..." value={medName} onChange={e => setMedName(e.target.value)} required />
        
        <label>Quantity to Deduct</label>
        <input type="number" placeholder="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        
        <hr style={{ borderColor: "var(--border)", margin: "30px 0 20px 0" }}/>
        <button type="submit" className="btn btn-success" style={{width: "100%"}}>
            Complete Transaction
        </button>
      </form>
    </div>
  );
}
