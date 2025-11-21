import React, { useState, useEffect } from 'react';

const SoftwareVersionPage = () => {
  const [softwareList, setSoftwareList] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const response = await fetch('/api/software', { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSoftwareList(data);
      } catch (error) {
        console.error("Error fetching software:", error);
      }
    };
    fetchSoftware();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
      fontFamily: 'Inter, SF Pro Display, system-ui, -apple-system, sans-serif',
      color: '#f9fafb',
    },
    header: {
      marginBottom: '2rem',
    },
    title: { 
      margin: 0, 
      fontSize: '2rem', 
      fontWeight: '800', 
      letterSpacing: '-0.025em',
    },
    tableContainer: {
      backgroundColor: '#111827',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      backgroundColor: '#1f2937',
      color: '#d1d5db',
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontSize: '0.75rem',
    },
    td: { padding: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e5e7eb' },
    link: { color: '#6366f1', textDecoration: 'none', fontWeight: '500' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Software Version Tracking</h1>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Software Name</th>
              <th style={styles.th}>Latest Version</th>
              <th style={styles.th}>Download Link</th>
            </tr>
          </thead>
          <tbody>
            {softwareList.map((software) => (
              <tr key={software.softwareId}>
                <td style={styles.td}>{software.name}</td>
                <td style={styles.td}>{software.latestVersion}</td>
                <td style={styles.td}>
                  <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoftwareVersionPage;
