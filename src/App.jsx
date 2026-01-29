import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import {
  Home, Package, Factory, Receipt, Truck, Users, Settings, BarChart3,
  Sparkles, MessageCircle, Building2, ChevronRight, ChevronDown, ChevronLeft,
  DollarSign, ShoppingCart, Wrench, Calendar, Clock, AlertTriangle,
  CheckCircle, TrendingUp, TrendingDown, FileText, Bell, Eye, Edit3,
  Search, Filter, Plus, Trash2, Send, RotateCcw, Layers, TreePine,
  Calculator, Zap, Upload, Camera, Scan, Target, ClipboardList,
  Globe, Phone, Shield, Key, Menu, Loader2, X, UserCheck, UserX,
  Wallet, MapPin, Activity, CreditCard, PieChart, Printer, Download,
  Save, RefreshCw, LogOut, User, Lock, Mail, Hash, Tag, Box,
  Warehouse, ArrowRight, ArrowLeft, MoreVertical, Copy, Archive,
  Languages, Check, AlertCircle, Info, HelpCircle, ExternalLink, Play,
  Briefcase, BadgeCheck, FileImage, FilePlus, UserPlus, DollarSign as Dollar,
  CalendarDays, Banknote, CircleDollarSign, Building, FileUp, Image
} from 'lucide-react'

// ============================================
// BRAND COLORS & THEME
// ============================================
const BRAND = {
  green: '#2ECC40',
  teal: '#1A5276',
  sky: '#5DADE2',
  brown: '#8B4513',
  gradientPrimary: 'from-[#1A5276] to-[#2ECC40]',
  gradientSecondary: 'from-[#5DADE2] to-[#2ECC40]',
}

// ============================================
// IND LOGO AS BASE64 (Triangular logo with IND text)
// ============================================
const IND_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <!-- Teal triangle (bottom left) -->
  <polygon points="30,180 100,50 30,50" fill="#1A5276"/>
  <!-- Green triangle (top right) -->
  <polygon points="100,50 170,180 170,50" fill="#2ECC40"/>
  <!-- Sky blue triangle (bottom right) -->
  <polygon points="100,50 170,180 100,180" fill="#5DADE2"/>
  <!-- White inner triangle -->
  <polygon points="70,130 100,80 130,130" fill="white"/>
  <!-- IND Text -->
  <text x="100" y="210" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="36" font-weight="bold" fill="#8B4513">IND</text>
</svg>
`)}`

// ============================================
// AUTHENTICATION CONTEXT
// ============================================
const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

// ============================================
// USER ROLES & PERMISSIONS
// ============================================
const ROLES = {
  admin: {
    name: 'Administrator',
    nameTh: 'ผู้ดูแลระบบ',
    color: 'bg-purple-500',
    permissions: ['all'],
    modules: ['dashboard', 'admin', 'sales', 'production', 'inventory', 'purchasing', 'hr', 'accounting', 'reports', 'settings']
  },
  sales: {
    name: 'Sales Staff',
    nameTh: 'พนักงานขาย',
    color: 'bg-blue-500',
    permissions: ['sales.view', 'sales.create', 'sales.edit', 'document.upload'],
    modules: ['dashboard', 'sales']
  },
  production: {
    name: 'Production Staff',
    nameTh: 'พนักงานผลิต',
    color: 'bg-orange-500',
    permissions: ['production.view', 'production.create', 'production.edit', 'document.upload'],
    modules: ['dashboard', 'production', 'inventory']
  },
  hr: {
    name: 'HR Staff',
    nameTh: 'พนักงาน HR',
    color: 'bg-pink-500',
    permissions: ['hr.view', 'hr.create', 'hr.edit', 'document.upload'],
    modules: ['dashboard', 'hr']
  },
  accounting: {
    name: 'Accounting Staff',
    nameTh: 'พนักงานบัญชี',
    color: 'bg-green-500',
    permissions: ['accounting.view', 'accounting.create', 'accounting.edit', 'document.upload'],
    modules: ['dashboard', 'accounting', 'reports']
  },
  warehouse: {
    name: 'Warehouse Staff',
    nameTh: 'พนักงานคลัง',
    color: 'bg-yellow-600',
    permissions: ['inventory.view', 'inventory.create', 'document.upload'],
    modules: ['dashboard', 'inventory', 'purchasing']
  }
}

// Demo users
const DEMO_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'System Admin', nameTh: 'ผู้ดูแลระบบ', role: 'admin', department: 'Management', entity: 'IND' },
  { id: 2, username: 'sales1', password: 'sales123', name: 'Somchai', nameTh: 'สมชาย', role: 'sales', department: 'Sales', entity: 'IND' },
  { id: 3, username: 'prod1', password: 'prod123', name: 'Wuttipong', nameTh: 'วุฒิพงษ์', role: 'production', department: 'Production', entity: 'IND' },
  { id: 4, username: 'hr1', password: 'hr123', name: 'Nanthana', nameTh: 'นันทนา', role: 'hr', department: 'HR', entity: 'IND' },
  { id: 5, username: 'acc1', password: 'acc123', name: 'Pakamas', nameTh: 'ผกามาศ', role: 'accounting', department: 'Accounting', entity: 'IND2' },
  { id: 6, username: 'wh1', password: 'wh123', name: 'Prasert', nameTh: 'ประเสริฐ', role: 'warehouse', department: 'Warehouse', entity: 'IND' },
]

