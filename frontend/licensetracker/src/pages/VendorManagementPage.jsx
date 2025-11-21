import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const VendorManagementPage = () => {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { user } = useUser();
  let userRole = null;

  if (user && user.token) {
    const decodedToken = jwtDecode(user.token);
    userRole = decodedToken.role;
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const apiUrl = `/api/vendors?name=${name}&page=${page}&size=10`;
        const response = await fetch(apiUrl, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setVendors(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
        setTotalPages(0);
      }
    };

    fetchVendors();
  }, [name, page]);

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
    controls: { display: 'flex', gap: '1rem', alignItems: 'center' },
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
    filterInput: {
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      border: '1px solid #374151',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      fontSize: '0.875rem',
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
    actionButton: { 
      border: 'none', 
      padding: '0.5rem 1rem', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      marginRight: '0.5rem', 
      fontWeight: '600', 
      transition: 'all 0.2s ease-in-out' 
    },
    editButton: { background: '#f59e0b', color: 'white' },
    deleteButton: { background: '#ef4444', color: 'white' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' },
    pageInfo: { color: '#d1d5db', fontWeight: '500' },
    paginationButton: { 
      background: '#1f2937', 
      color: '#f9fafb', 
      border: '1px solid #374151', 
      padding: '0.5rem 1rem', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      transition: 'background-color 0.2s' 
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Vendor Management</h2>
        <div style={styles.controls}>
          {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_PROCUREMENT_OFFICER') && (
            <button 
              style={styles.addButton}
              onClick={() => navigate('/vendors/add')}
            >
              Add Vendor
            </button>
          )}
          <input
            type="text"
            placeholder="Filter by Vendor Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.filterInput}
          />
        </div>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Vendor ID</th>
              <th style={styles.th}>Vendor Name</th>
              <th style={styles.th}>Support Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.vendorId}>
                <td style={styles.td}>{vendor.vendorId}</td>
                <td style={styles.td}>{vendor.vendorName}</td>
                <td style={styles.td}>{vendor.supportEmail}</td>
                <td style={styles.td}>
                  {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_PROCUREMENT_OFFICER') && (
                    <button style={{...styles.actionButton, ...styles.editButton}}>Edit</button>
                  )}
                  {userRole === 'ROLE_ADMIN' && (
                    <button style={{...styles.actionButton, ...styles.deleteButton}}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.pagination}>
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))} 
          disabled={page === 0} 
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
          disabled={page >= totalPages - 1} 
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VendorManagementPage;
