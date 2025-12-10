import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed! Please check your credentials.');
      }

      const data = await response.json();
      login(data.token);
      navigate('/'); // Redirect to dashboard on successful login

    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '1rem',
      margin: 0,
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    loginBox: {
      padding: '3rem 2.5rem',
      backgroundColor: '#111827',
      borderRadius: '16px',
      boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)`,
      width: '100%',
      maxWidth: '420px',
      textAlign: 'center',
      border: `1px solid rgba(255, 255, 255, 0.1)`,
      position: 'relative',
    },
    title: {
      color: '#f9fafb',
      marginBottom: '2.5rem',
      fontWeight: '800',
      fontSize: '2rem',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      color: '#d1d5db',
      marginBottom: '2rem',
      fontSize: '1rem',
      fontWeight: '400',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    label: {
      textAlign: 'left',
      color: '#e5e7eb',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '0.875rem 1rem',
      borderRadius: '10px',
      border: `1px solid #374151`,
      fontSize: '1rem',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
    },
    button: {
      background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
      color: 'white',
      border: 'none',
      padding: '1rem',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.2s ease-in-out',
      letterSpacing: '0.025em',
    },
    link: {
      marginTop: '1.75rem',
      color: '#d1d5db',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'color 0.2s ease-in-out',
    },
    error: {
      color: '#fca5a5',
      marginTop: '1rem',
      fontSize: '0.875rem',
      backgroundColor: '#1f2937',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #f87171',
      textAlign: 'left',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>✅ Certify</h1>
        <p style={styles.subtitle}>Sign in to manage your assets</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...styles.input }}
              required
            />
          </div>
          <div style={styles.inputWrapper}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input }}
              required
            />
          </div>
          <button 
            type="submit" 
            style={styles.button} 
          >
            Sign In
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
        <a 
          href="#" 
          style={styles.link} 
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
