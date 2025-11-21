import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Assuming an endpoint to get all users exists
        const response = await fetch('/api/users', { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: { 
      margin: 0, 
      fontSize: '2rem', 
      fontWeight: '800', 
      letterSpacing: '-0.025em',
    },
    addButton: {
      background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button 
          style={styles.addButton} 
          onClick={() => navigate('/users/add')}
        >
          Add New User
        </button>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td style={styles.td}>{user.userId}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
