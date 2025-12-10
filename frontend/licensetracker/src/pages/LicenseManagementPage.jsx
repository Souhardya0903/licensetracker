import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const LicenseManagementPage = () => {
  const [licenses, setLicenses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorFilterId, setVendorFilterId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { user } = useUser();
  let userRole = null;

  if (user && user.token) {
    const decodedToken = jwtDecode(user.token);
    userRole = decodedToken.role;
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedDevices, setAssignedDevices] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch(`/api/vendors?page=0&size=100`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVendors(data.content || data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const getVendorName = (id) => {
    const vendor = vendors.find(v => v.vendorId === id);
    return vendor ? vendor.vendorName : `Unknown Vendor (${id})`;
  };

  const handleViewDevices = async (license) => {
    setSelectedLicense(license);
    try {
      const response = await fetch(`/api/assignments/by-license/${license.licenseKey}`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAssignedDevices(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching assigned devices:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const vendorQuery = vendorFilterId ? `&vendorId=${vendorFilterId}` : '';
        const response = await fetch(`/api/licenses?page=${page}&size=10${vendorQuery}`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setLicenses(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching licenses:", error);
        setLicenses([]);
        setTotalPages(0);
      }
    };
    fetchLicenses();
  }, [vendorFilterId, page]);

  const getUsageIndicator = (license) => {
    if (license.maxUsage === null || license.maxUsage === 0) {
      return { text: `${license.currentUsage} / ∞`, color: '#6366f1' };
    }
    const usagePercentage = Math.round((license.currentUsage / license.maxUsage) * 100);
    let color = '#22c55e'; // Green
    if (usagePercentage >= 90) color = '#ef4444'; // Red
    else if (usagePercentage >= 70) color = '#f59e0b'; // Amber
    return { text: `${license.currentUsage} / ${license.maxUsage} (${usagePercentage}%)`, color };
  };

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
    usageCell: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    usageIndicator: { height: '10px', width: '10px', borderRadius: '50%' },
    actionButton: { 
      border: 'none', 
      padding: '0.5rem 1rem', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      marginRight: '0.5rem', 
      fontWeight: '600', 
      transition: 'all 0.2s ease-in-out' 
    },
    viewButton: { background: '#3b82f6', color: 'white' },
    editButton: { background: '#f59e0b', color: 'white' },
    renewButton: { background: '#22c55e', color: 'white' },
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
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#111827', padding: '2rem', borderRadius: '12px', width: '500px', border: '1px solid rgba(255, 255, 255, 0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { margin: 0, color: '#f9fafb' },
    closeButton: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#d1d5db' },
    modalList: { listStyle: 'none', padding: 0, marginTop: '1rem', color: '#e5e7eb' },
    modalListItem: { padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>License Management</h2>
          <div style={styles.controls}>
            {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_PROCUREMENT_OFFICER') && (
              <button style={styles.addButton} onClick={() => navigate('/licenses/add')}>Add License</button>
            )}
            <input type="text" placeholder="Filter by Vendor ID..." value={vendorFilterId} onChange={(e) => setVendorFilterId(e.target.value)} style={styles.filterInput} />
          </div>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>License Key</th>
                <th style={styles.th}>Software</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Usage</th>
                <th style={styles.th}>Validity</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => {
                const usage = getUsageIndicator(license);
                return (
                  <tr key={license.licenseKey}>
                    <td style={styles.td}>{license.licenseKey}</td>
                    <td style={styles.td}>{license.softwareName}</td>
                    <td style={styles.td}>{getVendorName(license.vendorId)}</td>
                    <td style={styles.td}>
                      <div style={styles.usageCell}>
                        <span style={{...styles.usageIndicator, backgroundColor: usage.color}}></span>
                        <span>{usage.text}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{license.validFrom} → {license.validTo}</td>
                    <td style={styles.td}>
                      <button style={{...styles.actionButton, ...styles.viewButton}} onClick={() => handleViewDevices(license)}>View Devices</button>
                      <button style={{...styles.actionButton, ...styles.editButton}}>Edit</button>
                      <button style={{...styles.actionButton, ...styles.renewButton}}>Renew</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={styles.pagination}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={styles.paginationButton}>Previous</button>
          <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={styles.paginationButton}>Next</button>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Devices for {selectedLicense?.softwareName}</h3>
              <button style={styles.closeButton} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <p style={{color: '#d1d5db'}}>Total devices using this license: {assignedDevices.length}</p>
            <ul style={styles.modalList}>
              {assignedDevices.map(assignment => (
                <li style={styles.modalListItem} key={assignment.assignmentId}>{assignment.deviceId} (Assigned on: {assignment.assignedOn})</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LicenseManagementPage;
