
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useParams, useNavigate } from "react-router-dom"
import Button from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { ArrowLeft, MessageSquare, Clock, User } from "lucide-react"

import { API_BASE_URL } from "../../contexts/AuthContext";
const TicketDetail = () => {
  const [ticket, setTicket] = useState(null)
  const [responses, setResponses] = useState([])
  const [newResponse, setNewResponse] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { getAuthHeaders, user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTicketDetails()
  }, [id])

  const fetchTicketDetails = async () => {
    try {
      const ticketResponse = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (ticketResponse.ok) {
        const ticketData = await ticketResponse.json()
        setTicket(ticketData)
        setNewStatus(ticketData.status)
      }

      const responsesResponse = await fetch(`${API_BASE_URL}/tickets/${id}/responses`, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (responsesResponse.ok) {
        const responsesData = await responsesResponse.json()
        setResponses(responsesData)
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResponse = async (e) => {
    e.preventDefault()
    if (!newResponse.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/responses`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newResponse,
          respondedBy : user.name
        }),
      })

      if (response.ok) {
        setNewResponse("")
        fetchTicketDetails()
      }
    } catch (error) {
      console.error("Error adding response:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (newStatus === ticket.status) return
    console.log(user.name)
    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        fetchTicketDetails() 
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "text-red-600 bg-red-50 border-red-200"
      case "IN_PROGRESS":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "RESOLVED":
        return "text-green-600 bg-green-50 border-green-200"
      case "CLOSED":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
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
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ticket not found</p>
        <Button onClick={() => navigate("/tickets")} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    )
  }

  const canUpdateStatus = user?.role === "ADMIN" || user?.role === "AGENT"
  const canAddResponse = user?.role === "ADMIN" || user?.role === "AGENT"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/tickets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
          <p className="text-muted-foreground">Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority} Priority</span>
        </div>
      </div>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {ticket.customerEmail}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Status Update (Admin/Agent only) */}
      {canUpdateStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <Button onClick={handleStatusUpdate} disabled={submitting || newStatus === ticket.status}>
                {submitting ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Responses ({responses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {responses.length > 0 ? (
            responses.map((response) => (
              <div key={response.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {response.agentEmail?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{response.agentEmail || "Support Agent"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(response.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{response.message}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No responses yet</p>
          )}

          {/* Add Response Form (Admin/Agent only) */}
          {canAddResponse && (
            <form onSubmit={handleAddResponse} className="space-y-3 pt-4 border-t">
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Add a response..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <Button type="submit" disabled={submitting || !newResponse.trim()}>
                {submitting ? "Adding..." : "Add Response"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketDetail
