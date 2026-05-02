import { useState, useEffect, useRef } from 'react';
import { t } from '../utils/i18n';

// Define the Cart Item structure
interface CartItem {
  id: string; // Unique ID to handle UI removals
  medName: string;
  quantity: number;
  unitPrice: number; // NEW: Track the financial price securely!
}

// Mirror the database structure
interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export function SellMedicine({ onMedicineSold }: { onMedicineSold: () => void }) {
  // Global Transaction State
  const [buyerName, setBuyerName] = useState("");
  
  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // === NEW INVENTORY STATE ===
  const [inventory, setInventory] = useState<Medicine[]>([]);
  
  // === NEW AUTOCOMPLETE STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState("");

  const API_URL = "http://localhost:3000";
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch live Inventory on Component Mount
  useEffect(() => {
      async function loadInventory() {
          const token = localStorage.getItem('token');
          if (!token) return;
          try {
              const res = await fetch(`${API_URL}/medicines`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  setInventory(await res.json());
              }
          } catch(e) {
              console.error("Failed to preload inventory.", e);
          }
      }
      loadInventory();
  }, []);

  // 2. Handle clicking outside the Dropdown to close it seamlessly
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Move inputs into the Cart array WITH HEAVY VALIDATION
  function handleAddToCart(e: React.FormEvent) {
      e.preventDefault(); 
      
      if (!buyerName || !selectedMed || !quantity) {
          alert("Please fill in Buyer, clearly select a Medicine from the dropdown list, and specify Quantity.");
          return;
      }

      const qty = Number(quantity);

      // === MATHEMATICAL VALIDATION LOCKS ===
      
      // Lock 1: Zero or Negatives
      if (qty <= 0) {
          alert("❌ Invalid input! Quantity must be at least 1.");
          return;
      }

      // Lock 2: Advanced Stock Checking 
      // We must check the database stock MINUS anything they already parked in the cart!
      const alreadyInCart = cart
        .filter(item => item.medName === selectedMed.name)
        .reduce((sum, item) => sum + item.quantity, 0);
        
      const remainingStock = selectedMed.stock - alreadyInCart;

      if (qty > remainingStock) {
          alert(`❌ Insufficient stock! You are trying to add ${qty}, but you only have ${remainingStock} available right now.\n\n(Total DB Stock: ${selectedMed.stock} | Already in Pending Cart: ${alreadyInCart})`);
          return;
      }

      // Generate the safe Item
      const newItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          medName: selectedMed.name,
          quantity: qty,
          unitPrice: selectedMed.price
      };

      setCart([...cart, newItem]);
      
      // Clear ONLY the medicine inputs securely so they can rapidly scan the next item
      setSelectedMed(null);
      setSearchQuery("");
      setQuantity("");
  }

  // 4. Remove an item from the Cart
  function removeFromCart(idToRemove: string) {
      setCart(cart.filter(item => item.id !== idToRemove));
  }

  // 5. Sequential Backend Processing Engine
  async function handleFinalizeSale() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    let allSuccessful = true;
    let errorMessages = [];

    // Loop through the cart and fire off individual requests
    for (const item of cart) {
        try {
            const res = await fetch(`${API_URL}/sell-medicine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: buyerName, 
                    med: item.medName,
                    quantity: item.quantity
                })
            });

            if (!res.ok) {
                const errBody = await res.text();
                errorMessages.push(`Failed to sell ${item.medName}: ${errBody}`);
                allSuccessful = false;
            }
        } catch (err) {
            errorMessages.push(`Network error on ${item.medName}`);
            allSuccessful = false;
        }
    }

    setIsProcessing(false);

    if (!allSuccessful) {
        alert(`Partial Failure:\n${errorMessages.join('\n')}`);
        onMedicineSold(); // Refresh dashboard anyway to show whatever DID succeed
    } else {
        // 100% Success Reset!
        setBuyerName(""); 
        setCart([]);
        onMedicineSold(); 
    }
  }

  // Live filter engine for the Autocomplete
  const filteredInventory = inventory.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Live Financial Math Engine
  const grandTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="card" style={{ maxWidth: "700px", overflow: "visible" }}>
        
      {/* 1. ADD TO CART FORM */}
      <form onSubmit={handleAddToCart}>
        <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
            <label>{t('buyer_name')}</label>
            <input 
                type="text" 
                placeholder="John Doe" 
                value={buyerName} 
                onChange={e => setBuyerName(e.target.value)} 
                required 
                disabled={cart.length > 0} 
                style={{ background: cart.length > 0 ? "var(--surface-disabled)" : "var(--input-bg)" }}
            />
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", position: "relative" }}>
            
            {/* THE AUTOCOMPLETE ENGINE UI */}
            <div style={{ flex: 2, minWidth: "250px", position: "relative" }} ref={dropdownRef}>
                <label>{t('search_live_inventory')}</label>
                
                {selectedMed ? (
                    // LOCKED STATE - When a user clicks a medicine from the dropdown
                    <div style={{ padding: "10px 14px", border: "1px solid var(--primary)", borderRadius: "6px", backgroundColor: "rgba(79, 70, 229, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", height: "42px", boxSizing: "border-box" }}>
                        <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: "14px" }}>✅ {selectedMed.name}</span>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                             <span style={{ fontSize: "12px", color: selectedMed.stock <= 5 ? "var(--danger)" : "var(--text-muted)", fontWeight: 500 }}>
                                Stock: {selectedMed.stock}
                             </span>
                             <button type="button" onClick={() => { setSelectedMed(null); setSearchQuery(""); }} style={{ background: "var(--danger)", border: "none", color: "white", cursor: "pointer", fontWeight: "bold", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyItems: "center" }} title="Clear Selection">
                                ✕
                             </button>
                        </div>
                    </div>
                ) : (
                    // SEARCHING STATE
                    <>
                        <input 
                            type="text" 
                            placeholder="Type to find medicine..." 
                            value={searchQuery} 
                            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                            onFocus={() => setShowDropdown(true)}
                            required 
                            autoComplete="off"
                        />
                        
                        {/* THE FLOATING DROPDOWN MENU */}
                        {showDropdown && searchQuery && (
                            <div style={{ position: "absolute", top: "72px", left: 0, right: 0, background: "white", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", zIndex: 100, maxHeight: "250px", overflowY: "auto" }}>
                                {filteredInventory.length === 0 ? (
                                    <div style={{ padding: "16px", color: "var(--text-muted)", textAlign: "center", fontSize: "14px" }}>No exact matches found in database.</div>
                                ) : (
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {filteredInventory.map(m => (
                                            <li 
                                                key={m.id} 
                                                onClick={() => { setSelectedMed(m); setShowDropdown(false); }}
                                                style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = "var(--surface-hover)"}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
                                            >
                                                <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "14px" }}>{m.name}</span>
                                                <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                                                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>${Number(m.price).toFixed(2)}</span>
                                                    <span style={{ color: m.stock <= 5 ? "var(--danger)" : "var(--text-muted)", fontWeight: 500, width: "70px", textAlign: "right" }}>{m.stock} units</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div style={{ flex: 1, minWidth: "120px" }}>
                <label>{t('qty_to_deduct')}</label>
                <input 
                    type="number" 
                    placeholder="1" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    required 
                    min="1"
                />
            </div>
        </div>
        
        <button type="submit" className="btn" style={{ background: "var(--primary)", width: "100%", marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {t('add_to_cart')}
        </button>
      </form>

      {/* 2. SHOPPING CART UI WITH FINANCIALS */}
      {cart.length > 0 && (
          <div style={{ background: "var(--surface-bg)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
                    🛒 {t('pending_transaction')} 
                </h3>
                <span className="badge ok">{cart.length} items</span>
              </div>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                  {cart.map((item, index) => (
                      <li key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "15px" }}>{item.medName}</span>
                              <span style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
                                  ${Number(item.unitPrice).toFixed(2)} × {item.quantity} units
                              </span>
                          </div>
                          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                              <span style={{ color: "var(--text-main)", fontSize: "16px", fontWeight: 700 }}>
                                  ${(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                              <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                                  ✕ {t('remove')}
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>

              {/* LIVE GRAND TOTAL CALCULATOR */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", backgroundColor: "var(--surface-hover)", borderRadius: "6px", marginBottom: "24px", border: "1px solid var(--primary)" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t('grand_total')}</span>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)" }}>
                      ${grandTotal.toFixed(2)}
                  </span>
              </div>

              {/* 3. FINALIZE SALE ACTION */}
              <button 
                onClick={handleFinalizeSale} 
                disabled={isProcessing}
                className="btn btn-success" 
                style={{width: "100%", padding: "16px", fontSize: "16px", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "8px"}}
              >
                  {isProcessing ? t('processing') : t('finalize_sale')}
              </button>
          </div>
      )}

    </div>
  );
}
