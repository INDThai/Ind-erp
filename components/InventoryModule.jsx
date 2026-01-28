import React, { useState } from 'react'
import { 
  Package, ChevronRight, ChevronDown, Calendar, DollarSign, 
  Layers, Search, Filter, X, TreePine, Box,
  ArrowUpDown, Eye, Printer, Download, RefreshCw, Plus,
  ArrowRightLeft, Scissors, RotateCcw, Send, CheckCircle,
  AlertTriangle, Clock, Hash, FileText, User, ArrowRight, Minus, ChevronUp
} from 'lucide-react'

export default function INDInventoryComplete() {
  const [selectedWoodType, setSelectedWoodType] = useState('MLH')
  const [expandedSizes, setExpandedSizes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const woodTypes = [
    { code: 'MLH', name: 'Mixed Light Hardwood', thName: 'ไม้เนื้อแข็งผสม', totalPcs: 12500, totalCbm: 156.8, totalValue: 2450000, color: 'amber' },
    { code: 'PW', name: 'Pine Wood', thName: 'ไม้สน', totalPcs: 4200, totalCbm: 52.5, totalValue: 680000, color: 'yellow' },
    { code: 'PLY', name: 'Plywood', thName: 'ไม้อัด', totalPcs: 3100, totalCbm: 38.75, totalValue: 520000, color: 'orange' },
    { code: 'PRTB', name: 'Particle Board', thName: 'ไม้ปาร์ติเกิล', totalPcs: 2800, totalCbm: 35.0, totalValue: 320000, color: 'brown' },
  ]

  const stockBySize = {
    'MLH': [
      { size: '20 × 100 × 2400', pcs: 2500, cbm: 12.0, value: 180000, status: 'ok', lots: [
        { lotNo: 'MLH-2401-001', pcs: 1500, date: '2024-01-15', supplier: 'Thai Timber' },
        { lotNo: 'MLH-2401-002', pcs: 1000, date: '2024-01-20', supplier: 'Green Wood' },
      ]},
      { size: '20 × 100 × 3600', pcs: 1800, cbm: 12.96, value: 194400, status: 'ok', lots: [
        { lotNo: 'MLH-2401-003', pcs: 1800, date: '2024-01-18', supplier: 'Thai Timber' },
      ]},
      { size: '20 × 100 × 3960', pcs: 45, cbm: 0.36, value: 5400, status: 'low', lots: [
        { lotNo: 'MLH-2312-015', pcs: 45, date: '2023-12-28', supplier: 'Green Wood' },
      ]},
      { size: '39 × 145 × 3960', pcs: 1200, cbm: 26.76, value: 401400, status: 'ok', lots: [
        { lotNo: 'MLH-2401-004', pcs: 800, date: '2024-01-22', supplier: 'Thai Timber' },
        { lotNo: 'MLH-2401-005', pcs: 400, date: '2024-01-25', supplier: 'Premium Wood' },
      ]},
      { size: '50 × 100 × 1100', pcs: 3200, cbm: 17.6, value: 264000, status: 'ok', lots: [
        { lotNo: 'MLH-2401-006', pcs: 3200, date: '2024-01-10', supplier: 'Thai Timber' },
      ]},
    ],
  }

  const toggleSize = (size) => {
    setExpandedSizes(prev => ({
      ...prev,
      [size]: !prev[size]
    }))
  }

  const selectedWood = woodTypes.find(w => w.code === selectedWoodType)
  const sizeData = stockBySize[selectedWoodType] || []

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between ml-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Inventory Manager</h1>
              <p className="text-amber-200 text-sm">5 Stores • Real-time Stock Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="
