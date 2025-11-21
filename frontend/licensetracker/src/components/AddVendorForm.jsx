import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddVendorForm = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    supportEmail: '',
  });
  const [error, setError] = useState('');
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
    setError('');
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to add vendor.');
      }
      alert('Vendor added successfully!');
      navigate('/vendors');
    } catch (err) {
      setError(err.message);
      console.error('Error adding vendor:', err);
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
    error: { color: '#fca5a5', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Add New Vendor</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Vendor Name</label>
            <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Support Email</label>
            <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} style={styles.input} />
          </div>
          <button type="submit" style={styles.submitButton}>Add Vendor</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddVendorForm;
