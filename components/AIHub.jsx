import React, { useState } from 'react'
import { 
  Scissors, Package, AlertTriangle, CheckCircle, TrendingDown,
  Plus, Trash2, Calculator, Zap, BarChart3, ArrowRight,
  Lightbulb, RefreshCw, Save, FileText, ChevronDown, ChevronUp,
  Target, Sparkles, Leaf, DollarSign, Upload, Camera, Scan,
  Edit3, X, Eye, Loader2, FileImage, Building2, Calendar, 
  Hash, ClipboardList, Check, AlertCircle, Image,
  Home, Bot, Settings, HelpCircle, Menu, Bell, User
} from 'lucide-react'

export default function INDAIAgentsHub() {
  const [activeTab, setActiveTab] = useState('cutting')
  const [bomItems, setBomItems] = useState([
    { id: 1, height: 20, width: 100, length: 1200, qty: 50 },
    { id: 2, height: 20, width: 100, length: 800, qty: 100 },
  ])
  const [optimizationResult, setOptimizationResult] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const stockItems = [
    { size: '20 × 100 × 2400', pcs: 500, cbm: 2.4 },
    { size: '20 × 100 × 3600', pcs: 300, cbm: 2.16 },
    { size: '20 × 100 × 3960', pcs: 200, cbm: 1.58 },
  ]

  const runOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setOptimizationResult({
        totalPieces: 150,
        stockUsed: 45,
        wastePercent: 8.5,
        savedPercent: 23,
        savedValue: 12500,
        cuttingPlan: [
          { stock: '20×100×2400', cuts: '2×1200mm', pieces: 25, waste: '0mm' },
          { stock: '20×100×2400', cuts: '3×800mm', pieces: 20, waste: '0mm' },
        ]
      })
      setIsOptimizing(false)
    }, 1500)
  }

  const addBomItem = () => {
    setBomItems([...bomItems, { id: Date.now(), height: 20, width: 100, length: 1000, qty: 10 }])
  }

  const removeBomItem = (id) => {
    setBomItems(bomItems.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 ml-12">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">AI Hub</h1>
              <p className="text-purple-300 text-sm">Cutting Optimizer & Document OCR</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('cutting')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'cutting' 
                  ? 'bg-white text-purple-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Scissors className="w-4 h-4 inline mr-2" />
              Cutting Optimizer
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'ocr' 
                  ? 'bg-white text-purple-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Scan className="w-4 h-4 inline mr-2" />
              Document OCR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'cutting' ? (
          <div className="grid grid-cols-2 gap-6">
            {/* BOM Input */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  BOM Requirements
                </h2>
                <p className="text-blue-100 text-sm">Enter pieces needed for your work order</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {bomItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}.</span>
                      <input
                        type="number"
                        value={item.height}
                        onChange={(e) => {
                          const updated = [...bomItems]
                          updated[idx].height = parseInt(e.target.value) || 0
                          setBomItems(updated)
                        }}
                        className="w-16 px-2 py-1 border rounded text-center"
                        placeholder="H"
                      />
                      <span className="text-gray-400">×</span>
                      <input
                        type="number"
                        value={item.width}
                        onChange={(e) => {
                          const updated = [...bomItems]
                          updated[idx].width = parseInt(e.target.value) || 0
                          setBomItems(updated)
                        }}
                        className="w-16 px-2 py-1 border rounded text-center"
                        placeholder="W"
                      />
                      <span className="text-gray-400">×</span>
                      <input
                        type="number"
                        value={item.length}
                        onChange={(e) => {
                          const updated = [...bomItems]
                          updated[idx].length = parseInt(e.target.value) || 0
                          setBomItems(updated)
                        }}
                        className="w-20 px-2 py-1 border rounded text-center"
                        placeholder="L"
                      />
                      <span className="text-gray-400 mx-2">Qty:</span>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const updated = [...bomItems]
                          updated[idx].qty = parseInt(e.target.value) || 0
                          setBomItems(updated)
                        }}
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                      <button
                        onClick={() => removeBomItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addBomItem}
                  className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
                <button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Run AI Optimization
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Optimization Results
                </h2>
                <p className="text-green-100 text-sm">AI-generated cutting plan</p>
              </div>
              <div className="p-4">
                {optimizationResult ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{optimizationResult.totalPieces}</div>
                        <div className="text-xs text-gray-500">Total Pieces</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{optimizationResult.savedPercent}%</div>
                        <div className="text-xs text-gray-500">Waste Saved</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600">{optimizationResult.stockUsed}</div>
                        <div className="text-xs text-gray-500">Stock Used</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">฿{optimizationResult.savedValue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Cost Saved</div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Cutting Plan:</h3>
                      <div className="space-y-2">
                        {optimizationResult.cuttingPlan.map((plan, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-mono">{plan.stock}</span>
                            <span className="text-sm">{plan.cuts}</span>
                            <span className="text-sm text-green-600">Waste: {plan.waste}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Scissors className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Enter BOM items and run optimization</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* OCR Tab */
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Document
                </h2>
                <p className="text-emerald-100 text-sm">Scan invoices, POs, delivery orders</p>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">Drag & drop or click to upload</p>
                  <p className="text-sm text-gray-400">Supports: PDF, JPG, PNG</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-sm">📄 Purchase Orders</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-sm">🧾 Invoices</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-sm">🚚 Delivery Orders</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-sm">💰 Quotations</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  OCR Statistics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600">98%</div>
                    <div className="text-sm text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">2.3s</div>
                    <div className="text-sm text-gray-500">Avg Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">1,240</div>
                    <div className="text-sm text-gray-500">Scanned</div>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-400">
                  <Scan className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Upload a document to start scanning</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