// ============================================
// LANGUAGE SYSTEM
// ============================================
const LanguageContext = createContext()

const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  th: { name: 'ไทย', flag: '🇹🇭' },
}

const TRANSLATIONS = {
  'app.title': { en: 'IND Thai Packwell', th: 'IND ไทย แพ็คเวลล์' },
  'app.subtitle': { en: 'Enterprise Resource Planning', th: 'ระบบบริหารจัดการองค์กร' },
  'login.title': { en: 'Sign In', th: 'เข้าสู่ระบบ' },
  'login.username': { en: 'Username', th: 'ชื่อผู้ใช้' },
  'login.password': { en: 'Password', th: 'รหัสผ่าน' },
  'login.signin': { en: 'Sign In', th: 'เข้าสู่ระบบ' },
  'login.demo': { en: 'Demo Accounts', th: 'บัญชีทดลอง' },
  'nav.dashboard': { en: 'Dashboard', th: 'แดชบอร์ด' },
  'nav.admin': { en: 'Admin Hub', th: 'ศูนย์จัดการ' },
  'nav.sales': { en: 'Sales', th: 'ขาย' },
  'nav.production': { en: 'Production', th: 'การผลิต' },
  'nav.inventory': { en: 'Inventory', th: 'คลังสินค้า' },
  'nav.purchasing': { en: 'Purchasing', th: 'จัดซื้อ' },
  'nav.hr': { en: 'HR', th: 'ทรัพยากรบุคคล' },
  'nav.accounting': { en: 'Accounting', th: 'บัญชี' },
  'nav.reports': { en: 'Reports', th: 'รายงาน' },
  'nav.settings': { en: 'Settings', th: 'ตั้งค่า' },
  'upload.title': { en: 'Upload Document', th: 'อัพโหลดเอกสาร' },
  'upload.dragdrop': { en: 'Drag & drop files here or click to browse', th: 'ลากไฟล์มาวางหรือคลิกเพื่อเลือก' },
  'upload.processing': { en: 'Processing document...', th: 'กำลังประมวลผลเอกสาร...' },
  'upload.extracted': { en: 'Extracted Data', th: 'ข้อมูลที่ดึงได้' },
  'action.save': { en: 'Save', th: 'บันทึก' },
  'action.cancel': { en: 'Cancel', th: 'ยกเลิก' },
  'action.add': { en: 'Add New', th: 'เพิ่มใหม่' },
  'action.search': { en: 'Search...', th: 'ค้นหา...' },
  'action.logout': { en: 'Logout', th: 'ออกจากระบบ' },
}

const t = (key, lang) => TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['en'] || key

// ============================================
// SAMPLE DATA
// ============================================

// HR Employees (from salary sheet structure)
const INITIAL_EMPLOYEES = [
  { id: 1, empId: 'EMP001', name: 'Wuttipong', nameTh: 'วุฒิพงษ์', department: 'Office', designation: 'MG', empType: 'FT', salary: 20000, positionInc: 0, labourInc: 0, phone: 1100, socialSecurity: 750, bank: 'Transfer', entity: 'IND', status: 'active', startDate: '2020-01-15' },
  { id: 2, empId: 'EMP002', name: 'Somchai', nameTh: 'สมชาย', department: 'Production', designation: 'LEAD', empType: 'FT', salary: 18000, positionInc: 2000, labourInc: 500, phone: 0, socialSecurity: 750, bank: 'Transfer', entity: 'IND', status: 'active', startDate: '2019-06-01' },
  { id: 3, empId: 'EMP003', name: 'Nanthana', nameTh: 'นันทนา', department: 'HR', designation: 'HR', empType: 'FT', salary: 16000, positionInc: 1500, labourInc: 500, phone: 500, socialSecurity: 750, bank: 'Transfer', entity: 'IND', status: 'active', startDate: '2021-03-10' },
  { id: 4, empId: 'EMP004', name: 'Pakamas', nameTh: 'ผกามาศ', department: 'Accounting', designation: 'ACC', empType: 'FT', salary: 15000, positionInc: 0, labourInc: 500, phone: 500, socialSecurity: 750, bank: 'Transfer', entity: 'IND2', status: 'active', startDate: '2022-01-05' },
  { id: 5, empId: 'EMP005', name: 'Prasert', nameTh: 'ประเสริฐ', department: 'Warehouse', designation: 'WH', empType: 'FT', salary: 12000, positionInc: 0, labourInc: 500, phone: 0, socialSecurity: 750, bank: 'Cash', entity: 'IND', status: 'active', startDate: '2023-02-20' },
  { id: 6, empId: 'EMP006', name: 'Somporn', nameTh: 'สมพร', department: 'Production', designation: 'OP', empType: 'PT', salary: 400, positionInc: 0, labourInc: 0, phone: 0, socialSecurity: 0, bank: 'Cash', entity: 'IND', status: 'active', startDate: '2024-01-15' },
  { id: 7, empId: 'EMP007', name: 'Kanya', nameTh: 'กัญญา', department: 'Sales', designation: 'SALES', empType: 'FT', salary: 15000, positionInc: 1000, labourInc: 500, phone: 800, socialSecurity: 750, bank: 'Transfer', entity: 'IND', status: 'active', startDate: '2021-08-01' },
  { id: 8, empId: 'EMP008', name: 'Wichai', nameTh: 'วิชัย', department: 'Production', designation: 'OP', empType: 'FT', salary: 13000, positionInc: 0, labourInc: 500, phone: 0, socialSecurity: 750, bank: 'Transfer', entity: 'IND2', status: 'active', startDate: '2022-05-15' },
]

