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

// ============================================
// VENDORS
// ============================================
const INITIAL_VENDORS = [
  { id: 'V001', code: 'V001', name: 'Thai Timber Co., Ltd', nameTh: 'ไม้ไทย จำกัด', type: 'local', country: 'TH', currency: 'THB', paymentTerms: 30, taxId: '0105548123456', email: 'sales@thaitimber.co.th', phone: '038-123-456', materials: ['MLH', 'PW', 'PWKD', 'PWGRN'], isActive: true },
  { id: 'V002', code: 'V002', name: 'Stora Enso', nameTh: 'สโตร่า เอ็นโซ่', type: 'import', country: 'FI', currency: 'USD', paymentTerms: 60, taxId: '', email: 'asia@storaenso.com', phone: '', materials: ['PW', 'PWKD'], isActive: true },
  { id: 'V003', code: 'V003', name: 'Timberlink Australia', nameTh: 'ทิมเบอร์ลิงค์', type: 'import', country: 'AU', currency: 'USD', paymentTerms: 60, taxId: '', email: 'export@timberlink.com.au', phone: '', materials: ['PW', 'PWGRN'], isActive: true },
  { id: 'V004', code: 'V004', name: 'Dai Nam Vietnam', nameTh: 'ได นาม เวียดนาม', type: 'import', country: 'VN', currency: 'USD', paymentTerms: 45, taxId: '', email: 'sales@dainam.vn', phone: '', materials: ['MLH', 'PRTB'], isActive: true },
  { id: 'V005', code: 'V005', name: 'Green Pine Ltd', nameTh: 'กรีน ไพน์', type: 'local', country: 'TH', currency: 'THB', paymentTerms: 30, taxId: '0105552098765', email: 'order@greenpine.co.th', phone: '038-987-654', materials: ['PWGRN'], isActive: true },
  { id: 'V006', code: 'V006', name: 'Ply Masters Thailand', nameTh: 'พลาย มาสเตอร์ส', type: 'local', country: 'TH', currency: 'THB', paymentTerms: 30, taxId: '0105556012345', email: 'sales@plymasters.co.th', phone: '02-123-4567', materials: ['PLYWW', 'PLYRR', 'PLYRW'], isActive: true },
  { id: 'V007', code: 'V007', name: 'Board Co', nameTh: 'บอร์ด โค', type: 'local', country: 'TH', currency: 'THB', paymentTerms: 30, taxId: '0105559876543', email: 'info@boardco.co.th', phone: '02-456-7890', materials: ['PRTB'], isActive: true },
]

// ============================================
// IMPORT COST TYPES (13 Types)
// ============================================
const IMPORT_COST_TYPES = [
  { id: 'custom_duty', nameEn: 'Custom Duty', nameTh: 'อากรศุลกากร', hasVat: true },
  { id: 'thc_do_storage', nameEn: 'THC/DO Fee/Storage', nameTh: 'ค่า THC/DO/จัดเก็บ', hasVat: false },
  { id: 'forest_officer', nameEn: 'Forest Officer', nameTh: 'ค่าตรวจป่าไม้', hasVat: true },
  { id: 'phyto_office', nameEn: 'Phyto Office', nameTh: 'ค่าใบรับรอง Phyto', hasVat: true },
  { id: 'transport', nameEn: 'Transport', nameTh: 'ค่าขนส่ง', hasVat: true },
  { id: 'surcharge_customs', nameEn: 'Surcharge on Customs', nameTh: 'ค่าธรรมเนียมศุลกากร', hasVat: true },
  { id: 'advance_thc', nameEn: 'Advance THC', nameTh: 'ค่า THC ล่วงหน้า', hasVat: false },
  { id: 'bank_charges', nameEn: 'Bank Charges', nameTh: 'ค่าธรรมเนียมธนาคาร', hasVat: false },
  { id: 'lc_commission', nameEn: 'LC/Remittance Commission', nameTh: 'ค่า LC/โอนเงิน', hasVat: false },
  { id: 'insurance', nameEn: 'Insurance', nameTh: 'ค่าประกันภัย', hasVat: false },
  { id: 'freight', nameEn: 'Freight', nameTh: 'ค่าระวาง', hasVat: false },
  { id: 'other', nameEn: 'Other Expenses', nameTh: 'ค่าใช้จ่ายอื่นๆ', hasVat: false },
]

