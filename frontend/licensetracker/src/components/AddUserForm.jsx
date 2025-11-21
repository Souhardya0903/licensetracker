import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'IT_AUDITOR', // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed! Please try again.');
      }
      setSuccess('User registered successfully! Redirecting to user management...');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(err.message);
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
    error: { color: '#fca5a5', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' },
    success: { color: '#86efac', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Add New User</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
              <option value="ADMIN">ADMIN</option>
              <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
              <option value="PROCUREMENT_OFFICER">PROCUREMENT_OFFICER</option>
              <option value="COMPLIANCE_OFFICER">COMPLIANCE_OFFICER</option>
              <option value="IT_AUDITOR">IT_AUDITOR</option>
              <option value="OPERATIONS_MANAGER">OPERATIONS_MANAGER</option>
              <option value="NETWORK_ENGINEER">NETWORK_ENGINEER</option>
              <option value="SECURITY_HEAD">SECURITY_HEAD</option>
              <option value="PRODUCT_OWNER">PRODUCT_OWNER</option>
              <option value="COMPLIANCE_LEAD">COMPLIANCE_LEAD</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton}>Register User</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </div>
    </div>
  );
};

export default AddUserForm;
