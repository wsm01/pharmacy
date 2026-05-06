import { useState, useEffect } from 'react';

interface Sale {
  id: number;
  buyer_name: string;
  medicine_name: string;
  quantity: number;
  total_price: string | number; 
  sold_by: string;
  sale_date: string;
}

export function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/sales-history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSales(data);
        }
      } catch (e) {
        console.error("Failed to load sales", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div style={{ padding: "24px", color: "var(--text-muted)" }}>Loading admin statistics...</div>;
  }

  // 1. Calculate Stats
  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
  const totalSales = sales.length;

  const sellerCounts: Record<string, number> = {};
  sales.forEach(sale => {
    const seller = sale.sold_by || 'Unknown';
    if (seller !== 'Unknown') {
      sellerCounts[seller] = (sellerCounts[seller] || 0) + 1;
    }
  });
  
  let topSeller = 'N/A';
  if (Object.keys(sellerCounts).length > 0) {
    topSeller = Object.keys(sellerCounts).reduce((a, b) => sellerCounts[a] > sellerCounts[b] ? a : b);
  }

  // Common glassmorphism style object
  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
    borderRadius: "16px",
    padding: "24px",
    flex: "1",
    minWidth: "200px"
  };

  return (
    <div className="admin-dashboard">
      
      {/* --- STATS CARDS ROW --- */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
        
        {/* Total Revenue Card (Green Accent) */}
        <div style={{ ...glassCardStyle, borderTop: "4px solid #10b981" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Revenue
          </h4>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#10b981" }}>
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        {/* Total Sales Card */}
        <div style={{ ...glassCardStyle, borderTop: "4px solid var(--primary)" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Sales
          </h4>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)" }}>
            {totalSales}
          </div>
        </div>

        {/* Top Seller Card */}
        <div style={{ ...glassCardStyle, borderTop: "4px solid #8b5cf6" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Top Seller
          </h4>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {topSeller}
          </div>
        </div>

      </div>

      {/* --- SALES HISTORY TABLE --- */}
      <div style={{ 
        background: "var(--surface-bg)", 
        borderRadius: "12px", 
        border: "1px solid var(--border)", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", backgroundColor: "rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: 0, color: "var(--text-main)", fontSize: "18px" }}>Recent Transactions</h3>
        </div>
        
        <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9fafb", zIndex: 10 }}>
              <tr>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Date</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Medicine Name</th>
                <th style={{ padding: "12px 24px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Quantity</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Total</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>Sold By</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                    No sales data available.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: "1px solid var(--border)", transition: "background-color 0.15s" }} onMouseOver={e => e.currentTarget.style.backgroundColor = "var(--surface-hover)"} onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(sale.sale_date).toLocaleString()}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-main)" }}>
                      {sale.medicine_name}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "var(--text-main)", textAlign: "center" }}>
                      {sale.quantity}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#10b981", textAlign: "right" }}>
                      ${Number(sale.total_price || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "var(--text-muted)", textAlign: "right" }}>
                      <span style={{ backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" }}>
                        {sale.sold_by || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
