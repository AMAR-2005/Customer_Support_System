
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import StatsCard from "./StatsCard"
import Button from "../ui/Button"
import { Ticket, Clock, CheckCircle, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { API_BASE_URL } from "../../contexts/AuthContext";
const CustomerDashboard = () => {
  const { getAuthHeaders } = useAuth()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    resolvedTickets: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/tickets`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTickets(data.slice(0, 5)) // Show recent 5 tickets

        // Calculate stats
        const open = data.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length
        const resolved = data.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length

        setStats({
          totalTickets: data.length,
          pendingTickets: open,
          resolvedTickets: resolved,
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
        <h1 className="text-3xl font-bold">My Dashboard</h1>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your support tickets</p>
        </div>
        <Link to="/new-ticket">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm border bg-card">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100">
            <Ticket className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Tickets</h3>
            <p className="text-2xl font-bold">{stats.totalTickets}</p>
            <p className="text-xs text-muted-foreground">All your tickets</p>
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
            <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
            <p className="text-2xl font-bold">{stats.resolvedTickets}</p>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="  space-y-4">
          <h2 className="text-xl font-semibold ">Recent Tickets</h2>
          <div className="max-h-[57vh] overflow-y-auto space-y-3 p-2">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block p-4 border rounded-lg transform hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg transition-all duration-300 ease-in-out"
                >
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
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tickets yet</p>
                <Link to="/new-ticket">
                  <Button>Create Your First Ticket</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Support Information</h2>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">How to Get Help</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create a detailed ticket with your issue</li>
                <li>• Include relevant screenshots or files</li>
                <li>• Check back for agent responses</li>
                <li>• Rate your experience when resolved</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Response Times</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600">High Priority</span>
                  <span>&lt; 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Medium Priority</span>
                  <span>&lt; 8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Low Priority</span>
                  <span>&lt; 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
