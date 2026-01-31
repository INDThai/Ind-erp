// ============================================
// IND ERP - ENHANCED RECEIVING MODULE
// Section 3-4: Editable Receiving with Split Lots
// ============================================
// Features:
// - Split single PO line into multiple lots (different sizes)
// - Add unexpected items discovered on receipt
// - Reject items with reason → triggers revised invoice workflow
// - Partial receiving (multiple GRN per PO)
// - Credit Note tracking
// - Variance reporting
// ============================================

// ============================================
// REJECTION REASONS
// ============================================
const REJECTION_REASONS = [
  { id: 'damaged', labelEn: 'Damaged in transit', labelTh: 'เสียหายระหว่างขนส่ง' },
  { id: 'wrong_size', labelEn: 'Wrong size/dimensions', labelTh: 'ขนาดไม่ตรง' },
  { id: 'wrong_material', labelEn: 'Wrong material type', labelTh: 'ประเภทวัสดุไม่ตรง' },
  { id: 'quality', labelEn: 'Quality not acceptable', labelTh: 'คุณภาพไม่ผ่าน' },
  { id: 'quantity_excess', labelEn: 'Quantity exceeds order', labelTh: 'จำนวนเกินที่สั่ง' },
  { id: 'not_ordered', labelEn: 'Not ordered/wrong item', labelTh: 'ไม่ได้สั่ง/สินค้าผิด' },
  { id: 'documentation', labelEn: 'Documentation mismatch', labelTh: 'เอกสารไม่ตรง' },
  { id: 'other', labelEn: 'Other (specify)', labelTh: 'อื่นๆ (ระบุ)' },
]

// ============================================
// GRN STATUS
// ============================================
const GRN_STATUS = {
  draft: { id: 'draft', label: 'Draft', labelTh: 'แบบร่าง', color: 'bg-gray-500' },
  pending_qc: { id: 'pending_qc', label: 'Pending QC', labelTh: 'รอตรวจ QC', color: 'bg-yellow-500' },
  partial: { id: 'partial', label: 'Partial Received', labelTh: 'รับบางส่วน', color: 'bg-blue-500' },
  completed: { id: 'completed', label: 'Completed', labelTh: 'รับครบ', color: 'bg-green-500' },
  has_rejection: { id: 'has_rejection', label: 'Has Rejections', labelTh: 'มีปฏิเสธ', color: 'bg-red-500' },
}

