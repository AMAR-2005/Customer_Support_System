
import DashboardLayout from "../components/dashboard/DashboardLayout"
import SystemAnalytics from "../components/admin/SystemAnalytics"

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your support system performance</p>
        </div>
        <SystemAnalytics />
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage
