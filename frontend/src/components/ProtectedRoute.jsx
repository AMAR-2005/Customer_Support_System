"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />
      case "CUSTOMER":
        return <Navigate to="/tickets" replace />
      case "AGENT":
        return <Navigate to="/agent" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
