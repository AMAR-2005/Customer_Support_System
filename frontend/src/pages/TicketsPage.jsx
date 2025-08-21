
import DashboardLayout from "../components/dashboard/DashboardLayout"
import TicketList from "../components/tickets/TicketList"
import Button from "../components/ui/Button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const TicketsPage = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user?.role === "CUSTOMER" ? "My Tickets" : "All Tickets"}</h1>
            <p className="text-muted-foreground">
              {user?.role === "CUSTOMER" ? "Track and manage your support requests" : "Manage all support tickets"}
            </p>
          </div>
          {user?.role === "CUSTOMER" && (
            <Link to="/new-ticket">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </Link>
          )}
        </div>
        <TicketList />
      </div>
    </DashboardLayout>
  )
}

export default TicketsPage
