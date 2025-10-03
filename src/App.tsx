import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RoleSelection } from '@/features/auth/pages/RoleSelection';
import { useUserStore } from '@/stores/useUserStore';
import {
  SeekerDashboard,
  CreateWorkPage,
  ContractDetailsPage,
} from '@/features/seeker';
import './App.css';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Placeholder dashboard components for Furnisher and Platform (Phase 4 & 5)
const FurnisherDashboard = () => (
  <div>
    <h1>Furnisher Dashboard</h1>
    <p>Phase 4: Browse work, place bids, complete tasks</p>
  </div>
);

const PlatformDashboard = () => (
  <div>
    <h1>Platform Dashboard</h1>
    <p>Phase 5: Manage disputes, resolve conflicts</p>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { role } = useUserStore();

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Role Selection */}
              <Route path="/" element={<RoleSelection />} />

              {/* Seeker Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute requiredRole="seeker">
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/create-work"
                element={
                  <ProtectedRoute requiredRole="seeker">
                    <CreateWorkPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/contracts/:txid/:outputIndex"
                element={
                  <ProtectedRoute requiredRole="seeker">
                    <ContractDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Furnisher Routes */}
              <Route
                path="/furnisher/dashboard"
                element={
                  <ProtectedRoute requiredRole="furnisher">
                    <FurnisherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Platform Routes */}
              <Route
                path="/platform/dashboard"
                element={
                  <ProtectedRoute requiredRole="platform">
                    <PlatformDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
