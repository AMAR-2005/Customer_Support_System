
import { useAuth } from "../contexts/AuthContext"
import DashboardLayout from "../components/dashboard/DashboardLayout"
import AdminDashboard from "../components/dashboard/AdminDashboard"
import AgentDashboard from "../components/dashboard/AgentDashboard"
import CustomerDashboard from "../components/dashboard/CustomerDashboard"

const Dashboard = () => {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminDashboard />
      case "AGENT":
        return <AgentDashboard />
      case "CUSTOMER":
        return <CustomerDashboard />
      default:
        return <div>Invalid user role</div>
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}

export default Dashboard
