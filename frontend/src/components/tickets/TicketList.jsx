
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { ArrowUp, Minus, ArrowDown } from "lucide-react"

import { API_BASE_URL } from "../../contexts/AuthContext";
const TicketList = () => {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const { getAuthHeaders, user } = useAuth()

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  const fetchTickets = async () => {
    try {
      let endpoint = `${API_BASE_URL}/tickets`
      if (user?.role === "CUSTOMER") {
        endpoint = `${API_BASE_URL}/customer/tickets`
      }

      const response = await fetch(endpoint, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTickets = () => {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          (ticket.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (ticket.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }

    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }
  useEffect(() => {
    filterTickets()
  }, [searchTerm, statusFilter, priorityFilter, tickets])

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
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors
        ${statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-2 rounded-md bg-gray-100 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200"
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

        </div>

      </div>

      <div className="max-h-[67vh] overflow-y-auto space-y-4 px-2 py-2">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const statusColor = getStatusColor(ticket.status)
            const priorityColor = getPriorityColor(ticket.priority)

            return (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="group block p-5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 text-slate-900 truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-slate-600 text-m line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                    <span
                      className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)} bg-opacity-20`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${ticket.status === "OPEN"
                          ? "bg-red-600"
                          : ticket.status === "IN_PROGRESS"
                            ? "bg-yellow-600"
                            : ticket.status === "RESOLVED"
                              ? "bg-green-600"
                              : "bg-gray-600"
                          }`}
                      />
                      {ticket.status.replace("_", " ")}
                    </span>

                    <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${ticket.priority === "HIGH"
                          ? "bg-red-600"
                          : ticket.priority === "MEDIUM"
                            ? "bg-yellow-600"
                            : ticket.priority === "LOW"
                              ? "bg-green-600"
                              : "bg-gray-600"
                          }`}
                      />
                      <span className={
                        ticket.priority === "HIGH"
                          ? "text-red-600 font-semibold"
                          : ticket.priority === "MEDIUM"
                            ? "text-yellow-600 font-semibold"
                            : ticket.priority === "LOW"
                              ? "text-green-600 font-semibold"
                              : "text-gray-600"
                      }
                      >
                        {ticket.priority} Priority
                      </span>
                    </span>
                  </div>

                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-mono">Ticket #{ticket.id}</span>
                  <div className="flex items-center gap-4">
                    {ticket.customerEmail && user?.role !== "CUSTOMER" && (
                      <span className="truncate max-w-xs">
                        Customer: {ticket.customerEmail}
                      </span>
                    )}
                    <span>
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No tickets found</p>
            {user?.role === "CUSTOMER" && (
              <Link to="/new-ticket">
                <Button className="bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all duration-200 px-5 py-2 rounded-md">
                  Create Your First Ticket
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>





    </div>
  )
}

export default TicketList
