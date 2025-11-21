import React, { useState, useEffect } from 'react';

const AlertsPage = () => {
    const [expiringLicenses, setExpiringLicenses] = useState([]);
    const [expiredLicenses, setExpiredLicenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const [expiringRes, expiredRes] = await Promise.all([
                    fetch('/api/alerts/expiring?days=30', { headers: getAuthHeaders() }),
                    fetch('/api/alerts/expired', { headers: getAuthHeaders() })
                ]);

                if (!expiringRes.ok) throw new Error('Failed to fetch expiring licenses');
                if (!expiredRes.ok) throw new Error('Failed to fetch expired licenses');

                const expiringData = await expiringRes.json();
                const expiredData = await expiredRes.json();

                setExpiringLicenses(expiringData);
                setExpiredLicenses(expiredData);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const styles = {
        container: { padding: '2rem', color: 'var(--text-light)' },
        title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' },
        section: { marginBottom: '3rem' },
        sectionTitle: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' },
        alertCard: {
            backgroundColor: 'var(--surface-dark)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem',
            borderLeft: '5px solid',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        expiredCard: { borderColor: '#ef4444' }, // Red
        expiringCard: { borderColor: '#f59e0b' }, // Amber
        cardContent: { display: 'flex', flexDirection: 'column' },
        cardTitle: { fontSize: '1.1rem', fontWeight: 'bold', margin: 0 },
        cardDetail: { color: 'var(--text-muted)', marginTop: '0.5rem' },
        actionButton: {
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-light)'
        }
    };

    if (loading) {
        return <div style={styles.container}>Loading alerts...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Alerts Center</h1>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Expired Licenses ({expiredLicenses.length})</h2>
                {expiredLicenses.length > 0 ? expiredLicenses.map(license => (
                    <div key={license.licenseKey} style={{ ...styles.alertCard, ...styles.expiredCard }}>
                        <div style={styles.cardContent}>
                            <span style={styles.cardTitle}>{license.softwareName} ({license.licenseKey})</span>
                            <span style={styles.cardDetail}>Expired on: {license.validTo}</span>
                        </div>
                        <button style={styles.actionButton} onClick={() => alert('Renewing license: ' + license.licenseKey)}>Renew Now</button>
                    </div>
                )) : <p>No expired licenses.</p>}
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Licenses Expiring in Next 30 Days ({expiringLicenses.length})</h2>
                {expiringLicenses.length > 0 ? expiringLicenses.map(license => (
                    <div key={license.licenseKey} style={{ ...styles.alertCard, ...styles.expiringCard }}>
                        <div style={styles.cardContent}>
                            <span style={styles.cardTitle}>{license.softwareName} ({license.licenseKey})</span>
                            <span style={styles.cardDetail}>Expires on: {license.validTo}</span>
                        </div>
                        <button style={styles.actionButton} onClick={() => alert('Sending reminder for: ' + license.licenseKey)}>Send Reminder</button>
                    </div>
                )) : <p>No licenses expiring soon.</p>}
            </div>
        </div>
    );
};

export default AlertsPage;
