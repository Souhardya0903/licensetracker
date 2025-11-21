import React, { useState } from 'react';

const ReportsPage = () => {
    const [nonCompliantDevices, setNonCompliantDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Authorization': token ? `Bearer ${token}` : '' };
    };

    const fetchNonCompliantDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/reports/non-compliant', { headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Failed to fetch non-compliant devices');
            const data = await response.json();
            setNonCompliantDevices(data);
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format) => {
        try {
            const response = await fetch(`/api/reports/non-compliant/${format}`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`Failed to export data as ${format}`);
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `non_compliant_devices.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();

        } catch (error) {
            console.error("Error exporting report:", error);
        }
    };

    const styles = {
        container: { padding: '2rem', color: 'var(--text-light)' },
        title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' },
        reportSection: {
            backgroundColor: 'var(--surface-dark)',
            borderRadius: '8px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-dark)'
        },
        sectionTitle: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' },
        buttonGroup: { display: 'flex', gap: '1rem' },
        button: {
            backgroundColor: 'var(--primary)',
            color: 'var(--text-light)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
        },
        resultsContainer: { marginTop: '2rem' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
        th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' },
        td: { padding: '1rem', borderBottom: '1px solid var(--border-dark)' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Reports & Exports</h1>

            <div style={styles.reportSection}>
                <h2 style={styles.sectionTitle}>Compliance Reports</h2>
                <div style={styles.buttonGroup}>
                    <button style={styles.button} onClick={fetchNonCompliantDevices} disabled={loading}>
                        {loading ? 'Generating...' : 'Find Non-Compliant Devices'}
                    </button>
                    <button style={styles.button} onClick={() => exportReport('csv')}>Export as CSV</button>
                    <button style={styles.button} onClick={() => exportReport('pdf')}>Export as PDF</button>
                </div>

                {nonCompliantDevices.length > 0 && (
                    <div style={styles.resultsContainer}>
                        <h3>Non-Compliant Devices ({nonCompliantDevices.length})</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Device ID</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nonCompliantDevices.map(device => (
                                    <tr key={device.deviceId}>
                                        <td style={styles.td}>{device.deviceId}</td>
                                        <td style={styles.td}>{device.type}</td>
                                        <td style={styles.td}>{device.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
