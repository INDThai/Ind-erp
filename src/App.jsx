// ============================================
// IND ERP - SALES & PRODUCTION MODULE ENHANCEMENT
// Version: 1.0 - 2026-01-31
// ============================================
// 
// SALES FEATURES:
// - Customer PO Entry (acts as SO)
// - Quotation (QT-YYMM-XXX)
// - Create WO from Customer PO
// - Invoice (IV-YYMM-XXX)
// - Dispatch Order (DO - Customer-YY-XXX)
// - Rejection Form (REJ-YYMM-XXX)
// - Claim Form (CLM-YYMM-XXX)
// - Credit Note (CN-YYMM-XXX)
//
// PRODUCTION FEATURES:
// - WO Number Format (WO-YYMMDD-XXX)
// - QC Checklist (product-by-product)
// - Heat Treatment Certificate (TH-0950)
// - FG Transfer (WO Complete → FG Store)
// - Link to Customer PO
//
// ============================================

// ============================================
// DOCUMENT NUMBER GENERATORS
// ============================================
const generateDocNumber = (prefix, date = new Date()) => {
  const yy = date.getFullYear().toString().slice(-2)
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 900 + 100) // 100-999
  return `${prefix}-${yy}${mm}-${seq}`
}

const generateWONumber = (date = new Date()) => {
  const yy = date.getFullYear().toString().slice(-2)
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const dd = date.getDate().toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0')
  return `WO-${yy}${mm}${dd}-${seq}`
}

const generateDONumber = (customerCode, year = new Date().getFullYear()) => {
  const yy = year.toString().slice(-2)
  const seq = Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0')
  return `${customerCode}-${yy}-${seq}`
}

const generateHTCertNumber = (date = new Date()) => {
  const yy = date.getFullYear().toString().slice(-2)
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const dd = date.getDate().toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0')
  return `HT-${yy}${mm}${dd}-${seq}`
}

