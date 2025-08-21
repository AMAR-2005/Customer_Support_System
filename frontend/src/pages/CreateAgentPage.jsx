
import DashboardLayout from "../components/dashboard/DashboardLayout"
import CreateAgentForm from "../components/admin/CreateAgentForm"

const CreateAgentPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Agent</h1>
          <p className="text-muted-foreground">Add a new support agent to your team</p>
        </div>
        <CreateAgentForm />
      </div>
    </DashboardLayout>
  )
}

export default CreateAgentPage
