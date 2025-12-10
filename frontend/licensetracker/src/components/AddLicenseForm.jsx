import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddLicenseForm = () => {
    const [licenseKey, setLicenseKey] = useState('');
    const [softwareName, setSoftwareName] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');
    const [licenseType, setLicenseType] = useState('PER_DEVICE');
    const [maxUsage, setMaxUsage] = useState(0);
    const [notes, setNotes] = useState('');
    const [vendors, setVendors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
    };

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('/api/vendors?page=0&size=1000', { headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Failed to fetch vendors');
                const data = await response.json();
                setVendors(data.content || []);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchVendors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const licenseData = {
            licenseKey,
            softwareName,
            vendorId: parseInt(vendorId, 10),
            validFrom,
            validTo,
            licenseType,
            maxUsage: parseInt(maxUsage, 10),
            notes,
        };

        try {
            const response = await fetch('/api/licenses', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(licenseData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add license');
            }

            navigate('/licenses');
        } catch (err) {
            setError(err.message);
        }
    };

    const styles = {
        container: { padding: '2rem', maxWidth: '600px', margin: '0 auto', color: 'var(--text-light)' },
        title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        inputGroup: { display: 'flex', flexDirection: 'column' },
        label: { marginBottom: '0.5rem', fontWeight: '500' },
        input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', color: 'var(--text-light)' },
        select: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', color: 'var(--text-light)' },
        button: { padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-light)', cursor: 'pointer', fontWeight: 'bold' },
        error: { color: '#f87171', marginTop: '1rem' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add New License</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>License Key</label>
                    <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Software Name</label>
                    <input type="text" value={softwareName} onChange={(e) => setSoftwareName(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Vendor</label>
                    <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} style={styles.select} required>
                        <option value="">Select a Vendor</option>
                        {vendors.map(vendor => (
                            <option key={vendor.vendorId} value={vendor.vendorId}>{vendor.vendorName}</option>
                        ))}
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Valid From</label>
                    <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Valid To</label>
                    <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>License Type</label>
                    <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} style={styles.select}>
                        <option value="PER_DEVICE">Per Device</option>
                        <option value="PER_USER">Per User</option>
                        <option value="ENTERPRISE">Enterprise</option>
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Max Usage</label>
                    <input type="number" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={styles.input}></textarea>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Add License</button>
            </form>
        </div>
    );
};

export default AddLicenseForm;