// Sales Orders
const INITIAL_SALES_ORDERS = [
  { id: 'SO-2501-001', customerId: 'CUST001', customerName: 'Royal Ceramics', orderDate: '2025-01-15', deliveryDate: '2025-01-30', status: 'confirmed', poNumber: 'PO.RPR6802-003', entity: 'IND', items: [
    { product: 'Pallet 1100x950x950', qty: 500, unit: 'Pcs', price: 303, material: 'Wood' }
  ], total: 151500, delivered: 200 },
  { id: 'SO-2501-002', customerId: 'CUST002', customerName: 'Shin Star', orderDate: '2025-01-18', deliveryDate: '2025-02-05', status: 'in_production', poNumber: 'PO20250168', entity: 'IND', items: [
    { product: 'Upper 9x70x2440', qty: 4000, unit: 'Pcs', price: 12, material: 'PRTB' }
  ], total: 48000, delivered: 0 },
  { id: 'SO-2501-003', customerId: 'CUST003', customerName: 'BV Industries', orderDate: '2025-01-20', deliveryDate: '2025-02-10', status: 'pending', poNumber: 'BV-PO-2025-001', entity: 'IND2', items: [
    { product: 'PLY Panel 4x8', qty: 300, unit: 'Sheets', price: 450, material: 'PLY' }
  ], total: 135000, delivered: 0 },
]

// Work Orders / Production
const INITIAL_WORK_ORDERS = [
  { id: 'WO-2501-001', soId: 'SO-2501-001', product: 'Pallet 1100x950x950', qty: 500, material: 'MLH', status: 'in_progress', startDate: '2025-01-20', targetDate: '2025-01-28', completedQty: 300, entity: 'IND' },
  { id: 'WO-2501-002', soId: 'SO-2501-002', product: 'Upper 9x70x2440', qty: 4000, material: 'PRTB', status: 'pending', startDate: '2025-01-25', targetDate: '2025-02-03', completedQty: 0, entity: 'IND' },
  { id: 'WO-2501-003', soId: 'SO-2501-003', product: 'PLY Panel 4x8', qty: 300, material: 'PLY', status: 'not_started', startDate: null, targetDate: '2025-02-08', completedQty: 0, entity: 'IND2' },
]

// Uploaded Documents
const INITIAL_DOCUMENTS = [
  { id: 'DOC001', filename: 'PO_Royal_Jan2025.pdf', type: 'customer_po', department: 'sales', uploadDate: '2025-01-15', uploadedBy: 'Somchai', status: 'processed', linkedTo: 'SO-2501-001' },
  { id: 'DOC002', filename: 'Receipt_Material_001.jpg', type: 'receipt', department: 'accounting', uploadDate: '2025-01-18', uploadedBy: 'Pakamas', status: 'processed', linkedTo: 'JE-001' },
]

// Invoices
const INITIAL_INVOICES = [
  { id: 'INV-2501-001', soId: 'SO-2501-001', customerId: 'CUST001', customerName: 'Royal Ceramics', invoiceDate: '2025-01-25', dueDate: '2025-02-25', status: 'issued', entity: 'IND', items: [
    { product: 'Pallet 1100x950x950', qty: 200, unit: 'Pcs', price: 303 }
  ], subtotal: 60600, vat: 4242, total: 64842, type: 'local' },
]

