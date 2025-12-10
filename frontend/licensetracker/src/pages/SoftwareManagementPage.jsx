import React, { useState, useEffect } from 'react';

const SoftwareManagementPage = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [softwareVersions, setSoftwareVersions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [softwareName, setSoftwareName] = useState('');
    const [installedVersion, setInstalledVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
    };

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch('/api/devices?size=1000', { headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Failed to fetch devices');
                const data = await response.json();
                setDevices(data.content || []);
            } catch (error) {
                console.error("Error fetching devices:", error);
            }
        };
        fetchDevices();
    }, []);

    useEffect(() => {
        if (!selectedDeviceId) {
            setSoftwareVersions([]);
            return;
        }
        const fetchSoftwareVersions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/software/device/${selectedDeviceId}`, { headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Failed to fetch software versions');
                const data = await response.json();
                setSoftwareVersions(data);
            } catch (error) {
                console.error("Error fetching software versions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSoftwareVersions();
    }, [selectedDeviceId]);

    const handleAddSoftware = async (e) => {
        e.preventDefault();
        if (!selectedDeviceId) {
            alert("Please select a device first.");
            return;
        }

        const newSoftware = {
            deviceId: selectedDeviceId,
            softwareName,
            installedVersion,
            latestVersion,
            status: installedVersion === latestVersion ? 'UP_TO_DATE' : 'OUTDATED'
        };

        try {
            const response = await fetch('/api/software', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newSoftware),
            });
            if (!response.ok) throw new Error('Failed to add software');
            const addedSoftware = await response.json();
            setSoftwareVersions([...softwareVersions, addedSoftware]);
            // Clear form
            setSoftwareName('');
            setInstalledVersion('');
            setLatestVersion('');
        } catch (error) {
            console.error("Error adding software:", error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'UP_TO_DATE': return { color: '#22c55e', fontWeight: 'bold' };
            case 'OUTDATED': return { color: '#ef4444', fontWeight: 'bold' };
            case 'UPDATE_RECOMMENDED': return { color: '#f59e0b', fontWeight: 'bold' };
            default: return {};
        }
    };

    const styles = {
        container: { padding: '2rem', color: 'var(--text-light)' },
        title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' },
        mainGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' },
        formSection: { backgroundColor: 'var(--surface-dark)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-dark)' },
        sectionTitle: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        inputGroup: { display: 'flex', flexDirection: 'column' },
        label: { marginBottom: '0.5rem', fontWeight: '500' },
        input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: '#1f2937', color: 'var(--text-light)' },
        select: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: '#1f2937', color: 'var(--text-light)' },
        button: { padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-light)', cursor: 'pointer', fontWeight: 'bold' },
        tableContainer: { backgroundColor: 'var(--surface-dark)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-dark)' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' },
        td: { padding: '1rem', borderBottom: '1px solid var(--border-dark)' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Software Version Management</h1>
            <div style={styles.mainGrid}>
                <div style={styles.formSection}>
                    <h2 style={styles.sectionTitle}>Add Software to Device</h2>
                    <form onSubmit={handleAddSoftware} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Select Device</label>
                            <select value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)} style={styles.select} required>
                                <option value="">-- Select a Device --</option>
                                {devices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>{device.deviceId} ({device.location})</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Software Name</label>
                            <input type="text" value={softwareName} onChange={e => setSoftwareName(e.target.value)} style={styles.input} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Installed Version</label>
                            <input type="text" value={installedVersion} onChange={e => setInstalledVersion(e.target.value)} style={styles.input} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Latest Version</label>
                            <input type="text" value={latestVersion} onChange={e => setLatestVersion(e.target.value)} style={styles.input} />
                        </div>
                        <button type="submit" style={styles.button}>Add Software</button>
                    </form>
                </div>
                <div style={styles.tableContainer}>
                    <h2 style={styles.sectionTitle}>Installed Software on {selectedDeviceId || '...'}</h2>
                    {loading ? <p>Loading...</p> : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Software Name</th>
                                    <th style={styles.th}>Installed Version</th>
                                    <th style={styles.th}>Latest Version</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {softwareVersions.map(sw => (
                                    <tr key={sw.id}>
                                        <td style={styles.td}>{sw.softwareName}</td>
                                        <td style={styles.td}>{sw.installedVersion}</td>
                                        <td style={styles.td}>{sw.latestVersion || 'N/A'}</td>
                                        <td style={{...styles.td, ...getStatusStyle(sw.status)}}>{sw.status.replace('_', ' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SoftwareManagementPage;
