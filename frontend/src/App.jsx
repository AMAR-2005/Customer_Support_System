"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"
import TicketsPage from "./pages/TicketsPage"
import TicketDetailPage from "./pages/TicketDetailPage"
import NewTicketPage from "./pages/NewTicketPage"
import UsersPage from "./pages/UsersPage"
import CreateAgentPage from "./pages/CreateAgentPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-ticket"
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <NewTicketPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-agent"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <CreateAgentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
