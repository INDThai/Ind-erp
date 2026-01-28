import React, { useState } from 'react'
import { Home, Package, Sparkles, MessageCircle, BarChart3, Building2, ChevronRight } from 'lucide-react'

function ERPModule() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">ERP System</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow"><div className="text-2xl font-bold text-blue-600">฿12.5M</div><div className="text-gray-500 text-sm">Revenue</div></div>
        <div className="bg-white p-4 rounded-xl shadow"><div className="text-2xl font-bold text-orange-600">15</div><div className="text-gray-500 text-sm">Active WOs</div></div>
        <div className="bg-white p-4 rounded-xl shadow"><div className="text-2xl font-bold text-amber-600">฿4.87M</div><div className="text-gray-500 text-sm">Inventory</div></div>
        <div className="bg-white p-4 rounded-xl shadow"><div className="text-2xl font-bold text-green-600">92%</div><div className="text-gray-500 text-sm">On-Time</div></div>
      </div>
    </div>
  )
}

function AIModule() {
  return (
    <div className="min-h-screen bg-purple-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-4">AI Hub</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-bold mb-2">✂️ Cutting Optimizer</h2>
          <p className="text-gray-600">23% waste reduction • ฿1.2M saved</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-bold mb-2">📷 Document OCR</h2>
          <p className="text-gray-600">98% accuracy • 1,240 scanned</p>
        </div>
      </div>
    </div>
  )
}

function DeptModule() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Department Dashboards</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="text-2xl">👥</div><div className="font-bold">HR</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="text-2xl">💰</div><div className="font-bold">Accounting</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="text-2xl">🏭</div><div className="font-bold">Production</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="text-2xl">🚚</div><div className="font-bold">Transport</div></div>
      </div>
    </div>
  )
}

function LineModule() {
  return (
    <div className="min-h-screen bg-green-600 p-6">
      <h1 className="text-2xl font-bold text-white mb-4">LINE Integration</h1>
      <div className="bg-white rounded-xl p-6 max-w-md">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm mb-2">สวัสดีครับ! 🙏 ยินดีต้อนรับ</div>
          <div className="bg-green-500 text-white p-3 rounded-lg ml-auto max-w-fit">สถานะ WO-2601-024</div>
        </div>
      </div>
    </div>
  )
}

function InvModule() {
  return (
    <div className="min-h-screen bg-amber-600 p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Inventory Manager</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="font-bold">MLH</div><div className="text-amber-600">฿2.45M</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="font-bold">PW</div><div className="text-amber-600">฿680K</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="font-bold">PLY</div><div className="text-amber-600">฿520K</div></div>
        <div className="bg-white p-4 rounded-xl shadow text-center"><div className="font-bold">PRTB</div><div className="text-amber-600">฿320K</div></div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')

  if (page === 'erp') return <><button onClick={() => setPage('home')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow rounded-lg">← Back</button><ERPModule /></>
  if (page === 'ai') return <><button onClick={() => setPage('home')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow rounded-lg">← Back</button><AIModule /></>
  if (page === 'dept') return <><button onClick={() => setPage('home')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow rounded-lg">← Back</button><DeptModule /></>
  if (page === 'line') return <><button onClick={() => setPage('home')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow rounded-lg">← Back</button><LineModule /></>
  if (page === 'inv') return <><button onClick={() => setPage('home')} className="fixed top-4 left-4 z-50 px-4 py-2 bg-white shadow rounded-lg">← Back</button><InvModule /></>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="p-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">IND</div>
          <div>
            <h1 className="text-white font-bold text-xl">IND THAI PACKWELL</h1>
            <p className="text-slate-400 text-sm">ERP System</p>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Select Module</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button onClick={() => setPage('erp')} className="bg-white/10 p-6 rounded-xl text-left hover:bg-white/20">
            <div className="text-2xl mb-2">🏢</div>
            <div className="text-white font-bold">ERP System</div>
          </button>
          <button onClick={() => setPage('dept')} className="bg-white/10 p-6 rounded-xl text-left hover:bg-white/20">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-white font-bold">Departments</div>
          </button>
          <button onClick={() => setPage('ai')} className="bg-white/10 p-6 rounded-xl text-left hover:bg-white/20">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-white font-bold">AI Hub</div>
          </button>
          <button onClick={() => setPage('line')} className="bg-white/10 p-6 rounded-xl text-left hover:bg-white/20">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-white font-bold">LINE</div>
          </button>
          <button onClick={() => setPage('inv')} className="bg-white/10 p-6 rounded-xl text-left hover:bg-white/20">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-white font-bold">Inventory</div>
          </button>
        </div>
      </main>
    </div>
  )
}
