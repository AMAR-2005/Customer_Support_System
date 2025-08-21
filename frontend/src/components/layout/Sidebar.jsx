
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Home, Ticket, Plus, Users, UserPlus, BarChart3, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import Button from "../ui/Button"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
 // const [isOpen, setIsOpen] = useState(true)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "AGENT", "CUSTOMER"] },
    { name: "Tickets", href: "/tickets", icon: Ticket, roles: ["ADMIN", "AGENT", "CUSTOMER"] },
    { name: "New Ticket", href: "/new-ticket", icon: Plus, roles: ["CUSTOMER"] },
    { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
    { name: "Create Agent", href: "/create-agent", icon: UserPlus, roles: ["ADMIN"] },
    // { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["ADMIN"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role))

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={`fixed top-4 transition-all duration-200 z-50  ${isOpen ? "ml-[200px]" : "ml-6"
          }`}
      >
        <Button className="hover:bg-zinc-400" variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      <div
        className={`
        h-screen fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        
      `}
      >
        <div className="flex flex-col  h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h1 className="text-xl font-bold text-indigo-700">Support System</h1>
              <p className="text-sm text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  // onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-blue-500 text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-blue-300"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      {/* {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />} */}
    </>
  )
}

export default Sidebar
