import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { API_BASE_URL } from "../../contexts/AuthContext";
import StatsCard from "./StatsCard"
import { Users, Ticket, Clock, CheckCircle, BarChart3, BarChart3Icon, Users2, UserSquare2Icon, UsersRound, LucideUserRoundCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

const AdminDashboard = () => {
  const { getAuthHeaders } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    pendingTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    totalAdmins: 0,
    totalAgents: 0,
    totalCustomers: 0,
    avgResponseTime: "0 hours",
    resolutionRate: "0%",
    userGrowth: "+0%",
    ticketTrends: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const resolutionRate = data.totalTickets > 0 ? Math.round((data.resolvedTickets / data.totalTickets) * 100) : 0
        setStats({
          ...data,
          resolutionRate: `${resolutionRate}%`,
          avgResponseTime: "2.5 hours", // Mock data
          userGrowth: "+12%", // Mock data
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your support system</p>
        </div>
        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-orange-100">
              <LucideUserRoundCheck className="h-6 w-6 text-teal -600" />
        </div>
      </div>

      <div className="border-t my-4" />
      <div className=" max-h-[75vh] overflow-y-scroll scrollbar-none flex-1 justify-between ">

        <div className="mt-6 grid gap-x-6 md:grid-cols-10 lg:grid-cols-4">
          <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100">
              <Ticket className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Tickets</h3>
              <p className="text-2xl font-bold">{stats.totalTickets}</p>
              <p className="text-xs text-muted-foreground">All support tickets</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pending Tickets</h3>
              <p className="text-2xl font-bold">{stats.pendingTickets}</p>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-purple-100">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Resolution Rate</h3>
              <p className="text-2xl font-bold">{stats.resolutionRate}</p>
              <p className="text-xs text-muted-foreground">Successfully resolved</p>
            </div>
          </div>

        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 mb-6 ">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-2 ">
              <a href="/users" className="p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg transition-all duration-300 ease-in-out">
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage all users</p>
              </a>
              <a href="/create-agent" className="p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg transition-all duration-300 ease-in-out">
                <h3 className="font-medium">Create Agent</h3>
                <p className="text-sm text-muted-foreground">Add new support agents</p>
              </a>
              <a href="/analytics" className="p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg transition-all duration-300 ease-in-out">
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Detailed system analytics</p>
              </a>
            </div>
          </div>

          <div className="space-y-4 ">
            <h2 className="text-xl font-semibold">System Health</h2>
            <div className="space-y-3  border p-2 rounded-lg">

              <div className="flex items-center justify-between p-3.5 border rounded-lg">
                <span className="text-sm font-medium">Database Performance</span>
                <span className="text-sm text-green-600 font-medium">Excellent</span>
              </div>
              <div className="flex items-center justify-between p-3.5 border rounded-lg">
                <span className="text-sm">System Status</span>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3.5 border rounded-lg">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium">&lt; 2 hours</span>
              </div>
              <div className="flex items-center justify-between p-3.5 border rounded-lg">
                <span className="text-sm">Active Agents</span>
                <span className="text-sm font-medium">{stats.totalAgents} online</span>
              </div>
            </div>
          </div>
        </div>
        <Card >
          <CardHeader>
            <CardTitle>Ticket Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.openTickets}</div>
                <div className="text-sm text-muted-foreground">Open</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.closedTickets}</div>
                <div className="text-sm text-muted-foreground">Closed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.totalAdmins}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalAgents}</div>
                <div className="text-sm text-muted-foreground">Agents</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalCustomers}</div>
                <div className="text-sm text-muted-foreground">Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
