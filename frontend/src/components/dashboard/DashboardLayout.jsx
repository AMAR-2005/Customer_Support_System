
import { useState } from "react"
import Sidebar from "../layout/Sidebar"

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background flex">

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-1 mt-10 transition-all duration-200 ${ isOpen ? "lg:ml-64" : "ml-0"     }`}>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
