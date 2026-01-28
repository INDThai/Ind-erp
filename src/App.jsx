import React, { useState } from 'react'
import { 
  Home, Package, Factory, Receipt, Truck, Users, 
  Sparkles, MessageCircle, BarChart3, Settings,
  ChevronRight, Building2
} from 'lucide-react'

import INDERPSystem from './components/ERPSystem.jsx'
import INDAIAgentsHub from './components/AIHub.jsx'
import DepartmentDashboards from './components/DepartmentDashboards.jsx'
import INDLineAndAccessSystem from './components/LINEIntegration.jsx'
import INDInventoryComplete from './components/InventoryModule.jsx'

export default function App() {
  const [currentModule, setCurrentModule] = useState('launcher')

  const modules = [
    { id: 'erp', name: 'ERP System', desc: '9 Modules', icon: Building2, color: 'from-blue-500 to-indigo-600' },
    { id: 'departments', name: 'Departments', desc: 'HR, Sales, Production', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
    { id: 'ai', name: 'AI Hub', desc: 'Cutting & OCR', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { id: 'line', name: 'LINE Integration', desc: 'Chat & Access', icon: MessageCircle, color: 'from-green-500 to-emerald-600' },
    { id: 'inventory', name: 'Inventory', desc: '5 Stores', icon: Package, color: 'from-amber-500 to-orange-600' },
  ]

  if (currentModule !== 'launcher') {
    return (
      <div className="min-h-screen">
        <button onClick={() => setCurrentModule('launcher')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow-lg rounded-lg border flex items-center gap-2 hover:bg-gray-50">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-black/20 border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">IND</div>
            <div>
              <h1 className="text-white font-bold text-2xl">IND THAI PACKWELL</h1>
              <p className="text-slate-400">Enterprise Resource Planning</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-white">
              <div className="text-sm text-slate-400">Welcome back</div>
              <div className="font-semibold">Vinit Dhariwal</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">VD</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">Good Morning! 👋</h2>
          <p className="text-slate-400 text-lg">Select a module to get started</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">15</div>
            <div className="text-sm text-slate-400">Active WOs</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-amber-400">฿4.87M</div>
            <div className="text-sm text-slate-400">Stock Value</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">฿8.2M</div>
            <div className="text-sm text-slate-400">Sales MTD</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">67</div>
            <div className="text-sm text-slate-400">Employees</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => setCurrentModule(m.id)}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all text-left group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4`}>
                <m.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {m.name}
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-all" />
              </h3>
              <p className="text-slate-400 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 text-sm">System Online • v1.0.0</span>
          </div>
        </div>
      </main>
    </div>
  )
}
