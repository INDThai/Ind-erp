import React, { useState, useEffect, createContext, useContext } from 'react'
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
  Languages, Check, AlertCircle, Info, HelpCircle, ExternalLink
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
// LANGUAGE SYSTEM (6 Languages)
// ============================================
const LanguageContext = createContext()

const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
  th: { name: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  my: { name: 'မြန်မာ', flag: '🇲🇲', dir: 'ltr' },
  kh: { name: 'ខ្មែរ', flag: '🇰🇭', dir: 'ltr' },
  zh: { name: '中文', flag: '🇨🇳', dir: 'ltr' },
  jp: { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
}

const TRANSLATIONS = {
  // Common
  'app.title': {
    en: 'IND Thai Packwell',
    th: 'IND ไทย แพ็คเวลล์',
    my: 'IND ထိုင်း ပက်ခ်ဝဲလ်',
    kh: 'IND ថៃ ផែកវែល',
    zh: 'IND 泰国包装',
    jp: 'IND タイパックウェル',
  },
  'app.subtitle': {
    en: 'Enterprise Resource Planning',
    th: 'ระบบบริหารจัดการองค์กร',
    my: 'လုပ်ငန်းရင်းမြစ်စီမံခန့်ခွဲမှု',
    kh: 'ការគ្រប់គ្រងធនធានសហគ្រាស',
    zh: '企业资源规划',
    jp: '企業資源計画',
  },
  'nav.dashboard': {
    en: 'Dashboard', th: 'แดชบอร์ด', my: 'ဒက်ရှ်ဘုတ်', kh: 'ផ្ទាំងគ្រប់គ្រង', zh: '仪表板', jp: 'ダッシュボード'
  },
  'nav.admin': {
    en: 'Admin Hub', th: 'ศูนย์จัดการ', my: 'စီမံခန့်ခွဲမှုဗဟို', kh: 'មជ្ឈមណ្ឌលគ្រប់គ្រង', zh: '管理中心', jp: '管理ハブ'
  },
  'nav.inventory': {
    en: 'Inventory', th: 'คลังสินค้า', my: 'စတော့', kh: 'ស្តុក', zh: '库存', jp: '在庫'
  },
  'nav.purchase': {
    en: 'Purchase', th: 'จัดซื้อ', my: 'ဝယ်ယူရေး', kh: 'ការទិញ', zh: '采购', jp: '購買'
  },
  'nav.production': {
    en: 'Production', th: 'การผลิต', my: 'ထုတ်လုပ်ရေး', kh: 'ផលិតកម្ម', zh: '生产', jp: '生産'
  },
  'nav.sales': {
    en: 'Sales', th: 'ขาย', my: 'ရောင်းချရေး', kh: 'ការលក់', zh: '销售', jp: '販売'
  },
  'nav.reports': {
    en: 'Reports', th: 'รายงาน', my: 'အစီရင်ခံစာများ', kh: 'របាយការណ៍', zh: '报告', jp: 'レポート'
  },
  // Admin
  'admin.stores': {
    en: 'Store Builder', th: 'จัดการคลัง', my: 'စတိုးတည်ဆောက်သူ', kh: 'អ្នកសាងសង់ហាង', zh: '仓库管理', jp: '倉庫管理'
  },
  'admin.categories': {
    en: 'Categories', th: 'หมวดหมู่', my: 'အမျိုးအစားများ', kh: 'ប្រភេទ', zh: '类别', jp: 'カテゴリー'
  },
  'admin.materials': {
    en: 'Material Types', th: 'ประเภทวัสดุ', my: 'ပစ္စည်းအမျိုးအစားများ', kh: 'ប្រភេទសម្ភារៈ', zh: '材料类型', jp: '材料タイプ'
  },
  'admin.customers': {
    en: 'Customers', th: 'ลูกค้า', my: 'ဖောက်သည်များ', kh: 'អតិថិជន', zh: '客户', jp: '顧客'
  },
  'admin.vendors': {
    en: 'Vendors', th: 'ผู้ขาย', my: 'ရောင်းချသူများ', kh: 'អ្នកលក់', zh: '供应商', jp: 'ベンダー'
  },
  'admin.users': {
    en: 'Users & Roles', th: 'ผู้ใช้และบทบาท', my: 'အသုံးပြုသူများနှင့်အခန်းကဏ္ဍများ', kh: 'អ្នកប្រើប្រាស់និងតួនាទី', zh: '用户与角色', jp: 'ユーザーと役割'
  },
  // Inventory
  'inventory.title': {
    en: 'Inventory Management', th: 'จัดการคลังสินค้า', my: 'စတော့စီမံခန့်ခွဲမှု', kh: 'ការគ្រប់គ្រងស្តុក', zh: '库存管理', jp: '在庫管理'
  },
  'inventory.totalValue': {
    en: 'Total Value', th: 'มูลค่ารวม', my: 'စုစုပေါင်းတန်ဖိုး', kh: 'តម្លៃសរុប', zh: '总价值', jp: '総価値'
  },
  'inventory.totalLots': {
    en: 'Total Lots', th: 'ล็อตทั้งหมด', my: 'စုစုပေါင်းလော့များ', kh: 'ឡូតសរុប', zh: '总批次', jp: '総ロット'
  },
  'inventory.lowStock': {
    en: 'Low Stock', th: 'สต็อกต่ำ', my: 'စတော့နည်း', kh: 'ស្តុកទាប', zh: '库存不足', jp: '在庫少'
  },
  // Actions
  'action.save': {
    en: 'Save', th: 'บันทึก', my: 'သိမ်းဆည်းမည်', kh: 'រក្សាទុក', zh: '保存', jp: '保存'
  },
  'action.cancel': {
    en: 'Cancel', th: 'ยกเลิก', my: 'ပယ်ဖျက်မည်', kh: 'បោះបង់', zh: '取消', jp: 'キャンセル'
  },
  'action.add': {
    en: 'Add New', th: 'เพิ่มใหม่', my: 'အသစ်ထည့်မည်', kh: 'បន្ថែមថ្មី', zh: '新增', jp: '新規追加'
  },
  'action.edit': {
    en: 'Edit', th: 'แก้ไข', my: 'ပြင်ဆင်မည်', kh: 'កែសម្រួល', zh: '编辑', jp: '編集'
  },
  'action.delete': {
    en: 'Delete', th: 'ลบ', my: 'ဖျက်မည်', kh: 'លុប', zh: '删除', jp: '削除'
  },
  'action.search': {
    en: 'Search...', th: 'ค้นหา...', my: 'ရှာဖွေရန်...', kh: 'ស្វែងរក...', zh: '搜索...', jp: '検索...'
  },
  // Branch
  'branch.ind': {
    en: 'IND Main', th: 'IND หลัก', my: 'IND အဓိက', kh: 'IND មេ', zh: 'IND 主', jp: 'IND メイン'
  },
  'branch.ind2': {
    en: 'IND-2 Ply', th: 'IND-2 ไม้อัด', my: 'IND-2 ပလိုင်း', kh: 'IND-2 ផ្លាយ', zh: 'IND-2 胶合板', jp: 'IND-2 合板'
  },
}

const t = (key, lang) => TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['en'] || key

// ============================================
// INITIAL DATA (Configurable by Staff)
// ============================================
const INITIAL_STORES = [
  { id: 'STORE1', code: 'STORE1', nameEn: 'RM Wood', nameTh: 'คลังวัตถุดิบไม้', type: 'raw_material', branch: 'IND', categories: ['MLH', 'PW', 'PWKD', 'PWGRN', 'PRTB', 'PLYWW', 'PLYRR', 'PLYRW'], isActive: true, itemCount: 658, value: 2450000 },
  { id: 'STORE2', code: 'STORE2', nameEn: 'IND 2 Ply', nameTh: 'คลังไม้อัด IND-2', type: 'branch_stock', branch: 'IND-2', categories: ['PLYWW', 'PLYRR', 'PLYRW'], isActive: true, itemCount: 234, value: 680000 },
  { id: 'STORE3', code: 'STORE3', nameEn: 'Consumables', nameTh: 'คลังวัสดุสิ้นเปลือง', type: 'consumables', branch: 'IND', categories: ['CONS'], isActive: true, itemCount: 145, value: 145000 },
  { id: 'STORE4', code: 'STORE4', nameEn: 'Office', nameTh: 'คลังเครื่องเขียน', type: 'office', branch: 'IND', categories: ['OFFICE'], isActive: true, itemCount: 85, value: 25000 },
  { id: 'STORE5', code: 'STORE5', nameEn: 'Maintenance', nameTh: 'คลังอะไหล่', type: 'maintenance', branch: 'IND', categories: ['MAINT'], isActive: true, itemCount: 320, value: 320000 },
  { id: 'STORE6', code: 'STORE6', nameEn: 'Finished FG', nameTh: 'คลังสินค้าสำเร็จรูป', type: 'finished_goods', branch: 'IND', categories: ['FG'], isActive: true, itemCount: 1250, value: 1250000 },
]

const INITIAL_CATEGORIES = [
  // Raw Material - Wood Types (8 categories)
  // MLH = Yellow
  { id: 'MLH', code: 'MLH', nameEn: 'Mixed Hardwood', nameTh: 'ไม้เนื้อแข็งผสม', color: '#F1C40F', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  // PW Family = Shades of Green
  { id: 'PW', code: 'PW', nameEn: 'Pine Wood', nameTh: 'ไม้สน', color: '#27AE60', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PWKD', code: 'PWKD', nameEn: 'Pine Wood Kiln Dried', nameTh: 'ไม้สนอบแห้ง', color: '#1E8449', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PWGRN', code: 'PWGRN', nameEn: 'Pine Wood Green', nameTh: 'ไม้สนสด', color: '#58D68D', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  // PLY Family = Shades of Blue
  { id: 'PLYWW', code: 'PLYWW', nameEn: 'Plywood White-White', nameTh: 'ไม้อัดขาว-ขาว', color: '#5DADE2', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PLYRR', code: 'PLYRR', nameEn: 'Plywood Red-Red', nameTh: 'ไม้อัดแดง-แดง', color: '#2E86C1', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PLYRW', code: 'PLYRW', nameEn: 'Plywood Red-White', nameTh: 'ไม้อัดแดง-ขาว', color: '#1A5276', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  // PRTB = Dark Salmon
  { id: 'PRTB', code: 'PRTB', nameEn: 'Particle Board', nameTh: 'ไม้ปาร์ติเกิล', color: '#E9967A', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  // Other Categories
  { id: 'CONS', code: 'CONS', nameEn: 'Consumables', nameTh: 'วัสดุสิ้นเปลือง', color: '#708090', costMethod: 'AVG', isActive: true, type: 'consumables' },
  { id: 'FG', code: 'FG', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป', color: '#2ECC40', costMethod: 'STD', isActive: true, type: 'finished_goods' },
  { id: 'OFFICE', code: 'OFFICE', nameEn: 'Office Supplies', nameTh: 'เครื่องเขียนสำนักงาน', color: '#9B59B6', costMethod: 'AVG', isActive: true, type: 'office' },
  { id: 'MAINT', code: 'MAINT', nameEn: 'Maintenance Parts', nameTh: 'อะไหล่ซ่อมบำรุง', color: '#E67E22', costMethod: 'AVG', isActive: true, type: 'maintenance' },
]

const INITIAL_INVENTORY = [
  // MLH - Mixed Hardwood (Yellow)
  { id: 1, lotNo: 'LP21499', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 700, cbm: 0.859, cost: 4218, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 2, lotNo: 'LP21500', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 650, cbm: 0.797, cost: 3914, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 3, lotNo: 'LP21501', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 45, cbm: 0.055, cost: 271, costPerCbm: 4912, status: 'low', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 4, lotNo: 'LP20044', category: 'MLH', code: 'IND-MLH/0.5/3.4/1.3', store: 'STORE1', qty: 241, cbm: 0.344, cost: 1689, costPerCbm: 4912, status: 'available', dateIn: '2024-05-25', vendor: 'Green Wood' },
  { id: 5, lotNo: 'LP19507', category: 'MLH', code: 'IND-MLH/0.5/3.8/1.3', store: 'STORE1', qty: 254, cbm: 0.405, cost: 1990, costPerCbm: 4912, status: 'available', dateIn: '2024-04-30', vendor: 'Premium Lumber' },
  // PW - Pine Wood (Green)
  { id: 6, lotNo: 'PW-2401', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 128, cbm: 2.87, cost: 8500, costPerCbm: 2962, status: 'low', dateIn: '2024-06-15', vendor: 'Pine Supply Co' },
  { id: 7, lotNo: 'PW-2402', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 350, cbm: 7.84, cost: 23200, costPerCbm: 2962, status: 'available', dateIn: '2024-06-20', vendor: 'Pine Supply Co' },
  // PWKD - Pine Wood Kiln Dried (Dark Green)
  { id: 8, lotNo: 'PWKD-001', category: 'PWKD', code: 'IND-PWKD/40/100/4000', store: 'STORE1', qty: 200, cbm: 3.2, cost: 12800, costPerCbm: 4000, status: 'available', dateIn: '2024-07-10', vendor: 'Kiln Dry Masters' },
  { id: 9, lotNo: 'PWKD-002', category: 'PWKD', code: 'IND-PWKD/38/95/3800', store: 'STORE1', qty: 180, cbm: 2.6, cost: 10400, costPerCbm: 4000, status: 'available', dateIn: '2024-07-12', vendor: 'Kiln Dry Masters' },
  // PWGRN - Pine Wood Green (Light Green)
  { id: 10, lotNo: 'PWGRN-001', category: 'PWGRN', code: 'IND-PWGRN/38/140/3900', store: 'STORE1', qty: 450, cbm: 9.35, cost: 18700, costPerCbm: 2000, status: 'available', dateIn: '2024-07-08', vendor: 'Green Pine Ltd' },
  { id: 11, lotNo: 'PWGRN-002', category: 'PWGRN', code: 'IND-PWGRN/40/150/4000', store: 'STORE1', qty: 320, cbm: 7.68, cost: 15360, costPerCbm: 2000, status: 'available', dateIn: '2024-07-15', vendor: 'Green Pine Ltd' },
  // PLYWW - Plywood White-White (Light Blue) - IND-2 Branch uses IND2- prefix
  { id: 12, lotNo: 'PLYWW-001', category: 'PLYWW', code: 'IND2-PLYWW/12/1220/2440', store: 'STORE2', qty: 150, cbm: 5.34, cost: 45000, costPerCbm: 8427, status: 'available', dateIn: '2024-07-01', vendor: 'IND-2 Production' },
  { id: 13, lotNo: 'PLYWW-002', category: 'PLYWW', code: 'IND2-PLYWW/18/1220/2440', store: 'STORE2', qty: 80, cbm: 4.27, cost: 42000, costPerCbm: 9836, status: 'available', dateIn: '2024-07-05', vendor: 'IND-2 Production' },
  // PLYWW bought from external vendor - stored in main RM Wood (IND- prefix)
  { id: 14, lotNo: 'PLYWW-EXT-001', category: 'PLYWW', code: 'IND-PLYWW/12/1220/2440', store: 'STORE1', qty: 50, cbm: 1.78, cost: 16000, costPerCbm: 8989, status: 'available', dateIn: '2024-07-18', vendor: 'External Ply Co' },
  // PLYRR - Plywood Red-Red (Medium Blue) - IND-2 Branch
  { id: 15, lotNo: 'PLYRR-001', category: 'PLYRR', code: 'IND2-PLYRR/15/1220/2440', store: 'STORE2', qty: 100, cbm: 4.46, cost: 52000, costPerCbm: 11659, status: 'available', dateIn: '2024-07-02', vendor: 'IND-2 Production' },
  { id: 16, lotNo: 'PLYRR-002', category: 'PLYRR', code: 'IND2-PLYRR/12/1220/2440', store: 'STORE2', qty: 65, cbm: 2.31, cost: 27500, costPerCbm: 11905, status: 'low', dateIn: '2024-07-08', vendor: 'IND-2 Production' },
  // PLYRW - Plywood Red-White (Dark Blue) - IND-2 Branch
  { id: 17, lotNo: 'PLYRW-001', category: 'PLYRW', code: 'IND2-PLYRW/12/1220/2440', store: 'STORE2', qty: 120, cbm: 4.27, cost: 38000, costPerCbm: 8900, status: 'available', dateIn: '2024-07-03', vendor: 'IND-2 Production' },
  { id: 18, lotNo: 'PLYRW-002', category: 'PLYRW', code: 'IND2-PLYRW/15/1220/2440', store: 'STORE2', qty: 90, cbm: 4.01, cost: 36000, costPerCbm: 8978, status: 'available', dateIn: '2024-07-10', vendor: 'IND-2 Production' },
  // PRTB - Particle Board (Dark Salmon)
  { id: 19, lotNo: 'PRTB-001', category: 'PRTB', code: 'IND-PRTB/9/70/2440', store: 'STORE1', qty: 500, cbm: 0.77, cost: 3500, costPerCbm: 4545, status: 'available', dateIn: '2024-07-10', vendor: 'Board Co' },
  { id: 20, lotNo: 'PRTB-002', category: 'PRTB', code: 'IND-PRTB/12/100/2440', store: 'STORE1', qty: 300, cbm: 0.88, cost: 4200, costPerCbm: 4773, status: 'available', dateIn: '2024-07-12', vendor: 'Board Co' },
]

const INITIAL_CUSTOMERS = [
  { id: 'FRKW-001', code: 'FRKW-001', name: 'Furukawa', paymentTerms: 30, taxId: '0105540069331', email: 'cholnapa_furukawa@hotmail.com', language: 'jp', isActive: true },
  { id: 'PLX-002', code: 'PLX-002', name: 'Polyplex', paymentTerms: 30, taxId: '0205556010518', email: 'vthongkhumsan@polyplex.com', language: 'en', isActive: true },
  { id: 'SHN-004', code: 'SHN-004', name: 'Shin Steel', paymentTerms: 60, taxId: '020555601518', email: 'thunyarut@shin-steel.com', language: 'th', isActive: true },
  { id: 'DNH-009', code: 'DNH-009', name: 'DingHeng', paymentTerms: 60, taxId: '0215561007643', email: '', language: 'zh', isActive: true },
  { id: 'HNG-012', code: 'HNG-012', name: 'Honglin', paymentTerms: 60, taxId: '0105562005611', email: 'pur01@honglinpowertech.com', language: 'zh', isActive: true },
  { id: 'LGN-007', code: 'LGN-007', name: 'Logisnext', paymentTerms: 30, taxId: '0205554019305', email: 'suwimol_nuengjamnong@logisnext.com', language: 'jp', isActive: true },
]

const STORE_TYPES = [
  { id: 'raw_material', nameEn: 'Raw Material', nameTh: 'วัตถุดิบ' },
  { id: 'finished_goods', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป' },
  { id: 'consumables', nameEn: 'Consumables', nameTh: 'วัสดุสิ้นเปลือง' },
  { id: 'office', nameEn: 'Office', nameTh: 'เครื่องเขียน' },
  { id: 'maintenance', nameEn: 'Maintenance', nameTh: 'อะไหล่' },
  { id: 'branch_stock', nameEn: 'Branch Stock', nameTh: 'สต็อกสาขา' },
]

// ============================================
// UTILITY COMPONENTS
// ============================================
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `฿${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `฿${(amount / 1000).toFixed(0)}K`
  return `฿${amount.toLocaleString()}`
}

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    ind: 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white',
    ind2: 'bg-gradient-to-r from-[#5DADE2] to-[#2ECC40] text-white',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white hover:opacity-90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    outline: 'border-2 border-[#1A5276] text-[#1A5276] hover:bg-[#1A5276] hover:text-white',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
  >
    {children}
  </div>
)

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1A5276] to-[#2ECC40]">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// LANGUAGE SWITCHER
// ============================================
const LanguageSwitcher = () => {
  const { lang, setLang } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
      >
        <span className="text-lg">{LANGUAGES[lang].flag}</span>
        <span className="text-sm text-white">{LANGUAGES[lang].name}</span>
        <ChevronDown className="w-4 h-4 text-white/70" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50 min-w-[160px]">
          <div className="p-2 border-b bg-gray-50">
            <span className="text-xs text-gray-500 font-medium">Internal</span>
          </div>
          {['en', 'th', 'my', 'kh'].map(code => (
            <button
              key={code}
              onClick={() => { setLang(code); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${lang === code ? 'bg-blue-50' : ''}`}
            >
              <span className="text-lg">{LANGUAGES[code].flag}</span>
              <span className="text-sm">{LANGUAGES[code].name}</span>
              {lang === code && <Check className="w-4 h-4 text-green-500 ml-auto" />}
            </button>
          ))}
          <div className="p-2 border-t border-b bg-gray-50">
            <span className="text-xs text-gray-500 font-medium">Customer</span>
          </div>
          {['zh', 'jp'].map(code => (
            <button
              key={code}
              onClick={() => { setLang(code); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${lang === code ? 'bg-blue-50' : ''}`}
            >
              <span className="text-lg">{LANGUAGES[code].flag}</span>
              <span className="text-sm">{LANGUAGES[code].name}</span>
              {lang === code && <Check className="w-4 h-4 text-green-500 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// ADMIN HUB - STORE BUILDER
// ============================================
const StoreBuilder = ({ stores, setStores, categories, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredStores = stores.filter(s => {
    const matchesSearch = s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.nameTh.includes(searchTerm) ||
                         s.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || s.type === filterType
    return matchesSearch && matchesType
  })

  const handleSave = (storeData) => {
    if (editingStore) {
      setStores(stores.map(s => s.id === editingStore.id ? { ...s, ...storeData } : s))
    } else {
      const newId = `STORE${stores.length + 1}`
      setStores([...stores, { ...storeData, id: newId, code: newId, itemCount: 0, value: 0 }])
    }
    setIsModalOpen(false)
    setEditingStore(null)
  }

  const handleEdit = (store) => {
    setEditingStore(store)
    setIsModalOpen(true)
  }

  const handleDeactivate = (storeId) => {
    setStores(stores.map(s => s.id === storeId ? { ...s, isActive: !s.isActive } : s))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.stores', lang)}</h1>
          <p className="text-gray-500">Manage warehouse and storage locations</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingStore(null); setIsModalOpen(true) }}>
          {t('action.add', lang)}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('action.search', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
        >
          <option value="all">All Types</option>
          {STORE_TYPES.map(type => (
            <option key={type.id} value={type.id}>{type.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map(store => (
          <Card key={store.id} className={`p-5 ${!store.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${store.branch === 'IND-2' ? 'bg-gradient-to-br from-[#5DADE2] to-[#2ECC40]' : 'bg-gradient-to-br from-[#1A5276] to-[#2ECC40]'}`}>
                  <Warehouse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{store.code}</div>
                  <Badge variant={store.branch === 'IND-2' ? 'ind2' : 'ind'}>{store.branch}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(store)} className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeactivate(store.id)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-gray-100 rounded">
                  {store.isActive ? <Eye className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="font-medium text-gray-800">{store.nameEn}</div>
              <div className="text-sm text-gray-500">{store.nameTh}</div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="default">{STORE_TYPES.find(t => t.id === store.type)?.nameEn}</Badge>
              {store.categories.map(cat => (
                <Badge key={cat} variant="info">{cat}</Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div>
                <div className="text-sm text-gray-500">Items</div>
                <div className="font-bold text-gray-800">{store.itemCount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Value</div>
                <div className="font-bold text-[#2ECC40]">{formatCurrency(store.value)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingStore(null) }}
        title={editingStore ? 'Edit Store' : 'Add New Store'}
        size="md"
      >
        <StoreForm
          store={editingStore}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingStore(null) }}
          lang={lang}
        />
      </Modal>
    </div>
  )
}

const StoreForm = ({ store, categories, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    nameEn: store?.nameEn || '',
    nameTh: store?.nameTh || '',
    type: store?.type || 'raw_material',
    branch: store?.branch || 'IND',
    categories: store?.categories || [],
    isActive: store?.isActive ?? true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const toggleCategory = (catId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (Thai)</label>
          <input
            type="text"
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Type *</label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            {STORE_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
          <select
            required
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            <option value="IND">IND (Main)</option>
            <option value="IND-2">IND-2 (Plywood Branch)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Raw Material Categories (8 Wood Types)</label>
        <div className="flex flex-wrap gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          {categories.filter(c => c.type === 'raw_material').map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border-2 transition-all ${
                formData.categories.includes(cat.id)
                  ? 'border-[#1A5276] bg-[#1A5276]/10 text-[#1A5276]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: cat.color }} />
              {cat.code}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">MLH, PW, PWKD, PWGRN, PLYWW, PLYRR, PLYRW, PRTB</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Other Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.type !== 'raw_material').map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border-2 transition-all ${
                formData.categories.includes(cat.id)
                  ? 'border-[#1A5276] bg-[#1A5276]/10 text-[#1A5276]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: cat.color }} />
              {cat.code}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
      </div>
    </form>
  )
}

// ============================================
// ADMIN HUB - CATEGORY MANAGER
// ============================================
const CategoryManager = ({ categories, setCategories, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleSave = (catData) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...catData } : c))
    } else {
      setCategories([...categories, { ...catData, id: catData.code, isActive: true }])
    }
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const rmCategories = categories.filter(c => c.type === 'raw_material')
  const otherCategories = categories.filter(c => c.type !== 'raw_material')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.categories', lang)}</h1>
          <p className="text-gray-500">Manage raw material (8 wood types) and other categories</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingCategory(null); setIsModalOpen(true) }}>
          {t('action.add', lang)}
        </Button>
      </div>

      {/* 8 Wood Type Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <TreePine className="w-5 h-5 text-amber-600" />
          Raw Material - Wood Types ({rmCategories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rmCategories.map(cat => (
            <Card key={cat.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <TreePine className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{cat.code}</div>
                    <div className="text-sm text-gray-500">{cat.nameEn}</div>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingCategory(cat); setIsModalOpen(true) }}
                  className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">{cat.nameTh}</div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="default">Cost: {cat.costMethod}</Badge>
                <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: cat.color }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Categories */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Box className="w-5 h-5 text-gray-500" />
          Other Categories ({otherCategories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherCategories.map(cat => (
            <Card key={cat.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <Box className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{cat.code}</div>
                    <div className="text-sm text-gray-500">{cat.nameEn}</div>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingCategory(cat); setIsModalOpen(true) }}
                  className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">{cat.nameTh}</div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="default">Cost: {cat.costMethod}</Badge>
                <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: cat.color }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null) }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="sm"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          const form = e.target
          handleSave({
            code: form.code.value.toUpperCase(),
            nameEn: form.nameEn.value,
            nameTh: form.nameTh.value,
            color: form.color.value,
            costMethod: form.costMethod.value,
            type: form.type.value,
          })
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code * (e.g., PWKD, PLYWW)</label>
            <input name="code" required defaultValue={editingCategory?.code} className="w-full px-3 py-2 border rounded-lg uppercase" placeholder="Material code" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
            <input name="nameEn" required defaultValue={editingCategory?.nameEn} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Pine Wood Kiln Dried" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Thai)</label>
            <input name="nameTh" defaultValue={editingCategory?.nameTh} className="w-full px-3 py-2 border rounded-lg" placeholder="ชื่อภาษาไทย" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Type *</label>
            <select name="type" defaultValue={editingCategory?.type || 'raw_material'} className="w-full px-3 py-2 border rounded-lg">
              <option value="raw_material">Raw Material (Wood)</option>
              <option value="consumables">Consumables</option>
              <option value="finished_goods">Finished Goods</option>
              <option value="office">Office Supplies</option>
              <option value="maintenance">Maintenance Parts</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input name="color" type="color" defaultValue={editingCategory?.color || '#8B4513'} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Method</label>
              <select name="costMethod" defaultValue={editingCategory?.costMethod || 'FIFO'} className="w-full px-3 py-2 border rounded-lg">
                <option value="FIFO">FIFO</option>
                <option value="AVG">Average</option>
                <option value="STD">Standard</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>{t('action.cancel', lang)}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ============================================
// INVENTORY MODULE
// ============================================
const InventoryModule = ({ inventory, stores, categories, lang }) => {
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedRows, setExpandedRows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInventory = inventory.filter(item => {
    const matchesStore = selectedStore === 'all' || item.store === selectedStore
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStore && matchesCategory && matchesSearch
  })

  // Group by material code
  const groupedInventory = filteredInventory.reduce((acc, item) => {
    if (!acc[item.code]) {
      acc[item.code] = { code: item.code, category: item.category, lots: [], totalQty: 0, totalCbm: 0, totalCost: 0 }
    }
    acc[item.code].lots.push(item)
    acc[item.code].totalQty += item.qty
    acc[item.code].totalCbm += item.cbm
    acc[item.code].totalCost += item.cost
    return acc
  }, {})

  const toggleExpand = (code) => {
    setExpandedRows(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }

  const totals = {
    value: filteredInventory.reduce((sum, i) => sum + i.cost, 0),
    lots: filteredInventory.length,
    lowStock: filteredInventory.filter(i => i.status === 'low').length,
    qty: filteredInventory.reduce((sum, i) => sum + i.qty, 0),
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('inventory.title', lang)}</h1>
          <p className="text-gray-500">Track materials across all stores with lot-level detail</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Download}>Export</Button>
          <Button icon={Plus}>Receive Stock</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(totals.value)}</div>
              <div className="text-sm text-gray-500">{t('inventory.totalValue', lang)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totals.lots}</div>
              <div className="text-sm text-gray-500">{t('inventory.totalLots', lang)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Box className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totals.qty.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Pieces</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{totals.lowStock}</div>
              <div className="text-sm text-gray-500">{t('inventory.lowStock', lang)}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Quick Cards - 8 Wood Types */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.filter(c => c.type === 'raw_material').map(cat => {
          const catItems = inventory.filter(i => i.category === cat.id)
          const catValue = catItems.reduce((sum, i) => sum + i.cost, 0)
          const catLots = catItems.length
          const lowCount = catItems.filter(i => i.status === 'low').length
          
          return (
            <Card 
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`p-4 min-w-[140px] flex-shrink-0 cursor-pointer transition-all ${selectedCategory === cat.id ? 'ring-2 ring-[#1A5276]' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                  <TreePine className="w-4 h-4" style={{ color: cat.color }} />
                </div>
                <span className="font-bold text-sm" style={{ color: cat.color }}>{cat.code}</span>
              </div>
              <div className="text-lg font-bold text-gray-800">{formatCurrency(catValue)}</div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{catLots} lots</span>
                {lowCount > 0 && <Badge variant="danger">{lowCount} low</Badge>}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by material code or lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            <option value="all">All Stores</option>
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.nameEn} ({s.branch})</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.nameEn}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Material Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Lot No</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Store</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Qty (Pcs)</th>
                <th className="px-4 py-3 text-right text-sm font-medium">CBM</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Value</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.values(groupedInventory).map(group => (
                <React.Fragment key={group.code}>
                  {/* Group Header */}
                  <tr 
                    onClick={() => toggleExpand(group.code)}
                    className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {expandedRows.includes(group.code) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="w-3 h-3 rounded-full" style={{ 
                          backgroundColor: categories.find(c => c.id === group.category)?.color 
                        }} />
                        <span className="font-medium text-gray-800">{group.code}</span>
                        <Badge variant="info">{group.lots.length} lots</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">-</td>
                    <td className="px-4 py-3 text-gray-500">Multiple</td>
                    <td className="px-4 py-3 text-right font-medium">{group.totalQty.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">{group.totalCbm.toFixed(3)}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#2ECC40]">{formatCurrency(group.totalCost)}</td>
                    <td className="px-4 py-3 text-center">
                      {group.lots.some(l => l.status === 'low') && <Badge variant="danger">Low</Badge>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1 text-gray-400 hover:text-[#1A5276]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Lot Details */}
                  {expandedRows.includes(group.code) && group.lots.map(lot => {
                    const store = stores.find(s => s.id === lot.store)
                    return (
                      <tr key={lot.id} className="bg-white hover:bg-blue-50/50">
                        <td className="px-4 py-2 pl-12">
                          <span className="text-gray-400">└</span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-[#1A5276]">{lot.lotNo}</span>
                            <span className="text-xs text-gray-400">{lot.dateIn}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={store?.branch === 'IND-2' ? 'ind2' : 'ind'}>{store?.branch}</Badge>
                            <span className="text-sm text-gray-600">{store?.nameEn}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">{lot.qty.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{lot.cbm.toFixed(3)}</td>
                        <td className="px-4 py-2 text-right text-[#2ECC40]">{formatCurrency(lot.cost)}</td>
                        <td className="px-4 py-2 text-center">
                          <Badge variant={lot.status === 'low' ? 'danger' : 'success'}>
                            {lot.status === 'low' ? '🔴 Low' : '🟢 OK'}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 text-gray-400 hover:text-amber-500" title="Issue">
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-blue-500" title="Transfer">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-500" title="Print Label">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" icon={ArrowRight}>Issue Material</Button>
        <Button variant="outline" icon={ArrowLeft}>Return Material</Button>
        <Button variant="outline" icon={RefreshCw}>Transfer</Button>
        <Button variant="outline" icon={Edit3}>Adjustment</Button>
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD
// ============================================
const Dashboard = ({ stores, inventory, categories, lang }) => {
  const stats = {
    totalValue: inventory.reduce((sum, i) => sum + i.cost, 0),
    totalLots: inventory.length,
    lowStock: inventory.filter(i => i.status === 'low').length,
    activeWO: 15,
    onTimeDelivery: 92,
    monthlyRevenue: 12500000,
  }

  const recentActivity = [
    { type: 'receive', text: 'Received MLH from Thai Timber', time: '2 hours ago', icon: Package, color: 'green' },
    { type: 'issue', text: 'Issued materials to WO-2601-024', time: '3 hours ago', icon: ArrowRight, color: 'blue' },
    { type: 'alert', text: 'Low stock alert: PW 39x145x3960', time: '5 hours ago', icon: AlertTriangle, color: 'red' },
    { type: 'complete', text: 'WO-2601-022 completed', time: '1 day ago', icon: CheckCircle, color: 'green' },
  ]

  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Good Morning, Vinit! 👋</h1>
            <p className="text-white/80">Here's what's happening at IND Thai Packwell today</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-2xl font-bold">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="success">+18%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.monthlyRevenue)}</div>
          <div className="text-sm text-gray-500">Monthly Revenue</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Factory className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-amber-600 font-medium">2 due today</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.activeWO}</div>
          <div className="text-sm text-gray-500">Active Work Orders</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant={stats.lowStock > 0 ? 'danger' : 'success'}>{stats.lowStock} low</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalValue)}</div>
          <div className="text-sm text-gray-500">Inventory Value</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <Badge variant="success">+3%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.onTimeDelivery}%</div>
          <div className="text-sm text-gray-500">On-Time Delivery</div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Store Overview */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Store Overview</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stores.map(store => (
              <div key={store.id} className={`p-4 rounded-xl border-2 ${store.branch === 'IND-2' ? 'border-[#5DADE2]/30 bg-[#5DADE2]/5' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={store.branch === 'IND-2' ? 'ind2' : 'ind'} className="text-xs">{store.branch}</Badge>
                </div>
                <div className="font-medium text-gray-800">{store.nameEn}</div>
                <div className="text-sm text-gray-500 mb-2">{store.nameTh}</div>
                <div className="text-lg font-bold text-[#2ECC40]">{formatCurrency(store.value)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.color === 'green' ? 'bg-green-100' :
                  activity.color === 'blue' ? 'bg-blue-100' :
                  'bg-red-100'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.color === 'green' ? 'text-green-600' :
                    activity.color === 'blue' ? 'text-blue-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800">{activity.text}</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  // State
  const [lang, setLang] = useState('en')
  const [currentModule, setCurrentModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Configurable Data (loaded from localStorage or defaults)
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('ind_stores')
    return saved ? JSON.parse(saved) : INITIAL_STORES
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('ind_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ind_inventory')
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY
  })
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('ind_customers')
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ind_stores', JSON.stringify(stores))
  }, [stores])
  useEffect(() => {
    localStorage.setItem('ind_categories', JSON.stringify(categories))
  }, [categories])
  useEffect(() => {
    localStorage.setItem('ind_inventory', JSON.stringify(inventory))
  }, [inventory])
  useEffect(() => {
    localStorage.setItem('ind_customers', JSON.stringify(customers))
  }, [customers])

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: t('nav.dashboard', lang) },
    { id: 'admin', icon: Settings, label: t('nav.admin', lang), submenu: [
      { id: 'admin-stores', label: t('admin.stores', lang) },
      { id: 'admin-categories', label: t('admin.categories', lang) },
      { id: 'admin-materials', label: t('admin.materials', lang) },
      { id: 'admin-customers', label: t('admin.customers', lang) },
      { id: 'admin-vendors', label: t('admin.vendors', lang) },
      { id: 'admin-users', label: t('admin.users', lang) },
    ]},
    { id: 'inventory', icon: Package, label: t('nav.inventory', lang) },
    { id: 'purchase', icon: ShoppingCart, label: t('nav.purchase', lang) },
    { id: 'production', icon: Factory, label: t('nav.production', lang) },
    { id: 'sales', icon: Receipt, label: t('nav.sales', lang) },
    { id: 'transport', icon: Truck, label: t('nav.transport', lang) },
    { id: 'reports', icon: BarChart3, label: t('nav.reports', lang) },
  ]

  const [expandedNav, setExpandedNav] = useState(['admin'])

  const toggleNavExpand = (id) => {
    setExpandedNav(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const renderContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard stores={stores} inventory={inventory} categories={categories} lang={lang} />
      case 'admin-stores':
        return <StoreBuilder stores={stores} setStores={setStores} categories={categories} lang={lang} />
      case 'admin-categories':
        return <CategoryManager categories={categories} setCategories={setCategories} lang={lang} />
      case 'inventory':
        return <InventoryModule inventory={inventory} stores={stores} categories={categories} lang={lang} />
      default:
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#1A5276] to-[#2ECC40] flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
              <p className="text-gray-500">{currentModule.replace('admin-', '').replace('-', ' ')} module is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 transition-all z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          {/* Logo */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ECC40] to-[#5DADE2] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">IND</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-white font-bold">IND Thai</div>
                  <div className="text-xs text-slate-400">ERP System</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 flex-1 overflow-y-auto">
            {navItems.map(item => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.submenu) {
                      toggleNavExpand(item.id)
                    } else {
                      setCurrentModule(item.id)
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    currentModule === item.id || currentModule.startsWith(item.id + '-')
                      ? 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.submenu && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedNav.includes(item.id) ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </button>
                
                {/* Submenu */}
                {item.submenu && expandedNav.includes(item.id) && !sidebarCollapsed && (
                  <div className="ml-4 mb-2">
                    {item.submenu.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setCurrentModule(sub.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          currentModule === sub.id
                            ? 'bg-white/10 text-white'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Top Bar */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-800">{t('app.title', lang)}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <LanguageSwitcher />
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A5276] to-[#2ECC40] flex items-center justify-center text-white font-bold">VD</div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800">Vinit Dhariwal</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-64px)]">
            {renderContent()}
          </main>
        </div>
      </div>
    </LanguageContext.Provider>
  )
}
