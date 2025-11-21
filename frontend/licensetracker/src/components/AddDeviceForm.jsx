import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDeviceForm = () => {
  const [formData, setFormData] = useState({
    deviceId: '',
    ipAddress: '',
    location: '',
    model: '',
    type: 'Router',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setErrors(errorData);
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to add device.');
        }
        return;
      }
      alert('Device added successfully!');
      navigate('/devices');
    } catch (err) {
      setErrors({ general: err.message });
      console.error('Error adding device:', err);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
      fontFamily: 'Inter, SF Pro Display, system-ui, -apple-system, sans-serif',
    },
    formContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2.5rem',
      backgroundColor: '#111827',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    },
    title: { 
      color: '#f9fafb', 
      textAlign: 'center', 
      marginBottom: '2rem', 
      fontWeight: '800', 
      fontSize: '1.75rem' 
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { color: '#d1d5db', fontWeight: '500' },
    input: {
      padding: '0.875rem 1rem',
      borderRadius: '10px',
      border: '1px solid #374151',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      fontSize: '1rem',
    },
    select: {
      padding: '0.875rem 1rem',
      borderRadius: '10px',
      border: '1px solid #374151',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      fontSize: '1rem',
    },
    submitButton: {
      background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
      color: 'white',
      border: 'none',
      padding: '1rem',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      marginTop: '1rem',
    },
    error: { color: '#fca5a5', fontSize: '0.875rem' },
    generalError: { color: '#fca5a5', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Add New Device</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Device ID</label>
            <input type="text" name="deviceId" value={formData.deviceId} onChange={handleChange} style={styles.input} required />
            {errors.deviceId && <p style={styles.error}>{errors.deviceId}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>IP Address</label>
            <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} style={styles.input} required />
            {errors.ipAddress && <p style={styles.error}>{errors.ipAddress}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} />
            {errors.location && <p style={styles.error}>{errors.location}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Model</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} style={styles.input} />
            {errors.model && <p style={styles.error}>{errors.model}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Device Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={styles.select}>
              <option value="Router">Router</option>
              <option value="Firewall">Firewall</option>
              <option value="Switch">Switch</option>
            </select>
            {errors.type && <p style={styles.error}>{errors.type}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Lifecycle Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
              <option value="ACTIVE">Active</option>
              <option value="OBSOLETE">Obsolete</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="DECOMMISSIONED">Decommissioned</option>
            </select>
            {errors.status && <p style={styles.error}>{errors.status}</p>}
          </div>
          <button type="submit" style={styles.submitButton}>Add Device</button>
          {errors.general && <p style={styles.generalError}>{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddDeviceForm;
