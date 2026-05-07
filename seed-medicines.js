require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const medicines = [
    { name: 'Amoxicillin', description: 'Antibiotic used to treat a wide variety of bacterial infections.', price: 12.50, stock: 50, expiry: '2025-12-31', prescription: true, barcode: '600123456003' },
    { name: 'Paracetamol 500mg', description: 'Pain reliever and a fever reducer.', price: 5.00, stock: 100, expiry: '2026-06-30', prescription: false, barcode: '123' },
    { name: 'Ibuprofen', description: 'Nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.', price: 8.25, stock: 75, expiry: '2026-03-15', prescription: false, barcode: '600123456002' },
    { name: 'Metformin', description: 'First-line medication for the treatment of type 2 diabetes.', price: 15.00, stock: 60, expiry: '2025-10-20', prescription: true, barcode: '600123456004' },
    { name: 'Atorvastatin', description: 'Statin medication used to prevent cardiovascular disease and treat abnormal lipid levels.', price: 22.40, stock: 40, expiry: '2025-08-12', prescription: true, barcode: '600123456012' },
    { name: 'Lisinopril', description: 'ACE inhibitor medication used to treat high blood pressure, heart failure, and after heart attacks.', price: 18.00, stock: 45, expiry: '2026-01-10', prescription: true, barcode: '600123456005' },
    { name: 'Amlodipine', description: 'Calcium channel blocker medication used to treat high blood pressure and coronary artery disease.', price: 14.50, stock: 55, expiry: '2025-11-05', prescription: true, barcode: '600123456001' },
    { name: 'Albuterol', description: 'Medication used to treat asthma, exercise-induced bronchospasm, and COPD.', price: 25.00, stock: 30, expiry: '2025-07-22', prescription: true, barcode: '600123456013' },
    { name: 'Omeprazole', description: 'Medication used in the treatment of gastroesophageal reflux disease (GERD).', price: 10.75, stock: 80, expiry: '2026-04-18', prescription: false, barcode: '600123456006' },
    { name: 'Levothyroxine', description: 'Thyroid hormone used to treat thyroid hormone deficiency.', price: 13.20, stock: 50, expiry: '2026-02-28', prescription: true, barcode: '600123456007' },
    { name: 'Gabapentin', description: 'Medication used to treat partial seizures and neuropathic pain.', price: 19.50, stock: 35, expiry: '2025-09-14', prescription: true, barcode: '600123456008' },
    { name: 'Hydrochlorothiazide', description: 'Diuretic medication often used to treat high blood pressure and swelling.', price: 9.00, stock: 70, expiry: '2026-05-20', prescription: true, barcode: '600123456009' },
    { name: 'Losartan', description: 'Angiotensin II receptor antagonist used mainly to treat high blood pressure.', price: 16.80, stock: 40, expiry: '2025-12-01', prescription: true, barcode: '600123456014' },
    { name: 'Sertraline', description: 'Antidepressant of the selective serotonin reuptake inhibitor (SSRI) class.', price: 21.00, stock: 25, expiry: '2025-06-15', prescription: true, barcode: '600123456015' },
    { name: 'Azithromycin', description: 'Antibiotic used for the treatment of a number of bacterial infections.', price: 14.00, stock: 45, expiry: '2025-11-30', prescription: true, barcode: '600123456010' }
];

async function seedMedicines() {
    try {
        await client.connect();
        console.log('Connected to Postgres for seeding.');

        for (const med of medicines) {
            await client.query(
                `INSERT INTO medicines (name, description, price, expiry_date, prescription, stock, barcode)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [med.name, med.description, med.price, med.expiry, med.prescription, med.stock, med.barcode]
            );
            console.log(`Added: ${med.name}`);
        }

        console.log('Seeding complete! 🚀');
    } catch (err) {
        console.error('Error seeding medicines:', err);
    } finally {
        await client.end();
    }
}

seedMedicines();
