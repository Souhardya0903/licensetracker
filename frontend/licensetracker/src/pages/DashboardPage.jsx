import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [summaryData, setSummaryData] = useState({ totalDevices: 0, totalLicenses: 0, expiringSoonCount: 0, devicesAtRiskCount: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, activityRes] = await Promise.all([
          fetch(`/api/dashboard/overview`, { headers: getAuthHeaders() }),
          fetch(`/api/audit/recent?limit=5`, { headers: getAuthHeaders() })
        ]);

        if (!overviewRes.ok) throw new Error(`Overview fetch failed!`);
        if (!activityRes.ok) throw new Error(`Activity fetch failed!`);

        const overviewData = await overviewRes.json();
        const activityData = await activityRes.json();

        setSummaryData(overviewData);
        setRecentActivity(activityData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const styles = {
    container: { padding: '2rem', color: 'var(--text-light)' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', margin: 0 },
    subtitle: { color: 'var(--text-muted)' },
    cardContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    card: { backgroundColor: 'var(--surface-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-dark)', cursor: 'pointer' },
    cardTitle: { fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' },
    cardValue: { fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-light)' },
    riskValue: { color: '#f87171' },
    activityContainer: { backgroundColor: 'var(--surface-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-dark)' },
    activityTitle: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '0.75rem', borderBottom: '1px solid var(--border-dark)', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' },
    td: { padding: '0.75rem', borderBottom: '1px solid var(--border-dark)' },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, {user?.name || 'User'}</h1>
        <p style={styles.subtitle}>Here is your asset overview for today.</p>
      </header>
      
      <div style={styles.cardContainer}>
        <div style={styles.card} onClick={() => navigate('/devices')}><h3 style={styles.cardTitle}>Total Devices</h3><p style={styles.cardValue}>{summaryData.totalDevices}</p></div>
        <div style={styles.card} onClick={() => navigate('/licenses')}><h3 style={styles.cardTitle}>Total Licenses</h3><p style={styles.cardValue}>{summaryData.totalLicenses}</p></div>
        <div style={styles.card} onClick={() => navigate('/alerts')}><h3 style={styles.cardTitle}>Expiring Soon</h3><p style={{...styles.cardValue, ...styles.riskValue}}>{summaryData.expiringSoonCount}</p></div>
        <div style={styles.card} onClick={() => navigate('/reports')}><h3 style={styles.cardTitle}>Devices at Risk</h3><p style={{...styles.cardValue, ...styles.riskValue}}>{summaryData.devicesAtRiskCount}</p></div>
      </div>

      <div style={styles.activityContainer}>
        <h2 style={styles.activityTitle}>Recent Activity</h2>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Action</th><th style={styles.th}>Item</th><th style={styles.th}>User</th><th style={styles.th}>Date</th></tr></thead>
          <tbody>
            {recentActivity.map((item) => (
              <tr key={item.id}><td style={styles.td}>{item.action}</td><td style={styles.td}>{item.item}</td><td style={styles.td}>{item.performedBy}</td><td style={styles.td}>{new Date(item.timestamp).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
