import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditDevicePage = () => {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
    };

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await fetch(`/api/devices/${id}`, { headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Failed to fetch device data');
                const data = await response.json();
                setDevice(data);
                setStatus(data.status);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchDevice();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const updatedData = { ...device, status };

        try {
            const response = await fetch(`/api/devices/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update device');
            }

            navigate('/devices');
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
        select: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', color: 'var(--text-light)' },
        button: { padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-light)', cursor: 'pointer', fontWeight: 'bold' },
        error: { color: '#f87171', marginTop: '1rem' },
    };

    if (!device) return <div style={styles.container}>Loading device data...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Edit Device: {device.deviceId}</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="IN_REPAIR">IN_REPAIR</option>
                        <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                    </select>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Update Status</button>
            </form>
        </div>
    );
};

export default EditDevicePage;
