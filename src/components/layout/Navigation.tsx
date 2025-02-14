import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Bell, Settings, ChevronDown, Building } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useAdminLogo } from "../../hooks/useAdminLogo"
import { signOut } from "../../lib/auth"
import DataCompletionModal from "../DataCompletionModal"

const Navigation = () => {
  const [activeItem, setActiveItem] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [isVehicleMenuOpen, setIsVehicleMenuOpen] = useState(false)
  const { user } = useAuthStore()
  const logoUrl = useAdminLogo()
  const location = useLocation()
  const navigate = useNavigate()
  const vehicleMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vehicleMenuRef.current && !vehicleMenuRef.current.contains(event.target as Node)) {
        setIsVehicleMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setIsVehicleMenuOpen(false)
    setActiveItem(location.pathname)
  }, [location])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getVehicleMenuItems = () => {
    const items = [
      {
        label: "Privatwagen",
        path: "/vehicles/private",
        roles: ["admin", "employee_normal", "employee_salary", "customer"],
      },
      {
        label: "Firmenwagen",
        path: "/vehicles/company",
        roles: ["admin", "employer", "broker"],
      },
      {
        label: "Gehaltsumwandlung",
        path: "/vehicles/salary",
        roles: ["admin", "employer", "employee_salary"],
      },
    ]

    return items.filter((item) => item.roles.includes(user?.role || ""))
  }

  const getMenuItems = () => {
    const items = [
      { name: "Dashboard", href: "/" },
      {
        name: "Fahrzeuge",
        href: "#",
        isDropdown: true,
        items: getVehicleMenuItems(),
      },
      { name: "Support", href: "/support" },
      { name: "News", href: "/news" },
      { name: "FAQ", href: "/faqs" },
    ]

    if (user?.role === "employer") {
      items.splice(2, 0,
        { name: "Mitarbeiter", href: "/employees" },
        { name: "Ihre Bestellungen", href: "/orders" },
        { name: "Anfragen", href: "/requests" },
        { name: "Vorteilsrechner", href: "/benefits" }
      )
    } else if (user?.role === "admin") {
      items.splice(2, 0,
        { name: "Mitarbeiter", href: "/employees" },
        { name: "Anfragen", href: "/requests" },
        { name: "Vorteilsrechner", href: "/benefits" }
      )
    } else if (user?.role === "employee_normal" || user?.role === "employee_salary" || user?.role === "customer") {
      if (user?.role === "employee_salary") {
        items.splice(2, 0,
          { name: "Ihre Bestellungen", href: "/orders" },
          { name: "Anfragen", href: "/requests" }
        )
      } else {
        items.splice(2, 0,
          { name: "Ihre Bestellungen", href: "/orders" }
        )
      }
    }

    if (user?.role === "broker") {
      items.splice(2, 0,
        { name: "Unternehmen", href: "/broker-companies" },
        { name: "Broker", href: "/brokers" },
        { name: "Kunden", href: "/broker-customers" },
        { name: "Ihre Bestellungen", href: "/orders" },
        { name: "Bestellungen", href: "/broker-orders" }
      )
    }

    return items
  }

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          {logoUrl ? (
            <img className="h-8 w-auto" src={logoUrl} alt="Company Logo" />
          ) : (
            <div className="flex items-center">
              <Building className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-lg">FahrzeugManager Pro</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {getMenuItems().map((item) =>
            item.isDropdown ? (
              <div key={item.name} className="relative" ref={vehicleMenuRef}>
                <button
                  onClick={() => setIsVehicleMenuOpen(!isVehicleMenuOpen)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                    ${
                      location.pathname.startsWith("/vehicles")
                        ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 shadow-lg backdrop-blur-sm"
                        : "text-white hover:bg-white/10"
                    }`}
                >
                  {item.name}
                  <ChevronDown className={`inline-block w-4 h-4 ml-1 transition-transform ${isVehicleMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isVehicleMenuOpen && item.items && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg py-1 border border-white/20 backdrop-blur-sm">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white"
                        onClick={() => setIsVehicleMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                  ${
                    activeItem === item.href
                      ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 shadow-lg backdrop-blur-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                onClick={() => setActiveItem(item.href)}
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-300 ease-in-out">
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/settings" className="p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-300 ease-in-out">
            <Settings className="h-5 w-5" />
          </Link>
          <div className="relative group" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 bg-white/10 rounded-full pl-2 pr-4 py-2 text-white hover:bg-white/20 transition-colors duration-300 ease-in-out"
            >
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src={user?.logoUrl || "https://i.pravatar.cc/32"}
                alt="User avatar"
              />
              <span className="text-sm font-medium">{user?.firstName || "Benutzer"}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-md shadow-lg py-1 hidden group-hover:block transition-all duration-300 ease-in-out border border-white/20 backdrop-blur-sm">
              <Link to="/profile" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white">
                Profil
              </Link>
              {user?.role === "employer" && (
                <Link to="/profile/company" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white">
                  Unternehmensdaten
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Completion Modal */}
      <DataCompletionModal isOpen={isDataModalOpen} onClose={() => setIsDataModalOpen(false)} />
    </nav>
  )
}

export default Navigation
