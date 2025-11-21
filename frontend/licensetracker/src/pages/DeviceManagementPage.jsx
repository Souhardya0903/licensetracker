import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState([]);
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  let userRole = null;

  if (user && user.token) {
    const decodedToken = jwtDecode(user.token);
    userRole = decodedToken.role;
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedLicenseKey, setSelectedLicenseKey] = useState('');

  const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch(`/api/devices?location=${location}&page=${page}&size=10`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDevices(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchLicenses = async () => {
    try {
        const response = await fetch(`/api/licenses?page=0&size=1000`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Failed to fetch licenses');
        const data = await response.json();
        setLicenses(data.content || []);
    } catch (err) {
        console.error(err.message);
    }
  };

  const handleOpenAssignModal = (device) => {
    setSelectedDevice(device);
    fetchLicenses();
    setIsModalOpen(true);
  };

  const handleAssignLicense = async () => {
    if (!selectedDevice || !selectedLicenseKey) return;

    try {
      const response = await fetch(`/api/assignments?deviceId=${selectedDevice.deviceId}&licenseKey=${selectedLicenseKey}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign license');
      }
      
      setIsModalOpen(false);
      setSelectedDevice(null);
      setSelectedLicenseKey('');
      fetchDevices();

    } catch (error) {
      console.error("Error assigning license:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/devices/bulk', {
        method: 'POST',
        headers: getAuthHeaders(true), // Use multipart headers
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bulk upload failed');
      }
      
      alert('Bulk upload successful!');
      fetchDevices(); // Refresh the list
      setFile(null);

    } catch (error) {
      console.error("Error during bulk upload:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [location, page]);

  const styles = {
    container: { padding: '2rem', color: 'var(--text-light)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', margin: 0 },
    controls: { display: 'flex', gap: '1rem', alignItems: 'center' },
    addButton: { backgroundColor: 'var(--primary)', color: 'var(--text-light)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    filterInput: { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', color: 'var(--text-light)' },
    tableContainer: { backgroundColor: 'var(--surface-dark)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-dark)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-dark)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' },
    td: { padding: '1rem', borderBottom: '1px solid var(--border-dark)' },
    actionButton: { border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', marginRight: '0.5rem', fontWeight: '600' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#111827', padding: '2rem', borderRadius: '12px', width: '500px', border: '1px solid rgba(255, 255, 255, 0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { margin: 0, color: '#f9fafb' },
    closeButton: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#d1d5db' },
    select: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--surface-dark)', color: 'var(--text-light)', marginTop: '1rem' },
    modalActions: { marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' },
    confirmButton: { backgroundColor: 'var(--primary)', color: 'var(--text-light)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    cancelButton: { backgroundColor: '#374151', color: 'var(--text-light)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Device Management</h1>
          <div style={styles.controls}>
            {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_NETWORK_ADMIN') && (
              <>
                <button style={styles.addButton} onClick={() => navigate('/devices/add')}>Add Device</button>
                <input type="file" onChange={handleFileChange} accept=".csv" />
                <button style={styles.addButton} onClick={handleBulkUpload} disabled={!file}>Bulk Upload</button>
              </>
            )}
            <input type="text" placeholder="Filter by Location..." value={location} onChange={(e) => setLocation(e.target.value)} style={styles.filterInput} />
          </div>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Device ID</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Model</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.deviceId}>
                  <td style={styles.td}>{device.deviceId}</td>
                  <td style={styles.td}>{device.type}</td>
                  <td style={styles.td}>{device.location}</td>
                  <td style={styles.td}>{device.model}</td>
                  <td style={styles.td}>{device.status}</td>
                  <td style={styles.td}>
                    {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_NETWORK_ADMIN') && (
                      <button style={{...styles.actionButton, backgroundColor: '#3b82f6', color: 'white'}} onClick={() => handleOpenAssignModal(device)}>Assign License</button>
                    )}
                    {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_OPERATIONS_MANAGER') && (
                      <button style={{...styles.actionButton, backgroundColor: '#f59e0b', color: 'white'}} onClick={() => navigate(`/devices/edit/${device.deviceId}`)}>Edit Status</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Assign License to {selectedDevice?.deviceId}</h3>
              <button style={styles.closeButton} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <select value={selectedLicenseKey} onChange={(e) => setSelectedLicenseKey(e.target.value)} style={styles.select}>
              <option value="">Select a License</option>
              {licenses.map(license => (
                <option key={license.licenseKey} value={license.licenseKey}>
                  {license.softwareName} ({license.licenseKey})
                </option>
              ))}
            </select>
            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button style={styles.confirmButton} onClick={handleAssignLicense}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceManagementPage;
