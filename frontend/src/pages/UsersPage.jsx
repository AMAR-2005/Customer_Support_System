
import DashboardLayout from "../components/dashboard/DashboardLayout"
import UserManagement from "../components/admin/UserManagement"
import Button from "../components/ui/Button"
import { UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

const UsersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all system users and their roles</p>
          </div>
          <Link to="/create-agent">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </Link>
        </div>
        <UserManagement />
      </div>
    </DashboardLayout>
  )
}

export default UsersPage
