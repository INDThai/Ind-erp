import React, { useState } from 'react'
import { 
  Package, ChevronRight, ChevronDown, Calendar, DollarSign, 
  Layers, Search, Filter, X, Box, TreePine,
  Eye, Printer, Download, RefreshCw, Plus,
  RotateCcw, Send, CheckCircle, AlertTriangle, Clock
} from 'lucide-react'

export default function INDInventoryComplete() {
  const [selectedWood, setSelectedWood] = useState('MLH')
  const [expanded, setExpanded] = useState({})

  const woodTypes = [
    { code: 'MLH', name: 'Mixed Light Hardwood', pcs: 12500, value: 2450000 },
    { code: 'PW', name: 'Pine Wood', pcs: 4200, value: 680000 },
    { code: 'PLY', name: 'Plywood', pcs: 3100, value: 520000 },
    { code: 'PRTB', name: 'Particle Board', pcs: 2800, value: 320000 },
  ]

  const stock = [
    { size: '20 × 100 × 2400', pcs: 2500, cbm: 12.0, value: 180000, status: 'ok', lots: [
      { lot: 'MLH-2401-001', pcs: 1500, date: '2024-01-15' },
      { lot: 'MLH-2401-002', pcs: 1000, date: '2024-01-20' },
    ]},
    { size: '20 × 100 × 3600', pcs: 1800, cbm: 12.96, value: 194400, status: 'ok', lots: [
      { lot: 'MLH-2401-003', pcs: 1800, date: '2024-01-18' },
    ]},
    { size: '20 × 100 × 3960', pcs: 45, cbm: 0.36, value: 5400, status: 'low', lots: [
      { lot: 'MLH-2312-015', pcs: 45, date: '2023-12-28' },
    ]},
    { size: '39 × 145 × 3960', pcs: 1200, cbm: 26.76, value: 401400, status: 'ok', lots: [
      { lot: 'MLH-2401-004', pcs: 800, date: '2024-01-22' },
      { lot: 'MLH-2401-005', pcs: 400, date: '2024-01-25' },
    ]},
    { size: '50 × 100 × 1100', pcs: 3200, cbm: 17.6, value: 264000, status: 'ok', lots: [
      { lot: 'MLH-2401-006', pcs: 3200, date: '2024-01-10' },
    ]},
  ]

  const toggle = (size) => setExpanded(prev => ({ ...prev, [size]: !prev[size] }))

  const wood = woodTypes.find(w => w.code === selectedWood)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between ml-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Inventory Manager</h1>
              <p className="text-amber-200 text-sm">5 Stores • Real-time Tracking</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">฿{((wood?.value || 0) / 1000000).toFixed(2)}M</div>
            <div className="text-amber-200 text-sm">{selectedWood} Value</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {woodTypes.map(w => (
            <button
              key={w.code}
              onClick={() => setSelectedWood(w.code)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all text-left ${
                selectedWood === w.code ? 'border-amber-500 shadow-lg' : 'border-transparent hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">{w.code}</div>
                  <div className="text-xs text-gray-500">{w.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-bold text-amber-600">฿{(w.value / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-gray-500">Value</div>
                </div>
                <div>
                  <div className="font-bold text-gray-800">{(w.pcs / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-gray-500">Pieces</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 flex items-center justify-between">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by size..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
              <Send className="w-4 h-4" />Issue Material
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              <RotateCcw className="w-4 h-4" />Return
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" />Receive Stock
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-amber-50 flex items-center justify-between">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
              <Layers className="w-5 h-5" />{selectedWood} Stock by Size
            </h3>
            <span className="text-sm text-amber-600">Click row to see lots</span>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 w-8"></th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600">Size (H × W × L)</th>
                <th className="p-3 text-right text-xs font-semibold text-gray-600">Pieces</th>
                <th className="p-3 text-right text-xs font-semibold text-gray-600">CBM</th>
                <th className="p-3 text-right text-xs font-semibold text-gray-600">Value</th>
                <th className="p-3 text-center text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stock.map((item, idx) => (
                <React.Fragment key={idx}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${item.status === 'low' ? 'bg-red-50/50' : ''}`}
                    onClick={() => toggle(item.size)}
                  >
                    <td className="p-3 text-center">
                      {expanded[item.size] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </td>
                    <td className="p-3 font-mono text-sm">{item.size}</td>
                    <td className="p-3 text-right font-semibold">{item.pcs.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-600">{item.cbm.toFixed(2)}</td>
                    <td className="p-3 text-right text-amber-600 font-semibold">฿{item.value.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'low' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {item.status === 'low' ? 'LOW' : 'OK'}
                      </span>
                    </td>
                  </tr>
                  
                  {expanded[item.size] && (
                    <tr>
                      <td colSpan="6" className="bg-gray-50 p-0">
                        <div className="p-4 pl-12">
                          <div className="text-xs font-semibold text-gray-500 mb-2">LOT DETAILS</div>
                          <div className="space-y-2">
                            {item.lots.map((lot, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center gap-4">
                                  <span className="font-mono text-sm font-semibold text-blue-600">{lot.lot}</span>
                                  <span className="text-sm text-gray-500">{lot.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold">{lot.pcs.toLocaleString()} pcs</span>
                                  <button className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded">Issue</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-white rounded-xl shadow-sm border p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{wood?.pcs.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Pieces</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">69.68</div>
              <div className="text-sm text-gray-500">Total CBM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">฿{((wood?.value || 0) / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-500">Low Stock Items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
