import { useState, useEffect } from 'react';

// 1. INTERFACES (TypeScript Magic)
// This tells our code exactly what a "Medicine" looks like.
// This prevents us from making typos like typing m.prece instead of m.price!
interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// We will use this refreshTrigger later to force the list to update when we add a new item!
interface MedicineListProps {
  refreshTrigger: number;
}

export function MedicineList({ refreshTrigger }: MedicineListProps) {
  // 2. STATE: This holds our array of medicine objects
  // Notice the <Medicine[]> syntax. We are strictly guarding this array!
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const API_URL = "http://localhost:3000";

  // 3. THE FETCH LOGIC
  async function loadMedicines() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL}/medicines`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired, please refresh page"); // Let parent handle true logout later
      return;
    }

    const data = await res.json();
    setMedicines(data); // This instantly paints the screen with the new array!
  }

  // 4. THE USE-EFFECT (The Trigger)
  // The array [refreshTrigger] at the end means: 
  // "Run loadMedicines() when the page opens, AND run it again ANYTIME refreshTrigger changes!"
  useEffect(() => {
    loadMedicines();
  }, [refreshTrigger]);

  // 5. THE DELETE LOGIC
  async function deleteMed(id: number) {
    const token = localStorage.getItem('token');
    if (window.confirm("Are you sure?")) {
      await fetch(`${API_URL}/medicines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadMedicines(); // Automatically fetch the fresh list after deleting!
    }
  }

  // 6. THE JSX (map instead of innerHTML)
  return (
    <div className="box" style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
      <h3>Medicine List</h3>

      {medicines.length === 0 ? <p>No medicines found.</p> : null}

      {/* React hates .innerHTML. Instead we use .map() to loop over the array directly! */}
      {medicines.map((m) => (
        <div key={m.id} style={{ borderBottom: "1px solid #eee", padding: "10px" }}>
          <strong>{m.name}</strong> - ${m.price}
          <span style={{ color: 'gray', marginLeft: '10px' }}>(Stock: {m.stock})</span>

          <button
            onClick={() => deleteMed(m.id)}
            style={{ marginLeft: "10px", background: "lightcoral" }}
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}
