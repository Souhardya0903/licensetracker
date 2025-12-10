import React, { useState, useEffect } from 'react';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return { 'Authorization': token ? `Bearer ${token}` : '' };
    };

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/audit?page=${page}&size=15&sort=timestamp,desc`, { headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Failed to fetch audit logs');
                const data = await response.json();
                setLogs(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [page]);

    const styles = {
        container: { padding: '2rem', color: 'var(--text-light)' },
        title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' },
        tableContainer: { backgroundColor: 'var(--surface-dark)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-dark)' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' },
        td: { padding: '1rem', borderBottom: '1px solid var(--border-dark)' },
        pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' },
        pageInfo: { color: '#d1d5db', fontWeight: '500' },
        paginationButton: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Audit Logs</h1>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Timestamp</th>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Action</th>
                            <th style={styles.th}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                                <td style={styles.td}>{log.username}</td>
                                <td style={styles.td}>{log.action}</td>
                                <td style={styles.td}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.pagination}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={styles.paginationButton}>Previous</button>
                <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={styles.paginationButton}>Next</button>
            </div>
        </div>
    );
};

export default AuditLogPage;