// ============================================
// LOGIN SCREEN COMPONENT
// ============================================
const LoginScreen = ({ onLogin, lang }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = DEMO_USERS.find(u => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
    } else {
      setError(lang === 'th' ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' : 'Invalid username or password')
    }
  }

  const quickLogin = (user) => {
    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] via-[#2ECC40] to-[#5DADE2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl p-2 shadow-lg">
            <img src={IND_LOGO_SVG} alt="IND Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('app.title', lang)}</h1>
          <p className="text-white/80 text-sm">{t('app.subtitle', lang)}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">{t('login.title', lang)}</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.username', lang)}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent"
                placeholder={lang === 'th' ? 'ใส่ชื่อผู้ใช้' : 'Enter username'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.password', lang)}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent"
                placeholder={lang === 'th' ? 'ใส่รหัสผ่าน' : 'Enter password'}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            {t('login.signin', lang)}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
          >
            {showDemo ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {t('login.demo', lang)}
          </button>
          
          {showDemo && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEMO_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  className={`${ROLES[user.role].color} text-white text-xs py-2 px-3 rounded-lg hover:opacity-90 transition`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="opacity-75">{ROLES[user.role].name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// DOCUMENT UPLOAD MODAL COMPONENT
// ============================================
const DocumentUploadModal = ({ isOpen, onClose, department, onDocumentProcessed, lang }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const fileInputRef = useRef(null)

  const DOCUMENT_TYPES = {
    sales: [
      { value: 'customer_po', label: 'Customer PO', labelTh: 'ใบสั่งซื้อลูกค้า' },
      { value: 'customer_pr', label: 'Customer PR', labelTh: 'ใบขอซื้อลูกค้า' },
      { value: 'delivery_plan', label: 'Delivery Plan', labelTh: 'แผนจัดส่ง' },
    ],
    production: [
      { value: 'work_order', label: 'Work Order', labelTh: 'ใบสั่งผลิต' },
      { value: 'spec_sheet', label: 'Specification Sheet', labelTh: 'ใบข้อมูลจำเพาะ' },
      { value: 'material_request', label: 'Material Request', labelTh: 'ใบเบิกวัสดุ' },
    ],
    hr: [
      { value: 'id_card', label: 'ID Card', labelTh: 'บัตรประชาชน' },
      { value: 'contract', label: 'Employment Contract', labelTh: 'สัญญาจ้าง' },
      { value: 'leave_request', label: 'Leave Request', labelTh: 'ใบลา' },
      { value: 'medical_cert', label: 'Medical Certificate', labelTh: 'ใบรับรองแพทย์' },
    ],
    accounting: [
      { value: 'receipt', label: 'Receipt', labelTh: 'ใบเสร็จ' },
      { value: 'invoice', label: 'Supplier Invoice', labelTh: 'ใบแจ้งหนี้ผู้ขาย' },
      { value: 'bank_statement', label: 'Bank Statement', labelTh: 'ใบแจ้งยอดธนาคาร' },
      { value: 'tax_invoice', label: 'Tax Invoice', labelTh: 'ใบกำกับภาษี' },
    ],
    purchasing: [
      { value: 'quotation', label: 'Quotation', labelTh: 'ใบเสนอราคา' },
      { value: 'grn', label: 'Goods Received Note', labelTh: 'ใบรับของ' },
    ],
    inventory: [
      { value: 'stock_count', label: 'Stock Count Sheet', labelTh: 'ใบนับสต็อก' },
      { value: 'transfer_note', label: 'Transfer Note', labelTh: 'ใบโอนสินค้า' },
    ],
  }

  const [docType, setDocType] = useState('')
  const availableTypes = DOCUMENT_TYPES[department] || DOCUMENT_TYPES.sales

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const processFile = (selectedFile) => {
    setFile(selectedFile)
    setProcessing(true)
    
    // Simulate OCR/document processing
    setTimeout(() => {
      // Generate mock extracted data based on document type
      const mockData = generateMockExtractedData(docType || 'customer_po', selectedFile.name)
      setExtractedData(mockData)
      setProcessing(false)
    }, 2000)
  }

  const generateMockExtractedData = (type, filename) => {
    const baseData = {
      filename,
      uploadDate: new Date().toISOString().split('T')[0],
      confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
    }

    switch (type) {
      case 'customer_po':
        return {
          ...baseData,
          type: 'Customer PO',
          fields: {
            poNumber: 'PO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            customer: 'Auto-detected Customer',
            orderDate: new Date().toISOString().split('T')[0],
            deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [
              { description: 'Pallet 1100x1100', qty: 500, unit: 'Pcs', price: 250 },
              { description: 'Block 90x90x90', qty: 2000, unit: 'Pcs', price: 15 },
            ],
            total: 155000,
          }
        }
      case 'receipt':
        return {
          ...baseData,
          type: 'Receipt',
          fields: {
            receiptNo: 'RCP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            vendor: 'Detected Vendor Name',
            date: new Date().toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 50000) + 5000,
            category: 'Materials',
            vatAmount: Math.floor(Math.random() * 3000) + 350,
          }
        }
      case 'id_card':
        return {
          ...baseData,
          type: 'ID Card',
          fields: {
            idNumber: '1-1234-56789-01-2',
            firstName: 'Detected Name',
            lastName: 'Detected Surname',
            birthDate: '1990-05-15',
            address: 'Detected Address, Province',
          }
        }
      default:
        return {
          ...baseData,
          type: 'General Document',
          fields: {
            documentId: 'DOC-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            detectedText: 'Document content extracted successfully',
          }
        }
    }
  }

  const handleSave = () => {
    if (extractedData) {
      onDocumentProcessed({
        ...extractedData,
        docType,
        department,
      })
      onClose()
      setFile(null)
      setExtractedData(null)
      setDocType('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">{t('upload.title', lang)}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Document Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'th' ? 'ประเภทเอกสาร' : 'Document Type'}
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            >
              <option value="">{lang === 'th' ? 'เลือกประเภท' : 'Select type'}</option>
              {availableTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {lang === 'th' ? type.labelTh : type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Drop Zone */}
          {!file && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                isDragging ? 'border-[#2ECC40] bg-green-50' : 'border-gray-300 hover:border-[#1A5276]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDragging ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isDragging ? (
                    <FileImage className="w-8 h-8 text-[#2ECC40]" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600">{t('upload.dragdrop', lang)}</p>
                <p className="text-sm text-gray-400">PDF, JPG, PNG, Excel</p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {processing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-[#1A5276] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">{t('upload.processing', lang)}</p>
              <p className="text-sm text-gray-400 mt-2">{file?.name}</p>
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData && !processing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{lang === 'th' ? 'ประมวลผลสำเร็จ!' : 'Processing complete!'}</span>
                <span className="text-sm ml-auto">{extractedData.confidence}% {lang === 'th' ? 'ความมั่นใจ' : 'confidence'}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('upload.extracted', lang)}
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(extractedData.fields).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <span className="text-gray-500 text-sm w-32 shrink-0 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-800 text-sm flex-1">
                        {Array.isArray(value) ? (
                          <div className="space-y-1">
                            {value.map((item, i) => (
                              <div key={i} className="bg-white px-2 py-1 rounded text-xs">
                                {typeof item === 'object' ? JSON.stringify(item) : item}
                              </div>
                            ))}
                          </div>
                        ) : typeof value === 'object' ? (
                          JSON.stringify(value)
                        ) : (
                          value
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{lang === 'th' ? 'กรุณาตรวจสอบข้อมูลก่อนบันทึก' : 'Please verify the extracted data before saving'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            {t('action.cancel', lang)}
          </button>
          {extractedData && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {t('action.save', lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
const Dashboard = ({ user, lang }) => {
  const stats = [
    { label: lang === 'th' ? 'ออเดอร์รอดำเนินการ' : 'Pending Orders', value: 12, icon: ShoppingCart, color: 'bg-blue-500', change: '+3' },
    { label: lang === 'th' ? 'งานผลิตวันนี้' : 'Production Today', value: 8, icon: Factory, color: 'bg-orange-500', change: '+2' },
    { label: lang === 'th' ? 'รายได้เดือนนี้' : 'Revenue This Month', value: '฿2.4M', icon: DollarSign, color: 'bg-green-500', change: '+15%' },
    { label: lang === 'th' ? 'พนักงานปฏิบัติงาน' : 'Staff On Duty', value: 45, icon: Users, color: 'bg-purple-500', change: '92%' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          {lang === 'th' ? `สวัสดี, ${user.nameTh || user.name}!` : `Welcome, ${user.name}!`}
        </h1>
        <p className="text-white/80 mt-1">
          {lang === 'th' ? `แผนก: ${user.department} | บทบาท: ${ROLES[user.role].nameTh}` : `Department: ${user.department} | Role: ${ROLES[user.role].name}`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: lang === 'th' ? 'สร้างใบสั่งขาย' : 'New Sales Order', icon: Plus, color: 'bg-blue-500' },
            { label: lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Document', icon: Upload, color: 'bg-green-500' },
            { label: lang === 'th' ? 'ดูรายงาน' : 'View Reports', icon: BarChart3, color: 'bg-purple-500' },
            { label: lang === 'th' ? 'ปฏิทินงาน' : 'Calendar', icon: Calendar, color: 'bg-orange-500' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#1A5276] hover:bg-gray-50 transition">
              <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-700 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {lang === 'th' ? 'กิจกรรมล่าสุด' : 'Recent Activity'}
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Sales Order SO-2501-003 created', time: '10 mins ago', icon: Plus, color: 'text-green-500' },
            { action: 'Document PO_Royal.pdf uploaded', time: '25 mins ago', icon: Upload, color: 'text-blue-500' },
            { action: 'Work Order WO-2501-001 completed', time: '1 hour ago', icon: CheckCircle, color: 'text-purple-500' },
            { action: 'Invoice INV-2501-001 generated', time: '2 hours ago', icon: FileText, color: 'text-orange-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="flex-1 text-gray-700">{item.action}</span>
              <span className="text-gray-400 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// HR MODULE COMPONENT
// ============================================
const HRModule = ({ lang, onUpload }) => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const [view, setView] = useState('list') // list, attendance, payroll
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const departments = ['all', 'Office', 'Production', 'Sales', 'Warehouse', 'HR', 'Accounting']
  
  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                       emp.nameTh.includes(search) ||
                       emp.empId.toLowerCase().includes(search.toLowerCase())
    const matchDept = selectedDept === 'all' || emp.department === selectedDept
    return matchSearch && matchDept
  })

  const totalSalary = employees.reduce((sum, emp) => sum + (emp.empType === 'FT' ? emp.salary : 0), 0)
  const activeCount = employees.filter(e => e.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {lang === 'th' ? 'ทรัพยากรบุคคล' : 'Human Resources'}
          </h1>
          <p className="text-gray-500">
            {lang === 'th' ? 'จัดการพนักงาน, เงินเดือน และการลา' : 'Manage employees, payroll, and attendance'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Document'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {lang === 'th' ? 'เพิ่มพนักงาน' : 'Add Employee'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{employees.length}</div>
              <div className="text-gray-500 text-sm">{lang === 'th' ? 'พนักงานทั้งหมด' : 'Total Employees'}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
              <div className="text-gray-500 text-sm">{lang === 'th' ? 'พนักงานปฏิบัติงาน' : 'Active'}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">฿{(totalSalary / 1000).toFixed(0)}K</div>
              <div className="text-gray-500 text-sm">{lang === 'th' ? 'เงินเดือนรวม/เดือน' : 'Monthly Payroll'}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{departments.length - 1}</div>
              <div className="text-gray-500 text-sm">{lang === 'th' ? 'แผนก' : 'Departments'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200 px-4">
          <div className="flex gap-4">
            {[
              { id: 'list', label: lang === 'th' ? 'รายชื่อพนักงาน' : 'Employee List', icon: Users },
              { id: 'attendance', label: lang === 'th' ? 'การลงเวลา' : 'Attendance', icon: Clock },
              { id: 'payroll', label: lang === 'th' ? 'เงินเดือน' : 'Payroll', icon: Banknote },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  view === tab.id ? 'border-[#1A5276] text-[#1A5276]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('action.search', lang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? (lang === 'th' ? 'ทุกแผนก' : 'All Departments') : dept}
              </option>
            ))}
          </select>
        </div>

        {/* Employee List View */}
        {view === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'ID'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'แผนก' : 'Dept'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ตำแหน่ง' : 'Position'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'สาขา' : 'Entity'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-[#1A5276]">{emp.empId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1A5276] to-[#5DADE2] flex items-center justify-center text-white text-sm font-medium">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.nameTh}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.designation}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        emp.empType === 'FT' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {emp.empType === 'FT' ? (lang === 'th' ? 'ประจำ' : 'Full-time') : (lang === 'th' ? 'รายวัน' : 'Part-time')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      ฿{emp.salary.toLocaleString()}{emp.empType === 'PT' ? '/d' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        emp.entity === 'IND' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {emp.entity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.status === 'active' ? (lang === 'th' ? 'ทำงาน' : 'Active') : (lang === 'th' ? 'ลาออก' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Attendance View */}
        {view === 'attendance' && (
          <div className="p-6">
            <div className="text-center text-gray-500 py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">{lang === 'th' ? 'ระบบลงเวลา' : 'Attendance System'}</p>
              <p className="text-sm mt-2">{lang === 'th' ? 'เชื่อมต่อกับเครื่องสแกนใบหน้า' : 'Connect to face scanner device'}</p>
            </div>
          </div>
        )}

        {/* Payroll View */}
        {view === 'payroll' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'พนักงาน' : 'Employee'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่าตำแหน่ง' : 'Position'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'เบี้ยขยัน' : 'Incentive'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่าโทรศัพท์' : 'Phone'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'หัก ปกส.' : 'SSO'}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รวมรับ' : 'Net Pay'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.filter(e => e.empType === 'FT').map(emp => {
                    const gross = emp.salary + emp.positionInc + emp.labourInc + emp.phone
                    const net = gross - emp.socialSecurity
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.empId}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">฿{emp.salary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm">฿{emp.positionInc.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm">฿{emp.labourInc.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm">฿{emp.phone.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm text-red-600">-฿{emp.socialSecurity.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">฿{net.toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-800">{lang === 'th' ? 'รวมทั้งหมด' : 'Total'}</td>
                    <td className="px-4 py-3 text-right font-bold">฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + e.salary, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold">฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + e.positionInc, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold">฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + e.labourInc, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold">฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + e.phone, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">-฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + e.socialSecurity, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      ฿{filteredEmployees.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.salary + e.positionInc + e.labourInc + e.phone - e.socialSecurity), 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SALES MODULE COMPONENT
// ============================================
const SalesModule = ({ lang, onUpload }) => {
  const [orders, setOrders] = useState(INITIAL_SALES_ORDERS)
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [view, setView] = useState('orders')
  const [search, setSearch] = useState('')

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.poNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {lang === 'th' ? 'การขาย' : 'Sales'}
          </h1>
          <p className="text-gray-500">
            {lang === 'th' ? 'จัดการใบสั่งขาย และใบแจ้งหนี้' : 'Manage sales orders and invoices'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {lang === 'th' ? 'อัพโหลด PO' : 'Upload PO'}
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white rounded-lg hover:opacity-90 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {lang === 'th' ? 'สร้างใบสั่งขาย' : 'New Order'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'ออเดอร์ทั้งหมด' : 'Total Orders'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-yellow-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'รอดำเนินการ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-green-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'ยอดขายเดือนนี้' : 'This Month'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">฿{(orders.reduce((s, o) => s + o.total, 0) / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-purple-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoices'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{invoices.length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex gap-4">
            {[
              { id: 'orders', label: lang === 'th' ? 'ใบสั่งขาย' : 'Sales Orders', icon: ShoppingCart },
              { id: 'invoices', label: lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoices', icon: Receipt },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  view === tab.id ? 'border-[#1A5276] text-[#1A5276]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('action.search', lang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
        </div>

        {/* Orders Table */}
        {view === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Order #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'PO ลูกค้า' : 'Customer PO'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันสั่ง' : 'Date'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'กำหนดส่ง' : 'Due'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สาขา' : 'Entity'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#1A5276] font-medium">{order.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.poNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.orderDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.deliveryDate}</td>
                    <td className="px-4 py-3 text-right font-medium">฿{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.entity === 'IND' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {order.entity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        order.status === 'in_production' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'confirmed' ? (lang === 'th' ? 'ยืนยันแล้ว' : 'Confirmed') :
                         order.status === 'in_production' ? (lang === 'th' ? 'กำลังผลิต' : 'In Production') :
                         (lang === 'th' ? 'รอดำเนินการ' : 'Pending')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Print Invoice">
                          <Printer className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoices Table */}
        {view === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Invoice #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ครบกำหนด' : 'Due'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สาขา' : 'Entity'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#1A5276] font-medium">{inv.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{inv.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.invoiceDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.dueDate}</td>
                    <td className="px-4 py-3 text-right font-medium">฿{inv.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.entity === 'IND' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {inv.entity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                        {lang === 'th' ? 'ออกแล้ว' : 'Issued'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Print">
                          <Printer className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PRODUCTION MODULE COMPONENT
// ============================================
const ProductionModule = ({ lang, onUpload }) => {
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS)
  const [search, setSearch] = useState('')

  const filteredOrders = workOrders.filter(wo =>
    wo.id.toLowerCase().includes(search.toLowerCase()) ||
    wo.product.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {lang === 'th' ? 'การผลิต' : 'Production'}
          </h1>
          <p className="text-gray-500">
            {lang === 'th' ? 'จัดการใบสั่งผลิตและติดตามงาน' : 'Manage work orders and track progress'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Document'}
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white rounded-lg hover:opacity-90 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {lang === 'th' ? 'สร้างใบสั่งผลิต' : 'New Work Order'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'งานทั้งหมด' : 'Total WO'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{workOrders.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-orange-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'กำลังผลิต' : 'In Progress'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{workOrders.filter(wo => wo.status === 'in_progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-yellow-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'รอดำเนินการ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{workOrders.filter(wo => wo.status === 'pending' || wo.status === 'not_started').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-green-500">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'เสร็จสิ้น' : 'Completed'}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{workOrders.filter(wo => wo.status === 'completed').length}</div>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('action.search', lang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'WO #' : 'WO #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'SO #' : 'SO #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Material'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ความคืบหน้า' : 'Progress'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'กำหนดเสร็จ' : 'Target'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สาขา' : 'Entity'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(wo => {
                const progress = wo.qty > 0 ? Math.round((wo.completedQty / wo.qty) * 100) : 0
                return (
                  <tr key={wo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#1A5276] font-medium">{wo.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{wo.soId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{wo.product}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        wo.material === 'PLY' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {wo.material}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{wo.completedQty}/{wo.qty}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-[#1A5276]'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{wo.targetDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        wo.entity === 'IND' ? 'bg-teal-100 text-teal-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {wo.entity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        wo.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        wo.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {wo.status === 'in_progress' ? (lang === 'th' ? 'กำลังผลิต' : 'In Progress') :
                         wo.status === 'completed' ? (lang === 'th' ? 'เสร็จสิ้น' : 'Completed') :
                         (lang === 'th' ? 'รอดำเนินการ' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PLACEHOLDER MODULES
// ============================================
const PlaceholderModule = ({ title, icon: Icon, lang, onUpload }) => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">
          {lang === 'th' ? 'โมดูลนี้กำลังพัฒนา' : 'This module is under development'}
        </p>
      </div>
      <button
        onClick={onUpload}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        {lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Document'}
      </button>
    </div>
    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
      <Icon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
      <p className="text-gray-500">{lang === 'th' ? 'เร็วๆ นี้' : 'Coming Soon'}</p>
    </div>
  </div>
)

// ============================================
// INVOICE PREVIEW COMPONENT (Thai Tax Invoice)
// ============================================
const InvoicePreview = ({ invoice, lang }) => {
  if (!invoice) return null

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img src={IND_LOGO_SVG} alt="IND Logo" className="w-20 h-20" />
          <div>
            <h1 className="text-lg font-bold">IND THAI PACKWELL INDUSTRIES CO., LTD.</h1>
            <p className="text-sm text-gray-600">399 MOO 8, THAT THONG SUBDISTRICT,</p>
            <p className="text-sm text-gray-600">BO THONG, CHONBURI 20270</p>
            <p className="text-sm text-gray-600">Tel: 094-7866886, 081-835-5435</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-[#1A5276]">
            {lang === 'th' ? 'ใบกำกับภาษี / ใบแจ้งหนี้' : 'TAX INVOICE'}
          </h2>
          <p className="text-lg font-mono mt-2">{invoice.id}</p>
          <p className="text-sm text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}: {invoice.invoiceDate}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-gray-700 mb-2">{lang === 'th' ? 'ลูกค้า' : 'Bill To'}:</h3>
          <p className="font-medium">{invoice.customerName}</p>
          <p className="text-sm text-gray-600">Customer ID: {invoice.customerId}</p>
        </div>
        <div className="text-right">
          <p><span className="text-gray-600">{lang === 'th' ? 'ครบกำหนด' : 'Due Date'}:</span> {invoice.dueDate}</p>
          <p><span className="text-gray-600">{lang === 'th' ? 'เงื่อนไข' : 'Terms'}:</span> 30 Days</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">{lang === 'th' ? 'รายการ' : 'Description'}</th>
            <th className="px-4 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
            <th className="px-4 py-2 text-right">{lang === 'th' ? 'หน่วย' : 'Unit'}</th>
            <th className="px-4 py-2 text-right">{lang === 'th' ? 'ราคา/หน่วย' : 'Price'}</th>
            <th className="px-4 py-2 text-right">{lang === 'th' ? 'รวม' : 'Amount'}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, i) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-3">{item.product}</td>
              <td className="px-4 py-3 text-right">{item.qty}</td>
              <td className="px-4 py-3 text-right">{item.unit}</td>
              <td className="px-4 py-3 text-right">฿{item.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">฿{(item.qty * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span>{lang === 'th' ? 'ยอดรวม' : 'Subtotal'}:</span>
            <span>฿{invoice.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>{lang === 'th' ? 'ภาษีมูลค่าเพิ่ม 7%' : 'VAT 7%'}:</span>
            <span>฿{invoice.vat?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg">
            <span>{lang === 'th' ? 'ยอดสุทธิ' : 'Total'}:</span>
            <span className="text-[#1A5276]">฿{invoice.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
        <p>{lang === 'th' ? 'ขอบคุณที่ใช้บริการ' : 'Thank you for your business'}</p>
      </div>
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function INDERPSystem() {
  const [user, setUser] = useState(null)
  const [lang, setLang] = useState('en')
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadDepartment, setUploadDepartment] = useState('sales')
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS)

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setActiveModule('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setActiveModule('dashboard')
  }

  const openUploadModal = (department) => {
    setUploadDepartment(department)
    setUploadModalOpen(true)
  }

  const handleDocumentProcessed = (doc) => {
    setDocuments(prev => [...prev, {
      id: 'DOC' + (prev.length + 1).toString().padStart(3, '0'),
      filename: doc.filename,
      type: doc.docType,
      department: doc.department,
      uploadDate: doc.uploadDate,
      uploadedBy: user?.name || 'System',
      status: 'processed',
      extractedData: doc.fields,
    }])
  }

  // Navigation items based on user role
  const getNavItems = () => {
    if (!user) return []
    const allowedModules = ROLES[user.role].modules
    const allItems = [
      { id: 'dashboard', label: t('nav.dashboard', lang), icon: Home },
      { id: 'admin', label: t('nav.admin', lang), icon: Settings },
      { id: 'sales', label: t('nav.sales', lang), icon: ShoppingCart },
      { id: 'production', label: t('nav.production', lang), icon: Factory },
      { id: 'inventory', label: t('nav.inventory', lang), icon: Package },
      { id: 'purchasing', label: t('nav.purchasing', lang), icon: Truck },
      { id: 'hr', label: t('nav.hr', lang), icon: Users },
      { id: 'accounting', label: t('nav.accounting', lang), icon: Calculator },
      { id: 'reports', label: t('nav.reports', lang), icon: BarChart3 },
    ]
    return allItems.filter(item => allowedModules.includes(item.id))
  }

  // Render login if no user
  if (!user) {
    return <LoginScreen onLogin={handleLogin} lang={lang} />
  }

  // Render module content
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard user={user} lang={lang} />
      case 'hr':
        return <HRModule lang={lang} onUpload={() => openUploadModal('hr')} />
      case 'sales':
        return <SalesModule lang={lang} onUpload={() => openUploadModal('sales')} />
      case 'production':
        return <ProductionModule lang={lang} onUpload={() => openUploadModal('production')} />
      case 'inventory':
        return <PlaceholderModule title={lang === 'th' ? 'คลังสินค้า' : 'Inventory'} icon={Package} lang={lang} onUpload={() => openUploadModal('inventory')} />
      case 'purchasing':
        return <PlaceholderModule title={lang === 'th' ? 'จัดซื้อ' : 'Purchasing'} icon={Truck} lang={lang} onUpload={() => openUploadModal('purchasing')} />
      case 'accounting':
        return <PlaceholderModule title={lang === 'th' ? 'บัญชี' : 'Accounting'} icon={Calculator} lang={lang} onUpload={() => openUploadModal('accounting')} />
      case 'reports':
        return <PlaceholderModule title={lang === 'th' ? 'รายงาน' : 'Reports'} icon={BarChart3} lang={lang} onUpload={() => {}} />
      case 'admin':
        return <PlaceholderModule title={lang === 'th' ? 'ศูนย์จัดการ' : 'Admin Hub'} icon={Settings} lang={lang} onUpload={() => {}} />
      default:
        return <Dashboard user={user} lang={lang} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <img src={IND_LOGO_SVG} alt="IND Logo" className="w-12 h-12" />
          {sidebarOpen && (
            <div>
              <div className="font-bold text-[#1A5276]">IND ERP</div>
              <div className="text-xs text-gray-500">{user.entity}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {getNavItems().map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                activeModule === item.id
                  ? 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${ROLES[user.role].color} flex items-center justify-center text-white font-bold`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{ROLES[user.role].name}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                {t('action.logout', lang)}
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
              className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{LANGUAGES[lang].flag} {LANGUAGES[lang].name}</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderModule()}
        </div>
      </main>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        department={uploadDepartment}
        onDocumentProcessed={handleDocumentProcessed}
        lang={lang}
      />
    </div>
  )
}
