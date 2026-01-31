// ============================================
// IND ERP - PURCHASE MODULE ENHANCEMENT
// PR → PO WORKFLOW (Section 8 & 7)
// ============================================
// This file contains the enhanced Purchase Module
// with Purchase Request → Purchase Order workflow
// and Approval Hierarchy enforcement
// ============================================

// ============================================
// APPROVAL HIERARCHY (Section 7)
// ============================================
const APPROVAL_HIERARCHY = {
  thresholds: [
    { id: 'pm', maxAmount: 10000, role: 'Production Manager', roleTh: 'ผู้จัดการฝ่ายผลิต', autoApprove: false },
    { id: 'gm', maxAmount: 50000, role: 'General Manager', roleTh: 'ผู้จัดการทั่วไป', autoApprove: false },
    { id: 'ceo', maxAmount: Infinity, role: 'CEO', roleTh: 'CEO', autoApprove: false },
  ],
  getRequiredApprover: (amount) => {
    if (amount <= 10000) return { level: 'pm', role: 'Production Manager', roleTh: 'ผู้จัดการฝ่ายผลิต' }
    if (amount <= 50000) return { level: 'gm', role: 'General Manager', roleTh: 'ผู้จัดการทั่วไป' }
    return { level: 'ceo', role: 'CEO', roleTh: 'CEO' }
  }
}

// ============================================
// PR STATUS WORKFLOW
// ============================================
const PR_STATUS = {
  draft: { id: 'draft', label: 'Draft', labelTh: 'แบบร่าง', color: 'bg-gray-500', next: ['submitted'] },
  submitted: { id: 'submitted', label: 'Submitted', labelTh: 'ส่งแล้ว', color: 'bg-blue-500', next: ['pending_approval'] },
  pending_approval: { id: 'pending_approval', label: 'Pending Approval', labelTh: 'รออนุมัติ', color: 'bg-yellow-500', next: ['approved', 'rejected'] },
  approved: { id: 'approved', label: 'Approved', labelTh: 'อนุมัติแล้ว', color: 'bg-green-500', next: ['converted'] },
  rejected: { id: 'rejected', label: 'Rejected', labelTh: 'ไม่อนุมัติ', color: 'bg-red-500', next: ['draft'] },
  converted: { id: 'converted', label: 'Converted to PO', labelTh: 'แปลงเป็น PO แล้ว', color: 'bg-purple-500', next: [] },
}

// ============================================
// INITIAL PURCHASE REQUESTS DATA
// ============================================
const INITIAL_PURCHASE_REQUESTS = [
  {
    id: 'PR-260130-001',
    requestDate: '2026-01-30',
    requestedBy: 'Somchai Yodrak',
    requestedById: 3,
    department: 'production',
    reason: 'Low stock alert - MLH running low for Allianz order',
    reasonTh: 'สต็อกต่ำ - ไม้ MLH ใกล้หมดสำหรับออเดอร์ Allianz',
    priority: 'high',
    type: 'local',
    suggestedVendorId: 'V001',
    items: [
      { id: 1, categoryId: 'MLH', description: 'Mixed Hardwood 50x100x2400', thickness: 50, width: 100, length: 2400, qty: 2000, unit: 'pcs', estimatedPrice: 4912, total: 9824000 },
    ],
    subtotal: 9824000,
    estimatedTotal: 9824000,
    status: 'pending_approval',
    approvalLevel: 'ceo',
    approvalHistory: [
      { action: 'submitted', by: 'Somchai Yodrak', date: '2026-01-30 09:00', note: 'Urgent - need for production' },
    ],
    requiredApprover: 'CEO',
    linkedWO: 'WO-260130-001',
    entity: 'IND',
  },
  {
    id: 'PR-260129-001',
    requestDate: '2026-01-29',
    requestedBy: 'Prasert Thongdee',
    requestedById: 4,
    department: 'warehouse',
    reason: 'Monthly restock - Pine Wood',
    reasonTh: 'เติมสต็อกประจำเดือน - ไม้สน',
    priority: 'medium',
    type: 'local',
    suggestedVendorId: 'V002',
    items: [
      { id: 1, categoryId: 'PW', description: 'Pine Wood 39x145x3960', thickness: 39, width: 145, length: 3960, qty: 500, unit: 'pcs', estimatedPrice: 2962, total: 1481000 },
    ],
    subtotal: 1481000,
    estimatedTotal: 1481000,
    status: 'approved',
    approvalLevel: 'ceo',
    approvalHistory: [
      { action: 'submitted', by: 'Prasert Thongdee', date: '2026-01-29 10:30', note: '' },
      { action: 'approved', by: 'CEO', date: '2026-01-29 14:00', note: 'Approved for Q1 stock' },
    ],
    requiredApprover: 'CEO',
    entity: 'IND',
  },
  {
    id: 'PR-260128-001',
    requestDate: '2026-01-28',
    requestedBy: 'Boonlert Jaidee',
    requestedById: 8,
    department: 'maintenance',
    reason: 'Spare parts for Saw Machine #2',
    reasonTh: 'อะไหล่สำหรับเครื่องเลื่อย #2',
    priority: 'low',
    type: 'local',
    suggestedVendorId: null,
    items: [
      { id: 1, categoryId: 'MAINT', description: 'Saw blade 14"', thickness: 0, width: 0, length: 0, qty: 5, unit: 'pcs', estimatedPrice: 1500, total: 7500 },
      { id: 2, categoryId: 'MAINT', description: 'Belt drive', thickness: 0, width: 0, length: 0, qty: 2, unit: 'pcs', estimatedPrice: 800, total: 1600 },
    ],
    subtotal: 9100,
    estimatedTotal: 9100,
    status: 'approved',
    approvalLevel: 'pm',
    approvalHistory: [
      { action: 'submitted', by: 'Boonlert Jaidee', date: '2026-01-28 08:00', note: 'Preventive maintenance' },
      { action: 'approved', by: 'Production Manager', date: '2026-01-28 09:30', note: 'OK' },
    ],
    requiredApprover: 'Production Manager',
    entity: 'IND',
  },
]

