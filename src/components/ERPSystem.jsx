import React, { useState } from 'react'
import { 
  LayoutDashboard, Package, ShoppingCart, Factory, FileText, Truck,
  Users, Settings, BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Calendar, DollarSign, Plus, Search, Filter,
  ChevronRight, ChevronDown, Eye, Edit3, Printer, Download
} from 'lucide-react'

export default function INDERPSystem() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'purchase', name: 'Purchase', icon: ShoppingCart },
    { id: 'production', name: 'Production', icon: Factory },
    { id: 'sales', name: 'Sales', icon: FileText },
    { id: 'transport', name: 'Transport', icon: Truck },
    { id: 'hr', name: 'HR', icon: Users },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const stats = [
    { label: 'Monthly Revenue', value: '฿12.5M', change: '+18%', up: true, color: 'blue' },
    { label: 'Active Work Orders', value: '15', change: '2 due today', up: null, color: 'orange' },
    { label: 'Inventory Value', value: '฿4.87M', change: '5 low stock', up: false, color: 'amber' },
    { label: 'On-Time Delivery', value: '92%', change: '+3%', up: true, color: 'green' },
  ]

  const workOrders = [
    { id: 'WO-2601-024', customer: 'Furukawa', product: 'Standard Pallet', qty: 100, status: 'In Progress', progress: 75 },
    { id: 'WO-2601-023', customer: 'Polyplex', product: 'Heavy Duty Pallet', qty: 200, status: 'In Progress', progress: 45 },
    { id: 'WO-2601-022', customer: 'Shin Steel', product: 'Export Box', qty: 50, status: 'Completed', progress: 100 },
    { id: 'WO-2601-021', customer: 'Alliance', product: 'Custom Skid', qty: 75, status: 'QC Check', progress: 90 },
  ]

  const alerts = [
    { type: 'danger', icon: Package, text: 'MLH 2400x100x20 - Low Stock', sub: 'Only 45 pcs remaining' },
    { type: 'warning', icon: Clock, text: 'WO-024 due tomorrow', sub: 'Furukawa order' },
    { type: 'info', icon: Truck, text: 'Delivery to Polyplex at 2PM', sub: 'Truck 1 - Somchai' },
    { type: 'success', icon: DollarSign, text: 'Payment received', sub: 'IV2601-042 • ฿256,000' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 ml-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center font-bold">ERP</div>
            <div>
              <h1 className="font-bold text-lg">IND Thai Packwell - ERP</h1>
              <p className="text-slate-400 text-sm">9 Integrated Modules</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-16 hover:w-56 bg-slate-900 min-h-screen transition-all duration-300 group fixed left-0 top-0 pt-20 z-40">
          <nav className="p-2">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
                  activeModule === m.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <m.icon className="w-5 h-5 flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{m.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 ml-16">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="text-3xl font-bold text-blue-600">{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
                <div className={`text-xs mt-1 ${s.up === true ? 'text-green-500' : s.up === false ? 'text-red-500' : 'text-amber-500'}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-blue-50 flex items-center justify-between">
                <h3 className="font-bold text-blue-800 flex items-center gap-2">
                  <Factory className="w-5 h-5" /> Active Work Orders
                </h3>
              </div>
              <div className="divide-y">
                {workOrders.map(wo => (
                  <div key={wo.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">{wo.id}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-600">{wo.customer}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        wo.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        wo.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{wo.status}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{wo.product} • {wo.qty} pcs</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${wo.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${wo.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-amber-50 flex items-center justify-between">
                <h3 className="font-bold text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Alerts & Actions
                </h3>
              </div>
              <div className="divide-y">
                {alerts.map((a, i) => (
                  <div key={i} className={`p-4 flex items-center gap-3 hover:bg-gray-50 ${a.type === 'danger' ? 'bg-red-50/50' : ''}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      a.type === 'danger' ? 'bg-red-100 text-red-600' :
                      a.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      a.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <a.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{a.text}</div>
                      <div className="text-xs text-gray-500">{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
