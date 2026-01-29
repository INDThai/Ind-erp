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
  Languages, Check, AlertCircle, Info, HelpCircle, ExternalLink, Play
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
// DEPARTMENT MANAGER
// ============================================
const DepartmentManager = ({ departments, setDepartments, lang }) => {
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    nameEn: '',
    nameTh: '',
    type: 'processing',
    hourlyRate: 180,
    sequence: 1,
    isActive: true,
  })

  const openAdd = () => {
    setFormData({
      code: '',
      nameEn: '',
      nameTh: '',
      type: 'processing',
      hourlyRate: 180,
      sequence: departments.length + 1,
      isActive: true,
    })
    setEditingDept(null)
    setShowModal(true)
  }

  const openEdit = (dept) => {
    setFormData({ ...dept })
    setEditingDept(dept)
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...formData } : d))
    } else {
      const newId = formData.code.toUpperCase()
      setDepartments([...departments, { ...formData, id: newId }])
    }
    setShowModal(false)
  }

  const toggleActive = (dept) => {
    setDepartments(departments.map(d => d.id === dept.id ? { ...d, isActive: !d.isActive } : d))
  }

  const getTypeColor = (type) => {
    const colors = {
      cutting: 'bg-red-100 text-red-700',
      processing: 'bg-blue-100 text-blue-700',
      assembly: 'bg-green-100 text-green-700',
      treatment: 'bg-orange-100 text-orange-700',
      qa: 'bg-purple-100 text-purple-700',
      fg: 'bg-teal-100 text-teal-700',
      machine: 'bg-gray-100 text-gray-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const sortedDepts = [...departments].sort((a, b) => a.sequence - b.sequence)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Production Departments</h1>
          <p className="text-gray-500">Configure cutting, processing, assembly, QC stations and machines</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Department</Button>
      </div>

      {/* Info Banner */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <div className="font-medium text-blue-800">Production Departments</div>
            <div className="text-sm text-blue-600">
              Add cutting stations (C1, C2...), assembly lines (A1, A2...), processing areas (P1, P2...), 
              machines, or QC stations. These appear in Work Order operations.
            </div>
            <div className="text-sm text-blue-600 mt-1">
              <strong>Note:</strong> Trucks & Transport are managed separately in the <strong>Transport Module</strong>.
            </div>
          </div>
        </div>
      </Card>

      {/* Department Grid */}
      <div className="grid grid-cols-3 gap-4">
        {sortedDepts.map(dept => (
          <Card key={dept.id} className={`p-4 ${!dept.isActive ? 'opacity-50 bg-gray-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A5276] to-[#2ECC40] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{dept.code}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">{dept.nameEn}</div>
                  <div className="text-sm text-gray-500">{dept.nameTh}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(dept)} className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(dept)} className={`p-1.5 rounded ${dept.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {dept.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Badge className={getTypeColor(dept.type)}>{dept.type}</Badge>
              <span className="text-gray-600">฿{dept.hourlyRate}/hr</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">Sequence: {dept.sequence}</div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? `Edit Department - ${editingDept.code}` : 'Add New Department'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-lg uppercase"
                placeholder="C1, A1, P1, M1..."
                disabled={!!editingDept}
              />
              <p className="text-xs text-gray-500 mt-1">Use: C=Cutting, A=Assembly, P=Process, M=Machine</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {DEPARTMENT_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.nameEn} / {t.nameTh}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Cutting 1 (Singh)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Thai) *</label>
              <input
                type="text"
                value={formData.nameTh}
                onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="ตัด 1 (สิงห์)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (฿)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sequence</label>
              <input
                type="number"
                value={formData.sequence}
                onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Order in production flow</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-[#1A5276]"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active (available for work orders)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.code || !formData.nameEn}>
              {editingDept ? 'Save Changes' : 'Add Department'}
            </Button>
          </div>
        </div>
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
// PRODUCTION MODULE DATA
// ============================================
const INITIAL_DEPARTMENTS = [
  // Cutting departments
  { id: 'C1', code: 'C1', nameEn: 'Cutting 1 (Singh)', nameTh: 'ตัด 1 (สิงห์)', hourlyRate: 200, type: 'cutting', sequence: 1, isActive: true },
  { id: 'C2', code: 'C2', nameEn: 'Cutting 2 (One)', nameTh: 'ตัด 2 (วัน)', hourlyRate: 200, type: 'cutting', sequence: 2, isActive: true },
  // Processing departments
  { id: 'P1', code: 'P1', nameEn: 'Processing 1', nameTh: 'แปรรูป 1', hourlyRate: 180, type: 'processing', sequence: 3, isActive: true },
  { id: 'P2', code: 'P2', nameEn: 'Processing 2', nameTh: 'แปรรูป 2', hourlyRate: 180, type: 'processing', sequence: 4, isActive: true },
  { id: 'P3', code: 'P3', nameEn: 'Processing 3', nameTh: 'แปรรูป 3', hourlyRate: 180, type: 'processing', sequence: 5, isActive: true },
  // Assembly departments
  { id: 'A1', code: 'A1', nameEn: 'Assembly 1 (Khem)', nameTh: 'ประกอบ 1 (เข็ม)', hourlyRate: 180, type: 'assembly', sequence: 6, isActive: true },
  { id: 'A2', code: 'A2', nameEn: 'Assembly 2 (Khwai)', nameTh: 'ประกอบ 2 (ควาย)', hourlyRate: 180, type: 'assembly', sequence: 7, isActive: true },
  // Treatment & QC
  { id: 'OVEN', code: 'OVEN', nameEn: 'Oven / Heat Treatment', nameTh: 'อบความร้อน', hourlyRate: 150, type: 'treatment', sequence: 8, isActive: true },
  { id: 'QC', code: 'QC', nameEn: 'Quality Control', nameTh: 'ตรวจคุณภาพ', hourlyRate: 200, type: 'qa', sequence: 9, isActive: true },
  // Finished Goods (end of production)
  { id: 'FG', code: 'FG', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป', hourlyRate: 150, type: 'fg', sequence: 10, isActive: true },
]

// Trucks belong to Transport Module (separate from Production)
const INITIAL_TRUCKS = [
  { id: 'T1', code: 'T1', nameEn: 'Truck 1 (6-Wheeler)', nameTh: 'รถบรรทุก 1 (6 ล้อ)', capacity: '5 tons', driver: '', status: 'available', isActive: true },
  { id: 'T2', code: 'T2', nameEn: 'Truck 2 (10-Wheeler)', nameTh: 'รถบรรทุก 2 (10 ล้อ)', capacity: '10 tons', driver: '', status: 'available', isActive: true },
]

// Department types for dropdown (Production only)
const DEPARTMENT_TYPES = [
  { id: 'cutting', nameEn: 'Cutting', nameTh: 'ตัด' },
  { id: 'processing', nameEn: 'Processing', nameTh: 'แปรรูป' },
  { id: 'assembly', nameEn: 'Assembly', nameTh: 'ประกอบ' },
  { id: 'treatment', nameEn: 'Treatment', nameTh: 'การบำบัด' },
  { id: 'qa', nameEn: 'Quality Control', nameTh: 'ควบคุมคุณภาพ' },
  { id: 'fg', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป' },
  { id: 'machine', nameEn: 'Machine', nameTh: 'เครื่องจักร' },
]

const INITIAL_PRODUCTS = [
  { id: 'PLT-STD-1200', code: 'PLT-STD-1200', nameEn: 'Standard Pallet 1200×1000', nameTh: 'พาเลทมาตรฐาน 1200×1000', unit: 'pcs', defaultPrice: 250, isActive: true },
  { id: 'PLT-STD-1100', code: 'PLT-STD-1100', nameEn: 'Standard Pallet 1100×1100', nameTh: 'พาเลทมาตรฐาน 1100×1100', unit: 'pcs', defaultPrice: 230, isActive: true },
  { id: 'BOX-STD', code: 'BOX-STD', nameEn: 'Standard Wooden Box', nameTh: 'กล่องไม้มาตรฐาน', unit: 'pcs', defaultPrice: 450, isActive: true },
  { id: 'BOX-CUSTOM', code: 'BOX-CUSTOM', nameEn: 'Custom Wooden Box', nameTh: 'กล่องไม้ตามสั่ง', unit: 'pcs', defaultPrice: 0, isActive: true },
  { id: 'CUT-CUSTOM', code: 'CUT-CUSTOM', nameEn: 'Custom Cutting', nameTh: 'ตัดไม้ตามสั่ง', unit: 'pcs', defaultPrice: 0, isActive: true },
]

const INITIAL_WORK_ORDERS = [
  {
    id: 'WO-2501-001',
    customerId: 'C001',
    customerPO: 'ABC-PO-2501',
    productId: 'PLT-STD-1200',
    productName: 'Standard Pallet 1200×1000',
    quantity: 100,
    unit: 'pcs',
    orderDate: '2025-01-10',
    deliveryDate: '2025-02-15',
    deliveryDateLocked: true,
    sellingPrice: 250,
    totalRevenue: 25000,
    status: 'in_progress',
    priority: 'normal',
    materials: [
      { id: 1, category: 'MLH', code: 'IND-MLH/0.5/3/2.4', qtyRequired: 50, qtyIssued: 50, unit: 'pcs', estCost: 12500, actualCost: 12500 },
      { id: 2, category: 'CONS', code: 'Nails 3"', qtyRequired: 25, qtyIssued: 25, unit: 'kg', estCost: 2000, actualCost: 2000 },
    ],
    operations: [
      { id: 1, deptId: 'C1', deptName: 'Cutting 1 (Singh)', estHours: 8, actualHours: 8, status: 'completed', startTime: '2025-01-20T08:00:00', endTime: '2025-01-20T16:00:00', worker: 'สมชาย' },
      { id: 2, deptId: 'P1', deptName: 'Processing 1', estHours: 12, actualHours: 6, status: 'in_progress', startTime: '2025-01-21T08:00:00', endTime: null, worker: 'สมหญิง' },
      { id: 3, deptId: 'A1', deptName: 'Assembly 1 (Khem)', estHours: 10, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
      { id: 4, deptId: 'QC', deptName: 'Quality Control', estHours: 2, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
      { id: 5, deptId: 'FG', deptName: 'Finished Goods', estHours: 1, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
    ],
    costs: { material: 14500, labor: 2680, overhead: 2175, other: 0, total: 19355, perUnit: 193.55 },
    profit: { amount: 5645, margin: 22.58 },
    instructions: { en: 'Cut planks to 1200mm, assemble with nails', th: 'ตัดไม้ยาว 1200 มม. ประกอบด้วยตะปู' },
    notes: '',
    createdAt: '2025-01-10',
    createdBy: 'Vinit',
  },
  {
    id: 'WO-2501-002',
    customerId: 'C002',
    customerPO: 'XYZ-PO-789',
    productId: 'BOX-CUSTOM',
    productName: 'Custom Box 800×600×400',
    quantity: 50,
    unit: 'pcs',
    orderDate: '2025-01-15',
    deliveryDate: '2025-02-10',
    deliveryDateLocked: true,
    sellingPrice: 580,
    totalRevenue: 29000,
    status: 'planned',
    priority: 'high',
    materials: [
      { id: 1, category: 'PLYRW', code: 'IND2-PLYRW/12/1220/2440', qtyRequired: 30, qtyIssued: 0, unit: 'sheets', estCost: 15000, actualCost: 0 },
      { id: 2, category: 'MLH', code: 'IND-MLH/0.5/2/1.2', qtyRequired: 100, qtyIssued: 0, unit: 'pcs', estCost: 8000, actualCost: 0 },
    ],
    operations: [
      { id: 1, deptId: 'C2', deptName: 'Cutting 2 (One)', estHours: 6, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
      { id: 2, deptId: 'A2', deptName: 'Assembly 2 (Khwai)', estHours: 16, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
      { id: 3, deptId: 'QC', deptName: 'Quality Control', estHours: 3, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null },
    ],
    costs: { material: 23000, labor: 0, overhead: 3450, other: 0, total: 26450, perUnit: 529 },
    profit: { amount: 2550, margin: 8.79 },
    instructions: { en: 'Custom box with reinforced corners', th: 'กล่องพิเศษเสริมมุม' },
    notes: 'Rush order - customer needs by Feb 10',
    createdAt: '2025-01-15',
    createdBy: 'Vinit',
  },
]

// ============================================
// PRODUCTION MODULE COMPONENT
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
// PRODUCTION MODULE
// ============================================
const ProductionModule = ({ workOrders, setWorkOrders, departments, customers, inventory, setInventory, categories, stores, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showWOModal, setShowWOModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [selectedWO, setSelectedWO] = useState(null)
  const [floorViewDept, setFloorViewDept] = useState('all')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workorders', label: 'Work Orders', icon: FileText },
    { id: 'floor', label: 'Floor View / หน้างาน', icon: Factory },
    { id: 'costing', label: 'Costing', icon: Calculator },
  ]

  // Stats
  const stats = {
    total: workOrders.length,
    planned: workOrders.filter(w => w.status === 'planned').length,
    inProgress: workOrders.filter(w => w.status === 'in_progress').length,
    completed: workOrders.filter(w => w.status === 'completed').length,
    totalRevenue: workOrders.reduce((sum, w) => sum + w.totalRevenue, 0),
    atRisk: workOrders.filter(w => {
      const daysLeft = Math.ceil((new Date(w.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
      return daysLeft <= 3 && w.status !== 'completed' && w.status !== 'delivered'
    }).length,
  }

  const handleStartOperation = (woId, opId) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        const updatedOps = wo.operations.map(op => {
          if (op.id === opId) {
            return { ...op, status: 'in_progress', startTime: new Date().toISOString() }
          }
          return op
        })
        return { ...wo, operations: updatedOps, status: 'in_progress' }
      }
      return wo
    }))
  }

  const handleCompleteOperation = (woId, opId, actualHours) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        const dept = departments.find(d => d.id === wo.operations.find(o => o.id === opId)?.deptId)
        const laborCost = actualHours * (dept?.hourlyRate || 180)
        
        const updatedOps = wo.operations.map(op => {
          if (op.id === opId) {
            return { ...op, status: 'completed', endTime: new Date().toISOString(), actualHours }
          }
          return op
        })
        
        const allCompleted = updatedOps.every(op => op.status === 'completed')
        const totalLabor = updatedOps.reduce((sum, op) => {
          const d = departments.find(dept => dept.id === op.deptId)
          return sum + (op.actualHours * (d?.hourlyRate || 180))
        }, 0)
        
        const newCosts = { 
          ...wo.costs, 
          labor: totalLabor,
          total: wo.costs.material + totalLabor + wo.costs.overhead + wo.costs.other,
          perUnit: (wo.costs.material + totalLabor + wo.costs.overhead + wo.costs.other) / wo.quantity
        }
        const newProfit = {
          amount: wo.totalRevenue - newCosts.total,
          margin: ((wo.totalRevenue - newCosts.total) / wo.totalRevenue * 100)
        }
        
        return { 
          ...wo, 
          operations: updatedOps, 
          status: allCompleted ? 'completed' : 'in_progress',
          costs: newCosts,
          profit: newProfit
        }
      }
      return wo
    }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.production', lang)}</h1>
          <p className="text-gray-500">Manage work orders, material issues, and production tracking</p>
        </div>
        <Button icon={Plus} onClick={() => { setSelectedWO(null); setShowWOModal(true) }}>
          New Work Order
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
        <ProductionDashboard 
          stats={stats} 
          workOrders={workOrders} 
          customers={customers}
          departments={departments}
          onViewWO={(wo) => { setSelectedWO(wo); setActiveTab('workorders') }}
        />
      )}
      {activeTab === 'workorders' && (
        <WorkOrderList 
          workOrders={workOrders} 
          customers={customers}
          departments={departments}
          onEdit={(wo) => { setSelectedWO(wo); setShowWOModal(true) }}
          onIssue={(wo) => { setSelectedWO(wo); setShowIssueModal(true) }}
          lang={lang}
        />
      )}
      {activeTab === 'floor' && (
        <FloorView 
          workOrders={workOrders}
          departments={departments}
          selectedDept={floorViewDept}
          onSelectDept={setFloorViewDept}
          onStartOp={handleStartOperation}
          onCompleteOp={handleCompleteOperation}
          lang={lang}
        />
      )}
      {activeTab === 'costing' && (
        <ProductionCosting workOrders={workOrders} customers={customers} lang={lang} />
      )}

      {/* Work Order Modal */}
      <Modal
        isOpen={showWOModal}
        onClose={() => { setShowWOModal(false); setSelectedWO(null) }}
        title={selectedWO ? `Edit Work Order - ${selectedWO.id}` : 'Create Work Order'}
        size="xl"
      >
        <WorkOrderForm
          wo={selectedWO}
          customers={customers}
          departments={departments}
          inventory={inventory}
          categories={categories}
          onSave={(woData) => {
            if (selectedWO) {
              setWorkOrders(workOrders.map(w => w.id === selectedWO.id ? { ...w, ...woData } : w))
            } else {
              const newId = `WO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(workOrders.length + 1).padStart(3, '0')}`
              setWorkOrders([...workOrders, { ...woData, id: newId, createdAt: new Date().toISOString().split('T')[0], createdBy: 'Vinit' }])
            }
            setShowWOModal(false)
            setSelectedWO(null)
          }}
          onCancel={() => { setShowWOModal(false); setSelectedWO(null) }}
          lang={lang}
        />
      </Modal>

      {/* Material Issue Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => { setShowIssueModal(false); setSelectedWO(null) }}
        title={`Issue Materials - ${selectedWO?.id}`}
        size="lg"
      >
        {selectedWO && (
          <MaterialIssueForm
            wo={selectedWO}
            inventory={inventory}
            onIssue={(issueData) => {
              // Update inventory
              setInventory(inventory.map(lot => {
                const issue = issueData.items.find(i => i.lotId === lot.id)
                if (issue) {
                  return { ...lot, qty: lot.qty - issue.qtyIssued }
                }
                return lot
              }))
              // Update WO materials
              setWorkOrders(workOrders.map(wo => {
                if (wo.id === selectedWO.id) {
                  const updatedMaterials = wo.materials.map(mat => {
                    const issue = issueData.items.find(i => i.materialId === mat.id)
                    if (issue) {
                      return { ...mat, qtyIssued: mat.qtyIssued + issue.qtyIssued, actualCost: mat.actualCost + issue.totalCost }
                    }
                    return mat
                  })
                  const materialCost = updatedMaterials.reduce((sum, m) => sum + m.actualCost, 0)
                  return { 
                    ...wo, 
                    materials: updatedMaterials,
                    costs: { ...wo.costs, material: materialCost, total: materialCost + wo.costs.labor + wo.costs.overhead }
                  }
                }
                return wo
              }))
              setShowIssueModal(false)
              setSelectedWO(null)
            }}
            onCancel={() => { setShowIssueModal(false); setSelectedWO(null) }}
            lang={lang}
          />
        )}
      </Modal>
    </div>
  )
}

// Production Dashboard
const ProductionDashboard = ({ stats, workOrders, customers, departments, onViewWO }) => {
  const urgentOrders = workOrders.filter(wo => {
    const daysLeft = Math.ceil((new Date(wo.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 7 && wo.status !== 'completed' && wo.status !== 'delivered'
  }).sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500">Total WOs</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{stats.planned}</div>
              <div className="text-sm text-gray-500">Planned</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Play className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.atRisk}</div>
              <div className="text-sm text-gray-500">At Risk</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2ECC40]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#2ECC40]" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Urgent Orders */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Upcoming Deliveries (Next 7 Days)
        </h3>
        {urgentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No urgent deliveries!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentOrders.map(wo => {
              const customer = customers.find(c => c.id === wo.customerId)
              const daysLeft = Math.ceil((new Date(wo.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
              const completedOps = wo.operations.filter(o => o.status === 'completed').length
              const progress = (completedOps / wo.operations.length) * 100
              
              return (
                <div key={wo.id} className={`p-4 rounded-xl border-2 ${daysLeft <= 2 ? 'border-red-300 bg-red-50' : daysLeft <= 5 ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${daysLeft <= 2 ? 'bg-red-500' : daysLeft <= 5 ? 'bg-amber-500' : 'bg-blue-500'}`}>
                        {daysLeft}d
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{wo.id}</div>
                        <div className="text-sm text-gray-500">{customer?.name || 'Unknown'} • {wo.productName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{wo.quantity} {wo.unit}</div>
                      <div className="text-sm text-gray-500">Due: {wo.deliveryDate}</div>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2ECC40] rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onViewWO(wo)}>View</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Department Status */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">Department Workload</h3>
        <div className="grid grid-cols-4 gap-4">
          {departments.slice(0, 8).map(dept => {
            const activeOps = workOrders.flatMap(wo => wo.operations).filter(op => op.deptId === dept.id && op.status === 'in_progress')
            const pendingOps = workOrders.flatMap(wo => wo.operations).filter(op => op.deptId === dept.id && op.status === 'pending')
            
            return (
              <div key={dept.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{dept.nameTh}</span>
                  <span className="text-sm text-gray-500">{dept.nameEn}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{activeOps.length} active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>{pendingOps.length} pending</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// Work Order List
const WorkOrderList = ({ workOrders, customers, departments, onEdit, onIssue, lang }) => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = workOrders.filter(wo => {
    const customer = customers.find(c => c.id === wo.customerId)
    const matchesSearch = wo.id.toLowerCase().includes(search.toLowerCase()) ||
                          customer?.name.toLowerCase().includes(search.toLowerCase()) ||
                          wo.productName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const variants = {
      planned: { variant: 'info', label: '📋 Planned' },
      in_progress: { variant: 'warning', label: '🔄 In Progress' },
      completed: { variant: 'success', label: '✅ Completed' },
      delivered: { variant: 'default', label: '🚚 Delivered' },
    }
    return variants[status] || { variant: 'info', label: status }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search WO, customer, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">WO Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Qty</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Delivery 🔒</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Progress</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Cost</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Margin</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(wo => {
              const customer = customers.find(c => c.id === wo.customerId)
              const daysLeft = Math.ceil((new Date(wo.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
              const completedOps = wo.operations.filter(o => o.status === 'completed').length
              const progress = (completedOps / wo.operations.length) * 100
              const statusBadge = getStatusBadge(wo.status)
              
              return (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-[#1A5276]">{wo.id}</span>
                      {wo.priority === 'high' && <Badge variant="danger">RUSH</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{customer?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{wo.customerPO}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{wo.productName}</td>
                  <td className="px-4 py-3 text-right font-medium">{wo.quantity} {wo.unit}</td>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-gray-800'}`}>
                      {wo.deliveryDate}
                    </div>
                    <div className="text-sm text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Today!' : `${Math.abs(daysLeft)} days overdue`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2ECC40] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{Math.round(progress)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(wo.costs.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${wo.profit.margin >= 20 ? 'text-green-600' : wo.profit.margin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                      {wo.profit.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEdit(wo)} className="p-1.5 text-gray-400 hover:text-[#1A5276] hover:bg-gray-100 rounded" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onIssue(wo)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-gray-100 rounded" title="Issue Materials">
                        <Package className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded" title="Print">
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

// Floor View (Thai Primary)
const FloorView = ({ workOrders, departments, selectedDept, onSelectDept, onStartOp, onCompleteOp, lang }) => {
  const [completingOp, setCompletingOp] = useState(null)
  const [actualHours, setActualHours] = useState('')

  const activeWOs = workOrders.filter(wo => wo.status === 'in_progress' || wo.status === 'planned')

  const handleComplete = () => {
    if (completingOp && actualHours) {
      onCompleteOp(completingOp.woId, completingOp.opId, parseFloat(actualHours))
      setCompletingOp(null)
      setActualHours('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Department Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSelectDept('all')}
          className={`px-4 py-2 rounded-lg transition-all ${selectedDept === 'all' ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          ทั้งหมด / All
        </button>
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => onSelectDept(dept.id)}
            className={`px-4 py-2 rounded-lg transition-all ${selectedDept === dept.id ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {dept.nameTh}
          </button>
        ))}
      </div>

      {/* Work Orders Cards */}
      <div className="grid grid-cols-2 gap-6">
        {activeWOs.map(wo => {
          const filteredOps = selectedDept === 'all' 
            ? wo.operations 
            : wo.operations.filter(op => op.deptId === selectedDept)
          
          if (filteredOps.length === 0) return null

          return (
            <Card key={wo.id} className="overflow-hidden">
              {/* Header */}
              <div className={`p-4 ${wo.priority === 'high' ? 'bg-red-500' : 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40]'} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">{wo.id}</div>
                    <div className="text-white/80">{wo.productName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{wo.quantity}</div>
                    <div className="text-white/80">{wo.unit}</div>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="p-3 bg-amber-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">วันส่งมอบ / Delivery:</span>
                </div>
                <span className="font-bold text-amber-800">{wo.deliveryDate}</span>
              </div>

              {/* Materials */}
              <div className="p-4 border-b">
                <div className="font-medium text-gray-700 mb-2">วัสดุ / Materials:</div>
                <div className="space-y-1">
                  {wo.materials.map(mat => (
                    <div key={mat.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{mat.code}</span>
                      <span className={`font-medium ${mat.qtyIssued >= mat.qtyRequired ? 'text-green-600' : 'text-amber-600'}`}>
                        {mat.qtyIssued >= mat.qtyRequired ? '✅' : '⏳'} {mat.qtyIssued}/{mat.qtyRequired} {mat.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations */}
              <div className="p-4">
                <div className="font-medium text-gray-700 mb-3">แผนก / Departments:</div>
                <div className="space-y-3">
                  {filteredOps.map(op => (
                    <div 
                      key={op.id} 
                      className={`p-3 rounded-lg border-2 ${
                        op.status === 'completed' ? 'border-green-300 bg-green-50' :
                        op.status === 'in_progress' ? 'border-amber-300 bg-amber-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {op.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : op.status === 'in_progress' ? (
                            <Play className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-bold text-gray-800">{op.deptName}</span>
                        </div>
                        <Badge variant={
                          op.status === 'completed' ? 'success' :
                          op.status === 'in_progress' ? 'warning' : 'info'
                        }>
                          {op.status === 'completed' ? 'เสร็จแล้ว' :
                           op.status === 'in_progress' ? 'กำลังทำ' : 'รอ'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>เวลา / Hours: {op.actualHours || 0}/{op.estHours}</span>
                        {op.worker && <span>ผู้ทำ: {op.worker}</span>}
                      </div>

                      {/* Action Buttons */}
                      {op.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => onStartOp(wo.id, op.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          เริ่มงาน / Start
                        </Button>
                      )}
                      {op.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="success"
                          className="w-full mt-3"
                          onClick={() => setCompletingOp({ woId: wo.id, opId: op.id, estHours: op.estHours })}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          เสร็จงาน / Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {wo.instructions.th && (
                <div className="p-4 border-t bg-blue-50">
                  <div className="font-medium text-blue-800 mb-1">คำแนะนำ / Instructions:</div>
                  <p className="text-sm text-blue-700">{wo.instructions.th}</p>
                  <p className="text-sm text-blue-600 mt-1">{wo.instructions.en}</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Complete Operation Modal */}
      {completingOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">เสร็จงาน / Complete Operation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชั่วโมงจริง / Actual Hours (Est: {completingOp.estHours}h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl text-xl text-center focus:ring-2 focus:ring-[#1A5276]"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setCompletingOp(null)}>
                  ยกเลิก / Cancel
                </Button>
                <Button className="flex-1" onClick={handleComplete} disabled={!actualHours}>
                  ยืนยัน / Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Work Order Form
const WorkOrderForm = ({ wo, customers, departments, inventory, categories, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    customerId: wo?.customerId || '',
    customerPO: wo?.customerPO || '',
    productId: wo?.productId || '',
    productName: wo?.productName || '',
    quantity: wo?.quantity || 0,
    unit: wo?.unit || 'pcs',
    orderDate: wo?.orderDate || new Date().toISOString().split('T')[0],
    deliveryDate: wo?.deliveryDate || '',
    deliveryDateLocked: wo?.deliveryDateLocked ?? true,
    sellingPrice: wo?.sellingPrice || 0,
    priority: wo?.priority || 'normal',
    instructions: wo?.instructions || { en: '', th: '' },
    materials: wo?.materials || [],
    operations: wo?.operations || [],
  })

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { id: Date.now(), category: '', code: '', qtyRequired: 0, qtyIssued: 0, unit: 'pcs', estCost: 0, actualCost: 0 }]
    })
  }

  const addOperation = () => {
    const nextSeq = formData.operations.length + 1
    setFormData({
      ...formData,
      operations: [...formData.operations, { id: Date.now(), deptId: '', deptName: '', estHours: 0, actualHours: 0, status: 'pending', startTime: null, endTime: null, worker: null }]
    })
  }

  const updateMaterial = (idx, field, value) => {
    setFormData({
      ...formData,
      materials: formData.materials.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    })
  }

  const updateOperation = (idx, field, value) => {
    const ops = [...formData.operations]
    ops[idx] = { ...ops[idx], [field]: value }
    if (field === 'deptId') {
      const dept = departments.find(d => d.id === value)
      ops[idx].deptName = dept?.nameEn || ''
    }
    setFormData({ ...formData, operations: ops })
  }

  const totalRevenue = formData.quantity * formData.sellingPrice
  const estMaterialCost = formData.materials.reduce((sum, m) => sum + (m.estCost || 0), 0)
  const estLaborCost = formData.operations.reduce((sum, o) => {
    const dept = departments.find(d => d.id === o.deptId)
    return sum + (o.estHours * (dept?.hourlyRate || 180))
  }, 0)
  const estOverhead = estMaterialCost * 0.15
  const estTotal = estMaterialCost + estLaborCost + estOverhead
  const estMargin = totalRevenue > 0 ? ((totalRevenue - estTotal) / totalRevenue * 100) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      totalRevenue,
      costs: { material: estMaterialCost, labor: estLaborCost, overhead: estOverhead, other: 0, total: estTotal, perUnit: estTotal / formData.quantity },
      profit: { amount: totalRevenue - estTotal, margin: estMargin },
      status: wo?.status || 'planned',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      {/* Customer & Product */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer / ลูกค้า *</label>
          <select
            required
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer PO / ใบสั่งซื้อลูกค้า</label>
          <input
            type="text"
            value={formData.customerPO}
            onChange={(e) => setFormData({ ...formData, customerPO: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="ABC-PO-001"
          />
        </div>
      </div>

      {/* Product */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product / สินค้า *</label>
          <input
            type="text"
            required
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Standard Pallet 1200×1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">🔴 High / Rush</option>
          </select>
        </div>
      </div>

      {/* Quantity & Price */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity / จำนวน *</label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            <option value="pcs">pcs</option>
            <option value="sets">sets</option>
            <option value="lots">lots</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price / ราคาขาย</label>
          <input
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
          <input
            type="text"
            value={formatCurrency(totalRevenue)}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-green-50 font-bold text-green-700"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
          <input
            type="date"
            value={formData.orderDate}
            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Date 🔒 / วันส่งมอบ *
          </label>
          <input
            type="date"
            required
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg border-amber-400 bg-amber-50"
          />
          <p className="text-xs text-amber-600 mt-1">⚠️ Delivery date is LOCKED once confirmed</p>
        </div>
      </div>

      {/* Materials */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-gray-700">Materials Required / วัสดุที่ต้องการ</label>
          <button type="button" onClick={addMaterial} className="text-sm text-[#1A5276] hover:underline flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Material
          </button>
        </div>
        {formData.materials.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No materials added yet</p>
        ) : (
          <div className="space-y-2">
            {formData.materials.map((mat, idx) => (
              <div key={mat.id} className="grid grid-cols-5 gap-2 items-end">
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <select
                    value={mat.category}
                    onChange={(e) => updateMaterial(idx, 'category', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  >
                    <option value="">Select...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Code / Size</label>
                  <input
                    type="text"
                    value={mat.code}
                    onChange={(e) => updateMaterial(idx, 'code', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                    placeholder="IND-MLH/0.5/3/2.4"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Qty Required</label>
                  <input
                    type="number"
                    value={mat.qtyRequired}
                    onChange={(e) => updateMaterial(idx, 'qtyRequired', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Est. Cost</label>
                  <input
                    type="number"
                    value={mat.estCost}
                    onChange={(e) => updateMaterial(idx, 'estCost', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, materials: formData.materials.filter((_, i) => i !== idx) })}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operations */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-gray-700">Production Operations / แผนการผลิต</label>
          <button type="button" onClick={addOperation} className="text-sm text-[#1A5276] hover:underline flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Operation
          </button>
        </div>
        {formData.operations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No operations added yet</p>
        ) : (
          <div className="space-y-2">
            {formData.operations.map((op, idx) => (
              <div key={op.id} className="grid grid-cols-4 gap-2 items-end">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Department / แผนก</label>
                  <select
                    value={op.deptId}
                    onChange={(e) => updateOperation(idx, 'deptId', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  >
                    <option value="">Select...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.nameTh} - {d.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Est. Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={op.estHours}
                    onChange={(e) => updateOperation(idx, 'estHours', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, operations: formData.operations.filter((_, i) => i !== idx) })}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cost Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Cost Summary / สรุปต้นทุน</h4>
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Material</div>
            <div className="font-bold">{formatCurrency(estMaterialCost)}</div>
          </div>
          <div>
            <div className="text-gray-500">Labor</div>
            <div className="font-bold">{formatCurrency(estLaborCost)}</div>
          </div>
          <div>
            <div className="text-gray-500">Overhead (15%)</div>
            <div className="font-bold">{formatCurrency(estOverhead)}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Cost</div>
            <div className="font-bold text-red-600">{formatCurrency(estTotal)}</div>
          </div>
          <div>
            <div className="text-gray-500">Margin</div>
            <div className={`font-bold ${estMargin >= 20 ? 'text-green-600' : estMargin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
              {estMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" icon={Save}>Save Work Order</Button>
      </div>
    </form>
  )
}

// Material Issue Form
const MaterialIssueForm = ({ wo, inventory, onIssue, onCancel, lang }) => {
  const [issues, setIssues] = useState(
    wo.materials.map(mat => ({
      materialId: mat.id,
      code: mat.code,
      qtyRequired: mat.qtyRequired,
      qtyIssued: mat.qtyIssued,
      qtyToIssue: 0,
      lotId: null,
      unitCost: 0,
      totalCost: 0,
    }))
  )

  const availableLots = (category) => inventory.filter(lot => lot.category === category && lot.qty > 0)

  const updateIssue = (idx, field, value) => {
    setIssues(issues.map((issue, i) => {
      if (i === idx) {
        const updated = { ...issue, [field]: value }
        if (field === 'lotId') {
          const lot = inventory.find(l => l.id === parseInt(value))
          updated.unitCost = lot ? lot.cost / lot.qty : 0
        }
        if (field === 'qtyToIssue' || field === 'lotId') {
          const lot = inventory.find(l => l.id === parseInt(updated.lotId))
          updated.totalCost = (updated.qtyToIssue || 0) * (lot ? lot.cost / lot.qty : 0)
        }
        return updated
      }
      return issue
    }))
  }

  const handleSubmit = () => {
    const validIssues = issues.filter(i => i.qtyToIssue > 0 && i.lotId)
    if (validIssues.length > 0) {
      onIssue({ woId: wo.id, items: validIssues })
    }
  }

  const totalCost = issues.reduce((sum, i) => sum + i.totalCost, 0)

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="font-medium text-blue-800">Work Order: {wo.id}</div>
        <div className="text-sm text-blue-600">{wo.productName} - {wo.quantity} {wo.unit}</div>
      </div>

      <div className="space-y-3">
        {issues.map((issue, idx) => {
          const mat = wo.materials.find(m => m.id === issue.materialId)
          const remaining = mat.qtyRequired - mat.qtyIssued
          const lots = availableLots(mat.category)

          return (
            <div key={issue.materialId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-800">{issue.code}</div>
                  <div className="text-sm text-gray-500">
                    Required: {mat.qtyRequired} | Issued: {mat.qtyIssued} | Remaining: {remaining}
                  </div>
                </div>
                {remaining <= 0 && <Badge variant="success">✅ Complete</Badge>}
              </div>

              {remaining > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Select Lot</label>
                    <select
                      value={issue.lotId || ''}
                      onChange={(e) => updateIssue(idx, 'lotId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Select lot...</option>
                      {lots.map(lot => (
                        <option key={lot.id} value={lot.id}>
                          {lot.lotNo} - {lot.qty} avail @ {formatCurrency(lot.cost / lot.qty)}/ea
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Qty to Issue</label>
                    <input
                      type="number"
                      value={issue.qtyToIssue}
                      onChange={(e) => updateIssue(idx, 'qtyToIssue', parseInt(e.target.value) || 0)}
                      max={remaining}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Total Cost</label>
                    <input
                      type="text"
                      value={formatCurrency(issue.totalCost)}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
        <span className="font-medium text-gray-700">Total Issue Cost:</span>
        <span className="text-xl font-bold text-[#1A5276]">{formatCurrency(totalCost)}</span>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} icon={Package}>Confirm Issue</Button>
      </div>
    </div>
  )
}

// Production Costing View
const ProductionCosting = ({ workOrders, customers, lang }) => {
  const completedWOs = workOrders.filter(wo => wo.status === 'completed' || wo.status === 'delivered')
  
  const totalRevenue = completedWOs.reduce((sum, wo) => sum + wo.totalRevenue, 0)
  const totalCost = completedWOs.reduce((sum, wo) => sum + wo.costs.total, 0)
  const totalProfit = totalRevenue - totalCost
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0

  // Customer profitability
  const customerStats = customers.map(cust => {
    const custWOs = completedWOs.filter(wo => wo.customerId === cust.id)
    const revenue = custWOs.reduce((sum, wo) => sum + wo.totalRevenue, 0)
    const cost = custWOs.reduce((sum, wo) => sum + wo.costs.total, 0)
    return {
      ...cust,
      orders: custWOs.length,
      revenue,
      cost,
      profit: revenue - cost,
      margin: revenue > 0 ? ((revenue - cost) / revenue * 100) : 0,
    }
  }).filter(c => c.orders > 0).sort((a, b) => b.profit - a.profit)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Cost</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Profit</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Margin</div>
          <div className={`text-2xl font-bold ${avgMargin >= 20 ? 'text-green-600' : avgMargin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
            {avgMargin.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Customer Profitability */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">Customer Profitability Ranking</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Orders</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Revenue</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Cost</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Profit</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customerStats.map((cust, idx) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{cust.name}</td>
                <td className="px-4 py-3 text-right">{cust.orders}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(cust.revenue)}</td>
                <td className="px-4 py-3 text-right text-red-600">{formatCurrency(cust.cost)}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(cust.profit)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${cust.margin >= 20 ? 'text-green-600' : cust.margin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                    {cust.margin.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* WO Cost Details */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">Work Order Cost Details</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">WO #</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Product</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Qty</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Material</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Labor</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Overhead</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Total</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">$/Unit</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {workOrders.slice(0, 10).map(wo => (
              <tr key={wo.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-[#1A5276]">{wo.id}</td>
                <td className="px-3 py-2">{wo.productName}</td>
                <td className="px-3 py-2 text-right">{wo.quantity}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs.material)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs.labor)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs.overhead)}</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(wo.costs.total)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs.perUnit)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`font-medium ${wo.profit.margin >= 20 ? 'text-green-600' : wo.profit.margin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                    {wo.profit.margin.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
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
  const [workOrders, setWorkOrders] = useState(() => {
    const saved = localStorage.getItem('ind_work_orders_v3')
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS
  })
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('ind_departments_v3')
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS
  })
  const [trucks, setTrucks] = useState(() => {
    const saved = localStorage.getItem('ind_trucks_v3')
    return saved ? JSON.parse(saved) : INITIAL_TRUCKS
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
  useEffect(() => {
    localStorage.setItem('ind_work_orders_v3', JSON.stringify(workOrders))
  }, [workOrders])
  useEffect(() => {
    localStorage.setItem('ind_departments_v3', JSON.stringify(departments))
  }, [departments])
  useEffect(() => {
    localStorage.setItem('ind_trucks_v3', JSON.stringify(trucks))
  }, [trucks])

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: t('nav.dashboard', lang) },
    { id: 'admin', icon: Settings, label: t('nav.admin', lang), submenu: [
      { id: 'admin-stores', label: t('admin.stores', lang) },
      { id: 'admin-categories', label: t('admin.categories', lang) },
      { id: 'admin-departments', label: 'Departments / แผนก' },
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
      case 'admin-departments':
        return <DepartmentManager departments={departments} setDepartments={setDepartments} lang={lang} />
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
      case 'production':
        return <ProductionModule 
          workOrders={workOrders}
          setWorkOrders={setWorkOrders}
          departments={departments}
          customers={customers}
          inventory={inventory}
          setInventory={setInventory}
          categories={categories}
          stores={stores}
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