// ============================================
// ENHANCED GOODS RECEIPT FORM
// ============================================
const GoodsReceiptFormEnhanced = ({ po, vendors, categories, onSave, onCancel, onReject, lang }) => {
  const vendor = vendors.find(v => v.id === po.vendorId)
  const rmCategories = categories?.filter(c => c.type === 'raw_material') || []
  
  // Initialize with PO items, each can be split into multiple lots
  const [receiptItems, setReceiptItems] = useState(
    po.items.map((item, idx) => ({
      poLineId: item.id,
      poLineIndex: idx,
      categoryId: item.categoryId,
      orderedQty: item.qty,
      previouslyReceived: item.qtyReceived || 0,
      remainingQty: item.qty - (item.qtyReceived || 0),
      orderedThickness: item.thickness,
      orderedWidth: item.width,
      orderedLength: item.length,
      unitPrice: item.unitPrice,
      // Lots array - can split into multiple
      lots: [{
        id: `lot-${idx}-1`,
        qtyToReceive: item.qty - (item.qtyReceived || 0),
        actualThickness: item.thickness,
        actualWidth: item.width,
        actualLength: item.length,
        condition: 'good', // good, damaged, rejected
        notes: '',
      }],
      // Rejection tracking
      rejectedQty: 0,
      rejectionReason: '',
      rejectionNotes: '',
    }))
  )
  
  // Additional items not on PO (discovered on receipt)
  const [additionalItems, setAdditionalItems] = useState([])
  
  // GRN metadata
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0])
  const [grnNotes, setGrnNotes] = useState('')
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState(po.vendorInvoice || '')
  const [vendorInvoiceDate, setVendorInvoiceDate] = useState(po.vendorInvoiceDate || '')
  const [receivedBy, setReceivedBy] = useState('')
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingItem, setRejectingItem] = useState(null)
  
  // ============================================
  // LOT MANAGEMENT FUNCTIONS
  // ============================================
  
  // Split a PO line into additional lots
  const addLotToItem = (itemIdx) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      const newLotId = `lot-${idx}-${item.lots.length + 1}`
      return {
        ...item,
        lots: [...item.lots, {
          id: newLotId,
          qtyToReceive: 0,
          actualThickness: item.orderedThickness,
          actualWidth: item.orderedWidth,
          actualLength: item.orderedLength,
          condition: 'good',
          notes: '',
        }]
      }
    }))
  }
  
  // Update a specific lot within an item
  const updateLot = (itemIdx, lotIdx, field, value) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      return {
        ...item,
        lots: item.lots.map((lot, lIdx) => {
          if (lIdx !== lotIdx) return lot
          return { ...lot, [field]: value }
        })
      }
    }))
  }
  
  // Remove a lot (but keep at least one)
  const removeLot = (itemIdx, lotIdx) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx || item.lots.length <= 1) return item
      return {
        ...item,
        lots: item.lots.filter((_, lIdx) => lIdx !== lotIdx)
      }
    }))
  }
  
  // ============================================
  // ADDITIONAL ITEMS (Not on PO)
  // ============================================
  
  const addAdditionalItem = () => {
    setAdditionalItems(items => [...items, {
      id: `add-${items.length + 1}`,
      categoryId: '',
      description: '',
      thickness: 0,
      width: 0,
      length: 0,
      qty: 0,
      unit: 'pcs',
      estimatedPrice: 0,
      notes: 'Item not on original PO',
      requiresApproval: true,
    }])
  }
  
  const updateAdditionalItem = (idx, field, value) => {
    setAdditionalItems(items => items.map((item, i) => {
      if (i !== idx) return item
      return { ...item, [field]: value }
    }))
  }
  
  const removeAdditionalItem = (idx) => {
    setAdditionalItems(items => items.filter((_, i) => i !== idx))
  }
  
  // ============================================
  // REJECT ITEM WORKFLOW
  // ============================================
  
  const openRejectModal = (itemIdx) => {
    setRejectingItem(itemIdx)
    setShowRejectModal(true)
  }
  
  const handleRejectConfirm = (rejectionData) => {
    if (rejectingItem !== null) {
      setReceiptItems(items => items.map((item, idx) => {
        if (idx !== rejectingItem) return item
        return {
          ...item,
          rejectedQty: rejectionData.qty,
          rejectionReason: rejectionData.reason,
          rejectionNotes: rejectionData.notes,
          lots: item.lots.map(lot => ({
            ...lot,
            qtyToReceive: Math.max(0, lot.qtyToReceive - Math.ceil(rejectionData.qty / item.lots.length))
          }))
        }
      }))
    }
    setShowRejectModal(false)
    setRejectingItem(null)
  }
  
  // ============================================
  // CALCULATIONS
  // ============================================
  
  const getTotalReceiving = (item) => {
    return item.lots.reduce((sum, lot) => sum + (lot.qtyToReceive || 0), 0)
  }
  
  const getTotalValue = (item) => {
    const qty = getTotalReceiving(item)
    return qty * item.unitPrice * (po.exchangeRate || 1)
  }
  
  const hasVariance = (item) => {
    const totalReceiving = getTotalReceiving(item)
    if (totalReceiving !== item.remainingQty) return true
    return item.lots.some(lot => 
      lot.actualThickness !== item.orderedThickness ||
      lot.actualWidth !== item.orderedWidth ||
      lot.actualLength !== item.orderedLength
    )
  }
  
  const summaryStats = {
    totalLotsToCreate: receiptItems.reduce((sum, item) => sum + item.lots.filter(l => l.qtyToReceive > 0).length, 0) + additionalItems.filter(i => i.qty > 0).length,
    totalQtyReceiving: receiptItems.reduce((sum, item) => sum + getTotalReceiving(item), 0),
    totalQtyRejected: receiptItems.reduce((sum, item) => sum + (item.rejectedQty || 0), 0),
    totalValue: receiptItems.reduce((sum, item) => sum + getTotalValue(item), 0),
    hasVariances: receiptItems.some(hasVariance),
    hasRejections: receiptItems.some(item => item.rejectedQty > 0),
    hasAdditionalItems: additionalItems.length > 0,
  }
  
  // ============================================
  // SUBMIT HANDLER
  // ============================================
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Build lots array from all items
    const allLots = []
    
    receiptItems.forEach((item, itemIdx) => {
      item.lots.forEach((lot, lotIdx) => {
        if (lot.qtyToReceive > 0) {
          allLots.push({
            poLineId: item.poLineId,
            poLineIndex: item.poLineIndex,
            lotIndex: lotIdx,
            category: item.categoryId,
            thickness: lot.actualThickness,
            width: lot.actualWidth,
            length: lot.actualLength,
            qtyReceived: lot.qtyToReceive,
            unitPrice: item.unitPrice,
            condition: lot.condition,
            notes: lot.notes,
            isVariance: lot.actualThickness !== item.orderedThickness ||
                       lot.actualWidth !== item.orderedWidth ||
                       lot.actualLength !== item.orderedLength,
          })
        }
      })
    })
    
    // Build rejections array
    const rejections = receiptItems
      .filter(item => item.rejectedQty > 0)
      .map(item => ({
        poLineId: item.poLineId,
        category: item.categoryId,
        qtyRejected: item.rejectedQty,
        reason: item.rejectionReason,
        notes: item.rejectionNotes,
      }))
    
    onSave({
      poId: po.id,
      grnDate,
      grnNotes,
      vendorInvoiceNo,
      vendorInvoiceDate,
      receivedBy,
      items: allLots,
      rejections,
      additionalItems: additionalItems.filter(i => i.qty > 0),
      summary: summaryStats,
      requiresRevisedInvoice: summaryStats.hasRejections || summaryStats.hasVariances,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* ============================================ */}
      {/* PO HEADER INFO */}
      {/* ============================================ */}
      <div className="p-4 bg-gradient-to-r from-[#1A5276]/10 to-[#2ECC40]/10 rounded-lg border">
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'เลขที่ PO' : 'PO Number'}</div>
            <div className="font-bold text-[#1A5276] text-lg">{po.id}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</div>
            <div className="font-medium">{vendor?.name}</div>
            <div className="text-xs text-gray-400">{vendor?.initials}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ประเภท' : 'Type'}</div>
            <Badge variant={po.type === 'import' ? 'info' : 'success'}>
              {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
            </Badge>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'มูลค่า PO' : 'PO Value'}</div>
            <div className="font-bold text-[#2ECC40]">{formatCurrency(po.total)}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'สถานะ' : 'Status'}</div>
            <Badge variant="warning">{po.status}</Badge>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* GRN METADATA */}
      {/* ============================================ */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันที่รับ *' : 'Receipt Date *'}
          </label>
          <input
            type="date"
            required
            value={grnDate}
            onChange={(e) => setGrnDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เลขใบแจ้งหนี้' : 'Vendor Invoice #'}
          </label>
          <input
            type="text"
            value={vendorInvoiceNo}
            onChange={(e) => setVendorInvoiceNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="INV-XXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันที่ใบแจ้งหนี้' : 'Invoice Date'}
          </label>
          <input
            type="date"
            value={vendorInvoiceDate}
            onChange={(e) => setVendorInvoiceDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ผู้รับ' : 'Received By'}
          </label>
          <input
            type="text"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder={lang === 'th' ? 'ชื่อผู้รับ' : 'Receiver name'}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* ITEMS TO RECEIVE (With Split Lots) */}
      {/* ============================================ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">
            {lang === 'th' ? '📦 รายการรับสินค้า (แบ่งล็อตได้)' : '📦 Items to Receive (Split into Lots)'}
          </h3>
          <div className="text-sm text-gray-500">
            {lang === 'th' ? 'สามารถแบ่ง 1 รายการ PO เป็นหลายล็อตได้ หากขนาดต่างกัน' : 
             'You can split 1 PO line into multiple lots if sizes differ'}
          </div>
        </div>
        
        <div className="space-y-4">
          {receiptItems.map((item, itemIdx) => {
            const totalReceiving = getTotalReceiving(item)
            const itemHasVariance = hasVariance(item)
            const shortQty = item.remainingQty - totalReceiving - (item.rejectedQty || 0)
            
            return (
              <Card 
                key={itemIdx} 
                className={`p-4 ${
                  item.rejectedQty > 0 ? 'border-red-300 bg-red-50' :
                  itemHasVariance ? 'border-amber-300 bg-amber-50' : 
                  'border-gray-200'
                }`}
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="info" 
                      className="text-lg px-3 py-1"
                      style={{ backgroundColor: categories?.find(c => c.id === item.categoryId)?.color + '20', color: categories?.find(c => c.id === item.categoryId)?.color }}
                    >
                      {item.categoryId}
                    </Badge>
                    <div>
                      <div className="font-medium">
                        {lang === 'th' ? 'สั่ง:' : 'Ordered:'} {item.orderedThickness} × {item.orderedWidth} × {item.orderedLength} mm
                      </div>
                      <div className="text-sm text-gray-500">
                        {lang === 'th' ? 'จำนวน:' : 'Qty:'} {item.orderedQty} | 
                        {lang === 'th' ? ' รับแล้ว:' : ' Prev:' } {item.previouslyReceived} | 
                        {lang === 'th' ? ' คงเหลือ:' : ' Remain:'} <strong className="text-[#1A5276]">{item.remainingQty}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {itemHasVariance && (
                      <Badge variant="warning">⚠️ {lang === 'th' ? 'ต่างจากที่สั่ง' : 'Variance'}</Badge>
                    )}
                    {item.rejectedQty > 0 && (
                      <Badge variant="danger">❌ {lang === 'th' ? 'ปฏิเสธ' : 'Rejected'} {item.rejectedQty}</Badge>
                    )}
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => addLotToItem(itemIdx)}
                    >
                      + {lang === 'th' ? 'แบ่งล็อต' : 'Split Lot'}
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="danger"
                      onClick={() => openRejectModal(itemIdx)}
                    >
                      ❌ {lang === 'th' ? 'ปฏิเสธ' : 'Reject'}
                    </Button>
                  </div>
                </div>

                {/* Lots Table */}
                <div className="space-y-3">
                  {item.lots.map((lot, lotIdx) => {
                    const lotHasVariance = 
                      lot.actualThickness !== item.orderedThickness ||
                      lot.actualWidth !== item.orderedWidth ||
                      lot.actualLength !== item.orderedLength
                    
                    return (
                      <div 
                        key={lot.id} 
                        className={`p-3 rounded-lg ${lotHasVariance ? 'bg-amber-100 border border-amber-300' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-500">
                            {lang === 'th' ? 'ล็อต' : 'LOT'} #{lotIdx + 1}
                          </span>
                          {lotHasVariance && (
                            <span className="text-xs text-amber-600">
                              ⚠️ {lang === 'th' ? 'ขนาดต่างจากที่สั่ง' : 'Size differs from order'}
                            </span>
                          )}
                          {item.lots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLot(itemIdx, lotIdx)}
                              className="ml-auto text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕ {lang === 'th' ? 'ลบล็อตนี้' : 'Remove'}
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-6 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'จำนวน *' : 'Qty *'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={lot.qtyToReceive}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'qtyToReceive', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'หนา (T)' : 'Thick (T)'}
                              {lot.actualThickness !== item.orderedThickness && <span className="text-amber-600"> ≠{item.orderedThickness}</span>}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={lot.actualThickness}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'actualThickness', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1.5 border rounded text-sm ${lot.actualThickness !== item.orderedThickness ? 'border-amber-400 bg-amber-50' : ''}`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'กว้าง (W)' : 'Width (W)'}
                              {lot.actualWidth !== item.orderedWidth && <span className="text-amber-600"> ≠{item.orderedWidth}</span>}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={lot.actualWidth}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'actualWidth', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1.5 border rounded text-sm ${lot.actualWidth !== item.orderedWidth ? 'border-amber-400 bg-amber-50' : ''}`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'ยาว (L)' : 'Length (L)'}
                              {lot.actualLength !== item.orderedLength && <span className="text-amber-600"> ≠{item.orderedLength}</span>}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={lot.actualLength}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'actualLength', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1.5 border rounded text-sm ${lot.actualLength !== item.orderedLength ? 'border-amber-400 bg-amber-50' : ''}`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'สภาพ' : 'Condition'}
                            </label>
                            <select
                              value={lot.condition}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'condition', e.target.value)}
                              className="w-full px-2 py-1.5 border rounded text-sm"
                            >
                              <option value="good">{lang === 'th' ? 'ดี' : 'Good'}</option>
                              <option value="acceptable">{lang === 'th' ? 'พอใช้' : 'Acceptable'}</option>
                              <option value="damaged">{lang === 'th' ? 'เสียหายบางส่วน' : 'Partial Damage'}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              {lang === 'th' ? 'มูลค่า' : 'Value'}
                            </label>
                            <div className="px-2 py-1.5 bg-gray-100 rounded text-sm font-medium text-[#2ECC40]">
                              {formatCurrency(lot.qtyToReceive * item.unitPrice * (po.exchangeRate || 1))}
                            </div>
                          </div>
                        </div>
                        
                        {lotHasVariance && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={lot.notes}
                              onChange={(e) => updateLot(itemIdx, lotIdx, 'notes', e.target.value)}
                              placeholder={lang === 'th' ? 'หมายเหตุเกี่ยวกับขนาดที่ต่าง...' : 'Notes about size variance...'}
                              className="w-full px-2 py-1.5 border border-amber-300 rounded text-sm bg-amber-50"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Item Summary */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      {lang === 'th' ? 'รวมรับ:' : 'Total Receiving:'} 
                      <strong className={`ml-1 ${totalReceiving !== item.remainingQty ? 'text-amber-600' : 'text-green-600'}`}>
                        {totalReceiving}
                      </strong>
                      / {item.remainingQty}
                    </span>
                    {shortQty > 0 && (
                      <span className="text-red-500">
                        ⚠️ {lang === 'th' ? 'ขาด:' : 'Short:'} {shortQty}
                      </span>
                    )}
                    {item.rejectedQty > 0 && (
                      <span className="text-red-600">
                        ❌ {lang === 'th' ? 'ปฏิเสธ:' : 'Rejected:'} {item.rejectedQty} ({item.rejectionReason})
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-[#2ECC40]">
                    {formatCurrency(getTotalValue(item))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* ADDITIONAL ITEMS (Not on PO) */}
      {/* ============================================ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">
            {lang === 'th' ? '➕ รายการเพิ่มเติม (ไม่อยู่ใน PO)' : '➕ Additional Items (Not on PO)'}
          </h3>
          <Button type="button" size="sm" variant="outline" onClick={addAdditionalItem}>
            + {lang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
          </Button>
        </div>
        
        {additionalItems.length > 0 ? (
          <div className="space-y-3">
            {additionalItems.map((item, idx) => (
              <Card key={item.id} className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">
                    ➕ {lang === 'th' ? 'รายการเพิ่ม' : 'Additional'} #{idx + 1}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeAdditionalItem(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕ {lang === 'th' ? 'ลบ' : 'Remove'}
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</label>
                    <select
                      value={item.categoryId}
                      onChange={(e) => updateAdditionalItem(idx, 'categoryId', e.target.value)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    >
                      <option value="">--</option>
                      {rmCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.code}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">{lang === 'th' ? 'รายละเอียด' : 'Description'}</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateAdditionalItem(idx, 'description', e.target.value)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                      placeholder="e.g., Extra pieces delivered"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">T × W × L</label>
                    <div className="flex gap-1">
                      <input type="number" value={item.thickness} onChange={(e) => updateAdditionalItem(idx, 'thickness', parseFloat(e.target.value) || 0)} className="w-12 px-1 py-1 border rounded text-xs" placeholder="T" />
                      <input type="number" value={item.width} onChange={(e) => updateAdditionalItem(idx, 'width', parseFloat(e.target.value) || 0)} className="w-12 px-1 py-1 border rounded text-xs" placeholder="W" />
                      <input type="number" value={item.length} onChange={(e) => updateAdditionalItem(idx, 'length', parseFloat(e.target.value) || 0)} className="w-14 px-1 py-1 border rounded text-xs" placeholder="L" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{lang === 'th' ? 'จำนวน' : 'Qty'}</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateAdditionalItem(idx, 'qty', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{lang === 'th' ? 'ราคาประมาณ' : 'Est. Price'}</label>
                    <input
                      type="number"
                      value={item.estimatedPrice}
                      onChange={(e) => updateAdditionalItem(idx, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  ⓘ {lang === 'th' ? 'รายการนี้จะต้องได้รับการอนุมัติจากฝ่ายจัดซื้อ' : 'This item requires purchasing approval'}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400 border-2 border-dashed rounded-lg">
            {lang === 'th' ? 'ไม่มีรายการเพิ่มเติม - คลิก "+ เพิ่มรายการ" หากพบสินค้าที่ไม่อยู่ใน PO' : 
             'No additional items - Click "+ Add Item" if you find items not on PO'}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* NOTES */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'หมายเหตุการรับ' : 'Receipt Notes'}
        </label>
        <textarea
          value={grnNotes}
          onChange={(e) => setGrnNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder={lang === 'th' ? 'หมายเหตุเพิ่มเติม...' : 'Additional notes...'}
        />
      </div>

      {/* ============================================ */}
      {/* SUMMARY */}
      {/* ============================================ */}
      <div className={`p-4 rounded-lg border ${
        summaryStats.hasRejections ? 'bg-red-50 border-red-200' :
        summaryStats.hasVariances ? 'bg-amber-50 border-amber-200' :
        'bg-green-50 border-green-200'
      }`}>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">{lang === 'th' ? 'ล็อตที่จะสร้าง' : 'Lots to Create'}</div>
            <div className="text-2xl font-bold text-[#1A5276]">{summaryStats.totalLotsToCreate}</div>
          </div>
          <div>
            <div className="text-gray-600">{lang === 'th' ? 'จำนวนรับ' : 'Qty Receiving'}</div>
            <div className="text-2xl font-bold text-green-600">{formatNumber(summaryStats.totalQtyReceiving)}</div>
          </div>
          <div>
            <div className="text-gray-600">{lang === 'th' ? 'จำนวนปฏิเสธ' : 'Qty Rejected'}</div>
            <div className="text-2xl font-bold text-red-600">{formatNumber(summaryStats.totalQtyRejected)}</div>
          </div>
          <div>
            <div className="text-gray-600">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
            <div className="text-2xl font-bold text-[#2ECC40]">{formatCurrency(summaryStats.totalValue)}</div>
          </div>
        </div>
        
        {/* Warnings */}
        {(summaryStats.hasVariances || summaryStats.hasRejections || summaryStats.hasAdditionalItems) && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {summaryStats.hasVariances && (
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {lang === 'th' ? 'มีความแตกต่างจากที่สั่ง - อาจต้องแก้ไขใบแจ้งหนี้' : 'Has variances - May require invoice revision'}
              </div>
            )}
            {summaryStats.hasRejections && (
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <X className="w-4 h-4" />
                {lang === 'th' ? 'มีรายการปฏิเสธ - จะสร้าง Credit Note อัตโนมัติ' : 'Has rejections - Credit Note will be generated'}
              </div>
            )}
            {summaryStats.hasAdditionalItems && (
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Plus className="w-4 h-4" />
                {lang === 'th' ? 'มีรายการเพิ่มเติม - ต้องอนุมัติจากฝ่ายจัดซื้อ' : 'Has additional items - Requires purchasing approval'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* ACTIONS */}
      {/* ============================================ */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          {lang === 'th' ? 'ระบบจะสร้างล็อตและฉลากอัตโนมัติตามขนาดจริง' : 
           'System will auto-generate lots and labels based on actual sizes'}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Button>
          <Button type="submit" icon={Save}>
            {lang === 'th' ? 'ยืนยันรับสินค้า' : 'Confirm Receipt'}
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* REJECTION MODAL */}
      {/* ============================================ */}
      {showRejectModal && rejectingItem !== null && (
        <RejectionModal
          isOpen={showRejectModal}
          onClose={() => { setShowRejectModal(false); setRejectingItem(null); }}
          item={receiptItems[rejectingItem]}
          lang={lang}
          onConfirm={handleRejectConfirm}
        />
      )}
    </form>
  )
}

// ============================================
// REJECTION MODAL
// ============================================
const RejectionModal = ({ isOpen, onClose, item, lang, onConfirm }) => {
  const [rejectQty, setRejectQty] = useState(item.remainingQty)
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({
      qty: rejectQty,
      reason,
      notes,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b bg-red-50 rounded-t-xl">
          <h3 className="font-bold text-red-800 flex items-center gap-2">
            <X className="w-5 h-5" />
            {lang === 'th' ? 'ปฏิเสธรับสินค้า' : 'Reject Items'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="font-medium">{item.categoryId} - {item.orderedThickness}×{item.orderedWidth}×{item.orderedLength}</div>
            <div className="text-gray-500">{lang === 'th' ? 'คงเหลือรับ:' : 'Remaining:'} {item.remainingQty}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'จำนวนที่ปฏิเสธ *' : 'Quantity to Reject *'}
            </label>
            <input
              type="number"
              required
              min="1"
              max={item.remainingQty}
              value={rejectQty}
              onChange={(e) => setRejectQty(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'เหตุผล *' : 'Reason *'}
            </label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">{lang === 'th' ? '-- เลือกเหตุผล --' : '-- Select Reason --'}</option>
              {REJECTION_REASONS.map(r => (
                <option key={r.id} value={r.id}>
                  {lang === 'th' ? r.labelTh : r.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional Details'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder={lang === 'th' ? 'ระบุรายละเอียด...' : 'Describe the issue...'}
            />
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ {lang === 'th' 
              ? 'การปฏิเสธจะสร้าง Credit Note และแจ้งให้ผู้ขายส่งใบแจ้งหนี้แก้ไข' 
              : 'Rejection will generate a Credit Note and notify vendor for revised invoice'}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button type="submit" variant="danger" icon={X}>
              {lang === 'th' ? 'ยืนยันปฏิเสธ' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// SMART DOCUMENT UPLOAD - MANUAL ENTRY MODE
// (Replaces fake OCR with proper manual entry)
// ============================================
const SmartDocumentUploadModalEnhanced = ({ isOpen, onClose, module, lang, onProcessed, categories, vendors }) => {
  const [mode, setMode] = useState('select') // select, upload, manual
  const [docType, setDocType] = useState('')
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    vendor: '',
    vendorId: '',
    invoiceNo: '',
    invoiceDate: '',
    items: [{ description: '', qty: 0, unit: 'pcs', unitPrice: 0, total: 0, category: '' }],
    subtotal: 0,
    vat: 0,
    total: 0,
  })
  const inputRef = useRef(null)
  
  const rmCategories = categories?.filter(c => c.type === 'raw_material') || []

  const documentTypes = {
    purchase: [
      { id: 'vendor_invoice', name: 'Vendor Invoice', nameTh: 'ใบแจ้งหนี้ผู้ขาย', icon: FileText },
      { id: 'delivery_note', name: 'Delivery Note', nameTh: 'ใบส่งของ', icon: Truck },
      { id: 'quotation', name: 'Quotation', nameTh: 'ใบเสนอราคา', icon: FileText },
      { id: 'import_docs', name: 'Import Documents', nameTh: 'เอกสารนำเข้า', icon: FileUp },
    ],
    inventory: [
      { id: 'stock_count', name: 'Stock Count Sheet', nameTh: 'ใบนับสต็อก', icon: ClipboardList },
      { id: 'transfer_note', name: 'Transfer Note', nameTh: 'ใบโอนย้าย', icon: ArrowRight },
    ],
    sales: [
      { id: 'customer_po', name: 'Customer PO', nameTh: 'ใบสั่งซื้อลูกค้า', icon: FileText },
    ],
  }

  const resetModal = () => {
    setMode('select')
    setDocType('')
    setFile(null)
    setFormData({
      vendor: '',
      vendorId: '',
      invoiceNo: '',
      invoiceDate: '',
      items: [{ description: '', qty: 0, unit: 'pcs', unitPrice: 0, total: 0, category: '' }],
      subtotal: 0,
      vat: 0,
      total: 0,
    })
  }

  const handleSelectDocType = (type) => {
    setDocType(type)
    setMode('upload')
  }

  const handleFileUpload = (f) => {
    setFile(f)
    setMode('manual')
  }

  const handleSkipUpload = () => {
    setMode('manual')
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', qty: 0, unit: 'pcs', unitPrice: 0, total: 0, category: '' }]
    }))
  }

  const updateItem = (idx, field, value) => {
    setFormData(prev => {
      const newItems = prev.items.map((item, i) => {
        if (i !== idx) return item
        const updated = { ...item, [field]: value }
        if (field === 'qty' || field === 'unitPrice') {
          updated.total = (updated.qty || 0) * (updated.unitPrice || 0)
        }
        return updated
      })
      const subtotal = newItems.reduce((sum, i) => sum + (i.total || 0), 0)
      const vat = subtotal * 0.07
      return {
        ...prev,
        items: newItems,
        subtotal,
        vat,
        total: subtotal + vat,
      }
    })
  }

  const removeItem = (idx) => {
    if (formData.items.length <= 1) return
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== idx)
      const subtotal = newItems.reduce((sum, i) => sum + (i.total || 0), 0)
      const vat = subtotal * 0.07
      return {
        ...prev,
        items: newItems,
        subtotal,
        vat,
        total: subtotal + vat,
      }
    })
  }

  const handleVendorChange = (vendorId) => {
    const vendor = vendors?.find(v => v.id === vendorId)
    setFormData(prev => ({
      ...prev,
      vendorId,
      vendor: vendor?.name || '',
    }))
  }

  const handleConfirm = () => {
    if (onProcessed) {
      onProcessed({
        docType,
        ...formData,
        file: file?.name,
        processedAt: new Date().toISOString(),
        entryMethod: 'manual',
      })
    }
    onClose()
    resetModal()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetModal(); }} title={lang === 'th' ? 'อัพโหลด/กรอกเอกสาร' : 'Upload/Enter Document'} size="lg">
      
      {/* STAGE: SELECT DOCUMENT TYPE */}
      {mode === 'select' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">
              {lang === 'th' ? 'เลือกประเภทเอกสาร' : 'Select Document Type'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(documentTypes[module] || documentTypes.purchase).map(dt => (
                <button
                  key={dt.id}
                  onClick={() => handleSelectDocType(dt.id)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-[#1A5276] hover:bg-gray-50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1A5276]/10 flex items-center justify-center">
                    <dt.icon className="w-5 h-5 text-[#1A5276]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{dt.name}</div>
                    <div className="text-sm text-gray-500">{dt.nameTh}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE: UPLOAD OR SKIP */}
      {mode === 'upload' && (
        <div className="space-y-6">
          <div className="text-center">
            <Badge variant="info" className="mb-4">{docType}</Badge>
          </div>
          
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#1A5276] hover:bg-gray-50 transition-all"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1A5276]/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#1A5276]" />
            </div>
            <p className="text-gray-600 font-medium">
              {lang === 'th' ? 'คลิกเพื่อเลือกไฟล์' : 'Click to select file'}
            </p>
            <p className="text-sm text-gray-400 mt-1">PDF, JPG, PNG, Excel</p>
          </div>

          <div className="text-center">
            <span className="text-gray-400">{lang === 'th' ? 'หรือ' : 'or'}</span>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSkipUpload}
            icon={Edit}
          >
            {lang === 'th' ? 'กรอกข้อมูลด้วยตนเอง (ไม่มีไฟล์)' : 'Enter Data Manually (No File)'}
          </Button>

          <Button variant="secondary" onClick={() => setMode('select')}>
            ← {lang === 'th' ? 'กลับ' : 'Back'}
          </Button>
        </div>
      )}

      {/* STAGE: MANUAL ENTRY */}
      {mode === 'manual' && (
        <div className="space-y-6">
          {file && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-green-800">{file.name}</div>
                <div className="text-xs text-green-600">{lang === 'th' ? 'ไฟล์แนบ - กรอกข้อมูลจากเอกสาร' : 'File attached - Enter data from document'}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'ผู้ขาย *' : 'Vendor *'}
              </label>
              <select
                value={formData.vendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">{lang === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                {vendors?.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'เลขที่ใบแจ้งหนี้ *' : 'Invoice No. *'}
              </label>
              <input
                type="text"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="INV-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'วันที่' : 'Date'}
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {lang === 'th' ? 'รายการสินค้า' : 'Items'}
              </label>
              <Button type="button" size="sm" variant="outline" onClick={addItem}>
                + {lang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">{lang === 'th' ? 'หมวดหมู่' : 'Cat'}</th>
                    <th className="px-3 py-2 text-left">{lang === 'th' ? 'รายละเอียด' : 'Description'}</th>
                    <th className="px-3 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                    <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคา' : 'Price'}</th>
                    <th className="px-3 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(idx, 'category', e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-sm"
                        >
                          <option value="">--</option>
                          {rmCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.code}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="e.g., MLH 50x100x2400"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.qty || ''}
                          onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice || ''}
                          onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-3 py-2">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-3 py-2 text-right">{lang === 'th' ? 'ยอดรวม' : 'Subtotal'}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(formData.subtotal)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="px-3 py-2 text-right">VAT 7%</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(formData.vat)}</td>
                    <td></td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan="4" className="px-3 py-2 text-right">{lang === 'th' ? 'รวมทั้งสิ้น' : 'Total'}</td>
                    <td className="px-3 py-2 text-right text-[#2ECC40]">{formatCurrency(formData.total)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="secondary" onClick={() => setMode('upload')}>
              ← {lang === 'th' ? 'กลับ' : 'Back'}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { onClose(); resetModal(); }}>
                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </Button>
              <Button onClick={handleConfirm} icon={CheckCircle}>
                {lang === 'th' ? 'ยืนยันข้อมูล' : 'Confirm Data'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount || 0)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('th-TH').format(num || 0)
}

// ============================================
// EXPORTS
// ============================================
export {
  GoodsReceiptFormEnhanced,
  RejectionModal,
  SmartDocumentUploadModalEnhanced,
  REJECTION_REASONS,
  GRN_STATUS,
}