// ============================================
// GENERATE PR NUMBER
// ============================================
const generatePRNumber = (existingPRs) => {
  const today = new Date()
  const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '')
  const todayPRs = existingPRs.filter(pr => pr.id.includes(`PR-${dateStr}`))
  const seq = String(todayPRs.length + 1).padStart(3, '0')
  return `PR-${dateStr}-${seq}`
}

// ============================================
// ENHANCED PURCHASE MODULE WITH PR WORKFLOW
// ============================================
const PurchaseModuleEnhanced = ({ 
  purchaseOrders, 
  setPurchaseOrders, 
  purchaseRequests,
  setPurchaseRequests,
  vendors, 
  categories, 
  stores, 
  inventory, 
  setInventory, 
  employees,
  currentUser,
  lang 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showPOModal, setShowPOModal] = useState(false)
  const [showPRModal, setShowPRModal] = useState(false)
  const [showGRNModal, setShowGRNModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [selectedPR, setSelectedPR] = useState(null)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [pendingLots, setPendingLots] = useState([])
  const [prFilter, setPRFilter] = useState('all')
  
  // GLOBAL LOT SEQUENCE - shared across ALL materials
  const [globalLotSequence, setGlobalLotSequence] = useState(14926)
  
  // Generate lot number with correct prefix based on material and vendor
  const generateLotNumber = (categoryCode, vendor) => {
    const seq = globalLotSequence + 1
    setGlobalLotSequence(seq)
    
    let prefix
    switch (categoryCode) {
      case 'MLH': prefix = 'LP'; break
      case 'PW': prefix = vendor?.initials || vendor?.name?.substring(0, 2).toUpperCase() || 'PW'; break
      case 'PLYRR': prefix = 'PLYRR'; break
      case 'PLYRW': prefix = 'PLYRW'; break
      case 'PLYWW': prefix = 'PLYWW'; break
      case 'PLYWB': prefix = 'PLYWB'; break
      case 'PRTB': prefix = 'PRTB'; break
      case 'PRTW': prefix = 'PRTW'; break
      default: prefix = categoryCode
    }
    
    return `${prefix}${seq}`
  }

  // Enhanced tabs with PR
  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'requests', label: lang === 'th' ? 'ใบขอซื้อ (PR)' : 'Purchase Requests', icon: ClipboardList, count: purchaseRequests?.filter(pr => pr.status === 'pending_approval').length || 0 },
    { id: 'orders', label: lang === 'th' ? 'ใบสั่งซื้อ (PO)' : 'Purchase Orders', icon: FileText },
    { id: 'receiving', label: lang === 'th' ? 'รับสินค้า' : 'Goods Receipt', icon: Package },
    { id: 'vendors', label: lang === 'th' ? 'ผู้ขาย' : 'Vendors', icon: Users },
  ]

  // Stats including PR
  const stats = {
    // PO Stats
    totalPOs: purchaseOrders.length,
    pendingPOs: purchaseOrders.filter(po => po.status === 'pending').length,
    inTransit: purchaseOrders.filter(po => po.status === 'in_transit').length,
    receivedPOs: purchaseOrders.filter(po => po.status === 'received').length,
    totalPOValue: purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0),
    importCosts: purchaseOrders.reduce((sum, po) => sum + (po.totalImportCosts || 0), 0),
    // PR Stats
    totalPRs: purchaseRequests?.length || 0,
    draftPRs: purchaseRequests?.filter(pr => pr.status === 'draft').length || 0,
    pendingApproval: purchaseRequests?.filter(pr => pr.status === 'pending_approval').length || 0,
    approvedPRs: purchaseRequests?.filter(pr => pr.status === 'approved').length || 0,
    rejectedPRs: purchaseRequests?.filter(pr => pr.status === 'rejected').length || 0,
  }

  // Check if current user can approve
  const canApprove = (pr) => {
    const userRole = currentUser?.role
    if (userRole === 'admin') return true
    
    const requiredLevel = APPROVAL_HIERARCHY.getRequiredApprover(pr.estimatedTotal)
    if (requiredLevel.level === 'pm' && ['admin', 'production'].includes(userRole)) return true
    if (requiredLevel.level === 'gm' && ['admin'].includes(userRole)) return true
    if (requiredLevel.level === 'ceo' && ['admin'].includes(userRole)) return true
    
    return false
  }

  // Handle PR submission
  const handleSubmitPR = (prData) => {
    const approver = APPROVAL_HIERARCHY.getRequiredApprover(prData.estimatedTotal)
    const newPR = {
      id: generatePRNumber(purchaseRequests || []),
      ...prData,
      status: 'pending_approval',
      approvalLevel: approver.level,
      requiredApprover: approver.role,
      approvalHistory: [
        {
          action: 'submitted',
          by: currentUser?.name || 'User',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: prData.reason || '',
        }
      ],
    }
    setPurchaseRequests(prev => [...(prev || []), newPR])
    setShowPRModal(false)
  }

  // Handle PR approval/rejection
  const handleApprovalAction = (pr, action, note) => {
    const updatedPR = {
      ...pr,
      status: action === 'approve' ? 'approved' : 'rejected',
      approvalHistory: [
        ...pr.approvalHistory,
        {
          action: action === 'approve' ? 'approved' : 'rejected',
          by: currentUser?.name || 'Approver',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: note || '',
        }
      ],
    }
    setPurchaseRequests(prev => prev.map(p => p.id === pr.id ? updatedPR : p))
    setShowApprovalModal(false)
    setSelectedPR(null)
  }

  // Convert approved PR to PO
  const handleConvertToPO = (pr, poData) => {
    // Create new PO from PR
    const newPO = {
      id: `PO-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      vendorId: poData.vendorId,
      type: poData.type,
      poDate: new Date().toISOString().split('T')[0],
      vendorInvoice: '',
      vendorInvoiceDate: '',
      deliveryDate: poData.deliveryDate,
      container: poData.container || '',
      blNumber: poData.blNumber || '',
      items: pr.items.map((item, idx) => ({
        id: idx + 1,
        categoryId: item.categoryId,
        thickness: item.thickness,
        width: item.width,
        length: item.length,
        qty: item.qty,
        unit: item.unit,
        unitPrice: poData.items?.[idx]?.unitPrice || item.estimatedPrice,
        cbm: (item.thickness * item.width * item.length * item.qty) / 1000000000,
        total: item.qty * (poData.items?.[idx]?.unitPrice || item.estimatedPrice),
      })),
      subtotal: poData.subtotal,
      vat: poData.vat || 0,
      total: poData.total,
      importCosts: poData.importCosts || {},
      totalImportCosts: poData.totalImportCosts || 0,
      status: 'pending',
      entity: pr.entity || 'IND',
      prId: pr.id,
      currency: poData.currency || 'THB',
      exchangeRate: poData.exchangeRate || 1,
    }
    
    // Update PR status to converted
    const updatedPR = {
      ...pr,
      status: 'converted',
      convertedPOId: newPO.id,
      approvalHistory: [
        ...pr.approvalHistory,
        {
          action: 'converted',
          by: currentUser?.name || 'User',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: `Converted to ${newPO.id}`,
        }
      ],
    }
    
    setPurchaseOrders(prev => [...prev, newPO])
    setPurchaseRequests(prev => prev.map(p => p.id === pr.id ? updatedPR : p))
    setShowConvertModal(false)
    setSelectedPR(null)
  }

  // ... (rest of existing handlers: handleReceive, handlePrePrint, handleGRNSave, handleDocumentProcessed)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.purchase', lang)}</h1>
          <p className="text-gray-500">
            {lang === 'th' ? 'จัดการใบขอซื้อ ใบสั่งซื้อ และรับสินค้า' : 'Manage purchase requests, orders and goods receipt'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload} onClick={() => setShowUploadModal(true)}>
            {lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Invoice'}
          </Button>
          <Button variant="outline" icon={ClipboardList} onClick={() => setShowPRModal(true)}>
            {lang === 'th' ? 'สร้างใบขอซื้อ' : 'New PR'}
          </Button>
          <Button icon={Plus} onClick={() => setShowPOModal(true)}>
            {lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'New PO'}
          </Button>
        </div>
      </div>

      {/* Stats - Enhanced with PR stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* PR Stats */}
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'ใบขอซื้อ' : 'PRs'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalPRs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'รออนุมัติ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'อนุมัติแล้ว' : 'Approved'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.approvedPRs}</div>
        </Card>
        {/* PO Stats */}
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'ใบสั่งซื้อ' : 'POs'}</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalPOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-cyan-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'ระหว่างทาง' : 'In Transit'}</div>
          <div className="text-2xl font-bold text-cyan-600">{stats.inTransit}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-teal-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
          <div className="text-2xl font-bold text-teal-600">{stats.receivedPOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
          <div className="text-xl font-bold text-emerald-600">{formatCurrency(stats.totalPOValue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-xs text-gray-500 uppercase">{lang === 'th' ? 'ค่านำเข้า' : 'Import Costs'}</div>
          <div className="text-xl font-bold text-orange-600">{formatCurrency(stats.importCosts)}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* PURCHASE REQUESTS TAB (NEW) */}
      {/* ============================================ */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* PR Filter */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['all', 'pending_approval', 'approved', 'rejected', 'converted'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setPRFilter(filter)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    prFilter === filter 
                      ? 'bg-[#1A5276] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? (lang === 'th' ? 'ทั้งหมด' : 'All') :
                   filter === 'pending_approval' ? (lang === 'th' ? 'รออนุมัติ' : 'Pending') :
                   filter === 'approved' ? (lang === 'th' ? 'อนุมัติแล้ว' : 'Approved') :
                   filter === 'rejected' ? (lang === 'th' ? 'ไม่อนุมัติ' : 'Rejected') :
                   (lang === 'th' ? 'แปลงเป็น PO' : 'Converted')}
                </button>
              ))}
            </div>
            <Button icon={Plus} onClick={() => setShowPRModal(true)}>
              {lang === 'th' ? 'สร้างใบขอซื้อใหม่' : 'New Purchase Request'}
            </Button>
          </div>

          {/* PR Workflow Indicator */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm font-medium">{lang === 'th' ? 'สร้าง PR' : 'Create PR'}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm font-medium">{lang === 'th' ? 'รออนุมัติ' : 'Approval'}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm font-medium">{lang === 'th' ? 'แปลงเป็น PO' : 'Convert to PO'}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-sm font-medium">{lang === 'th' ? 'ส่ง Vendor' : 'Send to Vendor'}</span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{lang === 'th' ? 'ขีดจำกัดอนุมัติ:' : 'Approval Limits:'}</div>
                <div className="text-xs">PM ≤฿10k | GM ≤฿50k | CEO &gt;฿50k</div>
              </div>
            </div>
          </Card>

          {/* PR List */}
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่ PR' : 'PR #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้ขอ' : 'Requested By'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เหตุผล' : 'Reason'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Amount'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้อนุมัติ' : 'Approver'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(purchaseRequests || [])
                  .filter(pr => prFilter === 'all' || pr.status === prFilter)
                  .map(pr => {
                    const statusConfig = PR_STATUS[pr.status] || PR_STATUS.draft
                    const vendor = vendors.find(v => v.id === pr.suggestedVendorId)
                    
                    return (
                      <tr key={pr.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-mono text-[#1A5276] font-medium">{pr.id}</div>
                          {pr.linkedWO && <div className="text-xs text-gray-400">→ {pr.linkedWO}</div>}
                          {pr.convertedPOId && <div className="text-xs text-purple-500">→ {pr.convertedPOId}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(pr.requestDate)}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-sm">{pr.requestedBy}</div>
                          <div className="text-xs text-gray-400 capitalize">{pr.department}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm max-w-xs truncate" title={lang === 'th' ? pr.reasonTh : pr.reason}>
                            {lang === 'th' ? pr.reasonTh : pr.reason}
                          </div>
                          {vendor && <div className="text-xs text-gray-400">{lang === 'th' ? 'แนะนำ:' : 'Suggested:'} {vendor.name}</div>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-bold text-[#2ECC40]">{formatCurrency(pr.estimatedTotal)}</div>
                          <div className="text-xs text-gray-400">{pr.items?.length || 0} {lang === 'th' ? 'รายการ' : 'items'}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pr.approvalLevel === 'ceo' ? 'bg-red-100 text-red-700' :
                            pr.approvalLevel === 'gm' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {pr.requiredApprover}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusConfig.color}`}>
                            {pr.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                            {pr.status === 'rejected' && <X className="w-3 h-3" />}
                            {pr.status === 'pending_approval' && <Clock className="w-3 h-3" />}
                            {pr.status === 'converted' && <ArrowRight className="w-3 h-3" />}
                            {lang === 'th' ? statusConfig.labelTh : statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {/* View button */}
                            <button 
                              className="p-1.5 hover:bg-gray-100 rounded" 
                              title={lang === 'th' ? 'ดู' : 'View'}
                              onClick={() => { setSelectedPR(pr); /* Open view modal */ }}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            
                            {/* Approve/Reject button - only for pending */}
                            {pr.status === 'pending_approval' && canApprove(pr) && (
                              <button 
                                className="p-1.5 hover:bg-yellow-100 rounded" 
                                title={lang === 'th' ? 'อนุมัติ/ไม่อนุมัติ' : 'Approve/Reject'}
                                onClick={() => { setSelectedPR(pr); setShowApprovalModal(true); }}
                              >
                                <BadgeCheck className="w-4 h-4 text-yellow-600" />
                              </button>
                            )}
                            
                            {/* Convert to PO button - only for approved */}
                            {pr.status === 'approved' && (
                              <button 
                                className="p-1.5 hover:bg-green-100 rounded" 
                                title={lang === 'th' ? 'แปลงเป็น PO' : 'Convert to PO'}
                                onClick={() => { setSelectedPR(pr); setShowConvertModal(true); }}
                              >
                                <ArrowRight className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            
                            {/* Re-submit button - only for rejected */}
                            {pr.status === 'rejected' && (
                              <button 
                                className="p-1.5 hover:bg-blue-100 rounded" 
                                title={lang === 'th' ? 'แก้ไขและส่งใหม่' : 'Edit & Resubmit'}
                              >
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                {(!purchaseRequests || purchaseRequests.length === 0) && (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                      {lang === 'th' ? 'ยังไม่มีใบขอซื้อ' : 'No purchase requests yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ... Dashboard Tab, Orders Tab, Receiving Tab, Vendors Tab remain the same ... */}

      {/* ============================================ */}
      {/* PR FORM MODAL */}
      {/* ============================================ */}
      {showPRModal && (
        <Modal 
          isOpen={showPRModal} 
          onClose={() => setShowPRModal(false)} 
          title={lang === 'th' ? 'สร้างใบขอซื้อ (PR)' : 'New Purchase Request'} 
          size="xl"
        >
          <PurchaseRequestForm
            vendors={vendors}
            categories={categories}
            employees={employees}
            currentUser={currentUser}
            lang={lang}
            onSave={handleSubmitPR}
            onCancel={() => setShowPRModal(false)}
          />
        </Modal>
      )}

      {/* ============================================ */}
      {/* APPROVAL MODAL */}
      {/* ============================================ */}
      {showApprovalModal && selectedPR && (
        <Modal 
          isOpen={showApprovalModal} 
          onClose={() => { setShowApprovalModal(false); setSelectedPR(null); }} 
          title={lang === 'th' ? 'อนุมัติใบขอซื้อ' : 'PR Approval'} 
          size="lg"
        >
          <PRApprovalForm
            pr={selectedPR}
            vendors={vendors}
            categories={categories}
            lang={lang}
            onApprove={(note) => handleApprovalAction(selectedPR, 'approve', note)}
            onReject={(note) => handleApprovalAction(selectedPR, 'reject', note)}
            onCancel={() => { setShowApprovalModal(false); setSelectedPR(null); }}
          />
        </Modal>
      )}

      {/* ============================================ */}
      {/* CONVERT TO PO MODAL */}
      {/* ============================================ */}
      {showConvertModal && selectedPR && (
        <Modal 
          isOpen={showConvertModal} 
          onClose={() => { setShowConvertModal(false); setSelectedPR(null); }} 
          title={lang === 'th' ? 'แปลงเป็นใบสั่งซื้อ' : 'Convert to Purchase Order'} 
          size="xl"
        >
          <ConvertPRtoPOForm
            pr={selectedPR}
            vendors={vendors}
            categories={categories}
            lang={lang}
            onConvert={(poData) => handleConvertToPO(selectedPR, poData)}
            onCancel={() => { setShowConvertModal(false); setSelectedPR(null); }}
          />
        </Modal>
      )}

      {/* ... Other existing modals (PO, GRN, Upload, Labels) ... */}
    </div>
  )
}

// ============================================
// PURCHASE REQUEST FORM
// ============================================
const PurchaseRequestForm = ({ vendors, categories, employees, currentUser, lang, onSave, onCancel }) => {
  const rmCategories = categories.filter(c => c.type === 'raw_material')
  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy: currentUser?.name || '',
    requestedById: currentUser?.id || null,
    department: currentUser?.department || 'production',
    reason: '',
    reasonTh: '',
    priority: 'medium',
    type: 'local',
    suggestedVendorId: '',
    linkedWO: '',
    entity: 'IND',
    items: [{ id: 1, categoryId: '', description: '', thickness: 0, width: 0, length: 0, qty: 0, unit: 'pcs', estimatedPrice: 0 }],
  })

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        id: prev.items.length + 1, 
        categoryId: '', 
        description: '',
        thickness: 0, 
        width: 0, 
        length: 0, 
        qty: 0, 
        unit: 'pcs', 
        estimatedPrice: 0 
      }]
    }))
  }

  const updateItem = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== idx) return item
        const updated = { ...item, [field]: value }
        // Auto-calculate total
        updated.total = updated.qty * updated.estimatedPrice
        return updated
      })
    }))
  }

  const removeItem = (idx) => {
    if (formData.items.length <= 1) return
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }))
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.estimatedPrice), 0)
  const estimatedTotal = subtotal // Can add estimated VAT/import costs if needed
  const requiredApprover = APPROVAL_HIERARCHY.getRequiredApprover(estimatedTotal)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      subtotal,
      estimatedTotal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันที่ขอ' : 'Request Date'}
          </label>
          <input
            type="date"
            value={formData.requestDate}
            onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'แผนก' : 'Department'}
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="production">{lang === 'th' ? 'ฝ่ายผลิต' : 'Production'}</option>
            <option value="warehouse">{lang === 'th' ? 'คลังสินค้า' : 'Warehouse'}</option>
            <option value="maintenance">{lang === 'th' ? 'ซ่อมบำรุง' : 'Maintenance'}</option>
            <option value="office">{lang === 'th' ? 'สำนักงาน' : 'Office'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ความเร่งด่วน' : 'Priority'}
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
            <option value="medium">{lang === 'th' ? 'ปานกลาง' : 'Medium'}</option>
            <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
            <option value="urgent">{lang === 'th' ? 'ด่วนมาก' : 'Urgent'}</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เหตุผล (EN)' : 'Reason (EN)'} *
          </label>
          <textarea
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
            placeholder="e.g., Low stock alert, Production requirement..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เหตุผล (TH)' : 'Reason (TH)'}
          </label>
          <textarea
            value={formData.reasonTh}
            onChange={(e) => setFormData({ ...formData, reasonTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={2}
            placeholder="เช่น สต็อกต่ำ, ความต้องการผลิต..."
          />
        </div>
      </div>

      {/* Type & Vendor Suggestion */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ประเภท' : 'Type'}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'local' })}
              className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                formData.type === 'local' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'
              }`}
            >
              🏠 Local
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'import' })}
              className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                formData.type === 'import' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
              }`}
            >
              🚢 Import
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'แนะนำผู้ขาย' : 'Suggested Vendor'}
          </label>
          <select
            value={formData.suggestedVendorId}
            onChange={(e) => setFormData({ ...formData, suggestedVendorId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">{lang === 'th' ? '-- ไม่ระบุ --' : '-- Not specified --'}</option>
            {vendors.filter(v => v.type === formData.type).map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เชื่อมโยง WO' : 'Linked Work Order'}
          </label>
          <input
            type="text"
            value={formData.linkedWO}
            onChange={(e) => setFormData({ ...formData, linkedWO: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g., WO-260130-001"
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {lang === 'th' ? 'รายการวัสดุ' : 'Material Items'}
          </label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            + {lang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                <th className="px-2 py-2 text-left">{lang === 'th' ? 'รายละเอียด' : 'Description'}</th>
                <th className="px-2 py-2 text-center">{lang === 'th' ? 'หนา' : 'T'}</th>
                <th className="px-2 py-2 text-center">{lang === 'th' ? 'กว้าง' : 'W'}</th>
                <th className="px-2 py-2 text-center">{lang === 'th' ? 'ยาว' : 'L'}</th>
                <th className="px-2 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                <th className="px-2 py-2 text-right">{lang === 'th' ? 'ราคาประมาณ' : 'Est. Price'}</th>
                <th className="px-2 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-2">
                    <select
                      value={item.categoryId}
                      onChange={(e) => updateItem(idx, 'categoryId', e.target.value)}
                      className="w-24 px-2 py-1 border rounded text-sm"
                    >
                      <option value="">--</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.code}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Description..."
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={item.thickness || ''}
                      onChange={(e) => updateItem(idx, 'thickness', parseInt(e.target.value) || 0)}
                      className="w-14 px-1 py-1 border rounded text-sm text-center"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={item.width || ''}
                      onChange={(e) => updateItem(idx, 'width', parseInt(e.target.value) || 0)}
                      className="w-14 px-1 py-1 border rounded text-sm text-center"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={item.length || ''}
                      onChange={(e) => updateItem(idx, 'length', parseInt(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border rounded text-sm text-center"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={item.qty || ''}
                      onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={item.estimatedPrice || ''}
                      onChange={(e) => updateItem(idx, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-[#2ECC40]">
                    {formatCurrency(item.qty * item.estimatedPrice)}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      disabled={formData.items.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals & Approval Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-700 mb-2">{lang === 'th' ? 'ข้อมูลการอนุมัติ' : 'Approval Information'}</div>
            <div className="flex justify-between">
              <span className="text-gray-500">{lang === 'th' ? 'มูลค่าประมาณ:' : 'Estimated Amount:'}</span>
              <span className="font-bold text-[#2ECC40]">{formatCurrency(estimatedTotal)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">{lang === 'th' ? 'ต้องอนุมัติโดย:' : 'Requires Approval From:'}</span>
              <span className={`font-bold ${
                requiredApprover.level === 'ceo' ? 'text-red-600' :
                requiredApprover.level === 'gm' ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {lang === 'th' ? requiredApprover.roleTh : requiredApprover.role}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            <div>• PM: ≤ ฿10,000</div>
            <div>• GM: ฿10,001 - ฿50,000</div>
            <div>• CEO: &gt; ฿50,000</div>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] p-4 rounded-lg text-white">
            <div className="text-sm opacity-80">{lang === 'th' ? 'มูลค่ารวมประมาณ' : 'Estimated Total'}</div>
            <div className="text-3xl font-bold">{formatCurrency(estimatedTotal)}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
        </Button>
        <Button type="submit" icon={Send}>
          {lang === 'th' ? 'ส่งใบขอซื้อ' : 'Submit PR'}
        </Button>
      </div>
    </form>
  )
}

// ============================================
// PR APPROVAL FORM
// ============================================
const PRApprovalForm = ({ pr, vendors, categories, lang, onApprove, onReject, onCancel }) => {
  const [note, setNote] = useState('')
  const vendor = vendors.find(v => v.id === pr.suggestedVendorId)

  return (
    <div className="space-y-6">
      {/* PR Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'เลขที่ PR:' : 'PR Number:'}</span>
            <span className="ml-2 font-mono font-bold text-[#1A5276]">{pr.id}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'วันที่:' : 'Date:'}</span>
            <span className="ml-2">{formatDate(pr.requestDate)}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'ผู้ขอ:' : 'Requested By:'}</span>
            <span className="ml-2">{pr.requestedBy}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'แผนก:' : 'Department:'}</span>
            <span className="ml-2 capitalize">{pr.department}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="text-gray-500 text-sm">{lang === 'th' ? 'เหตุผล:' : 'Reason:'}</div>
          <div className="mt-1">{lang === 'th' ? pr.reasonTh || pr.reason : pr.reason}</div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">{lang === 'th' ? 'รายการ' : 'Items'}</h4>
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">{lang === 'th' ? 'รายการ' : 'Item'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคาประมาณ' : 'Est. Price'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pr.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2">
                  <div className="font-medium">{item.categoryId}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </td>
                <td className="px-3 py-2 text-right">{formatNumber(item.qty)} {item.unit}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(item.estimatedPrice)}</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="3" className="px-3 py-2 text-right font-bold">{lang === 'th' ? 'รวมทั้งสิ้น:' : 'Total:'}</td>
              <td className="px-3 py-2 text-right font-bold text-[#2ECC40]">{formatCurrency(pr.estimatedTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Approval History */}
      {pr.approvalHistory && pr.approvalHistory.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">{lang === 'th' ? 'ประวัติ' : 'History'}</h4>
          <div className="space-y-2">
            {pr.approvalHistory.map((h, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  h.action === 'approved' ? 'bg-green-500' :
                  h.action === 'rejected' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <span className="text-gray-500">{h.date}</span>
                <span className="font-medium capitalize">{h.action}</span>
                <span className="text-gray-500">by {h.by}</span>
                {h.note && <span className="text-gray-400 italic">- {h.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'หมายเหตุการอนุมัติ' : 'Approval Note'}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={2}
          placeholder={lang === 'th' ? 'หมายเหตุ (ถ้ามี)...' : 'Add a note (optional)...'}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
        </Button>
        <Button 
          type="button" 
          variant="danger" 
          icon={X}
          onClick={() => onReject(note)}
        >
          {lang === 'th' ? 'ไม่อนุมัติ' : 'Reject'}
        </Button>
        <Button 
          type="button" 
          icon={CheckCircle}
          onClick={() => onApprove(note)}
        >
          {lang === 'th' ? 'อนุมัติ' : 'Approve'}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// CONVERT PR TO PO FORM
// ============================================
const ConvertPRtoPOForm = ({ pr, vendors, categories, lang, onConvert, onCancel }) => {
  const [formData, setFormData] = useState({
    vendorId: pr.suggestedVendorId || '',
    type: pr.type || 'local',
    deliveryDate: '',
    currency: 'THB',
    exchangeRate: 1,
    container: '',
    blNumber: '',
    items: pr.items.map(item => ({
      ...item,
      unitPrice: item.estimatedPrice,
    })),
    importCosts: {},
  })

  const selectedVendor = vendors.find(v => v.id === formData.vendorId)

  useEffect(() => {
    if (selectedVendor) {
      setFormData(prev => ({
        ...prev,
        type: selectedVendor.type,
        currency: selectedVendor.type === 'import' ? 'USD' : 'THB',
        exchangeRate: selectedVendor.type === 'import' ? 35.50 : 1,
      }))
    }
  }, [formData.vendorId])

  const updateItem = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== idx) return item
        const updated = { ...item, [field]: value }
        updated.total = updated.qty * updated.unitPrice * formData.exchangeRate
        return updated
      })
    }))
  }

  const updateImportCost = (costId, value) => {
    setFormData(prev => ({
      ...prev,
      importCosts: { ...prev.importCosts, [costId]: parseFloat(value) || 0 }
    }))
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.unitPrice * formData.exchangeRate), 0)
  const totalImportCosts = Object.values(formData.importCosts).reduce((sum, cost) => sum + (cost || 0), 0)
  const vat = (subtotal + totalImportCosts) * 0.07
  const total = subtotal + totalImportCosts + vat

  const handleSubmit = (e) => {
    e.preventDefault()
    onConvert({
      ...formData,
      subtotal,
      totalImportCosts,
      vat,
      total,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PR Reference */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-3">
        <ArrowRight className="w-5 h-5 text-blue-500" />
        <div>
          <span className="text-sm text-blue-700">{lang === 'th' ? 'แปลงจากใบขอซื้อ:' : 'Converting from PR:'}</span>
          <span className="ml-2 font-mono font-bold text-blue-800">{pr.id}</span>
        </div>
      </div>

      {/* Vendor Selection (REQUIRED for PO) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ผู้ขาย *' : 'Vendor *'}
          </label>
          <select
            required
            value={formData.vendorId}
            onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">{lang === 'th' ? '-- เลือกผู้ขาย --' : '-- Select Vendor --'}</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'กำหนดส่ง *' : 'Delivery Date *'}
          </label>
          <input
            type="date"
            required
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Currency for Import */}
      {formData.type === 'import' && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'สกุลเงิน' : 'Currency'}
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="USD">USD</option>
              <option value="MYR">MYR</option>
              <option value="THB">THB</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'อัตราแลกเปลี่ยน' : 'Exchange Rate'}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'เลขตู้คอนเทนเนอร์' : 'Container #'}
            </label>
            <input
              type="text"
              value={formData.container}
              onChange={(e) => setFormData({ ...formData, container: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="MSCU1234567"
            />
          </div>
        </div>
      )}

      {/* Items with actual prices */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">{lang === 'th' ? 'รายการและราคาจริง' : 'Items & Actual Prices'}</h4>
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">{lang === 'th' ? 'รายการ' : 'Item'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคาประมาณ' : 'Est.'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคาจริง *' : 'Actual *'}</th>
              <th className="px-3 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {formData.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2">
                  <div className="font-medium">{item.categoryId}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </td>
                <td className="px-3 py-2 text-right">{formatNumber(item.qty)}</td>
                <td className="px-3 py-2 text-right text-gray-400">{formatCurrency(item.estimatedPrice)}</td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border rounded text-right"
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium text-[#2ECC40]">
                  {formatCurrency(item.qty * item.unitPrice * formData.exchangeRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Import Costs (for import orders) */}
      {formData.type === 'import' && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">{lang === 'th' ? 'ค่าใช้จ่ายนำเข้า (13 รายการ)' : 'Import Costs (13 Types)'}</h4>
          <div className="grid grid-cols-3 gap-3">
            {IMPORT_COST_TYPES.map(cost => (
              <div key={cost.id} className="flex items-center gap-2">
                <label className="text-sm text-gray-600 w-28 truncate" title={cost.nameEn}>
                  {lang === 'th' ? cost.nameTh : cost.nameEn}
                </label>
                <input
                  type="number"
                  value={formData.importCosts[cost.id] || ''}
                  onChange={(e) => updateImportCost(cost.id, e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm text-right"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{lang === 'th' ? 'ค่าวัสดุ' : 'Materials'}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {formData.type === 'import' && totalImportCosts > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>{lang === 'th' ? 'ค่านำเข้า' : 'Import Costs'}</span>
              <span>{formatCurrency(totalImportCosts)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>VAT 7%</span>
            <span>{formatCurrency(vat)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>{lang === 'th' ? 'รวมทั้งสิ้น' : 'Grand Total'}</span>
            <span className="text-[#2ECC40]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
        </Button>
        <Button type="submit" icon={ArrowRight}>
          {lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'Create PO'}
        </Button>
      </div>
    </form>
  )
}

// ============================================
// HELPER: Format functions (if not imported)
// ============================================
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount || 0)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('th-TH').format(num || 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Export for use in main app
export {
  PurchaseModuleEnhanced,
  PurchaseRequestForm,
  PRApprovalForm,
  ConvertPRtoPOForm,
  INITIAL_PURCHASE_REQUESTS,
  APPROVAL_HIERARCHY,
  PR_STATUS,
  generatePRNumber,
}