// ============================================
// CUSTOMER PO ENTRY MODAL
// Spec 28: Customer PO = Sales Order
// ============================================
const CustomerPOEntryModal = ({ isOpen, onClose, customers, products, onSave, lang }) => {
  const [formData, setFormData] = useState({
    customerPO: '',
    customerId: '',
    poDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    items: [],
    notes: '',
    requiresHT: false,
    specialLabels: '', // allianz, polyplex, none
  })
  const [newItem, setNewItem] = useState({
    productId: '',
    description: '',
    qty: 0,
    unitPrice: 0,
  })

  if (!isOpen) return null

  const selectedCustomer = customers?.find(c => c.id === formData.customerId)

  // Auto-detect special label requirements
  useEffect(() => {
    if (selectedCustomer) {
      if (selectedCustomer.code === 'ALL-013' || selectedCustomer.name?.includes('Allianz')) {
        setFormData(prev => ({ ...prev, specialLabels: 'allianz', requiresHT: true }))
      } else if (selectedCustomer.code === 'PLX-002' || selectedCustomer.name?.includes('Polyplex')) {
        setFormData(prev => ({ ...prev, specialLabels: 'polyplex', requiresHT: false }))
      } else {
        setFormData(prev => ({ ...prev, specialLabels: 'none' }))
      }
    }
  }, [selectedCustomer])

  const addItem = () => {
    if (!newItem.productId || newItem.qty <= 0) return
    const product = products?.find(p => p.id === newItem.productId)
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        ...newItem,
        productCode: product?.code,
        productName: product?.name || newItem.description,
        lineTotal: newItem.qty * newItem.unitPrice,
      }]
    }))
    setNewItem({ productId: '', description: '', qty: 0, unitPrice: 0 })
  }

  const removeItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.lineTotal, 0)
    const vat = selectedCustomer?.isExport ? 0 : subtotal * 0.07
    return { subtotal, vat, total: subtotal + vat }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const totals = calculateTotals()
    onSave({
      ...formData,
      id: `SO-${Date.now()}`,
      soNumber: formData.customerPO, // Customer PO = SO
      customer: selectedCustomer,
      ...totals,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  const totals = calculateTotals()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white rounded-t-xl sticky top-0">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {lang === 'th' ? 'รับ PO ลูกค้า' : 'Enter Customer PO'}
          </h3>
          <p className="text-sm opacity-80">
            {lang === 'th' ? 'PO ลูกค้า = ใบสั่งขาย (ไม่สร้าง SO แยก)' : 'Customer PO = Sales Order (no separate SO)'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'เลข PO ลูกค้า *' : 'Customer PO Number *'}
              </label>
              <input
                type="text"
                required
                value={formData.customerPO}
                onChange={(e) => setFormData({ ...formData, customerPO: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 5100026898"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'ลูกค้า *' : 'Customer *'}
              </label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">{lang === 'th' ? '-- เลือกลูกค้า --' : '-- Select Customer --'}</option>
                {customers?.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'วันที่ PO' : 'PO Date'}
              </label>
              <input
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
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

          {/* Special Customer Indicators */}
          {selectedCustomer && formData.specialLabels !== 'none' && (
            <div className={`p-3 rounded-lg border ${
              formData.specialLabels === 'allianz' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${formData.specialLabels === 'allianz' ? 'text-blue-600' : 'text-orange-600'}`} />
                <span className="font-medium">
                  {formData.specialLabels === 'allianz' 
                    ? 'Allianz: QR Labels + Heat Treatment Certificate Required'
                    : 'Polyplex: 4-Column Color-Coded Labels Required'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Add Items */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">{lang === 'th' ? 'รายการสินค้า' : 'Line Items'}</h4>
            <div className="grid grid-cols-12 gap-2 mb-3">
              <div className="col-span-4">
                <select
                  value={newItem.productId}
                  onChange={(e) => {
                    const product = products?.find(p => p.id === e.target.value)
                    setNewItem({ 
                      ...newItem, 
                      productId: e.target.value,
                      description: product?.name || '',
                      unitPrice: product?.price || 0,
                    })
                  }}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                >
                  <option value="">{lang === 'th' ? 'เลือกสินค้า' : 'Select Product'}</option>
                  {products?.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={newItem.qty || ''}
                  onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                  placeholder="Qty"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  value={newItem.unitPrice || ''}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-2 border rounded-lg text-sm"
                  placeholder="Price"
                />
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-2 bg-[#2ECC40] text-white rounded-lg hover:bg-[#2ECC40]/90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Items Table */}
            {formData.items.length > 0 && (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{item.productCode || item.description}</td>
                      <td className="px-3 py-2 text-right">{item.qty}</td>
                      <td className="px-3 py-2 text-right">฿{item.unitPrice.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right font-medium">฿{item.lineTotal.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2">
                  <tr>
                    <td colSpan="3" className="px-3 py-2 text-right font-medium">Subtotal:</td>
                    <td className="px-3 py-2 text-right font-bold">฿{totals.subtotal.toLocaleString()}</td>
                    <td></td>
                  </tr>
                  {totals.vat > 0 && (
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-right font-medium">VAT 7%:</td>
                      <td className="px-3 py-2 text-right">฿{totals.vat.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  )}
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-3 py-2 text-right font-bold text-lg">Total:</td>
                    <td className="px-3 py-2 text-right font-bold text-lg text-[#2ECC40]">฿{totals.total.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresHT}
                onChange={(e) => setFormData({ ...formData, requiresHT: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                {lang === 'th' ? 'ต้องการใบรับรองอบความร้อน (HT)' : 'Heat Treatment Certificate Required'}
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'หมายเหตุ' : 'Notes'}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={formData.items.length === 0}
              className="px-6 py-2 bg-[#1A5276] text-white rounded-lg hover:bg-[#1A5276]/90 disabled:opacity-50"
            >
              {lang === 'th' ? 'บันทึก & สร้าง WO' : 'Save & Create WO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// CREATE WO FROM SO MODAL
// Spec 10: WO-YYMMDD-XXX format
// Spec 14: 1 WO per PO/PR
// ============================================
const CreateWOFromSOModal = ({ isOpen, onClose, salesOrder, onCreateWO, lang }) => {
  const [woData, setWoData] = useState({
    priority: 'normal',
    targetDate: '',
    notes: '',
  })

  if (!isOpen || !salesOrder) return null

  const woNumber = generateWONumber()

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateWO({
      id: woNumber,
      woNumber,
      soNumber: salesOrder.soNumber,
      customerPO: salesOrder.customerPO,
      customerId: salesOrder.customerId,
      customerName: salesOrder.customer?.name,
      items: salesOrder.items,
      priority: woData.priority,
      targetDate: woData.targetDate || salesOrder.deliveryDate,
      requiresHT: salesOrder.requiresHT,
      specialLabels: salesOrder.specialLabels,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: woData.notes,
      materialsIssued: [],
      operations: [],
      qcChecklist: [],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b bg-[#1A5276] text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Factory className="w-5 h-5" />
            {lang === 'th' ? 'สร้างใบสั่งผลิต' : 'Create Work Order'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* WO Number Preview */}
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'เลขที่ WO' : 'WO Number'}</div>
            <div className="text-2xl font-bold text-[#1A5276]">{woNumber}</div>
          </div>

          {/* SO Reference */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-500">Customer PO:</span> <strong>{salesOrder.customerPO}</strong></div>
              <div><span className="text-gray-500">Customer:</span> <strong>{salesOrder.customer?.name}</strong></div>
              <div><span className="text-gray-500">Items:</span> <strong>{salesOrder.items?.length}</strong></div>
              <div><span className="text-gray-500">Delivery:</span> <strong>{salesOrder.deliveryDate}</strong></div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'ความเร่งด่วน' : 'Priority'}
            </label>
            <select
              value={woData.priority}
              onChange={(e) => setWoData({ ...woData, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
              <option value="normal">{lang === 'th' ? 'ปกติ' : 'Normal'}</option>
              <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
              <option value="urgent">{lang === 'th' ? 'เร่งด่วน' : 'Urgent'}</option>
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'วันที่เป้าหมาย' : 'Target Completion Date'}
            </label>
            <input
              type="date"
              value={woData.targetDate || salesOrder.deliveryDate}
              onChange={(e) => setWoData({ ...woData, targetDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Special Requirements */}
          {(salesOrder.requiresHT || salesOrder.specialLabels !== 'none') && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <div className="font-medium text-yellow-800 mb-1">Special Requirements:</div>
              <ul className="list-disc list-inside text-yellow-700">
                {salesOrder.requiresHT && <li>Heat Treatment Certificate (ISPM15)</li>}
                {salesOrder.specialLabels === 'allianz' && <li>Allianz QR Labels</li>}
                {salesOrder.specialLabels === 'polyplex' && <li>Polyplex Color-Coded Labels</li>}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'หมายเหตุ' : 'Production Notes'}
            </label>
            <textarea
              rows={2}
              value={woData.notes}
              onChange={(e) => setWoData({ ...woData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button type="submit" className="px-6 py-2 bg-[#1A5276] text-white rounded-lg hover:bg-[#1A5276]/90">
              {lang === 'th' ? 'สร้าง WO' : 'Create WO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// QC CHECKLIST MODAL
// Spec 15: Product-by-product, configurable
// ============================================
const QCChecklistModal = ({ isOpen, onClose, workOrder, onSaveQC, lang }) => {
  const [checklist, setChecklist] = useState([])

  // Default QC items (configurable per product)
  const DEFAULT_QC_ITEMS = [
    { id: 'dim_length', category: 'Dimensions', item: 'Length within tolerance (±2mm)', required: true },
    { id: 'dim_width', category: 'Dimensions', item: 'Width within tolerance (±2mm)', required: true },
    { id: 'dim_height', category: 'Dimensions', item: 'Height/Thickness within tolerance (±1mm)', required: true },
    { id: 'surface', category: 'Surface', item: 'No cracks or splits', required: true },
    { id: 'moisture', category: 'Surface', item: 'Moisture content <18%', required: true },
    { id: 'assembly', category: 'Assembly', item: 'All nails/staples properly fastened', required: true },
    { id: 'blocks', category: 'Assembly', item: 'Blocks properly aligned', required: true },
    { id: 'stamp', category: 'Marking', item: 'ISPM15 stamp visible (if HT)', required: false },
    { id: 'label', category: 'Marking', item: 'Labels correctly applied', required: false },
    { id: 'clean', category: 'Appearance', item: 'Clean, no debris', required: true },
  ]

  useEffect(() => {
    if (workOrder) {
      const existingChecklist = workOrder.qcChecklist || []
      if (existingChecklist.length > 0) {
        setChecklist(existingChecklist)
      } else {
        setChecklist(DEFAULT_QC_ITEMS.map(item => ({
          ...item,
          status: 'pending', // pending, pass, fail
          note: '',
          checkedBy: '',
          checkedAt: null,
        })))
      }
    }
  }, [workOrder])

  if (!isOpen || !workOrder) return null

  const handleStatusChange = (itemId, status) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status, checkedBy: 'QC Staff', checkedAt: new Date().toISOString() }
        : item
    ))
  }

  const handleNoteChange = (itemId, note) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, note } : item
    ))
  }

  const allRequiredPassed = checklist
    .filter(item => item.required)
    .every(item => item.status === 'pass')

  const anyFailed = checklist.some(item => item.status === 'fail')

  const handleSubmit = () => {
    onSaveQC({
      woId: workOrder.id,
      checklist,
      overallStatus: anyFailed ? 'fail' : (allRequiredPassed ? 'pass' : 'pending'),
      completedAt: new Date().toISOString(),
    })
    onClose()
  }

  const groupedItems = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b bg-[#1A5276] text-white rounded-t-xl sticky top-0">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {lang === 'th' ? 'QC Checklist' : 'QC Checklist'}
          </h3>
          <p className="text-sm opacity-80">WO: {workOrder.woNumber || workOrder.id}</p>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">{category}</h4>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className={`p-3 rounded-lg border ${
                    item.status === 'pass' ? 'bg-green-50 border-green-200' :
                    item.status === 'fail' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={item.required ? 'font-medium' : ''}>{item.item}</span>
                          {item.required && <span className="text-xs text-red-500">*</span>}
                        </div>
                        {item.note && (
                          <div className="text-sm text-gray-500 mt-1">Note: {item.note}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'pass')}
                          className={`p-2 rounded-lg ${item.status === 'pass' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-100'}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'fail')}
                          className={`p-2 rounded-lg ${item.status === 'fail' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-100'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {item.status === 'fail' && (
                      <input
                        type="text"
                        placeholder="Add note for failure reason..."
                        value={item.note}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className={`p-4 rounded-lg ${
            anyFailed ? 'bg-red-100 border border-red-300' :
            allRequiredPassed ? 'bg-green-100 border border-green-300' :
            'bg-yellow-100 border border-yellow-300'
          }`}>
            <div className="flex items-center gap-2">
              {anyFailed ? (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  <span className="font-bold text-red-700">QC FAILED - Rework Required</span>
                </>
              ) : allRequiredPassed ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="font-bold text-green-700">QC PASSED - Ready for FG</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <span className="font-bold text-yellow-700">QC In Progress</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#1A5276] text-white rounded-lg hover:bg-[#1A5276]/90"
            >
              {lang === 'th' ? 'บันทึก QC' : 'Save QC Result'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// HEAT TREATMENT CERTIFICATE MODAL
// Spec 19: TH-0950, 56°C for 30 minutes
// ============================================
const HeatTreatmentCertModal = ({ isOpen, onClose, workOrder, onSave, lang }) => {
  const [certData, setCertData] = useState({
    certNumber: generateHTCertNumber(),
    treatmentDate: new Date().toISOString().split('T')[0],
    chamberNo: '',
    startTime: '',
    endTime: '',
    coreTemp: '56',
    duration: '30',
    moistureContent: '',
    operator: '',
  })

  if (!isOpen || !workOrder) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(generateCertHTML())
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const generateCertHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Heat Treatment Certificate - ${certData.certNumber}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { font-size: 16pt; margin: 0; }
          .header h2 { font-size: 14pt; margin: 5px 0; color: #333; }
          .logo { font-size: 24pt; font-weight: bold; color: #1A5276; }
          .cert-box {
            border: 3px solid #000;
            padding: 20px;
            margin: 20px 0;
          }
          .cert-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .ispm-logo {
            text-align: center;
            font-size: 24pt;
            font-weight: bold;
            border: 3px solid #000;
            padding: 10px 30px;
            display: inline-block;
            margin: 20px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 15px 0;
          }
          .info-row {
            display: flex;
            margin: 8px 0;
          }
          .info-label {
            font-weight: bold;
            width: 180px;
          }
          .info-value {
            flex: 1;
            border-bottom: 1px solid #ccc;
            padding-left: 10px;
          }
          .certification-text {
            text-align: justify;
            margin: 20px 0;
            line-height: 1.6;
          }
          .signature-area {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
          .signature-box {
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">IND THAI PACKWELL INDUSTRIES CO., LTD.</div>
          <p>BoThong, Chonburi, Thailand</p>
        </div>

        <div class="cert-box">
          <div class="cert-title">HEAT TREATMENT CERTIFICATE</div>
          <div style="text-align: center;">
            <div class="ispm-logo">
              🌲 ISPM 15<br/>
              <span style="font-size: 14pt;">TH-0950</span>
            </div>
          </div>

          <div class="info-row">
            <span class="info-label">Certificate No.:</span>
            <span class="info-value">${certData.certNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Work Order:</span>
            <span class="info-value">${workOrder.woNumber || workOrder.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Customer PO:</span>
            <span class="info-value">${workOrder.customerPO || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Customer:</span>
            <span class="info-value">${workOrder.customerName || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Treatment Date:</span>
            <span class="info-value">${certData.treatmentDate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Chamber No.:</span>
            <span class="info-value">${certData.chamberNo}</span>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Start Time:</span>
              <span class="info-value">${certData.startTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Time:</span>
              <span class="info-value">${certData.endTime}</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Core Temperature:</span>
              <span class="info-value">${certData.coreTemp}°C</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${certData.duration} minutes</span>
            </div>
          </div>

          <div class="info-row">
            <span class="info-label">Moisture Content:</span>
            <span class="info-value">${certData.moistureContent}%</span>
          </div>

          <div class="certification-text">
            <strong>CERTIFICATION:</strong><br/>
            This is to certify that the wood packaging materials described in this certificate have been 
            treated in accordance with ISPM 15 (International Standards for Phytosanitary Measures No. 15).
            The treatment was carried out using <strong>Heat Treatment (HT)</strong> method, where the 
            core temperature of the wood reached a minimum of <strong>56°C for at least 30 consecutive minutes</strong>.
            <br/><br/>
            This treatment facility is authorized by the Department of Agriculture, Thailand.
            Registration Number: <strong>TH-0950</strong>
          </div>

          <div class="signature-area">
            <div class="signature-box">
              <div class="signature-line">Operator</div>
              <div>${certData.operator || '________________'}</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">QC Manager</div>
              <div>________________</div>
            </div>
          </div>
        </div>

        <div class="footer">
          IND THAI PACKWELL INDUSTRIES CO., LTD. | ISPM 15 Certified Facility | TH-0950
        </div>
      </body>
      </html>
    `
  }

  const handleSave = () => {
    onSave({
      woId: workOrder.id,
      certificate: certData,
      issuedAt: new Date().toISOString(),
    })
    handlePrint()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b bg-orange-500 text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Flame className="w-5 h-5" />
            {lang === 'th' ? 'ใบรับรองอบความร้อน' : 'Heat Treatment Certificate'}
          </h3>
          <p className="text-sm opacity-80">ISPM 15 - TH-0950</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Cert Number */}
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">Certificate No.</div>
            <div className="text-xl font-bold text-orange-600">{certData.certNumber}</div>
          </div>

          {/* WO Reference */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div><span className="text-gray-500">WO:</span> <strong>{workOrder.woNumber || workOrder.id}</strong></div>
            <div><span className="text-gray-500">Customer:</span> <strong>{workOrder.customerName}</strong></div>
          </div>

          {/* Treatment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Date</label>
              <input
                type="date"
                value={certData.treatmentDate}
                onChange={(e) => setCertData({ ...certData, treatmentDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chamber No.</label>
              <input
                type="text"
                value={certData.chamberNo}
                onChange={(e) => setCertData({ ...certData, chamberNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., OVN-01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={certData.startTime}
                onChange={(e) => setCertData({ ...certData, startTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={certData.endTime}
                onChange={(e) => setCertData({ ...certData, endTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Fixed Values */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Core Temperature:</span>
                <span className="font-bold text-green-700 ml-2">56°C (minimum)</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="font-bold text-green-700 ml-2">30 minutes (minimum)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moisture Content (%)</label>
              <input
                type="number"
                value={certData.moistureContent}
                onChange={(e) => setCertData({ ...certData, moistureContent: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
              <input
                type="text"
                value={certData.operator}
                onChange={(e) => setCertData({ ...certData, operator: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Save & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DISPATCH ORDER MODAL
// Spec 28: DO - Customer-YY-XXX
// ============================================
const DispatchOrderModal = ({ isOpen, onClose, workOrder, salesOrder, onCreateDO, lang }) => {
  const [doData, setDoData] = useState({
    dispatchDate: new Date().toISOString().split('T')[0],
    truckNo: '',
    driverName: '',
    deliveryAddress: '',
    notes: '',
  })

  if (!isOpen) return null

  const customerCode = salesOrder?.customer?.code || 'CUST'
  const doNumber = generateDONumber(customerCode)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateDO({
      id: `DO-${Date.now()}`,
      doNumber,
      woId: workOrder?.id,
      soNumber: salesOrder?.soNumber,
      customerPO: salesOrder?.customerPO,
      customerId: salesOrder?.customerId,
      customerName: salesOrder?.customer?.name,
      ...doData,
      items: workOrder?.items || salesOrder?.items,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b bg-purple-600 text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Truck className="w-5 h-5" />
            {lang === 'th' ? 'สร้างใบส่งของ' : 'Create Dispatch Order'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* DO Number Preview */}
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">DO Number</div>
            <div className="text-2xl font-bold text-purple-600">{doNumber}</div>
          </div>

          {/* Reference */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-500">Customer:</span> <strong>{salesOrder?.customer?.name}</strong></div>
              <div><span className="text-gray-500">PO:</span> <strong>{salesOrder?.customerPO}</strong></div>
              {workOrder && <div><span className="text-gray-500">WO:</span> <strong>{workOrder.woNumber || workOrder.id}</strong></div>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Date</label>
            <input
              type="date"
              required
              value={doData.dispatchDate}
              onChange={(e) => setDoData({ ...doData, dispatchDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Truck No.</label>
              <select
                value={doData.truckNo}
                onChange={(e) => setDoData({ ...doData, truckNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Truck</option>
                <option value="TRK-01">TRK-01 (6 Wheel)</option>
                <option value="TRK-02">TRK-02 (6 Wheel)</option>
                <option value="TRK-03">TRK-03 (4 Wheel)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
              <select
                value={doData.driverName}
                onChange={(e) => setDoData({ ...doData, driverName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Driver</option>
                <option value="Mayo">Mayo</option>
                <option value="W">W</option>
                <option value="T">T</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea
              rows={2}
              value={doData.deliveryAddress}
              onChange={(e) => setDoData({ ...doData, deliveryAddress: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder={salesOrder?.customer?.address || 'Enter delivery address...'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              value={doData.notes}
              onChange={(e) => setDoData({ ...doData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Create DO
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// INVOICE MODAL
// Spec 28: IV-YYMM-XXX (local with VAT, export without)
// ============================================
const InvoiceModal = ({ isOpen, onClose, salesOrder, dispatchOrder, onCreateInvoice, lang }) => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    isExport: false,
    paymentTerms: '30',
    notes: '',
  })

  useEffect(() => {
    if (salesOrder?.customer?.isExport) {
      setInvoiceData(prev => ({ ...prev, isExport: true }))
    }
    // Calculate due date based on payment terms
    const due = new Date()
    due.setDate(due.getDate() + parseInt(invoiceData.paymentTerms))
    setInvoiceData(prev => ({ ...prev, dueDate: due.toISOString().split('T')[0] }))
  }, [salesOrder])

  if (!isOpen) return null

  const invoiceNumber = generateDocNumber('IV')
  const items = salesOrder?.items || []
  const subtotal = items.reduce((sum, item) => sum + (item.lineTotal || item.qty * item.unitPrice), 0)
  const vat = invoiceData.isExport ? 0 : subtotal * 0.07
  const grandTotal = subtotal + vat

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateInvoice({
      id: `INV-${Date.now()}`,
      invoiceNumber,
      soNumber: salesOrder?.soNumber,
      customerPO: salesOrder?.customerPO,
      doNumber: dispatchOrder?.doNumber,
      customerId: salesOrder?.customerId,
      customerName: salesOrder?.customer?.name,
      ...invoiceData,
      items,
      subtotal,
      vat,
      grandTotal,
      balance: grandTotal,
      paidAmount: 0,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b bg-green-600 text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            {lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'Create Invoice'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Invoice Number Preview */}
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">Invoice Number</div>
            <div className="text-2xl font-bold text-green-600">{invoiceNumber}</div>
          </div>

          {/* Reference */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-500">Customer:</span> <strong>{salesOrder?.customer?.name}</strong></div>
              <div><span className="text-gray-500">PO:</span> <strong>{salesOrder?.customerPO}</strong></div>
              {dispatchOrder && <div><span className="text-gray-500">DO:</span> <strong>{dispatchOrder.doNumber}</strong></div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                required
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
            <select
              value={invoiceData.paymentTerms}
              onChange={(e) => setInvoiceData({ ...invoiceData, paymentTerms: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="0">Cash / Immediate</option>
              <option value="15">Net 15 Days</option>
              <option value="30">Net 30 Days</option>
              <option value="45">Net 45 Days</option>
              <option value="60">Net 60 Days</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={invoiceData.isExport}
              onChange={(e) => setInvoiceData({ ...invoiceData, isExport: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Export Invoice (No VAT)</span>
          </label>

          {/* Totals */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">฿{subtotal.toLocaleString()}</span>
              </div>
              {!invoiceData.isExport && (
                <div className="flex justify-between">
                  <span>VAT 7%:</span>
                  <span className="font-medium">฿{vat.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Grand Total:</span>
                <span className="text-green-600">฿{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// REJECTION FORM MODAL
// Spec 26: REJ-YYMM-XXX
// ============================================
const RejectionFormModal = ({ isOpen, onClose, invoice, onSave, lang }) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    qtyRejected: 0,
    photos: [],
    action: '', // replace, repair, credit_note, scrap
  })

  if (!isOpen) return null

  const rejNumber = generateDocNumber('REJ')

  const REJECTION_REASONS = [
    { id: 'wrong_size', label: 'Wrong Size' },
    { id: 'damaged', label: 'Damaged' },
    { id: 'quality', label: 'Quality Issue' },
    { id: 'wrong_product', label: 'Wrong Product' },
    { id: 'other', label: 'Other' },
  ]

  const ACTIONS = [
    { id: 'replace', label: 'Replace' },
    { id: 'repair', label: 'Repair' },
    { id: 'credit_note', label: 'Issue Credit Note' },
    { id: 'scrap', label: 'Scrap Invoice' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: `REJ-${Date.now()}`,
      rejectionNumber: rejNumber,
      invoiceNumber: invoice?.invoiceNumber,
      customerId: invoice?.customerId,
      customerName: invoice?.customerName,
      ...formData,
      status: 'open',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b bg-red-600 text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {lang === 'th' ? 'บันทึกการปฏิเสธสินค้า' : 'Rejection Form'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* REJ Number */}
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">Rejection No.</div>
            <div className="text-xl font-bold text-red-600">{rejNumber}</div>
          </div>

          {/* Invoice Reference */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div><span className="text-gray-500">Invoice:</span> <strong>{invoice?.invoiceNumber}</strong></div>
            <div><span className="text-gray-500">Customer:</span> <strong>{invoice?.customerName}</strong></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <select
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Reason</option>
              {REJECTION_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Rejected</label>
            <input
              type="number"
              min="1"
              value={formData.qtyRejected || ''}
              onChange={(e) => setFormData({ ...formData, qtyRejected: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Describe the issue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action *</label>
            <select
              required
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Action</option>
              {ACTIONS.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Submit Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// EXPORTS
// ============================================
export {
  CustomerPOEntryModal,
  CreateWOFromSOModal,
  QCChecklistModal,
  HeatTreatmentCertModal,
  DispatchOrderModal,
  InvoiceModal,
  RejectionFormModal,
  generateDocNumber,
  generateWONumber,
  generateDONumber,
  generateHTCertNumber,
}
