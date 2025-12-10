import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const { user, logout } = useUser();
  let userRole = null;

  if (user && user.token) {
    try {
      const decodedToken = jwtDecode(user.token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const canViewReports = ['ROLE_ADMIN', 'ROLE_IT_AUDITOR', 'ROLE_COMPLIANCE_OFFICER', 'ROLE_COMPLIANCE_LEAD', 'ROLE_SECURITY_HEAD'].includes(userRole);
  const canViewAudit = userRole === 'ROLE_SECURITY_HEAD';

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 3rem',
      height: '64px',
      backgroundColor: 'var(--surface-dark)',
      borderBottom: '1px solid var(--border-dark)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--primary)',
      textDecoration: 'none',
    },
    navSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem',
    },
    navList: {
      listStyle: 'none',
      display: 'flex',
      gap: '2.5rem',
      margin: 0,
      padding: 0,
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--text-muted)',
      fontWeight: '500',
      textDecoration: 'none',
      padding: '0.5rem 0',
      borderBottom: '2px solid transparent',
      transition: 'color 0.2s, border-bottom-color 0.2s',
    },
    activeNavLink: {
      color: 'var(--primary)',
      borderBottom: '2px solid var(--primary)',
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    logoutButton: {
      backgroundColor: 'var(--primary)',
      color: 'var(--text-light)',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: '500',
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navSection}>
        <NavLink to="/" style={styles.logo}>✅ Certify</NavLink>
        <ul style={styles.navList}>
          <li><NavLink to="/" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>📊 Dashboard</NavLink></li>
          <li><NavLink to="/devices" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>📱 Devices</NavLink></li>
          <li><NavLink to="/licenses" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>📜 Licenses</NavLink></li>
          <li><NavLink to="/vendors" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>🏢 Vendors</NavLink></li>
          <li><NavLink to="/software" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>💿 Software</NavLink></li>
        </ul>
      </div>

      <div style={styles.navSection}>
        <ul style={styles.navList}>
          {canViewReports && (
            <li><NavLink to="/reports" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>📄 Reports</NavLink></li>
          )}
          {canViewAudit && (
            <li><NavLink to="/audit" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>🛡️ Audit</NavLink></li>
          )}
          <li><NavLink to="/alerts" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>🚨 Alerts</NavLink></li>
          {userRole === 'ROLE_ADMIN' && (
              <li><NavLink to="/users" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>👥 Users</NavLink></li>
          )}
          <li><NavLink to="/ai-assistant" style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeNavLink } : styles.navLink)}>🤖 AI</NavLink></li>
        </ul>
        {user && (
          <div style={styles.userProfile}>
            <button style={styles.logoutButton} onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
