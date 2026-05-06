import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { t } from '../utils/i18n';

interface Medicine {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    barcode: string;
}

export function QRScanner({ onSaleComplete }: { onSaleComplete: () => void }) {
    const [scannedMed, setScannedMed] = useState<Medicine | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);
    
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const API_URL = "http://localhost:3000";

    useEffect(() => {
        if (scannerActive && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [ 
                        Html5QrcodeSupportedFormats.QR_CODE, 
                        Html5QrcodeSupportedFormats.UPC_A, 
                        Html5QrcodeSupportedFormats.UPC_E, 
                        Html5QrcodeSupportedFormats.EAN_13, 
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.DATA_MATRIX
                    ]
                },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
                scannerRef.current = null;
            }
        };
    }, [scannerActive]);

    async function onScanSuccess(decodedText: string) {
        // Pause scanner if possible or just handle state
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/medicines/barcode/${decodedText}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const medicine = await res.json();
                setScannedMed(medicine);
                // We stop the scanner once a match is found to let the user confirm
                setScannerActive(false);
            } else if (res.status === 404) {
                alert(`Unrecognized Code: ${decodedText}. Please assign this barcode to a medicine first.`);
            }
        } catch (err) {
            console.error("Scan processing error", err);
        }
    }

    function onScanFailure(error: any) {
        // This is called frequently if no code is in view, usually safe to ignore
    }

    async function handleFinalizeSale() {
        if (!scannedMed) return;
        
        if (quantity > scannedMed.stock) {
            alert(`Insufficient stock! Available: ${scannedMed.stock}`);
            return;
        }

        setIsProcessing(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/sell-medicine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: "Scanned Sale",
                    med: scannedMed.name,
                    quantity: quantity
                })
            });

            if (res.ok) {
                alert(t('scanned_success'));
                setScannedMed(null);
                setQuantity(1);
                onSaleComplete();
            } else {
                const errText = await res.text();
                alert(`Error: ${errText}`);
            }
        } catch (err) {
            alert("Network error processing sale.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            
            {/* 1. THE CAMERA VIEWPORT */}
            <div className="card" style={{ width: "100%", maxWidth: "600px", padding: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>📷 {t('scan_medicine')}</h3>
                    <button 
                        onClick={() => setScannerActive(!scannerActive)}
                        className={`btn ${scannerActive ? 'danger' : 'btn-primary'}`}
                        style={{ padding: "8px 16px", fontSize: "13px" }}
                    >
                        {scannerActive ? t('stop_scanner') : t('start_scanner')}
                    </button>
                </div>

                <div id="reader" style={{ width: "100%", borderRadius: "8px", overflow: "hidden", border: scannerActive ? "2px solid var(--primary)" : "2px dashed var(--border)", minHeight: "300px", background: "var(--surface-bg)" }}>
                    {!scannerActive && !scannedMed && (
                        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px", opacity: 0.5 }}><path d="M23 19a2 2 0 0 1-1 1.73l-7 4A2 2 0 0 1 14 23V15a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 1 0l7 4A2 2 0 0 1 31 15v8a2 2 0 0 1-1 1.73l-7 4"></path><path d="M14 15l7 4 7-4"></path><path d="M21 19v8"></path><path d="M10 9l-7 4a2 2 0 0 0-1 1.73v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73v-8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0z"></path></svg>
                            <p>{t('start_scanner')} to begin</p>
                        </div>
                    )}
                </div>
                
                <p style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                    Supports UPC, EAN, QR, and GS1 DataMatrix
                </p>
            </div>

            {/* 2. THE CONFIRMATION MODAL (Shows when code is found) */}
            {scannedMed && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
                    <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "32px", border: "2px solid var(--primary)" }}>
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 style={{ margin: 0, fontSize: "24px", color: "var(--text-main)" }}>{scannedMed.name}</h2>
                            <span className="badge ok" style={{ marginTop: "8px" }}>{t('scanned_success')}</span>
                        </div>

                        <div style={{ background: "var(--surface-bg)", padding: "20px", borderRadius: "8px", marginBottom: "24px", border: "1px solid var(--border)" }}>
                            <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.5" }}>
                                {scannedMed.description || "No description available."}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 700, fontSize: "20px", color: "var(--primary)" }}>${Number(scannedMed.price).toFixed(2)}</span>
                                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Stock: {scannedMed.stock} units</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: "32px" }}>
                            <label style={{ display: "block", marginBottom: "12px", color: "var(--text-main)", fontWeight: 600 }}>{t('how_many_units')}</label>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn" style={{ width: "42px", height: "42px", padding: 0 }}>-</button>
                                <input 
                                    type="number" 
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                    style={{ flex: 1, textAlign: "center", fontSize: "18px", fontWeight: 700, height: "42px", margin: 0 }}
                                />
                                <button onClick={() => setQuantity(q => Math.min(scannedMed.stock, q + 1))} className="btn" style={{ width: "42px", height: "42px", padding: 0 }}>+</button>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button 
                                onClick={() => { setScannedMed(null); setScannerActive(true); }}
                                className="btn" 
                                style={{ flex: 1, background: "var(--surface-disabled)", color: "var(--text-main)" }}
                            >
                                {t('cancel')}
                            </button>
                            <button 
                                onClick={handleFinalizeSale}
                                disabled={isProcessing}
                                className="btn btn-primary" 
                                style={{ flex: 2 }}
                            >
                                {isProcessing ? t('processing') : t('finalize_scanned_sale')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
