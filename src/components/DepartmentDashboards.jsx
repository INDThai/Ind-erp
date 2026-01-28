import React, { useState } from 'react'
import {
  Users, DollarSign, ShoppingCart, Package, Factory, Receipt,
  Truck, Wrench, Calendar, Clock, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, FileText, Bell, ChevronRight, ChevronLeft,
  Home, Settings, Search, Filter, Plus, Eye, Edit3, Printer,
  Download, Upload, BarChart3, PieChart, Activity, Target,
  UserCheck, UserX, CreditCard, Wallet, Building2, MapPin
} from 'lucide-react'

export default function DepartmentDashboards() {
  const [activeDept, setActiveDept] = useState('overview')

  const departments = [
    { id: 'overview', name: 'Overview', icon: Home, color: 'gray' },
    { id: 'hr', name: 'HR', icon: Users, color: 'purple' },
    { id: 'accounting', name: 'Accounting', icon: DollarSign, color: 'green' },
    { id: 'purchase', name: 'Purchase', icon: ShoppingCart, color: 'blue' },
    { id: 'production', name: 'Production', icon: Factory, color: 'orange' },
    { id: 'sales', name: 'Sales', icon: Receipt, color: 'cyan' },
    { id: 'transport', name: 'Transport', icon: Truck, color: 'indigo' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'red' },
  ]

  const stats = {
    hr: [
      { label: 'Total Employees', value: '67', color: 'purple' },
      { label: 'Active Today', value: '58', color: 'green' },
      { label: 'On Leave', value: '6', color: 'amber' },
      { label: 'Pending Actions', value: '5', color: 'red' },
    ],
    accounting: [
      { label: 'Cash Balance', value: '฿2.45M', color: 'green' },
      { label: 'Receivables', value: '฿1.87M', color: 'blue' },
      { label: 'Payables', value: '฿890K', color: 'red' },
      { label: 'Overdue', value: '฿245K', color: 'amber' },
    ],
    purchase: [
      { label: 'Active POs', value: '8', color: 'blue' },
      { label: 'Pending PRs', value: '5', color: 'amber' },
      { label: 'This Month', value: '฿1.2M', color: 'green' },
      { label: 'Vendors', value: '47', color: 'purple' },
    ],
    production: [
      { label: 'Active WOs', value: '15', color: 'orange' },
      { label: 'Due This Week', value: '6', color: 'amber' },
      { label: 'On-Time Rate', value: '92%', color: 'green' },
      { label: 'Efficiency', value: '87%', color: 'blue' },
    ],
    sales: [
      { label: 'This Month', value: '฿8.2M', color: 'cyan' },
      { label: 'Open Orders', value: '23', color: 'blue' },
      { label: 'Invoiced', value: '฿5.8M', color: 'green' },
      { label: 'Overdue', value: '฿245K', color: 'red' },
    ],
    transport: [
      { label: 'Trips Today', value: '6', color: 'indigo' },
      { label: 'Active Drivers', value: '4', color: 'green' },
      { label: 'Total KM', value: '485', color: 'blue' },
      { label: 'Incentives MTD', value: '฿45K', color: 'amber' },
    ],
    maintenance: [
      { label: 'Pending Jobs', value: '4', color: 'red' },
      { label: 'PM Due', value: '3', color: 'amber' },
      { label: 'Completed MTD', value: '12', color: 'green' },
      { label: 'Total Assets', value: '45', color: 'blue' },
    ],
  }

  const schedule = [
    { time: '08:00', event: 'WO-2601-024 Start', dept: 'Production' },
    { time: '09:30', event: 'Delivery to Polyplex', dept: 'Transport' },
    { time: '10:00', event: 'Visa renewal - Mr. Nguyen', dept: 'HR' },
    { time: '14:00', event: 'Customer visit - Alliance', dept: 'Sales' },
  ]

  const alerts = [
    { text: 'Visa expiring in 7 days - Mr. Nguyen', color: 'red' },
    { text: '3 invoices overdue - ฿245,000', color: 'amber' },
    { text: '5 items below reorder level', color: 'orange' },
    { text: 'WO-2601-019 delayed 2 days', color: 'red' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 ml-12">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Department Dashboards</h1>
            <p className="text-slate-400 text-sm">8 Departments with Calendars</p>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {departments.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-all ${
                activeDept === d.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <d.icon className="w-4 h-4" />
              <span>{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeDept === 'overview' ? (
          <>
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Good Morning, Vinit! 👋</h2>
              <p className="text-slate-300">Here's your company overview for today.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {departments.filter(d => d.id !== 'overview').map(d => (
                <button key={d.id} onClick={() => setActiveDept(d.id)} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-lg transition-all text-left">
                  <d.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-800">{d.name}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-blue-50 font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />Today's Schedule
                </div>
                <div className="divide-y">
                  {schedule.map((s, i) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <span className="text-sm font-mono text-gray-500 w-12">{s.time}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.event}</div>
                        <div className="text-xs text-gray-500">{s.dept}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-amber-50 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />Alerts
                </div>
                <div className="divide-y">
                  {alerts.map((a, i) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">{a.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {(stats[activeDept] || []).map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="text-2xl font-bold text-blue-600">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50 font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {departments.find(d => d.id === activeDept)?.name} Calendar - January 2026
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="font-semibold text-gray-500 py-2">{d}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={`py-2 rounded-lg ${day === 28 ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
