import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import StatsCard from "./StatsCard"
import { Ticket, Clock, CheckCircle } from "lucide-react"

import { API_BASE_URL } from "../../contexts/AuthContext";
const AgentDashboard = () => {
  const { getAuthHeaders } = useAuth()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({
    assignedTickets: 0,
    pendingTickets: 0,
    resolvedToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTickets(data.slice(0, 10)) 

        const pending = data.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length
        const resolved = data.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length

        setStats({
          assignedTickets: data.length,
          pendingTickets: pending,
          resolvedToday: resolved,
        })
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "text-red-600 bg-red-50"
      case "IN_PROGRESS":
        return "text-yellow-600 bg-yellow-50"
      case "RESOLVED":
        return "text-green-600 bg-green-50"
      case "CLOSED":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600"
      case "MEDIUM":
        return "text-yellow-600"
      case "LOW":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <p className="text-muted-foreground">Manage your assigned tickets</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100">
            <Ticket className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Assigned Tickets</h3>
            <p className="text-2xl font-bold">{stats.assignedTickets}</p>
            <p className="text-xs text-muted-foreground">Total tickets</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            <p className="text-2xl font-bold">{stats.pendingTickets}</p>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
            <p className="text-2xl font-bold">{stats.resolvedToday}</p>
            <p className="text-xs text-muted-foreground">Completed tickets</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold ">Recent Tickets</h2>
          <div className=" p-2 space-y-3  max-h-[57vh] overflow-y-scroll scrollbar-none">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg transition-all duration-300 ease-in-out">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium truncate">{ticket.subject}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority} Priority
                    </span>
                    <span className="text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No tickets assigned</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-2">
            <a href="/tickets" className="p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 ease-in-out">
              <h3 className="font-medium">View All Tickets</h3>
              <p className="text-sm text-muted-foreground">Manage all support tickets</p>
            </a>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Performance</h3>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-medium">2.5 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resolution Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentDashboard
