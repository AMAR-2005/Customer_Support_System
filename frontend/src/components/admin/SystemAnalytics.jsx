
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { API_BASE_URL } from "../../contexts/AuthContext";
import StatsCard from "../dashboard/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Users, Ticket, Clock, CheckCircle, TrendingUp, Activity } from "lucide-react"

const SystemAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalTickets: 0,
    pendingTickets: 0,
    openTickets:0,
    resolvedTickets: 0,
    closedTickets:0,
    totalAdmins: 0,
    totalAgents: 0,
    totalCustomers: 0,
    avgResponseTime: "0 hours",
    resolutionRate: "0%",
    userGrowth: "+0%",
    ticketTrends: [],
  })
  const [loading, setLoading] = useState(true)
  const { getAuthHeaders } = useAuth()

  useEffect(() => {
    handlefetchAnalytics()
  }, [])

  const handlefetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })
      //const response = await fetchAnalytics();

      if (response.ok) {
        const data = await response.json()
        const resolutionRate = data.totalTickets > 0 ? Math.round((data.resolvedTickets / data.totalTickets) * 100) : 0

        setAnalytics({
          ...data,
          resolutionRate: `${resolutionRate}%`,
          avgResponseTime: "2.5 hours", // Mock data
          userGrowth: "+12%", // Mock data
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[82vh] overflow-y-auto space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers}
          description="Registered users"
          icon={Users}
         
        />
        <StatsCard
          title="Total Tickets"
          value={analytics.totalTickets}
          description="All support tickets"
          icon={Ticket}
        />
        <StatsCard
          title="Pending Tickets"
          value={analytics.pendingTickets}
          description="Awaiting response"
          icon={Clock}
        />
        <StatsCard
          title="Resolution Rate"
          value={analytics.resolutionRate}
          description="Successfully resolved"
          icon={CheckCircle}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Average Response Time</span>
              <span className="text-sm text-green-600 font-medium">{analytics.avgResponseTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Resolution Rate</span>
              <span className="text-sm text-green-600 font-medium">{analytics.resolutionRate}</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Customer Satisfaction</span>
              <span className="text-sm text-green-600 font-medium">4.8/5.0</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">First Contact Resolution</span>
              <span className="text-sm text-green-600 font-medium">78%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">System Status</span>
              <span className="text-sm text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Active Agents</span>
              <span className="text-sm font-medium">{analytics.totalAgents} online</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Server Uptime</span>
              <span className="text-sm text-green-600 font-medium">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Database Performance</span>
              <span className="text-sm text-green-600 font-medium">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Ticket Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analytics.openTickets}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analytics.pendingTickets}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.resolvedTickets}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{analytics.closedTickets}</div>
              <div className="text-sm text-muted-foreground">Closed</div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>User Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analytics.totalAdmins}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalAgents}</div>
              <div className="text-sm text-muted-foreground">Agents</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.totalCustomers}</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SystemAnalytics
