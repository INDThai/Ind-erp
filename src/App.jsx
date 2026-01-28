import React, { useState } from 'react'
import { 
  Home, Package, Factory, Receipt, Truck, Users, 
  Sparkles, MessageCircle, BarChart3, Settings,
  ChevronRight, Building2, FileText, Shield, Calendar
} from 'lucide-react'

import INDERPSystem from './components/ERPSystem'
import INDAIAgentsHub from './components/AIHub'
import DepartmentDashboards from './components/DepartmentDashboards'
import INDLineAndAccessSystem from './components/LINEIntegration'
import INDInventoryComplete from './components/InventoryModule'

export default function App() {
  const [currentModule, setCurrentModule] = useState('launcher')

  if (currentModule !== 'launcher') {
    return (
      <div className="min-h-screen">
        <button
          onClick={() => setCurrentModule('launcher')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow-lg rounded-lg border flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="font-medium">Back to Launcher</span>
        </button>
        
        {currentModule === 'erp' && <INDERPSystem />}
        {currentModule === 'ai' && <INDAIAgentsHub />}
        {currentModule === 'departments' && <DepartmentDashboards />}
        {currentModule === 'line' && <INDLineAndAccessSystem />}
        {currentModule === 'inventory' && <INDInventoryComplete />}
      </div>
    )
  }

  const modules = [
    { id: 'erp', name: 'ERP System', desc: '9 Modules: Dashboard, Inventory, Purchase, Production, Sales', icon: Building2, color: 'from-blue-500 to-indigo-600' },
    { id: 'departments', name: 'Department Dashboards', desc: 'HR, Accounting, Purchase, Production, Sales, Transport', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
    { id: 'ai', name: 'AI Hub', desc: 'Cutting Optimizer & Document OCR', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { id: 'line', name: 'LINE Integration', desc: 'Chat Agent & Access Control', icon: MessageCircle, color: 'from-green-500 to-emerald-600' },
    { id: 'inventory', name: 'Inventory Manager', desc: '5 Stores with Lot Tracking', icon: Package, color: 'from-amber-500 to-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">IND</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">IND THAI PACKWELL</h1>
              <p className="text-slate-400">Enterprise Resource Planning System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-white">
              <div className="text-sm text-slate-400">Welcome back</div>
              <div className="font-semibold">Vinit Dhariwal</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">VD</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Good Morning! 👋</h2>
          <p className="text-slate-400 text-lg">Select a module to get started</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">15</div>
            <div className="text-sm text-slate-400">Active WOs</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">฿4.87M</div>
            <div className="text-sm text-slate-400">Stock Value</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">฿8.2M</div>
            <div className="text-sm text-slate-400">Sales MTD</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">67</div>
            <div className="text-sm text-slate-400">Employees</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => setCurrentModule(m.id)}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <m.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {m.name}
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-slate-400 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 text-sm">System Online</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-sm">Version 1.0.0</span>
          </div>
        </div>
      </main>
    </div>
  )
}
