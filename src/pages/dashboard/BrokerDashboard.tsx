import React, { useState, useMemo } from "react"
import { OrderStatus } from "../../types/vehicleRequest"
import { Calendar, MapPin, Phone, Mail, Building, BarChart2, Users, EuroIcon, ChevronDown } from "lucide-react"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useBrokerStats } from "../../hooks/useBrokerStats"
import { useBrokerOrders } from "../../hooks/useBrokerOrders"
import { useBrokerData } from "../../hooks/useBrokerData"
import { useTopBrokers } from "../../hooks/useTopBrokers"
import { useNews } from "../../hooks/useNews"
import { format } from "date-fns"
import { de } from "date-fns/locale"

const BrokerDashboard = () => {
  const { stats, loading } = useBrokerStats()
  const { orders } = useBrokerOrders()
  const { user } = useAuthStore()
  const { brokerData } = useBrokerData()
  const { topBrokers, loading: loadingTopBrokers } = useTopBrokers()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { news, isLoading: loadingNews } = useNews()

  // Erlaubte Status für die Anzeige
  const allowedStatuses: OrderStatus[] = [
    'lease_contract_sent',
    'lease_contract_signed',
    'in_delivery',
    'delivered'
  ]

  // Status-Mapping für die Anzeige
  const statusMapping: Partial<Record<OrderStatus, string>> = {
    'lease_contract_sent': 'Vertrag versandt',
    'lease_contract_signed': 'Vertrag unterschrieben',
    'in_delivery': 'In Auslieferung',
    'delivered': 'Ausgeliefert'
  }

  // Filter orders by status and current month
  const filteredOrders = useMemo(() => orders.filter(order => {
    if (!order.createdAt) return false
    const orderDate = order.createdAt instanceof Date ? order.createdAt : order.createdAt.toDate()
    const now = new Date()
    const isCurrentMonth = orderDate.getMonth() === now.getMonth() && 
                          orderDate.getFullYear() === now.getFullYear()
    
    // Unterbroker-Bestellungen immer anzeigen
    if (order.brokerId === user?.id) return true

    // Für andere Bestellungen nur erlaubte Status anzeigen
    return isCurrentMonth && allowedStatuses.includes(order.status as OrderStatus)
  }), [orders, user?.id])

  const statsData = [
    {
      title: "Aktive Unternehmen",
      value: stats.activeCompanies.toString(),
      icon: Building,
      change: "0"
    },
    {
      title: "Aktive Kunden",
      value: stats.activeMembers.toString(),
      icon: Users,
      change: "0"
    },
    {
      title: "Verkaufte Fahrzeuge",
      value: stats.totalVehicles.toString(),
      icon: BarChart2,
      change: "0"
    },
  ]

  // Schließe das Dropdown wenn außerhalb geklickt wird
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown')
      const dropdownButton = document.getElementById('user-dropdown-button')
      if (dropdown && !dropdown.contains(event.target as Node) && 
          dropdownButton && !dropdownButton.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [])

  return (
    <div className="flex">
          {/* Left Sidebar */}
          <div className="w-64 p-6">
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Top Broker</h2>
              {loadingTopBrokers ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm text-gray-500">Lade Top Broker...</p>
                </div>
              ) : topBrokers.length > 0 ? (
                topBrokers.map((broker) => (
                  <div key={broker.id} className="flex items-center mb-4">
                    <img
                      src={broker.photoURL || `https://ui-avatars.com/api/?name=${broker.firstName}+${broker.lastName}&background=random`}
                      alt={broker.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{broker.name}</p>
                        <span className="text-xs text-gray-500">{broker.soldVehicles} Fahrzeuge</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-2 bg-yellow-400 rounded-full"
                          style={{ width: `${broker.percentageOfTop}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm text-gray-500">Keine Top Broker gefunden</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leistungsübersicht</h3>
                <div className="grid grid-cols-3 gap-4">
                  {statsData.map((stat) => (
                    <div key={stat.title} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <h4 className="text-sm font-medium text-gray-500">{stat.title}</h4>
                      <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {loading ? "..." : stat.value}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <span>{stat.change} vs. letzten Monat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">News</h3>
<div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
    {loadingNews ? (
        <p className="text-gray-500">Lade News...</p>
    ) : news.length === 0 ? (
        <p className="text-gray-500">Keine News vorhanden</p>
    ) : (
        news.map(item => (
            <div key={item.id} className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="text-gray-600">{item.content}</p>
                <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString("de-DE")}</p>
            </div>
        ))
    )}
</div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktuelle Aufträge</h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kunde
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fahrzeug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provision
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-blue-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                            Keine aktuellen Aufträge vorhanden
                          </td>
                        </tr>
                      ) : filteredOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className={order.status === 'delivered' ? "bg-green-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.brokerId === user?.id ? (
                              <span className="flex items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                                  Unterbroker
                                </span>
                                {order.company.contactPerson}
                              </span>
                            ) : (
                              order.employee ? 
                                `${order.employee.firstName} ${order.employee.lastName}` : 
                                order.company.contactPerson
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.brand} {order.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.brokerId === user?.id ? (
                              order.status === 'lease_contract_signed' || 
                              order.status === 'in_delivery' || 
                              order.status === 'delivered' ? 
                                statusMapping[order.status as OrderStatus] : 
                                'In Bearbeitung'
                            ) : (
                              allowedStatuses.includes(order.status as OrderStatus) ? 
                                statusMapping[order.status as OrderStatus] : 
                                order.status
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.status === 'delivered' ? '€250' : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6">
            

            <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Grundinformationen</h3>
              <div className="space-y-3">
                {[
                  { icon: Building, label: "Firmenname", value: brokerData?.companyName || "Nicht angegeben" },
                  { icon: Calendar, label: "Beitrittsdatum", value: brokerData?.createdAt ? format(new Date(brokerData.createdAt), "dd. MMMM yyyy", { locale: de }) : format(new Date(), "dd. MMMM yyyy", { locale: de }) },
                  { icon: MapPin, label: "Standort", value: brokerData?.address ? `${brokerData.address.city}, Deutschland` : "Nicht angegeben" },
                  { icon: Phone, label: "Telefon", value: brokerData?.phone || "Nicht angegeben" },
                  { icon: Mail, label: "E-Mail", value: brokerData?.email || "Nicht angegeben" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center text-sm">
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{label}:</span>
                    <span className="ml-2 text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Statistiken</h3>
              <div className="space-y-4">
                {[
                  { label: "Aktive Unternehmen", value: stats.activeCompanies || 0, icon: Building },
                  { label: "Aktive Kunden", value: stats.activeMembers, icon: Users },
                  { label: "Aktive Unterbroker", value: stats.activeSubBrokers, icon: Users },
                  { label: "Verkaufte Fahrzeuge", value: stats.totalVehicles, icon: BarChart2 },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  )
}

export default BrokerDashboard