// ============================================
// PURCHASE ORDERS
// ============================================
const INITIAL_PURCHASE_ORDERS = [
  { 
    id: 'PO-2401-001', 
    type: 'import', 
    vendorId: 'V002', 
    status: 'received',
    poDate: '2024-01-15',
    invoiceNo: '7323200006',
    invoiceDate: '2024-01-10',
    containerNo: 'MSKU1234567',
    expectedDelivery: '2024-02-15',
    currency: 'USD',
    exchangeRate: 35.50,
    items: [
      { id: 1, category: 'PW', materialCode: 'IND-PW/39/145/3960', thickness: 39, width: 145, length: 3960, qtyOrdered: 500, unit: 'pcs', unitPrice: 45, qtyReceived: 478, status: 'received' }
    ],
    importCosts: {
      custom_duty: 42842,
      thc_do_storage: 16000,
      forest_officer: 4000,
      phyto_office: 1500,
      transport: 10000,
      surcharge_customs: 4500,
      advance_thc: 0,
      bank_charges: 0,
      lc_commission: 0,
      insurance: 2500,
      freight: 15000,
      other: 0,
    },
    subtotal: 798750, // 500 * 45 * 35.50
    totalImportCosts: 96342,
    vat7: 6734,
    withholding3: 2890,
    grandTotal: 898936,
    createdAt: '2024-01-15',
    createdBy: 'Vinit'
  },
  { 
    id: 'PO-2401-002', 
    type: 'local', 
    vendorId: 'V001', 
    status: 'partial',
    poDate: '2024-01-20',
    invoiceNo: 'INV-2401-0055',
    invoiceDate: '2024-01-20',
    containerNo: '',
    expectedDelivery: '2024-01-25',
    currency: 'THB',
    exchangeRate: 1,
    items: [
      { id: 1, category: 'MLH', materialCode: 'IND-MLH/0.5/3/1', thickness: 0.5, width: 3, length: 1, qtyOrdered: 1000, unit: 'pcs', unitPrice: 125, qtyReceived: 700, status: 'partial' },
      { id: 2, category: 'MLH', materialCode: 'IND-MLH/0.5/3.4/1.3', thickness: 0.5, width: 3.4, length: 1.3, qtyOrdered: 500, unit: 'pcs', unitPrice: 135, qtyReceived: 0, status: 'pending' }
    ],
    importCosts: {},
    subtotal: 192500,
    totalImportCosts: 0,
    vat7: 13475,
    withholding3: 0,
    grandTotal: 205975,
    createdAt: '2024-01-20',
    createdBy: 'Vinit'
  },
  { 
    id: 'PO-2401-003', 
    type: 'local', 
    vendorId: 'V006', 
    status: 'pending',
    poDate: '2024-07-15',
    invoiceNo: '',
    invoiceDate: '',
    containerNo: '',
    expectedDelivery: '2024-07-25',
    currency: 'THB',
    exchangeRate: 1,
    items: [
      { id: 1, category: 'PLYWW', materialCode: 'IND-PLYWW/12/1220/2440', thickness: 12, width: 1220, length: 2440, qtyOrdered: 200, unit: 'sheets', unitPrice: 350, qtyReceived: 0, status: 'pending' }
    ],
    importCosts: {},
    subtotal: 70000,
    totalImportCosts: 0,
    vat7: 4900,
    withholding3: 0,
    grandTotal: 74900,
    createdAt: '2024-07-15',
    createdBy: 'Vinit'
  },
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
// EDIT LOT MODAL (for variance correction)
// ============================================
const EditLotModal = ({ isOpen, onClose, lot, categories, stores, onSave, onPrintLabel }) => {
  const [formData, setFormData] = useState({
    lotNo: lot?.lotNo || '',
    category: lot?.category || '',
    code: lot?.code || '',
    qty: lot?.qty || 0,
    store: lot?.store || '',
    cost: lot?.cost || 0,
    dateIn: lot?.dateIn || '',
    notes: '',
  })

  React.useEffect(() => {
    if (lot) {
      setFormData({
        lotNo: lot.lotNo,
        category: lot.category,
        code: lot.code,
        qty: lot.qty,
        store: lot.store,
        cost: lot.cost,
        dateIn: lot.dateIn,
        notes: '',
      })
    }
  }, [lot])

  // Parse dimensions from code (e.g., IND-MLH/0.5/3/1 → T=0.5, W=3, L=1)
  const parseDimensions = (code) => {
    const parts = code.split('/')
    if (parts.length >= 4) {
      return {
        thickness: parseFloat(parts[1]) || 0,
        width: parseFloat(parts[2]) || 0,
        length: parseFloat(parts[3]) || 0,
      }
    }
    return { thickness: 0, width: 0, length: 0 }
  }

  const [dimensions, setDimensions] = useState(parseDimensions(lot?.code || ''))

  React.useEffect(() => {
    if (lot?.code) {
      setDimensions(parseDimensions(lot.code))
    }
  }, [lot])

  // Rebuild code when dimensions change
  const updateCode = (newDims) => {
    const codeParts = formData.code.split('/')
    if (codeParts.length >= 4) {
      const prefix = codeParts[0] // e.g., "IND-MLH"
      const newCode = `${prefix}/${newDims.thickness}/${newDims.width}/${newDims.length}`
      setFormData(prev => ({ ...prev, code: newCode }))
    }
  }

  const handleDimensionChange = (field, value) => {
    const newDims = { ...dimensions, [field]: parseFloat(value) || 0 }
    setDimensions(newDims)
    updateCode(newDims)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...lot,
      ...formData,
      cbm: (dimensions.thickness * dimensions.width * dimensions.length * formData.qty) / 1000000000,
    })
  }

  if (!isOpen || !lot) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-amber-500 to-orange-500">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Lot - Variance Correction
          </h2>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-amber-800">Editing Lot After Receiving</div>
                <div className="text-sm text-amber-600">
                  Use this to correct quantities or sizes when actual goods differ from pre-printed labels.
                  Don't forget to <strong>reprint the label</strong> after saving changes.
                </div>
              </div>
            </div>
          </div>

          {/* Lot Info (read-only) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <input
                type="text"
                value={formData.lotNo}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-mono font-bold text-[#1A5276]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Received</label>
              <input
                type="date"
                value={formData.dateIn}
                onChange={(e) => setFormData({ ...formData, dateIn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Editable Fields */}
          <div className="p-4 bg-blue-50 rounded-lg space-y-4">
            <div className="font-medium text-blue-800 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Editable Fields
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity * <span className="text-gray-400">(Original: {lot.qty})</span>
              </label>
              <input
                type="number"
                required
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg ${formData.qty !== lot.qty ? 'border-amber-400 bg-amber-50' : ''}`}
              />
              {formData.qty !== lot.qty && (
                <div className="text-sm text-amber-600 mt-1">
                  ⚠️ Variance: {formData.qty - lot.qty > 0 ? '+' : ''}{formData.qty - lot.qty} pieces
                </div>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (T × W × L)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    step="0.1"
                    value={dimensions.thickness}
                    onChange={(e) => handleDimensionChange('thickness', e.target.value)}
                    placeholder="Thickness"
                    className={`w-full px-3 py-2 border rounded-lg ${dimensions.thickness !== parseDimensions(lot.code).thickness ? 'border-amber-400 bg-amber-50' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Thickness</div>
                </div>
                <div>
                  <input
                    type="number"
                    step="0.1"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    placeholder="Width"
                    className={`w-full px-3 py-2 border rounded-lg ${dimensions.width !== parseDimensions(lot.code).width ? 'border-amber-400 bg-amber-50' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Width</div>
                </div>
                <div>
                  <input
                    type="number"
                    step="0.1"
                    value={dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    placeholder="Length"
                    className={`w-full px-3 py-2 border rounded-lg ${dimensions.length !== parseDimensions(lot.code).length ? 'border-amber-400 bg-amber-50' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Length</div>
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material Code (auto-generated)</label>
              <input
                type="text"
                value={formData.code}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
              />
            </div>

            {/* Store */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Location</label>
              <select
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.nameEn} ({s.branch})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Correction</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="e.g., Actual count was 98 pcs instead of 100, 2 pieces were short"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              icon={Printer}
              onClick={() => onPrintLabel(formData)}
            >
              Save & Print Label
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" icon={Save}>Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// INVENTORY MODULE
// ============================================
const InventoryModule = ({ inventory, setInventory, stores, categories, lang }) => {
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedRows, setExpandedRows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [lotsForLabels, setLotsForLabels] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingLot, setEditingLot] = useState(null)

  const filteredInventory = inventory.filter(item => {
    const matchesStore = selectedStore === 'all' || item.store === selectedStore
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lotNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStore && matchesCategory && matchesSearch
  })

  const handlePrintLabel = (lot) => {
    setLotsForLabels([lot])
    setShowLabelModal(true)
  }

  const handlePrintAllLabels = () => {
    setLotsForLabels(filteredInventory)
    setShowLabelModal(true)
  }

  const handleEditLot = (lot) => {
    setEditingLot(lot)
    setShowEditModal(true)
  }

  const handleSaveEditedLot = (updatedLot) => {
    setInventory(inventory.map(lot => 
      lot.id === updatedLot.id ? { ...lot, ...updatedLot, status: updatedLot.qty < 100 ? 'low' : 'available' } : lot
    ))
    setShowEditModal(false)
    setEditingLot(null)
  }

  const handleSaveAndPrintLabel = (updatedLot) => {
    handleSaveEditedLot(updatedLot)
    setLotsForLabels([updatedLot])
    setShowLabelModal(true)
  }

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
                            <button 
                              className="p-1 text-gray-400 hover:text-amber-500" 
                              title="Edit Lot"
                              onClick={() => handleEditLot(lot)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-blue-500" title="Issue">
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-purple-500" title="Transfer">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1 text-gray-400 hover:text-green-500" 
                              title="Print Label"
                              onClick={() => handlePrintLabel(lot)}
                            >
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
        <Button variant="outline" icon={Printer} onClick={handlePrintAllLabels}>Print Labels</Button>
      </div>

      {/* Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        lots={lotsForLabels}
        lang={lang}
      />

      {/* Edit Lot Modal */}
      <EditLotModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingLot(null) }}
        lot={editingLot}
        categories={categories}
        stores={stores}
        onSave={handleSaveEditedLot}
        onPrintLabel={handleSaveAndPrintLabel}
      />
    </div>
  )
}

