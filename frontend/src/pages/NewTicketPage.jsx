
import DashboardLayout from "../components/dashboard/DashboardLayout"
import TicketForm from "../components/tickets/TicketForm"

const NewTicketPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Ticket</h1>
          <p className="text-muted-foreground">Submit a new support request</p>
        </div>
        <TicketForm />
      </div>
    </DashboardLayout>
  )
}

export default NewTicketPage
