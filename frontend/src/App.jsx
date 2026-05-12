import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import AppLayout from './layouts/AppLayout'
import { AuthProvider } from './context/AuthContext'

// Pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import DashboardPage from './pages/DashboardPage'
import MyTripsPage from './pages/MyTripsPage'
import CreateTripPage from './pages/CreateTripPage'
import { ExplorePage, BudgetPage, PackingPage, ProfilePage, ItineraryPage } from './pages/PlaceholderPages'

// Auth guard
function RequireAuth({ children }) {
  const isAuth = localStorage.getItem('traveloop-token')
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="trips" element={<MyTripsPage />} />
              <Route path="trips/:id" element={<ItineraryPage />} />
              <Route path="create-trip" element={<CreateTripPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="packing" element={<PackingPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProfilePage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}