// ============================================
// LABEL PRINTING COMPONENT
// ============================================
const LabelPrintModal = ({ isOpen, onClose, lots, lang, title, isPrePrint }) => {
  const [selectedLots, setSelectedLots] = useState(lots.map(l => l.lotNo))
  const printRef = React.useRef()

  // Reset selection when lots change
  React.useEffect(() => {
    setSelectedLots(lots.map(l => l.lotNo))
  }, [lots])

  const toggleLot = (lotNo) => {
    setSelectedLots(prev => 
      prev.includes(lotNo) ? prev.filter(l => l !== lotNo) : [...prev, lotNo]
    )
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const lotsToShow = lots.filter(l => selectedLots.includes(l.lotNo))
    
    printWindow.document.write(`
      <html>
        <head>
          <title>IND Labels - ${new Date().toLocaleDateString()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            @page { size: A4; margin: 10mm; }
            .labels-container { display: flex; flex-wrap: wrap; gap: 10mm; }
            .label {
              width: 90mm;
              height: 55mm;
              border: 1px solid #000;
              padding: 3mm;
              page-break-inside: avoid;
              display: flex;
              flex-direction: column;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 9pt;
              border-bottom: 1px solid #000;
              padding-bottom: 2mm;
              margin-bottom: 2mm;
            }
            .row {
              display: flex;
              border-bottom: 1px solid #ccc;
            }
            .row:last-child { border-bottom: none; }
            .label-key {
              width: 28mm;
              font-weight: bold;
              font-size: 8pt;
              padding: 1.5mm;
              background: #f5f5f5;
              border-right: 1px solid #ccc;
            }
            .label-value {
              flex: 1;
              font-size: 10pt;
              padding: 1.5mm;
              font-weight: bold;
            }
            .material-code {
              text-align: center;
              font-size: 12pt;
              font-weight: bold;
              padding: 3mm;
              border-bottom: 1px solid #000;
            }
            .barcode-area {
              text-align: center;
              padding: 2mm;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .barcode {
              font-family: 'Libre Barcode 128', monospace;
              font-size: 36pt;
              letter-spacing: -2px;
            }
            .barcode-text {
              font-size: 7pt;
              margin-top: 1mm;
            }
            .issue-section {
              border-top: 1px solid #000;
              margin-top: auto;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="labels-container">
            ${lotsToShow.map(lot => `
              <div class="label">
                <div class="header">IND THAI PACKWELL INDUSTRIES CO., LTD.</div>
                <div class="row">
                  <div class="label-key">LOT NO:</div>
                  <div class="label-value">${lot.lotNo}</div>
                </div>
                <div class="material-code">${lot.code}</div>
                <div class="row">
                  <div class="label-key">QUANTITY</div>
                  <div class="label-value">${lot.qty}</div>
                </div>
                <div class="row">
                  <div class="label-key">DATE RECD</div>
                  <div class="label-value">${new Date(lot.dateIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div class="barcode-area">
                  <div class="barcode">*${lot.code}*</div>
                  <div class="barcode-text">${lot.code}</div>
                </div>
                <div class="issue-section">
                  <div class="row">
                    <div class="label-key">DATE ISSUED</div>
                    <div class="label-value"></div>
                  </div>
                  <div class="row">
                    <div class="label-key">PCS ISSUED</div>
                    <div class="label-value"></div>
                  </div>
                  <div class="row">
                    <div class="label-key">ISSUED BY</div>
                    <div class="label-value"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1A5276] to-[#2ECC40]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isPrePrint ? <Tag className="w-5 h-5" /> : <Printer className="w-5 h-5" />}
            {title || 'Print Inventory Labels'}
            {isPrePrint && <Badge variant="warning" className="ml-2">PRE-PRINT</Badge>}
          </h2>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Pre-Print Notice */}
          {isPrePrint && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800">Pre-Print Labels from PO Data</div>
                  <div className="text-sm text-amber-600">
                    These labels are based on invoice/PO quantities. If actual received quantities differ, 
                    go to <strong>Inventory → Edit Lot</strong> to adjust and reprint.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Select Labels */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-gray-700">Select Labels to Print ({selectedLots.length} selected)</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedLots(lots.map(l => l.lotNo))}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <button 
                  onClick={() => setSelectedLots([])}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {lots.map(lot => (
                <label
                  key={lot.lotNo}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLots.includes(lot.lotNo) 
                      ? 'border-[#1A5276] bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedLots.includes(lot.lotNo)}
                    onChange={() => toggleLot(lot.lotNo)}
                    className="w-5 h-5 rounded text-[#1A5276]"
                  />
                  <div className="flex-1">
                    <div className="font-mono font-bold text-[#1A5276]">{lot.lotNo}</div>
                    <div className="text-sm text-gray-600">{lot.code}</div>
                    <div className="text-sm text-gray-500">Qty: {lot.qty} | {lot.dateIn}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Label Preview */}
          <div className="mb-4">
            <label className="font-medium text-gray-700 mb-2 block">Label Preview</label>
            <div className="border rounded-lg p-4 bg-gray-50">
              {selectedLots.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {lots.filter(l => selectedLots.includes(l.lotNo)).slice(0, 4).map(lot => (
                    <div key={lot.lotNo} className="flex-shrink-0 w-[280px] border border-gray-800 bg-white p-2 text-sm">
                      <div className="text-center font-bold text-xs border-b pb-1 mb-1">
                        IND THAI PACKWELL INDUSTRIES CO., LTD.
                      </div>
                      <div className="flex border-b">
                        <div className="w-20 bg-gray-100 p-1 font-bold text-xs border-r">LOT NO:</div>
                        <div className="flex-1 p-1 font-bold">{lot.lotNo}</div>
                      </div>
                      <div className="text-center font-bold py-2 border-b text-lg">{lot.code}</div>
                      <div className="flex border-b">
                        <div className="w-20 bg-gray-100 p-1 font-bold text-xs border-r">QUANTITY</div>
                        <div className="flex-1 p-1 font-bold">{lot.qty}</div>
                      </div>
                      <div className="flex border-b">
                        <div className="w-20 bg-gray-100 p-1 font-bold text-xs border-r">DATE RECD</div>
                        <div className="flex-1 p-1">{lot.dateIn}</div>
                      </div>
                      <div className="text-center py-2 border-b">
                        <div className="text-2xl font-mono tracking-[-2px]">||||||||||||||||</div>
                        <div className="text-[10px]">{lot.code}</div>
                      </div>
                      <div className="text-xs">
                        <div className="flex border-b">
                          <div className="w-20 bg-gray-100 p-1 border-r">DATE ISSUED</div>
                          <div className="flex-1 p-1"></div>
                        </div>
                        <div className="flex border-b">
                          <div className="w-20 bg-gray-100 p-1 border-r">PCS ISSUED</div>
                          <div className="flex-1 p-1"></div>
                        </div>
                        <div className="flex">
                          <div className="w-20 bg-gray-100 p-1 border-r">ISSUED BY</div>
                          <div className="flex-1 p-1"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedLots.length > 4 && (
                    <div className="flex-shrink-0 w-[280px] border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500">
                      +{selectedLots.length - 4} more labels
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select labels to see preview
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
              icon={Printer} 
              onClick={handlePrint}
              disabled={selectedLots.length === 0}
            >
              Print {selectedLots.length} Label{selectedLots.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PURCHASE MODULE
// ============================================
const PurchaseModule = ({ purchaseOrders, setPurchaseOrders, vendors, categories, stores, inventory, setInventory, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showPOModal, setShowPOModal] = useState(false)
  const [showGRNModal, setShowGRNModal] = useState(false)
  const [showPrePrintModal, setShowPrePrintModal] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [editingPO, setEditingPO] = useState(null)
  const [prePrintLots, setPrePrintLots] = useState([])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Purchase Orders', icon: FileText },
    { id: 'receiving', label: 'Goods Receipt', icon: Package },
    { id: 'vendors', label: 'Vendors', icon: Building2 },
  ]

  const stats = {
    totalPOs: purchaseOrders.length,
    pendingPOs: purchaseOrders.filter(p => p.status === 'pending').length,
    partialPOs: purchaseOrders.filter(p => p.status === 'partial').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0),
    pendingValue: purchaseOrders.filter(p => p.status !== 'received').reduce((sum, po) => sum + po.grandTotal, 0),
  }

  const handleReceive = (po) => {
    setSelectedPO(po)
    setShowGRNModal(true)
  }

  // Pre-print labels from PO (before container arrives)
  const handlePrePrintLabels = (po) => {
    const lots = po.items.map((item, idx) => {
      const prefix = po.type === 'import' || item.category.startsWith('PLY') ? 'IND2' : 'IND'
      const lotNo = `LP${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(idx + 1).padStart(3, '0')}`
      return {
        lotNo,
        code: `${prefix}-${item.category}/${item.thickness}/${item.width}/${item.length}`,
        category: item.category,
        qty: item.qtyOrdered - (item.qtyReceived || 0), // Remaining qty to receive
        dateIn: po.expectedDelivery || new Date().toISOString().split('T')[0],
        poId: po.id,
        status: 'pre-printed',
      }
    })
    setPrePrintLots(lots)
    setSelectedPO(po)
    setShowPrePrintModal(true)
  }

  const handleGRNSave = (grnData) => {
    // Update PO with received quantities
    setPurchaseOrders(purchaseOrders.map(po => {
      if (po.id === grnData.poId) {
        const updatedItems = po.items.map(item => {
          const grnItem = grnData.items.find(g => g.id === item.id)
          if (grnItem) {
            return { 
              ...item, 
              qtyReceived: (item.qtyReceived || 0) + grnItem.qtyReceived,
              status: (item.qtyReceived || 0) + grnItem.qtyReceived >= item.qtyOrdered ? 'received' : 'partial'
            }
          }
          return item
        })
        const allReceived = updatedItems.every(i => i.status === 'received')
        const anyReceived = updatedItems.some(i => i.qtyReceived > 0)
        return { 
          ...po, 
          items: updatedItems,
          status: allReceived ? 'received' : (anyReceived ? 'partial' : 'pending')
        }
      }
      return po
    }))

    // Add to inventory
    const newLots = grnData.items.filter(item => item.qtyReceived > 0).map((item, idx) => {
      const po = purchaseOrders.find(p => p.id === grnData.poId)
      const vendor = vendors.find(v => v.id === po?.vendorId)
      const lotNo = `LP${Date.now().toString().slice(-5)}${idx}`
      const store = po?.type === 'import' || item.category.startsWith('PLY') ? 'STORE2' : 'STORE1'
      const prefix = stores.find(s => s.id === store)?.branch === 'IND-2' ? 'IND2' : 'IND'
      
      return {
        id: Date.now() + idx,
        lotNo,
        category: item.category,
        code: `${prefix}-${item.category}/${item.thickness}/${item.width}/${item.length}`,
        store,
        qty: item.qtyReceived,
        cbm: (item.thickness * item.width * item.length * item.qtyReceived) / 1000000000,
        cost: item.qtyReceived * item.unitPrice * (po?.exchangeRate || 1),
        costPerCbm: 0, // Calculate based on CBM
        status: item.qtyReceived < 100 ? 'low' : 'available',
        dateIn: new Date().toISOString().split('T')[0],
        vendor: vendor?.name || 'Unknown',
        poId: grnData.poId,
      }
    })

    setInventory([...inventory, ...newLots])
    setShowGRNModal(false)
    setSelectedPO(null)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.purchase', lang)}</h1>
          <p className="text-gray-500">Manage purchase orders, receiving, and import costing</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingPO(null); setShowPOModal(true) }}>
          New Purchase Order
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#1A5276] text-[#1A5276] font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <PurchaseDashboard stats={stats} purchaseOrders={purchaseOrders} vendors={vendors} onReceive={handleReceive} onPrePrint={handlePrePrintLabels} />
      )}
      {activeTab === 'orders' && (
        <PurchaseOrderList 
          purchaseOrders={purchaseOrders} 
          vendors={vendors} 
          onEdit={(po) => { setEditingPO(po); setShowPOModal(true) }}
          onReceive={handleReceive}
          onPrintLabels={handlePrePrintLabels}
        />
      )}
      {activeTab === 'receiving' && (
        <GoodsReceiptList purchaseOrders={purchaseOrders} vendors={vendors} onReceive={handleReceive} />
      )}
      {activeTab === 'vendors' && (
        <VendorList vendors={vendors} />
      )}

      {/* PO Modal */}
      <Modal
        isOpen={showPOModal}
        onClose={() => { setShowPOModal(false); setEditingPO(null) }}
        title={editingPO ? 'Edit Purchase Order' : 'Create Purchase Order'}
        size="xl"
      >
        <PurchaseOrderForm
          po={editingPO}
          vendors={vendors}
          categories={categories}
          onSave={(poData) => {
            if (editingPO) {
              setPurchaseOrders(purchaseOrders.map(p => p.id === editingPO.id ? { ...p, ...poData } : p))
            } else {
              const newId = `PO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(purchaseOrders.length + 1).padStart(3, '0')}`
              setPurchaseOrders([...purchaseOrders, { ...poData, id: newId, createdAt: new Date().toISOString().split('T')[0], createdBy: 'Vinit' }])
            }
            setShowPOModal(false)
            setEditingPO(null)
          }}
          onCancel={() => { setShowPOModal(false); setEditingPO(null) }}
          lang={lang}
        />
      </Modal>

      {/* GRN Modal */}
      <Modal
        isOpen={showGRNModal}
        onClose={() => { setShowGRNModal(false); setSelectedPO(null) }}
        title={`Goods Receipt - ${selectedPO?.id}`}
        size="xl"
      >
        {selectedPO && (
          <GoodsReceiptForm
            po={selectedPO}
            vendors={vendors}
            onSave={handleGRNSave}
            onCancel={() => { setShowGRNModal(false); setSelectedPO(null) }}
            lang={lang}
          />
        )}
      </Modal>

      {/* Pre-Print Labels Modal */}
      <LabelPrintModal
        isOpen={showPrePrintModal}
        onClose={() => { setShowPrePrintModal(false); setSelectedPO(null) }}
        lots={prePrintLots}
        lang={lang}
        title={`Pre-Print Labels - ${selectedPO?.id}`}
        isPrePrint={true}
      />
    </div>
  )
}

const PurchaseDashboard = ({ stats, purchaseOrders, vendors, onReceive, onPrePrint }) => {
  const pendingOrders = purchaseOrders.filter(p => p.status !== 'received').slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Tag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-800 mb-1">Label Workflow for Swift Offloading</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>1️⃣ <strong>Pre-Print Labels</strong> from PO before container arrives</div>
              <div>2️⃣ <strong>Attach Labels</strong> during offloading for instant identification</div>
              <div>3️⃣ <strong>Edit & Reprint</strong> if quantities or sizes differ from invoice</div>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalPOs}</div>
              <div className="text-sm text-gray-500">Total POs</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingPOs}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.partialPOs}</div>
              <div className="text-sm text-gray-500">Partial Receipt</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalValue)}</div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.pendingValue)}</div>
              <div className="text-sm text-gray-500">Pending Value</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Orders */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">Orders Awaiting Receipt</h3>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>All orders have been received!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <div key={po.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${po.type === 'import' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {po.type === 'import' ? <Globe className="w-5 h-5 text-blue-600" /> : <MapPin className="w-5 h-5 text-green-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{po.id}</div>
                      <div className="text-sm text-gray-500">{vendor?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{formatCurrency(po.grandTotal)}</div>
                    <div className="text-sm text-gray-500">Expected: {po.expectedDelivery}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={po.status === 'partial' ? 'warning' : 'info'}>
                      {po.status === 'partial' ? 'Partial' : 'Pending'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => onPrePrint(po)} title="Pre-Print Labels">
                      <Tag className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => onReceive(po)}>Receive</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

const PurchaseOrderList = ({ purchaseOrders, vendors, onEdit, onReceive, onPrintLabels }) => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filtered = purchaseOrders.filter(po => {
    const vendor = vendors.find(v => v.id === po.vendorId)
    const matchesSearch = po.id.toLowerCase().includes(search.toLowerCase()) ||
                          vendor?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || po.status === filterStatus
    const matchesType = filterType === 'all' || po.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <Printer className="w-6 h-6 text-blue-600" />
          <div>
            <div className="font-medium text-blue-800">Pre-Print Labels for Swift Offloading</div>
            <div className="text-sm text-blue-600">Print labels before container arrives. Click 🏷️ on any PO to generate labels from invoice data.</div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search PO or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Types</option>
            <option value="import">Import</option>
            <option value="local">Local</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="received">Received</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">PO Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Vendor</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Items</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono font-medium text-[#1A5276]">{po.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={po.type === 'import' ? 'info' : 'success'}>
                      {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{vendor?.name}</div>
                    <div className="text-sm text-gray-500">{vendor?.country}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{po.poDate}</td>
                  <td className="px-4 py-3 text-right">{po.items.length}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2ECC40]">{formatCurrency(po.grandTotal)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={
                      po.status === 'received' ? 'success' :
                      po.status === 'partial' ? 'warning' : 'info'
                    }>
                      {po.status === 'received' ? '✅ Received' :
                       po.status === 'partial' ? '⏳ Partial' : '🕐 Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEdit(po)} className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded" title="View/Edit">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onPrintLabels(po)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-gray-100 rounded" title="Pre-Print Labels">
                        <Tag className="w-4 h-4" />
                      </button>
                      {po.status !== 'received' && (
                        <button onClick={() => onReceive(po)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded" title="Receive Goods">
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded" title="Print PO">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

const GoodsReceiptList = ({ purchaseOrders, vendors, onReceive }) => {
  const pendingPOs = purchaseOrders.filter(p => p.status !== 'received')

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <div>
            <div className="font-medium text-amber-800">{pendingPOs.length} Purchase Orders awaiting receipt</div>
            <div className="text-sm text-amber-600">Select a PO below to record goods receipt</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {pendingPOs.map(po => {
          const vendor = vendors.find(v => v.id === po.vendorId)
          const totalOrdered = po.items.reduce((sum, i) => sum + i.qtyOrdered, 0)
          const totalReceived = po.items.reduce((sum, i) => sum + (i.qtyReceived || 0), 0)
          
          return (
            <Card key={po.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${po.type === 'import' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {po.type === 'import' ? <Globe className="w-7 h-7 text-blue-600" /> : <MapPin className="w-7 h-7 text-green-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-lg text-[#1A5276]">{po.id}</span>
                      <Badge variant={po.type === 'import' ? 'info' : 'success'}>{po.type}</Badge>
                      <Badge variant={po.status === 'partial' ? 'warning' : 'default'}>{po.status}</Badge>
                    </div>
                    <div className="text-gray-600">{vendor?.name}</div>
                    <div className="text-sm text-gray-500">Invoice: {po.invoiceNo || 'N/A'} | Expected: {po.expectedDelivery}</div>
                  </div>
                </div>
                <Button onClick={() => onReceive(po)}>
                  <Package className="w-4 h-4 mr-2" />
                  Receive Goods
                </Button>
              </div>

              {/* Items Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  {po.items.map(item => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-800">{item.category}</div>
                      <div className="text-xs text-gray-500 mb-2">{item.materialCode}</div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ordered:</span>
                        <span className="font-medium">{item.qtyOrdered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Received:</span>
                        <span className={`font-medium ${item.qtyReceived < item.qtyOrdered ? 'text-amber-600' : 'text-green-600'}`}>
                          {item.qtyReceived || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3 text-sm">
                  <span className="text-gray-500 mr-2">Progress:</span>
                  <span className="font-bold">{totalReceived} / {totalOrdered}</span>
                  <span className="text-gray-400 ml-1">({Math.round((totalReceived / totalOrdered) * 100)}%)</span>
                </div>
              </div>
            </Card>
          )
        })}

        {pendingPOs.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending goods receipts at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

const VendorList = ({ vendors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map(vendor => (
        <Card key={vendor.id} className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${vendor.type === 'import' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {vendor.type === 'import' ? <Globe className="w-6 h-6 text-blue-600" /> : <MapPin className="w-6 h-6 text-green-600" />}
              </div>
              <div>
                <div className="font-bold text-gray-800">{vendor.code}</div>
                <Badge variant={vendor.type === 'import' ? 'info' : 'success'}>{vendor.type}</Badge>
              </div>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-[#1A5276]">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-3">
            <div className="font-medium text-gray-800">{vendor.name}</div>
            <div className="text-sm text-gray-500">{vendor.nameTh}</div>
          </div>
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{vendor.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>{vendor.currency} • {vendor.paymentTerms} days</span>
            </div>
            {vendor.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{vendor.email}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 pt-3 border-t">
            {vendor.materials.map(mat => (
              <Badge key={mat} variant="default">{mat}</Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

const PurchaseOrderForm = ({ po, vendors, categories, onSave, onCancel, lang }) => {
  const rmCategories = categories.filter(c => c.type === 'raw_material')
  const [formData, setFormData] = useState({
    type: po?.type || 'local',
    vendorId: po?.vendorId || '',
    poDate: po?.poDate || new Date().toISOString().split('T')[0],
    invoiceNo: po?.invoiceNo || '',
    invoiceDate: po?.invoiceDate || '',
    containerNo: po?.containerNo || '',
    expectedDelivery: po?.expectedDelivery || '',
    currency: po?.currency || 'THB',
    exchangeRate: po?.exchangeRate || 1,
    items: po?.items || [{ id: 1, category: '', materialCode: '', thickness: 0, width: 0, length: 0, qtyOrdered: 0, unit: 'pcs', unitPrice: 0 }],
    importCosts: po?.importCosts || {},
    status: po?.status || 'pending',
  })

  const selectedVendor = vendors.find(v => v.id === formData.vendorId)

  useEffect(() => {
    if (selectedVendor) {
      setFormData(prev => ({
        ...prev,
        type: selectedVendor.type,
        currency: selectedVendor.currency,
        exchangeRate: selectedVendor.currency === 'USD' ? 35.50 : 1,
      }))
    }
  }, [formData.vendorId])

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: prev.items.length + 1, category: '', materialCode: '', thickness: 0, width: 0, length: 0, qtyOrdered: 0, unit: 'pcs', unitPrice: 0 }]
    }))
  }

  const updateItem = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }))
  }

  const removeItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }))
  }

  const updateImportCost = (costId, value) => {
    setFormData(prev => ({
      ...prev,
      importCosts: { ...prev.importCosts, [costId]: parseFloat(value) || 0 }
    }))
  }

  // Calculations
  const subtotal = formData.items.reduce((sum, item) => sum + (item.qtyOrdered * item.unitPrice * formData.exchangeRate), 0)
  const totalImportCosts = Object.values(formData.importCosts).reduce((sum, cost) => sum + (cost || 0), 0)
  const vat7 = (subtotal + totalImportCosts) * 0.07
  const withholding3 = formData.type === 'import' ? totalImportCosts * 0.03 : 0
  const grandTotal = subtotal + totalImportCosts + vat7 - withholding3

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      subtotal,
      totalImportCosts,
      vat7,
      withholding3,
      grandTotal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type & Vendor */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'local' })}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${formData.type === 'local' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}
            >
              🏠 Local
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'import' })}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${formData.type === 'import' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}
            >
              🚢 Import
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
          <select
            required
            value={formData.vendorId}
            onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            <option value="">Select Vendor</option>
            {vendors.filter(v => formData.type === 'all' || v.type === formData.type).map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.country})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates & Invoice */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PO Date *</label>
          <input
            type="date"
            required
            value={formData.poDate}
            onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Invoice #</label>
          <input
            type="text"
            value={formData.invoiceNo}
            onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery *</label>
          <input
            type="date"
            required
            value={formData.expectedDelivery}
            onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        {formData.type === 'import' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Container #</label>
            <input
              type="text"
              value={formData.containerNo}
              onChange={(e) => setFormData({ ...formData, containerNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Currency */}
      {formData.type === 'import' && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="THB">THB</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate</label>
            <input
              type="number"
              step="0.01"
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              1 {formData.currency} = ฿{formData.exchangeRate.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Order Items</label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>+ Add Item</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">T x W x L (mm)</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2 text-left">Unit</th>
                <th className="px-3 py-2 text-right">Unit Price</th>
                <th className="px-3 py-2 text-right">Total</th>
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
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">Select</option>
                      {rmCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.code}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="T"
                        value={item.thickness || ''}
                        onChange={(e) => updateItem(idx, 'thickness', parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="W"
                        value={item.width || ''}
                        onChange={(e) => updateItem(idx, 'width', parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="L"
                        value={item.length || ''}
                        onChange={(e) => updateItem(idx, 'length', parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.qtyOrdered || ''}
                      onChange={(e) => updateItem(idx, 'qtyOrdered', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    >
                      <option value="pcs">pcs</option>
                      <option value="sheets">sheets</option>
                      <option value="m3">m³</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                      className="w-24 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatCurrency(item.qtyOrdered * item.unitPrice * formData.exchangeRate)}
                  </td>
                  <td className="px-3 py-2">
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Costs */}
      {formData.type === 'import' && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Import Costing (13 Types)</label>
          <div className="grid grid-cols-4 gap-3 p-4 bg-blue-50 rounded-lg">
            {IMPORT_COST_TYPES.map(cost => (
              <div key={cost.id}>
                <label className="block text-xs text-gray-600 mb-1">
                  {cost.nameEn} {cost.hasVat && <span className="text-blue-500">(+VAT)</span>}
                </label>
                <input
                  type="number"
                  value={formData.importCosts[cost.id] || ''}
                  onChange={(e) => updateImportCost(cost.id, e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm text-right"
                  placeholder="฿0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal (Materials)</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {formData.type === 'import' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Import Costs</span>
                <span className="font-medium">{formatCurrency(totalImportCosts)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">VAT 7%</span>
              <span className="font-medium">{formatCurrency(vat7)}</span>
            </div>
            {formData.type === 'import' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Withholding 3%</span>
                <span className="font-medium text-red-600">-{formatCurrency(withholding3)}</span>
              </div>
            )}
          </div>
          <div className="flex items-end justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-500">Grand Total</div>
              <div className="text-3xl font-bold text-[#2ECC40]">{formatCurrency(grandTotal)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
      </div>
    </form>
  )
}

const GoodsReceiptForm = ({ po, vendors, onSave, onCancel, lang }) => {
  const vendor = vendors.find(v => v.id === po.vendorId)
  const [grnItems, setGrnItems] = useState(
    po.items.map(item => ({
      ...item,
      qtyToReceive: item.qtyOrdered - (item.qtyReceived || 0),
      actualThickness: item.thickness,
      actualWidth: item.width,
      actualLength: item.length,
      varianceReason: '',
    }))
  )
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [pendingLots, setPendingLots] = useState([])

  const updateGrnItem = (idx, field, value) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  // Generate lot preview for label printing
  const generatePreviewLots = () => {
    return grnItems.filter(item => item.qtyToReceive > 0).map((item, idx) => {
      const prefix = po.type === 'import' || item.category.startsWith('PLY') ? 'IND2' : 'IND'
      const lotNo = `LP${Date.now().toString().slice(-5)}${idx}`
      return {
        lotNo,
        code: `${prefix}-${item.category}/${item.actualThickness}/${item.actualWidth}/${item.actualLength}`,
        category: item.category,
        qty: item.qtyToReceive,
        dateIn: grnDate,
      }
    })
  }

  const handlePrintLabels = () => {
    const lots = generatePreviewLots()
    setPendingLots(lots)
    setShowLabelModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      poId: po.id,
      grnDate,
      notes,
      items: grnItems.map(item => ({
        id: item.id,
        category: item.category,
        materialCode: item.materialCode,
        thickness: item.actualThickness,
        width: item.actualWidth,
        length: item.actualLength,
        qtyReceived: item.qtyToReceive,
        unitPrice: item.unitPrice,
        varianceReason: item.varianceReason,
      }))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PO Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">PO Number</div>
            <div className="font-bold text-[#1A5276]">{po.id}</div>
          </div>
          <div>
            <div className="text-gray-500">Vendor</div>
            <div className="font-medium">{vendor?.name}</div>
          </div>
          <div>
            <div className="text-gray-500">Invoice</div>
            <div className="font-medium">{po.invoiceNo || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-500">Type</div>
            <Badge variant={po.type === 'import' ? 'info' : 'success'}>{po.type}</Badge>
          </div>
        </div>
      </div>

      {/* GRN Date */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Date *</label>
          <input
            type="date"
            required
            value={grnDate}
            onChange={(e) => setGrnDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Items to Receive */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Items to Receive (Editable)</label>
        <div className="space-y-4">
          {grnItems.map((item, idx) => {
            const remaining = item.qtyOrdered - (po.items[idx].qtyReceived || 0)
            const hasVariance = item.qtyToReceive !== remaining || 
                               item.actualThickness !== item.thickness ||
                               item.actualWidth !== item.width ||
                               item.actualLength !== item.length
            
            return (
              <Card key={idx} className={`p-4 ${hasVariance ? 'border-amber-300 bg-amber-50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{item.category}</Badge>
                      <span className="font-mono text-sm">{item.materialCode}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Ordered: {item.qtyOrdered} {item.unit} | Already Received: {po.items[idx].qtyReceived || 0} | Remaining: {remaining}
                    </div>
                  </div>
                  {hasVariance && (
                    <Badge variant="warning">⚠️ Variance</Badge>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Qty to Receive *</label>
                    <input
                      type="number"
                      value={item.qtyToReceive}
                      onChange={(e) => updateGrnItem(idx, 'qtyToReceive', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg ${item.qtyToReceive !== remaining ? 'border-amber-400 bg-amber-50' : ''}`}
                      max={remaining}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Actual Thickness</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualThickness}
                      onChange={(e) => updateGrnItem(idx, 'actualThickness', parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualThickness !== item.thickness ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Actual Width</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualWidth}
                      onChange={(e) => updateGrnItem(idx, 'actualWidth', parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualWidth !== item.width ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Actual Length</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualLength}
                      onChange={(e) => updateGrnItem(idx, 'actualLength', parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualLength !== item.length ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cost</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg font-medium text-[#2ECC40]">
                      {formatCurrency(item.qtyToReceive * item.unitPrice * (po.exchangeRate || 1))}
                    </div>
                  </div>
                </div>

                {hasVariance && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Variance Reason *</label>
                    <input
                      type="text"
                      value={item.varianceReason}
                      onChange={(e) => updateGrnItem(idx, 'varianceReason', e.target.value)}
                      placeholder="Explain the variance (e.g., 2 pieces short, 10mm shorter length)"
                      className="w-full px-3 py-2 border border-amber-400 rounded-lg bg-amber-50"
                      required={hasVariance}
                    />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Any additional notes about this receipt..."
        />
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-green-800">Receipt Summary</div>
            <div className="text-sm text-green-600">
              {grnItems.reduce((sum, i) => sum + i.qtyToReceive, 0)} items will be added to inventory
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600">Total Value</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(grnItems.reduce((sum, i) => sum + (i.qtyToReceive * i.unitPrice * (po.exchangeRate || 1)), 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="button" variant="outline" icon={Printer} onClick={handlePrintLabels}>Print Labels</Button>
        <Button type="submit" icon={Save}>Confirm Receipt</Button>
      </div>

      {/* Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        lots={pendingLots}
        lang={lang}
      />
    </form>
  )
}

// ============================================
// DASHBOARD
// ============================================
const Dashboard = ({ stores, inventory, categories, purchaseOrders = [], lang }) => {
  const stats = {
    totalValue: inventory.reduce((sum, i) => sum + i.cost, 0),
    totalLots: inventory.length,
    lowStock: inventory.filter(i => i.status === 'low').length,
    activeWO: 15,
    onTimeDelivery: 92,
    monthlyRevenue: 12500000,
    pendingPOs: purchaseOrders.filter(p => p.status !== 'received').length,
  }

  const recentActivity = [
    { type: 'receive', text: 'Received MLH from Thai Timber', time: '2 hours ago', icon: Package, color: 'green' },
    { type: 'po', text: 'New PO created for Stora Enso', time: '3 hours ago', icon: FileText, color: 'blue' },
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
    const saved = localStorage.getItem('ind_stores_v3')
    return saved ? JSON.parse(saved) : INITIAL_STORES
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('ind_categories_v3')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ind_inventory_v3')
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY
  })
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('ind_customers_v3')
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
  })
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('ind_vendors_v3')
    return saved ? JSON.parse(saved) : INITIAL_VENDORS
  })
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('ind_purchase_orders_v3')
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ind_stores_v3', JSON.stringify(stores))
  }, [stores])
  useEffect(() => {
    localStorage.setItem('ind_categories_v3', JSON.stringify(categories))
  }, [categories])
  useEffect(() => {
    localStorage.setItem('ind_inventory_v3', JSON.stringify(inventory))
  }, [inventory])
  useEffect(() => {
    localStorage.setItem('ind_customers_v3', JSON.stringify(customers))
  }, [customers])
  useEffect(() => {
    localStorage.setItem('ind_vendors_v3', JSON.stringify(vendors))
  }, [vendors])
  useEffect(() => {
    localStorage.setItem('ind_purchase_orders_v3', JSON.stringify(purchaseOrders))
  }, [purchaseOrders])

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
        return <Dashboard stores={stores} inventory={inventory} categories={categories} purchaseOrders={purchaseOrders} lang={lang} />
      case 'admin-stores':
        return <StoreBuilder stores={stores} setStores={setStores} categories={categories} lang={lang} />
      case 'admin-categories':
        return <CategoryManager categories={categories} setCategories={setCategories} lang={lang} />
      case 'inventory':
        return <InventoryModule inventory={inventory} setInventory={setInventory} stores={stores} categories={categories} lang={lang} />
      case 'purchase':
        return <PurchaseModule 
          purchaseOrders={purchaseOrders} 
          setPurchaseOrders={setPurchaseOrders}
          vendors={vendors}
          categories={categories}
          stores={stores}
          inventory={inventory}
          setInventory={setInventory}
          lang={lang} 
        />
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
