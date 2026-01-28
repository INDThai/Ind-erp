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
            <button onClick={() => setActiveTab('cutting')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'cutting' ? 'bg-white text-purple-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Scissors className="w-4 h-4 inline mr-2" />Cutting Optimizer
            </button>
            <button onClick={() => setActiveTab('ocr')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'ocr' ? 'bg-white text-purple-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Scan className="w-4 h-4 inline mr-2" />Document OCR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'cutting' ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />B
