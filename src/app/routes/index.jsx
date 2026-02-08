
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import useSessionTimeout from '../../shared/hooks/useSessionTimeout';

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('../../features/auth/pages/LandingPage'));
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const PatientDashboard = lazy(() => import('../../features/patient/pages/PatientDashboard'));
const WorkoutSession = lazy(() => import('../../features/patient/pages/WorkoutSession'));
const ProfilePage = lazy(() => import('../../features/patient/pages/ProfilePage'));
const HistoryPage = lazy(() => import('../../features/patient/pages/HistoryPage'));
const PatientMessagesPage = lazy(() => import('../../features/patient/pages/MessagesPage'));
const DoctorDashboard = lazy(() => import('../../features/doctor/pages/DoctorDashboard'));
const PatientDetailView = lazy(() => import('../../features/doctor/pages/PatientDetailView'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

function AppRoutes() {
  const { user, userData, loading } = useAuth();

  // Enable automatic session timeout (30 minutes)
  useSessionTimeout(30 * 60 * 1000);

  if (loading) return null; // Let ProtectedRoute handle initial load spin

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={userData?.userType === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} replace />
            ) : (
              <LandingPage />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={userData?.userType === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <ProtectedRoute allowedRole="patient">
              <WorkoutSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="patient">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRole="patient">
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientMessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:patientId"
          element={
            <ProtectedRoute allowedRole="doctor">
              <PatientDetailView />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
