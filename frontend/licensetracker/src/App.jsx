import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeviceManagementPage from './pages/DeviceManagementPage';
import LicenseManagementPage from './pages/LicenseManagementPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AddDeviceForm from './components/AddDeviceForm';
import AddLicenseForm from './components/AddLicenseForm';
import EditDevicePage from './pages/EditDevicePage';
import PrivateRoute from './components/PrivateRoute';
import { useUser } from './context/UserContext';
import AddUserForm from './components/AddUserForm';
import UserManagementPage from './pages/UserManagementPage';
import VendorManagementPage from './pages/VendorManagementPage';
import AddVendorForm from './components/AddVendorForm';
import SoftwareManagementPage from './pages/SoftwareManagementPage';
import AuditLogPage from './pages/AuditLogPage';

const AppLayout = () => {
  const { user } = useUser();
  if (!user) return null;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--background-dark)',
    },
    mainContent: {
      flex: 1,
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/devices" element={<DeviceManagementPage />} />
            <Route path="/devices/add" element={<AddDeviceForm />} />
            <Route path="/devices/edit/:id" element={<EditDevicePage />} />
            <Route path="/licenses" element={<LicenseManagementPage />} />
            <Route path="/licenses/add" element={<AddLicenseForm />} />
            <Route path="/vendors" element={<VendorManagementPage />} />
            <Route path="/vendors/add" element={<AddVendorForm />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/users/add" element={<AddUserForm />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/software" element={<SoftwareManagementPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
