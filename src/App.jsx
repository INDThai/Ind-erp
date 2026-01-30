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
  Car, Hammer, CalendarDays, FileUp, Briefcase, UserPlus, Banknote,
  Route, Fuel, MapPinned, Navigation, FileImage, FileScan, Brain,
  Cog, AlertOctagon, ClipboardCheck, Timer, BadgeCheck
} from 'lucide-react'

// ============================================
// VERSION INFO
// ============================================
const VERSION = '6.0'
const VERSION_DATE = '2026-01-30'

// ============================================
// IND LOGO (SVG as base64)
// ============================================
const IND_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
  <polygon points="30,180 100,50 30,50" fill="#1A5276"/>
  <polygon points="100,50 170,180 170,50" fill="#2ECC40"/>
  <polygon points="100,50 170,180 100,180" fill="#5DADE2"/>
  <polygon points="70,130 100,80 130,130" fill="white"/>
  <text x="100" y="210" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="36" font-weight="bold" fill="#8B4513">IND</text>
</svg>
`)}`

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
// AUTHENTICATION CONTEXT
// ============================================
const AuthContext = createContext()
const useAuth = () => useContext(AuthContext)

// ============================================
// ROLE-BASED ACCESS CONTROL
// ============================================
const ROLES = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    nameTh: 'ผู้ดูแลระบบ',
    color: 'bg-purple-600',
    modules: ['dashboard', 'admin', 'inventory', 'purchase', 'production', 'sales', 'hr', 'accounting', 'transport', 'maintenance', 'reports'],
    permissions: ['all']
  },
  sales: {
    id: 'sales',
    name: 'Sales Staff',
    nameTh: 'พนักงานขาย',
    color: 'bg-blue-500',
    modules: ['dashboard', 'sales'],
    permissions: ['sales.view', 'sales.create', 'sales.edit']
  },
  production: {
    id: 'production',
    name: 'Production Staff',
    nameTh: 'พนักงานผลิต',
    color: 'bg-orange-500',
    modules: ['dashboard', 'production', 'inventory'],
    permissions: ['production.view', 'production.edit', 'inventory.view']
  },
  warehouse: {
    id: 'warehouse',
    name: 'Warehouse Staff',
    nameTh: 'พนักงานคลัง',
    color: 'bg-yellow-600',
    modules: ['dashboard', 'inventory', 'purchase'],
    permissions: ['inventory.all', 'purchase.receive']
  },
  hr: {
    id: 'hr',
    name: 'HR Staff',
    nameTh: 'พนักงาน HR',
    color: 'bg-pink-500',
    modules: ['dashboard', 'hr'],
    permissions: ['hr.all']
  },
  accounting: {
    id: 'accounting',
    name: 'Accounting Staff',
    nameTh: 'พนักงานบัญชี',
    color: 'bg-green-500',
    modules: ['dashboard', 'accounting', 'reports', 'sales'],
    permissions: ['accounting.all', 'reports.view', 'sales.view']
  },
  transport: {
    id: 'transport',
    name: 'Transport Staff',
    nameTh: 'พนักงานขนส่ง',
    color: 'bg-cyan-500',
    modules: ['dashboard', 'transport'],
    permissions: ['transport.all']
  },
  maintenance: {
    id: 'maintenance',
    name: 'Maintenance Staff',
    nameTh: 'พนักงานซ่อมบำรุง',
    color: 'bg-purple-500',
    modules: ['dashboard', 'maintenance'],
    permissions: ['maintenance.all']
  },
}

// ============================================
// DEMO USER ACCOUNTS
// ============================================
const DEMO_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Vinit Dhariwal', nameTh: 'วินิต ธารีวาล', role: 'admin', department: 'office', entity: 'IND', email: 'vinit@indthai.com' },
  { id: 2, username: 'sales1', password: 'sales123', name: 'Kanya Srisuk', nameTh: 'กัญญา ศรีสุข', role: 'sales', department: 'sales', entity: 'IND', email: 'kanya@indthai.com' },
  { id: 3, username: 'prod1', password: 'prod123', name: 'Somchai Yodrak', nameTh: 'สมชาย ยอดรัก', role: 'production', department: 'production', entity: 'IND', email: 'somchai@indthai.com' },
  { id: 4, username: 'wh1', password: 'wh123', name: 'Prasert Thongdee', nameTh: 'ประเสริฐ ทองดี', role: 'warehouse', department: 'warehouse', entity: 'IND', email: 'prasert@indthai.com' },
  { id: 5, username: 'hr1', password: 'hr123', name: 'Nanthana Boonmee', nameTh: 'นันทนา บุญมี', role: 'hr', department: 'hr', entity: 'IND', email: 'nanthana@indthai.com' },
  { id: 6, username: 'acc1', password: 'acc123', name: 'Pakamas Rattana', nameTh: 'ผกามาศ รัตนะ', role: 'accounting', department: 'accounting', entity: 'IND2', email: 'pakamas@indthai.com' },
  { id: 7, username: 'trans1', password: 'trans123', name: 'Vichai Kaewsri', nameTh: 'วิชัย แก้วศรี', role: 'transport', department: 'transport', entity: 'IND', email: 'vichai@indthai.com' },
  { id: 8, username: 'maint1', password: 'maint123', name: 'Boonlert Jaidee', nameTh: 'บุญเลิศ ใจดี', role: 'maintenance', department: 'maintenance', entity: 'IND', email: 'boonlert@indthai.com' },
]

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
  'nav.dashboard': { en: 'Dashboard', th: 'แดชบอร์ด', my: 'ဒက်ရှ်ဘုတ်', kh: 'ផ្ទាំងគ្រប់គ្រង', zh: '仪表板', jp: 'ダッシュボード' },
  'nav.admin': { en: 'Admin Hub', th: 'ศูนย์จัดการ', my: 'စီမံခန့်ခွဲမှုဗဟို', kh: 'មជ្ឈមណ្ឌលគ្រប់គ្រង', zh: '管理中心', jp: '管理ハブ' },
  'nav.inventory': { en: 'Inventory', th: 'คลังสินค้า', my: 'စတော့', kh: 'ស្តុក', zh: '库存', jp: '在庫' },
  'nav.purchase': { en: 'Purchase', th: 'จัดซื้อ', my: 'ဝယ်ယူရေး', kh: 'ការទិញ', zh: '采购', jp: '購買' },
  'nav.production': { en: 'Production', th: 'การผลิต', my: 'ထုတ်လုပ်ရေး', kh: 'ផលិតកម្ម', zh: '生产', jp: '生産' },
  'nav.sales': { en: 'Sales', th: 'ขาย', my: 'ရောင်းချရေး', kh: 'ការលក់', zh: '销售', jp: '販売' },
  'nav.hr': { en: 'HR', th: 'ทรัพยากรบุคคล', my: 'HR', kh: 'ធនធានមនុស្ស', zh: '人力资源', jp: '人事' },
  'nav.accounting': { en: 'Accounting', th: 'บัญชี', my: 'စာရင်းကိုင်', kh: 'គណនេយ្យ', zh: '会计', jp: '会計' },
  'nav.transport': { en: 'Transport', th: 'ขนส่ง', my: 'သယ်ယူပို့ဆောင်ရေး', kh: 'ដឹកជញ្ជូន', zh: '运输', jp: '輸送' },
  'nav.maintenance': { en: 'Maintenance', th: 'ซ่อมบำรุง', my: 'ပြုပြင်ထိန်းသိမ်းရေး', kh: 'ថែទាំ', zh: '维护', jp: 'メンテナンス' },
  'nav.reports': { en: 'Reports', th: 'รายงาน', my: 'အစီရင်ခံစာများ', kh: 'របាយការណ៍', zh: '报告', jp: 'レポート' },
  // Admin
  'admin.stores': { en: 'Store Builder', th: 'จัดการคลัง', my: 'စတိုးတည်ဆောက်သူ', kh: 'អ្នកសាងសង់ហាង', zh: '仓库管理', jp: '倉庫管理' },
  'admin.categories': { en: 'Categories', th: 'หมวดหมู่', my: 'အမျိုးအစားများ', kh: 'ប្រភេទ', zh: '类别', jp: 'カテゴリー' },
  'admin.materials': { en: 'Material Types', th: 'ประเภทวัสดุ', my: 'ပစ္စည်းအမျိုးအစားများ', kh: 'ប្រភេទសម្ភារៈ', zh: '材料类型', jp: '材料タイプ' },
  'admin.customers': { en: 'Customers', th: 'ลูกค้า', my: 'ဖောက်သည်များ', kh: 'អតិថិជន', zh: '客户', jp: '顧客' },
  'admin.vendors': { en: 'Vendors', th: 'ผู้ขาย', my: 'ရောင်းချသူများ', kh: 'អ្នកលក់', zh: '供应商', jp: 'ベンダー' },
  'admin.users': { en: 'Users & Roles', th: 'ผู้ใช้และบทบาท', my: 'အသုံးပြုသူများနှင့်အခန်းကဏ္ဍများ', kh: 'អ្នកប្រើប្រាស់និងតួនាទី', zh: '用户与角色', jp: 'ユーザーと役割' },
  // Inventory
  'inventory.title': { en: 'Inventory Management', th: 'จัดการคลังสินค้า', my: 'စတော့စီမံခန့်ခွဲမှု', kh: 'ការគ្រប់គ្រងស្តុក', zh: '库存管理', jp: '在庫管理' },
  'inventory.totalValue': { en: 'Total Value', th: 'มูลค่ารวม', my: 'စုစုပေါင်းတန်ဖိုး', kh: 'តម្លៃសរុប', zh: '总价值', jp: '総額' },
  'inventory.totalLots': { en: 'Total Lots', th: 'จำนวนล็อต', my: 'စုစုပေါင်းအစုံများ', kh: 'ឡុតសរុប', zh: '总批次', jp: '総ロット' },
  'inventory.lowStock': { en: 'Low Stock', th: 'สินค้าใกล้หมด', my: 'စတော့နည်းသည်', kh: 'ស្តុកទាប', zh: '库存不足', jp: '在庫少' },
  // Actions
  'action.save': { en: 'Save', th: 'บันทึก', my: 'သိမ်းဆည်းရန်', kh: 'រក្សាទុក', zh: '保存', jp: '保存' },
  'action.cancel': { en: 'Cancel', th: 'ยกเลิก', my: 'ပယ်ဖျက်ရန်', kh: 'បោះបង់', zh: '取消', jp: 'キャンセル' },
  'action.edit': { en: 'Edit', th: 'แก้ไข', my: 'တည်းဖြတ်ရန်', kh: 'កែសម្រួល', zh: '编辑', jp: '編集' },
  'action.delete': { en: 'Delete', th: 'ลบ', my: 'ဖျက်ရန်', kh: 'លុប', zh: '删除', jp: '削除' },
  'action.search': { en: 'Search...', th: 'ค้นหา...', my: 'ရှာဖွေရန်...', kh: 'ស្វែងរក...', zh: '搜索...', jp: '検索...' },
  'action.upload': { en: 'Upload Document', th: 'อัพโหลดเอกสาร', my: 'စာရွက်စာတမ်းတင်ရန်', kh: 'បញ្ជូនឯកសារ', zh: '上传文档', jp: 'ドキュメントをアップロード' },
  'action.logout': { en: 'Logout', th: 'ออกจากระบบ', my: 'ထွက်ရန်', kh: 'ចាកចេញ', zh: '退出', jp: 'ログアウト' },
  // Login
  'login.title': { en: 'Sign In', th: 'เข้าสู่ระบบ', my: 'ဝင်ရောက်ရန်', kh: 'ចូល', zh: '登录', jp: 'サインイン' },
  'login.username': { en: 'Username', th: 'ชื่อผู้ใช้', my: 'အသုံးပြုသူအမည်', kh: 'ឈ្មោះអ្នកប្រើ', zh: '用户名', jp: 'ユーザー名' },
  'login.password': { en: 'Password', th: 'รหัสผ่าน', my: 'စကားဝှက်', kh: 'ពាក្យសម្ងាត់', zh: '密码', jp: 'パスワード' },
  'login.signin': { en: 'Sign In', th: 'เข้าสู่ระบบ', my: 'ဝင်ရောက်ရန်', kh: 'ចូល', zh: '登录', jp: 'サインイン' },
  'login.demo': { en: 'Demo Accounts', th: 'บัญชีทดลอง', my: 'Demo အကောင့်များ', kh: 'គណនីសាកល្បង', zh: '演示账户', jp: 'デモアカウント' },
  // Document Upload
  'upload.title': { en: 'Smart Document Upload', th: 'อัพโหลดเอกสารอัจฉริยะ', my: 'စမတ်စာရွက်စာတမ်းတင်ခြင်း', kh: 'បញ្ជូនឯកសារឆ្លាតវៃ', zh: '智能文档上传', jp: 'スマートドキュメントアップロード' },
  'upload.processing': { en: 'Processing document...', th: 'กำลังประมวลผลเอกสาร...', my: 'စာရွက်စာတမ်းလုပ်ဆောင်နေသည်...', kh: 'កំពុងដំណើរការឯកសារ...', zh: '处理文档中...', jp: 'ドキュメント処理中...' },
  'upload.success': { en: 'Document processed successfully!', th: 'ประมวลผลเอกสารสำเร็จ!', my: 'စာရွက်စာတမ်းအောင်မြင်စွာလုပ်ဆောင်ပြီး!', kh: 'ដំណើរការឯកសារបានជោគជ័យ!', zh: '文档处理成功!', jp: 'ドキュメント処理成功!' },
}

const t = (key, lang) => TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['en'] || key

// ============================================
// MASTER DATA - 6 STORES
// ============================================
const INITIAL_STORES = [
  { id: 'STORE1', code: 'STORE1', nameEn: 'RM Wood', nameTh: 'คลังวัตถุดิบไม้', type: 'raw_material', branch: 'IND', categories: ['MLH', 'PW', 'PWKD', 'PWGRN', 'PRTB', 'PLYWW', 'PLYRR', 'PLYRW'], isActive: true, itemCount: 658, value: 2450000 },
  { id: 'STORE2', code: 'STORE2', nameEn: 'IND 2 Ply', nameTh: 'คลังไม้อัด IND-2', type: 'branch_stock', branch: 'IND-2', categories: ['PLYWW', 'PLYRR', 'PLYRW'], isActive: true, itemCount: 234, value: 680000 },
  { id: 'STORE3', code: 'STORE3', nameEn: 'Consumables', nameTh: 'คลังวัสดุสิ้นเปลือง', type: 'consumables', branch: 'IND', categories: ['CONS'], isActive: true, itemCount: 145, value: 145000 },
  { id: 'STORE4', code: 'STORE4', nameEn: 'Office', nameTh: 'คลังเครื่องเขียน', type: 'office', branch: 'IND', categories: ['OFFICE'], isActive: true, itemCount: 85, value: 25000 },
  { id: 'STORE5', code: 'STORE5', nameEn: 'Maintenance', nameTh: 'คลังอะไหล่', type: 'maintenance', branch: 'IND', categories: ['MAINT'], isActive: true, itemCount: 320, value: 320000 },
  { id: 'STORE6', code: 'STORE6', nameEn: 'Finished FG', nameTh: 'คลังสินค้าสำเร็จรูป', type: 'finished_goods', branch: 'IND', categories: ['FG'], isActive: true, itemCount: 1250, value: 1250000 },
]

// ============================================
// MASTER DATA - 12 CATEGORIES
// ============================================
const INITIAL_CATEGORIES = [
  // Raw Material - Wood Types (8 categories)
  { id: 'MLH', code: 'MLH', nameEn: 'Mixed Hardwood', nameTh: 'ไม้เนื้อแข็งผสม', color: '#F1C40F', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PW', code: 'PW', nameEn: 'Pine Wood', nameTh: 'ไม้สน', color: '#27AE60', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PWKD', code: 'PWKD', nameEn: 'Pine Wood Kiln Dried', nameTh: 'ไม้สนอบแห้ง', color: '#1E8449', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PWGRN', code: 'PWGRN', nameEn: 'Pine Wood Green', nameTh: 'ไม้สนสด', color: '#58D68D', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PLYWW', code: 'PLYWW', nameEn: 'Plywood White-White', nameTh: 'ไม้อัดขาว-ขาว', color: '#5DADE2', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PLYRR', code: 'PLYRR', nameEn: 'Plywood Red-Red', nameTh: 'ไม้อัดแดง-แดง', color: '#2E86C1', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PLYRW', code: 'PLYRW', nameEn: 'Plywood Red-White', nameTh: 'ไม้อัดแดง-ขาว', color: '#1A5276', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  { id: 'PRTB', code: 'PRTB', nameEn: 'Particle Board', nameTh: 'ไม้ปาร์ติเกิล', color: '#E9967A', costMethod: 'FIFO', isActive: true, type: 'raw_material' },
  // Other Categories
  { id: 'CONS', code: 'CONS', nameEn: 'Consumables', nameTh: 'วัสดุสิ้นเปลือง', color: '#708090', costMethod: 'AVG', isActive: true, type: 'consumables' },
  { id: 'FG', code: 'FG', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป', color: '#2ECC40', costMethod: 'STD', isActive: true, type: 'finished_goods' },
  { id: 'OFFICE', code: 'OFFICE', nameEn: 'Office Supplies', nameTh: 'เครื่องเขียนสำนักงาน', color: '#9B59B6', costMethod: 'AVG', isActive: true, type: 'office' },
  { id: 'MAINT', code: 'MAINT', nameEn: 'Maintenance Parts', nameTh: 'อะไหล่ซ่อมบำรุง', color: '#E67E22', costMethod: 'AVG', isActive: true, type: 'maintenance' },
]

// ============================================
// MASTER DATA - INVENTORY (with CBM & costPerCbm)
// ============================================
const INITIAL_INVENTORY = [
  // STORE1 - MLH
  { id: 1, lotNo: 'LP21499', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 700, cbm: 0.859, cost: 4218, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 2, lotNo: 'LP21500', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 650, cbm: 0.797, cost: 3914, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 3, lotNo: 'LP21501', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 45, cbm: 0.055, cost: 271, costPerCbm: 4912, status: 'low', dateIn: '2024-07-03', vendor: 'Thai Timber' },
  { id: 4, lotNo: 'LP20044', category: 'MLH', code: 'IND-MLH/0.5/3.4/1.3', store: 'STORE1', qty: 241, cbm: 0.344, cost: 1689, costPerCbm: 4912, status: 'available', dateIn: '2024-05-25', vendor: 'Green Wood' },
  { id: 5, lotNo: 'LP19507', category: 'MLH', code: 'IND-MLH/0.5/3.8/1.3', store: 'STORE1', qty: 254, cbm: 0.405, cost: 1990, costPerCbm: 4912, status: 'available', dateIn: '2024-04-30', vendor: 'Premium Lumber' },
  // STORE1 - PW
  { id: 6, lotNo: 'PW-2401', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 128, cbm: 2.87, cost: 8500, costPerCbm: 2962, status: 'low', dateIn: '2024-06-15', vendor: 'Pine Supply Co' },
  { id: 7, lotNo: 'PW-2402', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 350, cbm: 7.84, cost: 23200, costPerCbm: 2962, status: 'available', dateIn: '2024-06-20', vendor: 'Pine Supply Co' },
  // STORE1 - PWKD
  { id: 8, lotNo: 'PWKD-001', category: 'PWKD', code: 'IND-PWKD/40/100/4000', store: 'STORE1', qty: 200, cbm: 3.2, cost: 12800, costPerCbm: 4000, status: 'available', dateIn: '2024-07-10', vendor: 'Kiln Dry Masters' },
  { id: 9, lotNo: 'PWKD-002', category: 'PWKD', code: 'IND-PWKD/38/95/3800', store: 'STORE1', qty: 180, cbm: 2.6, cost: 10400, costPerCbm: 4000, status: 'available', dateIn: '2024-07-12', vendor: 'Kiln Dry Masters' },
  // STORE1 - PWGRN
  { id: 10, lotNo: 'PWGRN-001', category: 'PWGRN', code: 'IND-PWGRN/38/140/3900', store: 'STORE1', qty: 450, cbm: 9.35, cost: 18700, costPerCbm: 2000, status: 'available', dateIn: '2024-07-08', vendor: 'Green Pine Ltd' },
  { id: 11, lotNo: 'PWGRN-002', category: 'PWGRN', code: 'IND-PWGRN/40/150/4000', store: 'STORE1', qty: 320, cbm: 7.68, cost: 15360, costPerCbm: 2000, status: 'available', dateIn: '2024-07-15', vendor: 'Green Pine Ltd' },
  // STORE2 - PLYWW
  { id: 12, lotNo: 'PLYWW-001', category: 'PLYWW', code: 'IND2-PLYWW/12/1220/2440', store: 'STORE2', qty: 150, cbm: 5.34, cost: 45000, costPerCbm: 8427, status: 'available', dateIn: '2024-07-01', vendor: 'IND-2 Production' },
  { id: 13, lotNo: 'PLYWW-002', category: 'PLYWW', code: 'IND2-PLYWW/18/1220/2440', store: 'STORE2', qty: 80, cbm: 4.27, cost: 42000, costPerCbm: 9836, status: 'available', dateIn: '2024-07-05', vendor: 'IND-2 Production' },
  // STORE1 - External PLY
  { id: 14, lotNo: 'PLYWW-EXT-001', category: 'PLYWW', code: 'IND-PLYWW/12/1220/2440', store: 'STORE1', qty: 50, cbm: 1.78, cost: 16000, costPerCbm: 8989, status: 'available', dateIn: '2024-07-18', vendor: 'External Ply Co' },
  // STORE2 - PLYRR
  { id: 15, lotNo: 'PLYRR-001', category: 'PLYRR', code: 'IND2-PLYRR/15/1220/2440', store: 'STORE2', qty: 100, cbm: 4.46, cost: 52000, costPerCbm: 11659, status: 'available', dateIn: '2024-07-02', vendor: 'IND-2 Production' },
  { id: 16, lotNo: 'PLYRR-002', category: 'PLYRR', code: 'IND2-PLYRR/12/1220/2440', store: 'STORE2', qty: 65, cbm: 2.31, cost: 27500, costPerCbm: 11905, status: 'low', dateIn: '2024-07-08', vendor: 'IND-2 Production' },
  // STORE2 - PLYRW
  { id: 17, lotNo: 'PLYRW-001', category: 'PLYRW', code: 'IND2-PLYRW/12/1220/2440', store: 'STORE2', qty: 120, cbm: 4.27, cost: 38000, costPerCbm: 8900, status: 'available', dateIn: '2024-07-03', vendor: 'IND-2 Production' },
  { id: 18, lotNo: 'PLYRW-002', category: 'PLYRW', code: 'IND2-PLYRW/15/1220/2440', store: 'STORE2', qty: 90, cbm: 4.01, cost: 36000, costPerCbm: 8978, status: 'available', dateIn: '2024-07-10', vendor: 'IND-2 Production' },
  // STORE1 - PRTB
  { id: 19, lotNo: 'PRTB-001', category: 'PRTB', code: 'IND-PRTB/9/70/2440', store: 'STORE1', qty: 500, cbm: 0.77, cost: 3500, costPerCbm: 4545, status: 'available', dateIn: '2024-07-10', vendor: 'Board Co' },
  { id: 20, lotNo: 'PRTB-002', category: 'PRTB', code: 'IND-PRTB/12/100/2440', store: 'STORE1', qty: 300, cbm: 0.88, cost: 4200, costPerCbm: 4773, status: 'available', dateIn: '2024-07-12', vendor: 'Board Co' },
]

// ============================================
// VENDORS
// ============================================
const INITIAL_VENDORS = [
  { id: 'V001', code: 'V001', name: 'Thai Timber Co., Ltd', nameTh: 'บริษัท ไทยทิมเบอร์ จำกัด', type: 'local', category: 'MLH', paymentTerms: 30, contact: 'Somchai', phone: '081-234-5678', isActive: true },
  { id: 'V002', code: 'V002', name: 'Pine Supply Co., Ltd', nameTh: 'บริษัท ไพน์ซัพพลาย จำกัด', type: 'local', category: 'PW', paymentTerms: 30, contact: 'Wilai', phone: '089-876-5432', isActive: true },
  { id: 'V003', code: 'V003', name: 'Green Wood Enterprise', nameTh: 'บริษัท กรีนวูด เอ็นเตอร์ไพรส์', type: 'local', category: 'MLH', paymentTerms: 45, contact: 'Prasit', phone: '086-111-2222', isActive: true },
  { id: 'V004', code: 'V004', name: 'Malaysia Wood Import', nameTh: 'นำเข้าไม้มาเลเซีย', type: 'import', category: 'MLH', paymentTerms: 60, contact: 'Mr. Lee', phone: '+60-12-345-6789', isActive: true },
  { id: 'V005', code: 'V005', name: 'Vietnam Pine Export', nameTh: 'ส่งออกไม้สนเวียดนาม', type: 'import', category: 'PW', paymentTerms: 60, contact: 'Mr. Nguyen', phone: '+84-90-123-4567', isActive: true },
]

// ============================================
// 13 IMPORT COST TYPES (CRITICAL)
// ============================================
const IMPORT_COST_TYPES = [
  { id: 'fob', nameEn: 'FOB', nameTh: 'ค่า FOB' },
  { id: 'freight', nameEn: 'Freight', nameTh: 'ค่าระวาง' },
  { id: 'insurance', nameEn: 'Insurance', nameTh: 'ค่าประกัน' },
  { id: 'customDuty', nameEn: 'Custom Duty', nameTh: 'อากรศุลกากร' },
  { id: 'thcDoStorage', nameEn: 'THC/DO/Storage', nameTh: 'ค่า THC/DO/Storage' },
  { id: 'forestOfficer', nameEn: 'Forest Officer', nameTh: 'ค่าตรวจสอบป่าไม้' },
  { id: 'phytoOffice', nameEn: 'Phyto Office', nameTh: 'ค่าใบรับรองพืช' },
  { id: 'transport', nameEn: 'Transport', nameTh: 'ค่าขนส่ง' },
  { id: 'surcharge', nameEn: 'Surcharge', nameTh: 'ค่าธรรมเนียมเพิ่มเติม' },
  { id: 'advanceThc', nameEn: 'Advance THC', nameTh: 'ค่า THC ล่วงหน้า' },
  { id: 'bankCharges', nameEn: 'Bank Charges', nameTh: 'ค่าธรรมเนียมธนาคาร' },
  { id: 'lcCommission', nameEn: 'LC/Commission', nameTh: 'ค่า LC/คอมมิชชั่น' },
  { id: 'other', nameEn: 'Other', nameTh: 'อื่นๆ' },
]

// ============================================
// PURCHASE ORDERS (with Import Costing)
// ============================================
const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-2407-001',
    vendorId: 'V001',
    type: 'local',
    poDate: '2024-07-01',
    vendorInvoice: 'INV-TT-2407-001',
    vendorInvoiceDate: '2024-07-01',
    deliveryDate: '2024-07-03',
    items: [
      { id: 1, categoryId: 'MLH', thickness: 50, width: 100, length: 2400, qty: 1395, unit: 'pcs', cbm: 1.711, unitPrice: 4912, total: 8403 },
    ],
    subtotal: 8403,
    vat: 588,
    total: 8991,
    importCosts: {},
    totalImportCosts: 0,
    status: 'received',
    receivedDate: '2024-07-03',
    receivedBy: 'Warehouse Staff',
    entity: 'IND',
  },
  {
    id: 'PO-2407-002',
    vendorId: 'V004',
    type: 'import',
    poDate: '2024-06-15',
    vendorInvoice: 'MYS-2024-0456',
    vendorInvoiceDate: '2024-06-15',
    deliveryDate: '2024-07-10',
    container: 'MSCU7654321',
    blNumber: 'MSKU123456789',
    items: [
      { id: 1, categoryId: 'MLH', thickness: 50, width: 100, length: 2400, qty: 5000, unit: 'pcs', cbm: 6.0, unitPrice: 3500, total: 21000 },
    ],
    subtotal: 21000,
    vat: 0,
    total: 21000,
    importCosts: {
      fob: 21000,
      freight: 35000,
      insurance: 2100,
      customDuty: 8500,
      thcDoStorage: 15000,
      forestOfficer: 3500,
      phytoOffice: 2500,
      transport: 5000,
      surcharge: 1500,
      advanceThc: 0,
      bankCharges: 1242,
      lcCommission: 0,
      other: 1000,
    },
    totalImportCosts: 96342,
    status: 'received',
    receivedDate: '2024-07-10',
    receivedBy: 'Warehouse Staff',
    entity: 'IND',
  },
  {
    id: 'PO-2407-003',
    vendorId: 'V002',
    type: 'local',
    poDate: '2024-07-05',
    vendorInvoice: 'PSC-2024-789',
    vendorInvoiceDate: '2024-07-05',
    deliveryDate: '2024-07-08',
    items: [
      { id: 1, categoryId: 'PW', thickness: 39, width: 145, length: 3960, qty: 478, unit: 'pcs', cbm: 10.71, unitPrice: 2962, total: 31703 },
    ],
    subtotal: 31703,
    vat: 2219,
    total: 33922,
    importCosts: {},
    totalImportCosts: 0,
    status: 'pending',
    entity: 'IND',
  },
]

// ============================================
// CUSTOMERS
// ============================================
const INITIAL_CUSTOMERS = [
  { id: 'C001', code: 'C001', name: 'Royal Ceramics', nameTh: 'รอยัล เซรามิค', contact: 'Khun Preeda', phone: '038-123-456', email: 'purchasing@royalceramics.co.th', paymentTerms: 30, deliveryAddress: 'Rayong', isActive: true },
  { id: 'C002', code: 'C002', name: 'Shin Star Industries', nameTh: 'ชินสตาร์ อินดัสตรี', contact: 'Khun Somsak', phone: '038-234-567', email: 'po@shinstar.com', paymentTerms: 45, deliveryAddress: 'Chonburi', isActive: true },
  { id: 'C003', code: 'C003', name: 'BV Industries', nameTh: 'บีวี อินดัสทรีส์', contact: 'Khun Napat', phone: '02-345-6789', email: 'procurement@bvindustries.com', paymentTerms: 60, deliveryAddress: 'Bangkok', isActive: true },
  { id: 'C004', code: 'C004', name: 'SCG Packaging', nameTh: 'เอสซีจี แพคเกจจิ้ง', contact: 'Khun Prawit', phone: '02-586-1234', email: 'purchasing@scg.com', paymentTerms: 30, deliveryAddress: 'Saraburi', isActive: true },
]

// ============================================
// STORE TYPES
// ============================================
const STORE_TYPES = [
  { id: 'raw_material', nameEn: 'Raw Material', nameTh: 'วัตถุดิบ' },
  { id: 'branch_stock', nameEn: 'Branch Stock', nameTh: 'สต็อกสาขา' },
  { id: 'consumables', nameEn: 'Consumables', nameTh: 'วัสดุสิ้นเปลือง' },
  { id: 'office', nameEn: 'Office Supplies', nameTh: 'เครื่องเขียน' },
  { id: 'maintenance', nameEn: 'Maintenance', nameTh: 'อะไหล่ซ่อม' },
  { id: 'finished_goods', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จ' },
]

// ============================================
// PRODUCTION DEPARTMENTS (10 Departments)
// ============================================
const INITIAL_DEPARTMENTS = [
  { id: 'C1', code: 'C1', nameEn: 'Cutting 1 (Singh)', nameTh: 'ตัด 1 (สิงห์)', hourlyRate: 200, type: 'cutting', sequence: 1, isActive: true },
  { id: 'C2', code: 'C2', nameEn: 'Cutting 2 (One)', nameTh: 'ตัด 2 (วัน)', hourlyRate: 200, type: 'cutting', sequence: 2, isActive: true },
  { id: 'P1', code: 'P1', nameEn: 'Processing 1', nameTh: 'แปรรูป 1', hourlyRate: 180, type: 'processing', sequence: 3, isActive: true },
  { id: 'P2', code: 'P2', nameEn: 'Processing 2', nameTh: 'แปรรูป 2', hourlyRate: 180, type: 'processing', sequence: 4, isActive: true },
  { id: 'P3', code: 'P3', nameEn: 'Processing 3', nameTh: 'แปรรูป 3', hourlyRate: 180, type: 'processing', sequence: 5, isActive: true },
  { id: 'A1', code: 'A1', nameEn: 'Assembly 1 (Khem)', nameTh: 'ประกอบ 1 (เข็ม)', hourlyRate: 180, type: 'assembly', sequence: 6, isActive: true },
  { id: 'A2', code: 'A2', nameEn: 'Assembly 2 (Khwai)', nameTh: 'ประกอบ 2 (ควาย)', hourlyRate: 180, type: 'assembly', sequence: 7, isActive: true },
  { id: 'OVEN', code: 'OVEN', nameEn: 'Oven / Heat Treatment', nameTh: 'อบความร้อน', hourlyRate: 150, type: 'treatment', sequence: 8, isActive: true },
  { id: 'QC', code: 'QC', nameEn: 'Quality Control', nameTh: 'ตรวจคุณภาพ', hourlyRate: 200, type: 'qa', sequence: 9, isActive: true },
  { id: 'FG', code: 'FG', nameEn: 'Finished Goods', nameTh: 'สินค้าสำเร็จรูป', hourlyRate: 150, type: 'fg', sequence: 10, isActive: true },
]

// ============================================
// TRUCKS / VEHICLES
// ============================================
const INITIAL_TRUCKS = [
  { id: 'T1', code: 'T1', nameEn: 'Truck 1 (6-Wheeler)', nameTh: 'รถบรรทุก 1 (6 ล้อ)', capacity: '5 tons', licensePlate: 'ชบ-1234', driver: 'Vichai', driverId: 7, fuelType: 'diesel', status: 'available', isActive: true },
  { id: 'T2', code: 'T2', nameEn: 'Truck 2 (10-Wheeler)', nameTh: 'รถบรรทุก 2 (10 ล้อ)', capacity: '10 tons', licensePlate: 'ชบ-5678', driver: 'Sompon', driverId: null, fuelType: 'diesel', status: 'available', isActive: true },
  { id: 'T3', code: 'T3', nameEn: 'Pickup (Ford Ranger)', nameTh: 'กระบะ (ฟอร์ด เรนเจอร์)', capacity: '1 ton', licensePlate: 'ชบ-9012', driver: '', driverId: null, fuelType: 'diesel', status: 'available', isActive: true },
]

// ============================================
// COMPANY ENTITIES (IND vs IND2)
// ============================================
const COMPANY_ENTITIES = [
  { 
    id: 'IND', 
    name: 'IND THAI PACKWELL INDUSTRIES CO., LTD',
    nameTh: 'บริษัท อินด์ ไทย แพคเวลล์ อินดัสตรีส์ จำกัด',
    address: '399 Moo 8, Bo Thong, Chonburi 20270',
    addressTh: '399 หมู่ 8 ต.บ่อทอง อ.บ่อทอง จ.ชลบุรี 20270',
    taxId: '0-2055-56010-51-8',
    tel: '094-7866886, 081-8358435',
    invoicePrefix: 'INV',
    materials: ['MLH', 'PW', 'PWKD', 'PWGRN'],
  },
  { 
    id: 'IND2', 
    name: 'IND THAI PACKWELL INDUSTRIES (2) CO., LTD',
    nameTh: 'บริษัท อินด์ ไทย แพคเวลล์ อินดัสตรีส์ (2) จำกัด',
    address: '399 Moo 8, Bo Thong, Chonburi 20270',
    addressTh: '399 หมู่ 8 ต.บ่อทอง อ.บ่อทอง จ.ชลบุรี 20270',
    taxId: '0-2055-56010-52-6',
    tel: '094-7866886, 081-8358435',
    invoicePrefix: 'IND2',
    materials: ['PLYRW', 'PLYRR', 'PLYWW', 'PRTB'],
  },
]

// ============================================
// PAYMENT TERMS
// ============================================
const PAYMENT_TERMS = [
  { id: 'cash', label: 'Cash / เงินสด', days: 0 },
  { id: 'net7', label: 'Net 7 Days', days: 7 },
  { id: 'net15', label: 'Net 15 Days', days: 15 },
  { id: 'net30', label: 'Net 30 Days', days: 30 },
  { id: 'net45', label: 'Net 45 Days', days: 45 },
  { id: 'net60', label: 'Net 60 Days', days: 60 },
]

// ============================================
// DEPARTMENT TYPES (for Production)
// ============================================
const DEPARTMENT_TYPES = [
  { id: 'cutting', nameEn: 'Cutting', nameTh: 'ตัด', color: '#E74C3C' },
  { id: 'processing', nameEn: 'Processing', nameTh: 'แปรรูป', color: '#F39C12' },
  { id: 'assembly', nameEn: 'Assembly', nameTh: 'ประกอบ', color: '#3498DB' },
  { id: 'treatment', nameEn: 'Treatment', nameTh: 'อบ', color: '#9B59B6' },
  { id: 'qa', nameEn: 'Quality', nameTh: 'ตรวจสอบ', color: '#1ABC9C' },
  { id: 'fg', nameEn: 'Finished', nameTh: 'สำเร็จ', color: '#2ECC71' },
]

// ============================================
// PRODUCTS
// ============================================
const INITIAL_PRODUCTS = [
  { id: 'PROD001', code: 'PROD001', name: 'Pallet 1100x1100', materialType: 'MLH', unitPrice: 350, unit: 'pcs' },
  { id: 'PROD002', code: 'PROD002', name: 'Pallet 1100x950x950', materialType: 'MLH', unitPrice: 303, unit: 'pcs' },
  { id: 'PROD003', code: 'PROD003', name: 'Box 600x400x300', materialType: 'MLH', unitPrice: 280, unit: 'pcs' },
  { id: 'PROD004', code: 'PROD004', name: 'Upper 9x70x2440', materialType: 'PRTB', unitPrice: 12, unit: 'pcs' },
]

// ============================================
// WORK ORDERS (with Cost Tracking)
// ============================================
const INITIAL_WORK_ORDERS = [
  {
    id: 'WO-2407-001',
    soId: 'SO-2407-001',
    customerId: 'C001',
    productId: 'PROD002',
    productName: 'Pallet 1100x950x950',
    quantity: 500,
    completedQty: 350,
    materialType: 'MLH',
    department: 'C1',
    status: 'in_progress',
    priority: 'high',
    startDate: '2024-07-15',
    targetDate: '2024-07-25',
    operations: [
      { dept: 'C1', status: 'completed', startTime: '2024-07-15 08:00', endTime: '2024-07-16 17:00', hours: 16, operator: 'Somchai' },
      { dept: 'P1', status: 'completed', startTime: '2024-07-17 08:00', endTime: '2024-07-18 12:00', hours: 12, operator: 'Prasit' },
      { dept: 'A1', status: 'in_progress', startTime: '2024-07-19 08:00', endTime: null, hours: 8, operator: 'Manop' },
    ],
    materialsIssued: [
      { lotNo: 'LP21499', category: 'MLH', code: 'IND-MLH/0.5/3/1', qty: 400, cbm: 0.49, cost: 2407 },
      { lotNo: 'LP21500', category: 'MLH', code: 'IND-MLH/0.5/3/1', qty: 350, cbm: 0.43, cost: 2112 },
    ],
    costs: {
      material: 4519,
      labor: 7200,
      overhead: 1500,
      total: 13219,
      perUnit: 37.77,
    },
    totalRevenue: 151500,
    profit: {
      amount: 138281,
      margin: 91.26,
    },
    entity: 'IND',
  },
  {
    id: 'WO-2407-002',
    soId: 'SO-2407-002',
    customerId: 'C002',
    productId: 'PROD004',
    productName: 'Upper 9x70x2440',
    quantity: 4000,
    completedQty: 0,
    materialType: 'PRTB',
    department: 'P2',
    status: 'pending',
    priority: 'medium',
    startDate: null,
    targetDate: '2024-08-05',
    operations: [],
    materialsIssued: [],
    costs: {
      material: 0,
      labor: 0,
      overhead: 0,
      total: 0,
      perUnit: 0,
    },
    totalRevenue: 48000,
    profit: {
      amount: 0,
      margin: 0,
    },
    entity: 'IND',
  },
]

// ============================================
// SALES ORDERS
// ============================================
const INITIAL_SALES_ORDERS = [
  {
    id: 'SO-2407-001',
    customerId: 'C001',
    customerPO: 'PO.RPR6802-003',
    orderDate: '2024-07-10',
    dueDate: '2024-07-25',
    deliveryDate: '2024-07-25',
    status: 'in_production',
    items: [
      { id: 1, productId: 'PROD002', productName: 'Pallet 1100x950x950', materialType: 'MLH', qty: 500, qtyDelivered: 200, unit: 'pcs', unitPrice: 303, total: 151500, woId: 'WO-2407-001' },
    ],
    subtotal: 151500,
    vatRate: 7,
    vat: 10605,
    grandTotal: 162105,
    entity: 'IND',
    paymentTerms: 'net30',
    deliveryAddress: 'Rayong Factory',
    notes: 'Urgent order - priority delivery',
  },
  {
    id: 'SO-2407-002',
    customerId: 'C002',
    customerPO: 'PO20250168',
    orderDate: '2024-07-12',
    dueDate: '2024-08-05',
    deliveryDate: '2024-08-05',
    status: 'confirmed',
    items: [
      { id: 1, productId: 'PROD004', productName: 'Upper 9x70x2440', materialType: 'PRTB', qty: 4000, qtyDelivered: 0, unit: 'pcs', unitPrice: 12, total: 48000, woId: 'WO-2407-002' },
    ],
    subtotal: 48000,
    vatRate: 7,
    vat: 3360,
    grandTotal: 51360,
    entity: 'IND',
    paymentTerms: 'net45',
    deliveryAddress: 'Chonburi Plant',
    notes: '',
  },
]

// ============================================
// INVOICES
// ============================================
const INITIAL_INVOICES = [
  {
    id: 'INV-2407-001',
    entity: 'IND',
    soId: 'SO-2407-001',
    customerId: 'C001',
    customerPO: 'PO.RPR6802-003',
    invoiceDate: '2024-07-20',
    dueDate: '2024-08-19',
    items: [
      { id: 1, description: 'Pallet 1100x950x950', descriptionTh: 'พาเลท 1100x950x950', qty: 200, unit: 'pcs', unitPrice: 303, total: 60600, soItemId: 1 },
    ],
    subtotal: 60600,
    vatRate: 7,
    vat: 4242,
    discount: 0,
    grandTotal: 64842,
    status: 'sent',
    paidAmount: 30000,
    balance: 34842,
    payments: [
      { id: 1, date: '2024-07-25', amount: 30000, method: 'transfer', reference: 'TRF-2407-001', notes: 'Partial payment' },
    ],
    createdAt: '2024-07-20',
  },
]

// ============================================
// DELIVERY ORDERS
// ============================================
const INITIAL_DELIVERY_ORDERS = [
  {
    id: 'DO-2407-001',
    invoiceId: 'INV-2407-001',
    soId: 'SO-2407-001',
    customerId: 'C001',
    deliveryDate: '2024-07-20',
    scheduledTime: '09:00',
    truckId: 'T1',
    driverId: 7,
    status: 'delivered',
    items: [
      { productName: 'Pallet 1100x950x950', qty: 200, unit: 'pcs' },
    ],
    deliveryAddress: 'Royal Ceramics - Rayong Factory',
    receivedBy: 'Khun Preeda',
    receivedAt: '2024-07-20 10:30',
    notes: 'Delivered on time',
    entity: 'IND',
  },
]

// ============================================
// HR - EMPLOYEES
// ============================================
const INITIAL_EMPLOYEES = [
  { id: 1, empId: 'EMP001', name: 'Wuttipong Srisuk', nameTh: 'วุฒิพงษ์ ศรีสุข', department: 'office', designation: 'MG', empType: 'FT', salary: 35000, positionInc: 5000, labourInc: 0, phone: 500, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2018-01-15' },
  { id: 2, empId: 'EMP002', name: 'Somchai Yodrak', nameTh: 'สมชาย ยอดรัก', department: 'production', subDept: 'C1', designation: 'LEAD', empType: 'FT', salary: 18000, positionInc: 2000, labourInc: 1500, phone: 300, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2019-03-01' },
  { id: 3, empId: 'EMP003', name: 'Nanthana Boonmee', nameTh: 'นันทนา บุญมี', department: 'hr', designation: 'HR', empType: 'FT', salary: 16000, positionInc: 1500, labourInc: 0, phone: 300, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2020-06-01' },
  { id: 4, empId: 'EMP004', name: 'Pakamas Rattana', nameTh: 'ผกามาศ รัตนะ', department: 'accounting', designation: 'ACC', empType: 'FT', salary: 15000, positionInc: 0, labourInc: 0, phone: 300, socialSecurity: 750, bank: 'transfer', entity: 'IND2', status: 'active', joinDate: '2021-01-10' },
  { id: 5, empId: 'EMP005', name: 'Prasert Thongdee', nameTh: 'ประเสริฐ ทองดี', department: 'warehouse', designation: 'WH', empType: 'FT', salary: 12000, positionInc: 0, labourInc: 1000, phone: 0, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2019-08-15' },
  { id: 6, empId: 'EMP006', name: 'Somporn Kaewjai', nameTh: 'สมพร แก้วใจ', department: 'production', subDept: 'P1', designation: 'OP', empType: 'PT', dailyRate: 400, entity: 'IND', status: 'active', joinDate: '2022-03-01' },
  { id: 7, empId: 'EMP007', name: 'Vichai Kaewsri', nameTh: 'วิชัย แก้วศรี', department: 'transport', designation: 'DRIVER', empType: 'FT', salary: 14000, positionInc: 0, labourInc: 500, phone: 300, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2020-02-01' },
  { id: 8, empId: 'EMP008', name: 'Boonlert Jaidee', nameTh: 'บุญเลิศ ใจดี', department: 'maintenance', designation: 'TECH', empType: 'FT', salary: 15000, positionInc: 1000, labourInc: 500, phone: 300, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2019-05-15' },
  { id: 9, empId: 'EMP009', name: 'Kanya Srisuk', nameTh: 'กัญญา ศรีสุข', department: 'sales', designation: 'SALES', empType: 'FT', salary: 15000, positionInc: 0, labourInc: 0, phone: 500, socialSecurity: 750, bank: 'transfer', entity: 'IND', status: 'active', joinDate: '2021-07-01' },
  { id: 10, empId: 'EMP010', name: 'Manop Saelee', nameTh: 'มานพ แสลี', department: 'production', subDept: 'A1', designation: 'OP', empType: 'FT', salary: 11000, positionInc: 0, labourInc: 1000, phone: 0, socialSecurity: 750, bank: 'cash', entity: 'IND', status: 'active', joinDate: '2022-01-10' },
]

// ============================================
// MAINTENANCE TASKS
// ============================================
const INITIAL_MAINTENANCE_TASKS = [
  { id: 'MT-001', equipment: 'CNC Router #1', equipmentId: 'EQ001', type: 'preventive', description: 'Monthly maintenance check', assignedTo: 8, scheduledDate: '2025-01-30', completedDate: null, status: 'scheduled', priority: 'medium', estimatedHours: 4, actualHours: null, parts: [], cost: 0 },
  { id: 'MT-002', equipment: 'Forklift #2', equipmentId: 'EQ002', type: 'repair', description: 'Hydraulic system repair', assignedTo: 8, scheduledDate: '2025-01-26', completedDate: null, status: 'in_progress', priority: 'high', estimatedHours: 6, actualHours: 4, parts: ['Hydraulic seal', 'Oil filter'], cost: 2500 },
  { id: 'MT-003', equipment: 'Band Saw #3', equipmentId: 'EQ003', type: 'preventive', description: 'Blade replacement and calibration', assignedTo: 8, scheduledDate: '2025-02-05', completedDate: null, status: 'scheduled', priority: 'low', estimatedHours: 2, actualHours: null, parts: ['Saw blade 24"'], cost: 0 },
  { id: 'MT-004', equipment: 'Air Compressor', equipmentId: 'EQ004', type: 'preventive', description: 'Filter replacement', assignedTo: 8, scheduledDate: '2025-02-10', completedDate: null, status: 'scheduled', priority: 'medium', estimatedHours: 1, actualHours: null, parts: [], cost: 0 },
]

// ============================================
// EQUIPMENT LIST
// ============================================
const INITIAL_EQUIPMENT = [
  { id: 'EQ001', code: 'CNC-01', name: 'CNC Router #1', nameTh: 'เครื่อง CNC #1', location: 'Production Hall A', department: 'P1', purchaseDate: '2020-06-15', warrantyEnd: '2023-06-15', status: 'operational', lastMaintenance: '2024-12-15' },
  { id: 'EQ002', code: 'FLT-02', name: 'Forklift #2', nameTh: 'รถยก #2', location: 'Warehouse', department: 'warehouse', purchaseDate: '2019-03-10', warrantyEnd: '2022-03-10', status: 'under_repair', lastMaintenance: '2024-11-20' },
  { id: 'EQ003', code: 'SAW-03', name: 'Band Saw #3', nameTh: 'เลื่อยสายพาน #3', location: 'Cutting Area', department: 'C1', purchaseDate: '2021-01-20', warrantyEnd: '2024-01-20', status: 'operational', lastMaintenance: '2025-01-10' },
  { id: 'EQ004', code: 'COMP-01', name: 'Air Compressor', nameTh: 'ปั๊มลม', location: 'Utility Room', department: 'maintenance', purchaseDate: '2018-08-05', warrantyEnd: '2021-08-05', status: 'operational', lastMaintenance: '2024-10-01' },
]

// ============================================
// TRANSPORT - SCHEDULED DELIVERIES
// ============================================
const INITIAL_SCHEDULED_DELIVERIES = [
  { id: 'SD-001', date: '2025-01-30', soId: 'SO-2407-001', customerId: 'C001', customerName: 'Royal Ceramics', destination: 'Rayong', truckId: 'T1', driverId: 7, items: 150, status: 'scheduled', departureTime: '08:00', estimatedArrival: '10:30', distance: 85, notes: 'Call 30 min before arrival' },
  { id: 'SD-002', date: '2025-01-31', soId: 'SO-2407-002', customerId: 'C002', customerName: 'Shin Star Industries', destination: 'Chonburi', truckId: 'T2', driverId: null, items: 500, status: 'pending_driver', departureTime: '07:00', estimatedArrival: '08:30', distance: 45, notes: '' },
  { id: 'SD-003', date: '2025-02-01', soId: null, customerId: 'C003', customerName: 'BV Industries', destination: 'Bangkok', truckId: 'T2', driverId: null, items: 200, status: 'scheduled', departureTime: '06:00', estimatedArrival: '09:00', distance: 120, notes: 'Heavy traffic expected' },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '฿0'
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const generateId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`

// ============================================
// UI COMPONENTS
// ============================================
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-teal-100 text-teal-700',
    orange: 'bg-orange-100 text-orange-700',
    pink: 'bg-pink-100 text-pink-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    IND: 'bg-teal-100 text-teal-700',
    IND2: 'bg-sky-100 text-sky-700',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white hover:opacity-90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-gray-600 hover:bg-gray-100',
    success: 'bg-green-500 text-white hover:bg-green-600',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button
      type={type}
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
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
    {children}
  </div>
)

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl', full: 'max-w-[95vw]' }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#1A5276] to-[#2ECC40] rounded-t-xl">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
)

// ============================================
// LOGIN SCREEN
// ============================================
const LoginScreen = ({ onLogin, lang, setLang }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.username === username && u.password === password)
      if (user) {
        onLogin(user)
      } else {
        setError(lang === 'th' ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' : 'Invalid username or password')
      }
      setIsLoading(false)
    }, 500)
  }

  const handleDemoLogin = (user) => {
    setIsLoading(true)
    setTimeout(() => {
      onLogin(user)
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] via-[#2980B9] to-[#2ECC40] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A5276] to-[#2ECC40] p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-2xl p-3 shadow-lg">
            <img src={IND_LOGO_SVG} alt="IND" className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('app.title', lang)}</h1>
          <p className="text-white/80 text-sm mt-1">{t('app.subtitle', lang)}</p>
          <p className="text-white/60 text-xs mt-2">Version {VERSION}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 -mt-4 relative z-10">
          {Object.entries(LANGUAGES).slice(0, 2).map(([code, { flag, name }]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                lang === code 
                  ? 'bg-white text-[#1A5276] ring-2 ring-[#2ECC40]' 
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              {flag} {name}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.username', lang)}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition-all"
                placeholder={lang === 'th' ? 'กรอกชื่อผู้ใช้' : 'Enter username'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.password', lang)}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition-all"
                placeholder={lang === 'th' ? 'กรอกรหัสผ่าน' : 'Enter password'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {lang === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...'}
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                {t('login.signin', lang)}
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="px-8 pb-8">
          <button 
            onClick={() => setShowDemo(!showDemo)} 
            className="w-full text-sm text-gray-500 flex items-center justify-center gap-2 hover:text-gray-700 transition-colors"
          >
            {showDemo ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {t('login.demo', lang)}
          </button>
          
          {showDemo && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {DEMO_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  disabled={isLoading}
                  className={`${ROLES[user.role].color} text-white text-xs py-2.5 px-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-left`}
                >
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="opacity-75 text-[10px] truncate">{ROLES[user.role].name}</div>
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
// SMART DOCUMENT UPLOAD MODAL
// ============================================
const SmartDocumentUploadModal = ({ isOpen, onClose, module, lang, onProcessed, categories, vendors }) => {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [stage, setStage] = useState('upload') // upload, processing, review, complete
  const [extractedData, setExtractedData] = useState(null)
  const [manualMode, setManualMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [confidence, setConfidence] = useState(0)
  const inputRef = useRef(null)

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
      { id: 'delivery_plan', name: 'Delivery Plan', nameTh: 'แผนส่งของ', icon: Calendar },
    ],
    hr: [
      { id: 'id_card', name: 'ID Card', nameTh: 'บัตรประชาชน', icon: User },
      { id: 'contract', name: 'Contract', nameTh: 'สัญญาจ้าง', icon: FileText },
    ],
  }

  const handleFile = async (f) => {
    setFile(f)
    setStage('processing')
    setProcessing(true)

    // Simulate AI document processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock extraction based on module
    const mockExtraction = {
      purchase: {
        docType: 'vendor_invoice',
        vendor: vendors?.[0]?.name || 'Thai Timber Co., Ltd',
        vendorId: vendors?.[0]?.id || 'V001',
        invoiceNo: 'INV-TT-2501-' + Math.floor(Math.random() * 1000),
        invoiceDate: new Date().toISOString().split('T')[0],
        items: [
          { category: 'MLH', description: 'Mixed Hardwood 50x100x2400mm', qty: 500, unit: 'pcs', cbm: 0.6, unitPrice: 4912, total: 2947 },
          { category: 'MLH', description: 'Mixed Hardwood 50x150x2400mm', qty: 300, unit: 'pcs', cbm: 0.54, unitPrice: 4912, total: 2652 },
        ],
        subtotal: 5599,
        vat: 392,
        total: 5991,
        suggestedCategory: 'MLH',
        confidence: 94,
      },
      inventory: {
        docType: 'stock_count',
        store: 'STORE1',
        countDate: new Date().toISOString().split('T')[0],
        items: [
          { code: 'IND-MLH/0.5/3/1', lotNo: 'LP21499', counted: 695, system: 700, variance: -5 },
        ],
        confidence: 88,
      },
      sales: {
        docType: 'customer_po',
        customer: 'Royal Ceramics',
        poNumber: 'PO.RPR-' + Math.floor(Math.random() * 10000),
        poDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          { product: 'Pallet 1100x950x950', qty: 300, unit: 'pcs', price: 303, total: 90900 },
        ],
        total: 90900,
        confidence: 91,
      },
    }

    setExtractedData(mockExtraction[module] || mockExtraction.purchase)
    setConfidence(mockExtraction[module]?.confidence || 85)
    setSelectedCategory(mockExtraction[module]?.suggestedCategory || '')
    setProcessing(false)
    setStage('review')
  }

  const handleConfirm = () => {
    setStage('complete')
    if (onProcessed) {
      onProcessed({
        ...extractedData,
        category: selectedCategory || extractedData.suggestedCategory,
        file: file?.name,
        processedAt: new Date().toISOString(),
      })
    }
    setTimeout(() => {
      onClose()
      resetModal()
    }, 1500)
  }

  const resetModal = () => {
    setFile(null)
    setStage('upload')
    setExtractedData(null)
    setManualMode(false)
    setSelectedCategory('')
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('upload.title', lang)} size="lg">
      {/* Stage: Upload */}
      {stage === 'upload' && (
        <div className="space-y-6">
          {/* Document Type Selection */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">
              {lang === 'th' ? 'ประเภทเอกสาร' : 'Document Type'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(documentTypes[module] || documentTypes.purchase).map(dt => (
                <button
                  key={dt.id}
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

          {/* Upload Zone */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#1A5276] hover:bg-gray-50 transition-all"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1A5276] to-[#2ECC40] flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium">
              {lang === 'th' ? 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง' : 'Click to select file or drag and drop'}
            </p>
            <p className="text-sm text-gray-400 mt-2">PDF, JPG, PNG, Excel • Max 10MB</p>
          </div>

          {/* AI Features Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Brain className="w-4 h-4 text-[#2ECC40]" />
            <span>{lang === 'th' ? 'AI จะอ่านและดึงข้อมูลจากเอกสารโดยอัตโนมัติ' : 'AI will automatically extract data from document'}</span>
          </div>
        </div>
      )}

      {/* Stage: Processing */}
      {stage === 'processing' && (
        <div className="text-center py-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#1A5276] border-r-[#2ECC40] animate-spin" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#1A5276] to-[#2ECC40] flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {lang === 'th' ? 'กำลังประมวลผลเอกสาร' : 'Processing Document'}
          </h3>
          <p className="text-gray-500">{file?.name}</p>
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#1A5276]" />
              <span>{lang === 'th' ? 'กำลังอ่านข้อความ...' : 'Reading text...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stage: Review */}
      {stage === 'review' && extractedData && (
        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confidence >= 90 ? 'bg-green-100' : confidence >= 70 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <span className={`text-lg font-bold ${confidence >= 90 ? 'text-green-600' : confidence >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {confidence}%
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {lang === 'th' ? 'ความมั่นใจในการอ่าน' : 'Extraction Confidence'}
                </div>
                <div className="text-sm text-gray-500">
                  {confidence >= 90 ? (lang === 'th' ? 'สูง - พร้อมใช้งาน' : 'High - Ready to use') :
                   confidence >= 70 ? (lang === 'th' ? 'ปานกลาง - ควรตรวจสอบ' : 'Medium - Please verify') :
                   (lang === 'th' ? 'ต่ำ - ต้องตรวจสอบ' : 'Low - Needs review')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setManualMode(!manualMode)}
              className="text-sm text-[#1A5276] hover:underline"
            >
              {manualMode ? (lang === 'th' ? 'ดูข้อมูลอัตโนมัติ' : 'View Auto Data') : (lang === 'th' ? 'แก้ไขด้วยตนเอง' : 'Edit Manually')}
            </button>
          </div>

          {/* Extracted Data */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-medium text-gray-800">
                {lang === 'th' ? 'ข้อมูลที่ดึงได้' : 'Extracted Information'}
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {extractedData.vendor && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</label>
                    <p className="font-medium">{extractedData.vendor}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">{lang === 'th' ? 'เลขที่ใบแจ้งหนี้' : 'Invoice No.'}</label>
                    <p className="font-medium">{extractedData.invoiceNo}</p>
                  </div>
                </div>
              )}
              
              {extractedData.items && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">{lang === 'th' ? 'รายการสินค้า' : 'Items'}</label>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">{lang === 'th' ? 'รายการ' : 'Description'}</th>
                        <th className="px-3 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                        <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคา' : 'Price'}</th>
                        <th className="px-3 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {extractedData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{item.description || item.product}</td>
                          <td className="px-3 py-2 text-right">{item.qty} {item.unit}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice || item.price)}</td>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <td colSpan="3" className="px-3 py-2 text-right">{lang === 'th' ? 'รวมทั้งสิ้น' : 'Grand Total'}</td>
                        <td className="px-3 py-2 text-right text-[#1A5276]">{formatCurrency(extractedData.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Category Selection */}
              {extractedData.suggestedCategory && categories && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">
                    {lang === 'th' ? 'หมวดหมู่วัสดุ' : 'Material Category'}
                  </label>
                  <select
                    value={selectedCategory || extractedData.suggestedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {categories.filter(c => c.type === 'raw_material').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.code} - {cat.nameEn}</option>
                    ))}
                  </select>
                  {!selectedCategory && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {lang === 'th' ? 'AI แนะนำหมวดหมู่นี้' : 'AI suggested this category'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { resetModal(); }} className="flex-1">
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <CheckCircle className="w-4 h-4" />
              {lang === 'th' ? 'ยืนยันและนำเข้า' : 'Confirm & Import'}
            </Button>
          </div>
        </div>
      )}

      {/* Stage: Complete */}
      {stage === 'complete' && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {t('upload.success', lang)}
          </h3>
          <p className="text-gray-500">
            {lang === 'th' ? 'ข้อมูลถูกนำเข้าสู่ระบบเรียบร้อยแล้ว' : 'Data has been imported to the system'}
          </p>
        </div>
      )}
    </Modal>
  )
}

// File continues in next part...
// Total lines so far: ~1,450

// ============================================
// TRANSPORT MODULE (DEEP - WITH CALENDAR)
// ============================================
const TransportModule = ({ deliveries, setDeliveries, trucks, employees, salesOrders, lang }) => {
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  const tabs = [
    { id: 'calendar', label: lang === 'th' ? 'ปฏิทิน' : 'Calendar', icon: CalendarDays },
    { id: 'deliveries', label: lang === 'th' ? 'รายการส่ง' : 'Deliveries', icon: Truck },
    { id: 'vehicles', label: lang === 'th' ? 'ยานพาหนะ' : 'Vehicles', icon: Car },
    { id: 'routes', label: lang === 'th' ? 'เส้นทาง' : 'Routes', icon: Route },
  ]

  const drivers = employees?.filter(e => e.department === 'transport') || []

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    // Add empty days for alignment
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getDeliveriesForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return deliveries?.filter(d => d.date === dateStr) || []
  }

  const stats = {
    total: deliveries?.length || 0,
    scheduled: deliveries?.filter(d => d.status === 'scheduled').length || 0,
    inTransit: deliveries?.filter(d => d.status === 'in_transit').length || 0,
    delivered: deliveries?.filter(d => d.status === 'delivered').length || 0,
    pendingDriver: deliveries?.filter(d => d.status === 'pending_driver').length || 0,
    availableTrucks: trucks?.filter(t => t.status === 'available').length || 0,
  }

  const monthNames = lang === 'th' 
    ? ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = lang === 'th'
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.transport', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการการจัดส่งและยานพาหนะ' : 'Manage deliveries and vehicles'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload}>
            {lang === 'th' ? 'อัพโหลด' : 'Upload'}
          </Button>
          <Button icon={Plus} onClick={() => setShowScheduleModal(true)}>
            {lang === 'th' ? 'กำหนดการส่ง' : 'Schedule Delivery'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายการทั้งหมด' : 'Total'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำหนดส่ง' : 'Scheduled'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำลังส่ง' : 'In Transit'}</div>
          <div className="text-2xl font-bold text-orange-600">{stats.inTransit}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ส่งแล้ว' : 'Delivered'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอคนขับ' : 'Need Driver'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingDriver}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-cyan-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รถว่าง' : 'Available'}</div>
          <div className="text-2xl font-bold text-cyan-600">{stats.availableTrucks}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <Card className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(selectedDate).map((day, idx) => {
              const dayDeliveries = getDeliveriesForDate(day)
              const isToday = day && day.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 rounded-lg border ${
                    day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-[#2ECC40]' : ''}`}
                  onClick={() => day && dayDeliveries.length > 0 && setSelectedDelivery(dayDeliveries[0])}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium ${isToday ? 'text-[#2ECC40]' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayDeliveries.slice(0, 3).map(del => (
                          <div 
                            key={del.id}
                            className={`text-xs p-1 rounded truncate ${
                              del.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              del.status === 'in_transit' ? 'bg-orange-100 text-orange-700' :
                              del.status === 'pending_driver' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {del.customerName}
                          </div>
                        ))}
                        {dayDeliveries.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayDeliveries.length - 3} {lang === 'th' ? 'รายการ' : 'more'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Deliveries List */}
      {activeTab === 'deliveries' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'ID'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ปลายทาง' : 'Destination'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รถ' : 'Vehicle'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'คนขับ' : 'Driver'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Items'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(deliveries || INITIAL_SCHEDULED_DELIVERIES).map(del => {
                  const truck = trucks?.find(t => t.id === del.truckId)
                  const driver = employees?.find(e => e.id === del.driverId)
                  return (
                    <tr key={del.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{del.id}</td>
                      <td className="px-4 py-3">{formatDate(del.date)}</td>
                      <td className="px-4 py-3 font-medium">{del.customerName}</td>
                      <td className="px-4 py-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {del.destination}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          {truck?.nameEn || del.truckId}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {driver ? driver.name : (
                          <span className="text-yellow-600 text-sm">{lang === 'th' ? 'รอมอบหมาย' : 'Unassigned'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">{del.items}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          del.status === 'delivered' ? 'success' :
                          del.status === 'in_transit' ? 'orange' :
                          del.status === 'pending_driver' ? 'warning' :
                          'info'
                        }>
                          {del.status === 'delivered' ? (lang === 'th' ? 'ส่งแล้ว' : 'Delivered') :
                           del.status === 'in_transit' ? (lang === 'th' ? 'กำลังส่ง' : 'In Transit') :
                           del.status === 'pending_driver' ? (lang === 'th' ? 'รอคนขับ' : 'Need Driver') :
                           (lang === 'th' ? 'กำหนด' : 'Scheduled')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(trucks || INITIAL_TRUCKS).map(truck => (
            <Card key={truck.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    truck.status === 'available' ? 'bg-green-100' :
                    truck.status === 'in_use' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    <Truck className={`w-6 h-6 ${
                      truck.status === 'available' ? 'text-green-600' :
                      truck.status === 'in_use' ? 'text-blue-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{truck.nameEn}</h3>
                    <p className="text-sm text-gray-500">{truck.nameTh}</p>
                  </div>
                </div>
                <Badge variant={
                  truck.status === 'available' ? 'success' :
                  truck.status === 'in_use' ? 'info' :
                  'danger'
                }>
                  {truck.status === 'available' ? (lang === 'th' ? 'ว่าง' : 'Available') :
                   truck.status === 'in_use' ? (lang === 'th' ? 'ใช้งาน' : 'In Use') :
                   (lang === 'th' ? 'ซ่อม' : 'Maintenance')}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang === 'th' ? 'ทะเบียน' : 'License'}</span>
                  <span className="font-medium">{truck.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang === 'th' ? 'บรรทุก' : 'Capacity'}</span>
                  <span className="font-medium">{truck.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang === 'th' ? 'คนขับ' : 'Driver'}</span>
                  <span className="font-medium">{truck.driver || '-'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Routes Tab - Placeholder for GPS */}
      {activeTab === 'routes' && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
            <Navigation className="w-10 h-10 text-cyan-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {lang === 'th' ? 'ระบบ GPS กำลังพัฒนา' : 'GPS System Coming Soon'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {lang === 'th' 
              ? 'ระบบติดตาม GPS แบบ Real-time กำลังพัฒนา จะสามารถดูตำแหน่งรถและเส้นทางได้' 
              : 'Real-time GPS tracking is under development. You will be able to track vehicles and routes.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Cog className="w-4 h-4 animate-spin" />
            <span>Under Development</span>
          </div>
        </Card>
      )}
    </div>
  )
}

// ============================================
// MAINTENANCE MODULE
// ============================================
const MaintenanceModule = ({ tasks, setTasks, equipment, employees, lang }) => {
  const [activeTab, setActiveTab] = useState('tasks')
  const [showTaskModal, setShowTaskModal] = useState(false)

  const tabs = [
    { id: 'tasks', label: lang === 'th' ? 'งานซ่อมบำรุง' : 'Tasks', icon: Wrench },
    { id: 'equipment', label: lang === 'th' ? 'อุปกรณ์' : 'Equipment', icon: Cog },
    { id: 'schedule', label: lang === 'th' ? 'ตารางบำรุงรักษา' : 'PM Schedule', icon: Calendar },
  ]

  const tasksList = tasks || INITIAL_MAINTENANCE_TASKS
  const equipmentList = equipment || INITIAL_EQUIPMENT
  const technicians = employees?.filter(e => e.department === 'maintenance') || []

  const stats = {
    total: tasksList.length,
    inProgress: tasksList.filter(t => t.status === 'in_progress').length,
    scheduled: tasksList.filter(t => t.status === 'scheduled').length,
    completed: tasksList.filter(t => t.status === 'completed').length,
    highPriority: tasksList.filter(t => t.priority === 'high').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.maintenance', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการงานซ่อมบำรุงและอุปกรณ์' : 'Manage maintenance tasks and equipment'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload}>
            {lang === 'th' ? 'อัพโหลด' : 'Upload'}
          </Button>
          <Button icon={Plus} onClick={() => setShowTaskModal(true)}>
            {lang === 'th' ? 'สร้างงาน' : 'New Task'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'งานทั้งหมด' : 'Total Tasks'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำลังดำเนินการ' : 'In Progress'}</div>
          <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำหนดการ' : 'Scheduled'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'เสร็จสิ้น' : 'Completed'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'เร่งด่วน' : 'High Priority'}</div>
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {activeTab === 'tasks' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'ID'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'อุปกรณ์' : 'Equipment'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รายละเอียด' : 'Description'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้รับผิดชอบ' : 'Assigned'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'กำหนด' : 'Due'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ความสำคัญ' : 'Priority'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasksList.map(task => {
                  const assignee = employees?.find(e => e.id === task.assignedTo)
                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{task.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Hammer className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{task.equipment}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={task.type === 'repair' ? 'danger' : 'info'}>
                          {task.type === 'repair' ? (lang === 'th' ? 'ซ่อม' : 'Repair') : (lang === 'th' ? 'บำรุงรักษา' : 'Preventive')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{task.description}</td>
                      <td className="px-4 py-3">{assignee?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(task.scheduledDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          task.priority === 'high' ? 'danger' :
                          task.priority === 'medium' ? 'warning' :
                          'default'
                        }>
                          {task.priority === 'high' ? (lang === 'th' ? 'สูง' : 'High') :
                           task.priority === 'medium' ? (lang === 'th' ? 'กลาง' : 'Medium') :
                           (lang === 'th' ? 'ต่ำ' : 'Low')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          task.status === 'completed' ? 'success' :
                          task.status === 'in_progress' ? 'orange' :
                          'info'
                        }>
                          {task.status === 'completed' ? (lang === 'th' ? 'เสร็จ' : 'Done') :
                           task.status === 'in_progress' ? (lang === 'th' ? 'ดำเนินการ' : 'In Progress') :
                           (lang === 'th' ? 'กำหนด' : 'Scheduled')}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Equipment List */}
      {activeTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map(eq => (
            <Card key={eq.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    eq.status === 'operational' ? 'bg-green-100' :
                    eq.status === 'under_repair' ? 'bg-orange-100' :
                    'bg-red-100'
                  }`}>
                    <Cog className={`w-6 h-6 ${
                      eq.status === 'operational' ? 'text-green-600' :
                      eq.status === 'under_repair' ? 'text-orange-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{eq.name}</h3>
                    <p className="text-sm text-gray-500">{eq.code}</p>
                  </div>
                </div>
                <Badge variant={
                  eq.status === 'operational' ? 'success' :
                  eq.status === 'under_repair' ? 'orange' :
                  'danger'
                }>
                  {eq.status === 'operational' ? (lang === 'th' ? 'ใช้งานได้' : 'OK') :
                   eq.status === 'under_repair' ? (lang === 'th' ? 'ซ่อม' : 'Repair') :
                   (lang === 'th' ? 'หยุด' : 'Down')}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang === 'th' ? 'ตำแหน่ง' : 'Location'}</span>
                  <span className="font-medium">{eq.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang === 'th' ? 'บำรุงล่าสุด' : 'Last PM'}</span>
                  <span className="font-medium">{formatDate(eq.lastMaintenance)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* PM Schedule */}
      {activeTab === 'schedule' && (
        <Card className="p-6">
          <p className="text-gray-500 text-center py-12">
            {lang === 'th' ? 'ปฏิทินบำรุงรักษาเชิงป้องกัน กำลังพัฒนา' : 'Preventive Maintenance Calendar - Coming Soon'}
          </p>
        </Card>
      )}
    </div>
  )
}

// ============================================
// HR MODULE
// ============================================
const HRModule = ({ employees, setEmployees, lang }) => {
  const [activeTab, setActiveTab] = useState('employees')
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')

  const tabs = [
    { id: 'employees', label: lang === 'th' ? 'พนักงาน' : 'Employees', icon: Users },
    { id: 'attendance', label: lang === 'th' ? 'ลงเวลา' : 'Attendance', icon: Clock },
    { id: 'payroll', label: lang === 'th' ? 'เงินเดือน' : 'Payroll', icon: Banknote },
  ]

  const employeeList = employees || INITIAL_EMPLOYEES
  
  const filtered = employeeList.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                       emp.nameTh.includes(search) ||
                       emp.empId.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'all' || emp.department === filterDept
    return matchSearch && matchDept
  })

  const departments = [...new Set(employeeList.map(e => e.department))]

  const stats = {
    total: employeeList.length,
    active: employeeList.filter(e => e.status === 'active').length,
    fullTime: employeeList.filter(e => e.empType === 'FT').length,
    partTime: employeeList.filter(e => e.empType === 'PT').length,
    totalPayroll: employeeList.filter(e => e.empType === 'FT').reduce((sum, e) => {
      return sum + (e.salary || 0) + (e.positionInc || 0) + (e.labourInc || 0) + (e.phone || 0) - (e.socialSecurity || 0)
    }, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.hr', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการพนักงานและเงินเดือน' : 'Manage employees and payroll'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload}>
            {lang === 'th' ? 'อัพโหลด' : 'Upload'}
          </Button>
          <Button icon={UserPlus}>
            {lang === 'th' ? 'เพิ่มพนักงาน' : 'Add Employee'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'พนักงานทั้งหมด' : 'Total'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ทำงานอยู่' : 'Active'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ประจำ' : 'Full-time'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.fullTime}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายวัน' : 'Part-time'}</div>
          <div className="text-2xl font-bold text-orange-600">{stats.partTime}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'เงินเดือนรวม' : 'Total Payroll'}</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalPayroll)}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Employees List */}
      {activeTab === 'employees' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('action.search', lang)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">{lang === 'th' ? 'ทุกแผนก' : 'All Departments'}</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'ID'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'แผนก' : 'Department'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ตำแหน่ง' : 'Position'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สาขา' : 'Entity'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#1A5276]">{emp.empId}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-sm text-gray-500">{emp.nameTh}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{emp.department}</td>
                    <td className="px-4 py-3">{emp.designation}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={emp.empType === 'FT' ? 'info' : 'orange'}>
                        {emp.empType === 'FT' ? (lang === 'th' ? 'ประจำ' : 'Full-time') : (lang === 'th' ? 'รายวัน' : 'Daily')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {emp.empType === 'FT' ? formatCurrency(emp.salary) : `${formatCurrency(emp.dailyRate)}/day`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={emp.entity}>{emp.entity}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={emp.status === 'active' ? 'success' : 'danger'}>
                        {emp.status === 'active' ? (lang === 'th' ? 'ทำงาน' : 'Active') : (lang === 'th' ? 'ลาออก' : 'Inactive')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-800">{lang === 'th' ? 'สรุปเงินเดือน - พนักงานประจำ' : 'Payroll Summary - Full-time Employees'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">{lang === 'th' ? 'พนักงาน' : 'Employee'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'ค่าตำแหน่ง' : 'Position'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'ค่าขยัน' : 'Diligence'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'ค่าโทรศัพท์' : 'Phone'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'รวมรับ' : 'Gross'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'ประกันสังคม' : 'SSO'}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'สุทธิ' : 'Net'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employeeList.filter(e => e.empType === 'FT').map(emp => {
                  const gross = (emp.salary || 0) + (emp.positionInc || 0) + (emp.labourInc || 0) + (emp.phone || 0)
                  const net = gross - (emp.socialSecurity || 0)
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.empId}</div>
                      </td>
                      <td className="px-3 py-2 text-right">{formatCurrency(emp.salary)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(emp.positionInc || 0)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(emp.labourInc || 0)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(emp.phone || 0)}</td>
                      <td className="px-3 py-2 text-right font-medium text-blue-600">{formatCurrency(gross)}</td>
                      <td className="px-3 py-2 text-right text-red-600">-{formatCurrency(emp.socialSecurity || 0)}</td>
                      <td className="px-3 py-2 text-right font-bold text-green-600">{formatCurrency(net)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-100 font-bold">
                <tr>
                  <td className="px-3 py-3">{lang === 'th' ? 'รวมทั้งสิ้น' : 'TOTAL'}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.salary || 0), 0))}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.positionInc || 0), 0))}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.labourInc || 0), 0))}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.phone || 0), 0))}</td>
                  <td className="px-3 py-3 text-right text-blue-600">
                    {formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.salary || 0) + (e.positionInc || 0) + (e.labourInc || 0) + (e.phone || 0), 0))}
                  </td>
                  <td className="px-3 py-3 text-right text-red-600">
                    -{formatCurrency(employeeList.filter(e => e.empType === 'FT').reduce((s, e) => s + (e.socialSecurity || 0), 0))}
                  </td>
                  <td className="px-3 py-3 text-right text-green-600">{formatCurrency(stats.totalPayroll)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {lang === 'th' ? 'ระบบลงเวลา' : 'Attendance System'}
          </h3>
          <p className="text-gray-500">
            {lang === 'th' ? 'รองรับการเชื่อมต่อเครื่องสแกนลายนิ้วมือ' : 'Ready for fingerprint scanner integration'}
          </p>
        </Card>
      )}
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
      >
        <span className="text-lg">{LANGUAGES[lang].flag}</span>
        <span className="text-sm font-medium text-gray-700">{LANGUAGES[lang].name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-50 py-1">
            {Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setIsOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 ${lang === code ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
              >
                <span className="text-lg">{flag}</span>
                <span className="text-sm">{name}</span>
                {lang === code && <Check className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// LABEL PRINT MODAL (With QR Codes)
// ============================================
const LabelPrintModal = ({ isOpen, onClose, lots, lang, title, isPrePrint }) => {
  const printRef = useRef()
  
  const handlePrint = () => {
    const content = printRef.current
    const printWindow = window.open('', '_blank')
    printWindow.document.write('<html><head><title>Labels</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; }
      @page { size: 100mm 50mm; margin: 2mm; }
      .label { 
        width: 96mm; height: 46mm; border: 1px solid #000; 
        padding: 3mm; page-break-after: always; margin-bottom: 2mm;
        display: flex; justify-content: space-between;
      }
      .label-content { flex: 1; }
      .logo { font-weight: bold; font-size: 16pt; color: #1A5276; }
      .lot-no { font-size: 14pt; font-weight: bold; margin: 2mm 0; }
      .material-code { font-size: 10pt; font-family: monospace; background: #f0f0f0; padding: 1mm 2mm; }
      .details { font-size: 9pt; margin-top: 2mm; }
      .qr-placeholder { 
        width: 35mm; height: 35mm; border: 1px solid #ccc; 
        display: flex; align-items: center; justify-content: center;
        font-size: 8pt; color: #666;
      }
    `)
    printWindow.document.write('</style></head><body>')
    printWindow.document.write(content.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || (lang === 'th' ? 'พิมพ์ฉลาก' : 'Print Labels')} size="lg">
      <div className="space-y-4">
        {isPrePrint && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-800">
                {lang === 'th' ? 'ฉลากล่วงหน้า' : 'Pre-Print Labels'}
              </div>
              <div className="text-sm text-amber-700">
                {lang === 'th' 
                  ? 'ฉลากเหล่านี้จะถูกพิมพ์ก่อนรับของ ขนาดอาจเปลี่ยนแปลงได้เมื่อรับของจริง'
                  : 'These labels are printed before goods receipt. Dimensions may change upon actual receipt.'}
              </div>
            </div>
          </div>
        )}
        
        <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
          <div ref={printRef}>
            {lots.map((lot, idx) => (
              <div key={idx} className="label bg-white mb-4 p-4 border rounded flex justify-between">
                <div className="label-content">
                  <div className="logo flex items-center gap-2">
                    <span className="text-[#1A5276] font-bold text-xl">IND</span>
                    <span className="text-xs text-gray-500">Thai Packwell</span>
                  </div>
                  <div className="lot-no text-lg font-bold mt-2">{lot.lotNo}</div>
                  <div className="material-code bg-gray-100 px-2 py-1 font-mono text-sm inline-block mt-1">{lot.code}</div>
                  <div className="details grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
                    <div><span className="text-gray-500">Category:</span> <strong>{lot.category}</strong></div>
                    <div><span className="text-gray-500">Qty:</span> <strong>{lot.qty} {lot.unit || 'pcs'}</strong></div>
                    <div><span className="text-gray-500">Store:</span> <strong>{lot.store || 'STORE1'}</strong></div>
                    <div><span className="text-gray-500">Date:</span> <strong>{lot.dateIn}</strong></div>
                    {lot.cbm && <div><span className="text-gray-500">CBM:</span> <strong>{lot.cbm.toFixed(3)}</strong></div>}
                    {lot.vendor && <div><span className="text-gray-500">Vendor:</span> <strong>{lot.vendor}</strong></div>}
                  </div>
                </div>
                <div className="qr-placeholder w-24 h-24 border border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  [QR: {lot.lotNo}]
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {lots.length} {lang === 'th' ? 'ฉลาก' : 'labels'} {lang === 'th' ? 'พร้อมพิมพ์' : 'ready to print'}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>{t('action.cancel', lang)}</Button>
            <Button icon={Printer} onClick={handlePrint}>
              {lang === 'th' ? 'พิมพ์' : 'Print'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ============================================
// EDIT LOT MODAL (Correct quantities after receiving)
// ============================================
const EditLotModal = ({ isOpen, onClose, lot, categories, stores, onSave, onPrintLabel }) => {
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    if (lot) {
      // Parse dimensions from code (e.g., IND-MLH/50/100/2400)
      const codeParts = lot.code?.split('/') || []
      const thickness = parseFloat(codeParts[1]) || 0
      const width = parseFloat(codeParts[2]) || 0
      const length = parseFloat(codeParts[3]) || 0
      
      setFormData({
        lotNo: lot.lotNo,
        category: lot.category,
        dateIn: lot.dateIn,
        qty: lot.qty,
        thickness,
        width,
        length,
        store: lot.store,
        reason: '',
        cost: lot.cost || 0,
        cbm: lot.cbm || 0,
        costPerCbm: lot.costPerCbm || 0,
      })
    }
  }, [lot])

  if (!isOpen || !formData) return null

  const generateMaterialCode = () => {
    const prefix = formData.store === 'STORE2' ? 'IND2' : 'IND'
    return `${prefix}-${formData.category}/${formData.thickness}/${formData.width}/${formData.length}`
  }

  const calculateCbm = () => {
    return (formData.thickness * formData.width * formData.length * formData.qty) / 1000000000
  }

  const handleSave = () => {
    const updatedLot = {
      ...lot,
      ...formData,
      code: generateMaterialCode(),
      cbm: calculateCbm(),
    }
    onSave(updatedLot)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lot / แก้ไขล็อต" size="lg">
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            Use this to correct quantities or sizes when actual goods differ from pre-printed labels.
            Don't forget to <strong>reprint the label</strong> after saving changes.
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
            <input
              type="text"
              value={formData.lotNo}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {categories.filter(c => c.type === 'raw_material').map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.nameEn}</option>
              ))}
            </select>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-gray-400">(Original: {lot.qty})</span>
            </label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg ${formData.qty !== lot.qty ? 'border-amber-400 bg-amber-50' : ''}`}
            />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (mm)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Thickness</label>
              <input
                type="number"
                step="0.1"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Width</label>
              <input
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Length</label>
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Auto-calculated fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Code (auto-generated)</label>
            <input
              type="text"
              value={generateMaterialCode()}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Location</label>
            <select
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.nameEn}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason for correction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Correction</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Explain why this correction is needed..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="outline"
            icon={Printer}
            onClick={() => onPrintLabel(formData)}
          >
            Save & Print Label
          </Button>
          <Button icon={Save} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  )
}

// ============================================
// INVENTORY MODULE (Full with CBM tracking)
// ============================================
const InventoryModule = ({ inventory, setInventory, stores, categories, lang }) => {
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [selectedLot, setSelectedLot] = useState(null)
  const [lotsForLabels, setLotsForLabels] = useState([])
  const [expandedCodes, setExpandedCodes] = useState({})

  const handlePrintLabel = (lot) => {
    setLotsForLabels([lot])
    setShowLabelModal(true)
  }

  const handlePrintAllLabels = () => {
    setLotsForLabels(filteredInventory)
    setShowLabelModal(true)
  }

  const handleSaveAndPrintLabel = (updatedLot) => {
    setInventory(inv => inv.map(i => i.id === updatedLot.id ? updatedLot : i))
    setLotsForLabels([updatedLot])
    setShowLabelModal(true)
  }

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchStore = selectedStore === 'all' || item.store === selectedStore
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory
    const matchSearch = !search || 
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.lotNo.toLowerCase().includes(search.toLowerCase())
    return matchStore && matchCat && matchSearch
  })

  // Group by material code
  const groupedInventory = filteredInventory.reduce((acc, item) => {
    if (!acc[item.code]) {
      acc[item.code] = { code: item.code, category: item.category, lots: [], totalQty: 0, totalCbm: 0, totalCost: 0 }
    }
    acc[item.code].lots.push(item)
    acc[item.code].totalQty += item.qty
    acc[item.code].totalCbm += item.cbm || 0
    acc[item.code].totalCost += item.cost || 0
    return acc
  }, {})

  // Calculate totals
  const totals = {
    lots: filteredInventory.length,
    qty: filteredInventory.reduce((sum, i) => sum + i.qty, 0),
    cbm: filteredInventory.reduce((sum, i) => sum + (i.cbm || 0), 0),
    value: filteredInventory.reduce((sum, i) => sum + (i.cost || 0), 0),
    lowStock: filteredInventory.filter(i => i.status === 'low').length,
  }

  const rmCategories = categories.filter(c => c.type === 'raw_material')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('inventory.title', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'ติดตามสินค้าคงคลังทุกคลัง' : 'Track inventory across all stores'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload}>
            {lang === 'th' ? 'อัพโหลด' : 'Upload'}
          </Button>
          <Button variant="outline" icon={Printer} onClick={handlePrintAllLabels}>
            {lang === 'th' ? 'พิมพ์ทั้งหมด' : 'Print All'}
          </Button>
        </div>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stores.map(store => {
          const storeItems = inventory.filter(i => i.store === store.id)
          const storeValue = storeItems.reduce((sum, i) => sum + (i.cost || 0), 0)
          const isSelected = selectedStore === store.id
          return (
            <Card 
              key={store.id} 
              onClick={() => setSelectedStore(isSelected ? 'all' : store.id)}
              className={`p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-[#1A5276] bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-600">{store.code}</div>
                <Badge variant={store.type === 'raw_material' ? 'success' : store.type === 'finished_goods' ? 'info' : 'default'}>
                  {storeItems.length}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 truncate">{lang === 'th' ? store.nameTh : store.nameEn}</div>
              <div className="font-bold text-[#2ECC40] mt-2">{formatCurrency(storeValue)}</div>
            </Card>
          )
        })}
      </div>

      {/* Category Filter (8 Wood Types) */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">{lang === 'th' ? 'หมวดหมู่วัตถุดิบ (8 ประเภทไม้)' : 'Raw Material Categories (8 Wood Types)'}</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang === 'th' ? 'ทั้งหมด' : 'All'}
          </button>
          {rmCategories.map(cat => {
            const count = inventory.filter(i => i.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.code}
                <span className="text-xs opacity-75">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{t('inventory.totalLots', lang)}</div>
          <div className="text-2xl font-bold text-gray-800">{totals.lots}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'จำนวนรวม' : 'Total Qty'}</div>
          <div className="text-2xl font-bold text-gray-800">{formatNumber(totals.qty)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ปริมาตรรวม' : 'Total CBM'}</div>
          <div className="text-2xl font-bold text-blue-600">{totals.cbm.toFixed(2)} m³</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{t('inventory.totalValue', lang)}</div>
          <div className="text-2xl font-bold text-[#2ECC40]">{formatCurrency(totals.value)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{t('inventory.lowStock', lang)}</div>
          <div className="text-2xl font-bold text-red-600">{totals.lowStock}</div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('action.search', lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัสวัสดุ' : 'Material Code'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ล็อต' : 'Lots'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">CBM</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Object.values(groupedInventory).map(group => {
              const cat = categories.find(c => c.id === group.category)
              const isExpanded = expandedCodes[group.code]
              return (
                <React.Fragment key={group.code}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedCodes(prev => ({ ...prev, [group.code]: !prev[group.code] }))}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        <span className="font-mono text-[#1A5276]">{group.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat?.color }} />
                        <span>{group.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{group.lots.length}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatNumber(group.totalQty)}</td>
                    <td className="px-4 py-3 text-right">{group.totalCbm.toFixed(3)}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#2ECC40]">{formatCurrency(group.totalCost)}</td>
                  </tr>
                  {isExpanded && group.lots.map(lot => (
                    <tr key={lot.id} className="bg-gray-50/50 hover:bg-gray-100">
                      <td className="px-4 py-2 pl-12">
                        <span className="text-sm font-mono text-gray-600">{lot.lotNo}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{lot.vendor || '-'}</td>
                      <td className="px-4 py-2 text-right text-sm">
                        <Badge variant={lot.status === 'low' ? 'warning' : 'success'}>{lot.status}</Badge>
                      </td>
                      <td className="px-4 py-2 text-right text-sm">{lot.qty}</td>
                      <td className="px-4 py-2 text-right text-sm">{(lot.cbm || 0).toFixed(3)}</td>
                      <td className="px-4 py-2 text-right text-sm text-[#2ECC40]">{formatCurrency(lot.cost)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Modals */}
      <EditLotModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedLot(null) }}
        lot={selectedLot}
        categories={categories}
        stores={stores}
        onSave={(updatedLot) => setInventory(inv => inv.map(i => i.id === updatedLot.id ? updatedLot : i))}
        onPrintLabel={handleSaveAndPrintLabel}
      />

      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        lots={lotsForLabels}
        lang={lang}
      />
    </div>
  )
}

// ============================================
// PURCHASE MODULE (Full with Import Costing)
// ============================================
const PurchaseModule = ({ purchaseOrders, setPurchaseOrders, vendors, categories, stores, inventory, setInventory, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showPOModal, setShowPOModal] = useState(false)
  const [showGRNModal, setShowGRNModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [pendingLots, setPendingLots] = useState([])

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: lang === 'th' ? 'ใบสั่งซื้อ' : 'Purchase Orders', icon: FileText },
    { id: 'receiving', label: lang === 'th' ? 'รับสินค้า' : 'Goods Receipt', icon: Package },
    { id: 'vendors', label: lang === 'th' ? 'ผู้ขาย' : 'Vendors', icon: Users },
  ]

  // Stats
  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(po => po.status === 'pending').length,
    inTransit: purchaseOrders.filter(po => po.status === 'in_transit').length,
    received: purchaseOrders.filter(po => po.status === 'received').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0),
    importCosts: purchaseOrders.reduce((sum, po) => sum + (po.totalImportCosts || 0), 0),
  }

  const handleReceive = (po) => {
    setSelectedPO(po)
    setShowGRNModal(true)
  }

  const handlePrePrint = (po) => {
    const lots = po.items.map((item, idx) => {
      const prefix = po.type === 'import' ? 'IND2' : 'IND'
      return {
        lotNo: `LP${Date.now().toString().slice(-5)}${idx}`,
        code: `${prefix}-${item.categoryId}/${item.thickness}/${item.width}/${item.length}`,
        category: item.categoryId,
        qty: item.qty,
        dateIn: po.deliveryDate || new Date().toISOString().split('T')[0],
      }
    })
    setPendingLots(lots)
    setShowLabelModal(true)
  }

  const handleGRNSave = (grnData) => {
    // Update PO status
    setPurchaseOrders(pos => pos.map(po => 
      po.id === grnData.poId ? { ...po, status: 'received', receivedDate: grnData.grnDate } : po
    ))
    
    // Add to inventory
    const newItems = grnData.items.map((item, idx) => {
      const prefix = selectedPO.type === 'import' ? 'IND2' : 'IND'
      const store = selectedPO.type === 'import' || ['PLYWW', 'PLYRR', 'PLYRW'].includes(item.category) ? 'STORE2' : 'STORE1'
      const cbm = (item.thickness * item.width * item.length * item.qtyReceived) / 1000000000
      
      // Calculate cost including import costs if applicable
      let unitCost = item.unitPrice * (selectedPO.exchangeRate || 1)
      if (selectedPO.type === 'import' && selectedPO.totalImportCosts > 0) {
        const totalQty = selectedPO.items.reduce((s, i) => s + i.qtyOrdered, 0)
        const importCostShare = selectedPO.totalImportCosts / totalQty
        unitCost += importCostShare
      }
      
      return {
        id: Date.now() + idx,
        lotNo: `LP${Date.now().toString().slice(-5)}${idx}`,
        category: item.category,
        code: `${prefix}-${item.category}/${item.thickness}/${item.width}/${item.length}`,
        store,
        qty: item.qtyReceived,
        cbm,
        cost: item.qtyReceived * unitCost,
        costPerCbm: cbm > 0 ? (item.qtyReceived * unitCost) / cbm : 0,
        status: 'available',
        dateIn: grnData.grnDate,
        vendor: vendors.find(v => v.id === selectedPO.vendorId)?.name || '',
        poId: selectedPO.id,
      }
    })
    
    setInventory(inv => [...inv, ...newItems])
    setShowGRNModal(false)
    setSelectedPO(null)
  }

  const handleDocumentProcessed = (data) => {
    // Auto-create PO from uploaded document
    if (data.docType === 'vendor_invoice' && data.items) {
      const newPO = {
        id: `PO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        vendorId: data.vendorId,
        type: 'local',
        poDate: new Date().toISOString().split('T')[0],
        vendorInvoice: data.invoiceNo,
        vendorInvoiceDate: data.invoiceDate,
        items: data.items.map((item, idx) => ({
          id: idx + 1,
          categoryId: item.category || data.suggestedCategory,
          thickness: 50,
          width: 100,
          length: 2400,
          qty: item.qty,
          unit: 'pcs',
          cbm: item.cbm || 0,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        subtotal: data.subtotal,
        vat: data.vat,
        total: data.total,
        importCosts: {},
        totalImportCosts: 0,
        status: 'pending',
        entity: 'IND',
        uploadedFrom: data.file,
        processedAt: data.processedAt,
      }
      setPurchaseOrders(pos => [...pos, newPO])
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.purchase', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการใบสั่งซื้อและรับสินค้า' : 'Manage purchase orders and goods receipt'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload} onClick={() => setShowUploadModal(true)}>
            {lang === 'th' ? 'อัพโหลดเอกสาร' : 'Upload Invoice'}
          </Button>
          <Button icon={Plus} onClick={() => setShowPOModal(true)}>
            {lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'New PO'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอดำเนินการ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ระหว่างทาง' : 'In Transit'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.received}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ค่านำเข้า' : 'Import Costs'}</div>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.importCosts)}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent POs */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'ใบสั่งซื้อล่าสุด' : 'Recent Purchase Orders'}</h3>
            <div className="space-y-3">
              {purchaseOrders.slice(0, 5).map(po => {
                const vendor = vendors.find(v => v.id === po.vendorId)
                return (
                  <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-mono text-[#1A5276] font-medium">{po.id}</div>
                      <div className="text-sm text-gray-500">{vendor?.name || po.vendorId}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        po.status === 'received' ? 'success' :
                        po.status === 'in_transit' ? 'info' :
                        'warning'
                      }>
                        {po.status}
                      </Badge>
                      <div className="text-sm font-medium mt-1">{formatCurrency(po.total)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Pending Receipts */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'รอรับสินค้า' : 'Pending Receipts'}</h3>
            <div className="space-y-3">
              {purchaseOrders.filter(po => po.status === 'pending' || po.status === 'in_transit').map(po => {
                const vendor = vendors.find(v => v.id === po.vendorId)
                return (
                  <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-mono text-[#1A5276] font-medium">{po.id}</div>
                      <div className="text-sm text-gray-500">{vendor?.name}</div>
                      <div className="text-xs text-gray-400">{lang === 'th' ? 'กำหนดส่ง:' : 'Due:'} {po.deliveryDate}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" icon={Printer} onClick={() => handlePrePrint(po)}>
                        {lang === 'th' ? 'ฉลาก' : 'Labels'}
                      </Button>
                      <Button size="sm" icon={Package} onClick={() => handleReceive(po)}>
                        {lang === 'th' ? 'รับ' : 'Receive'}
                      </Button>
                    </div>
                  </div>
                )
              })}
              {purchaseOrders.filter(po => po.status === 'pending' || po.status === 'in_transit').length === 0 && (
                <p className="text-gray-400 text-center py-4">{lang === 'th' ? 'ไม่มีรายการรอรับ' : 'No pending receipts'}</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่ PO' : 'PO #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่าวัสดุ' : 'Materials'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่านำเข้า' : 'Import'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รวม' : 'Total'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchaseOrders.map(po => {
                  const vendor = vendors.find(v => v.id === po.vendorId)
                  return (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-[#1A5276] font-medium">{po.id}</div>
                        {po.vendorInvoice && <div className="text-xs text-gray-400">{po.vendorInvoice}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{vendor?.name || po.vendorId}</div>
                        <div className="text-xs text-gray-400">{vendor?.country}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={po.type === 'import' ? 'info' : 'success'}>
                          {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(po.poDate)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(po.subtotal)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">
                        {po.type === 'import' ? formatCurrency(po.totalImportCosts) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#2ECC40]">{formatCurrency(po.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          po.status === 'received' ? 'success' :
                          po.status === 'in_transit' ? 'info' :
                          'warning'
                        }>
                          {po.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded" title="View">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {po.status !== 'received' && (
                            <button 
                              className="p-1 hover:bg-gray-100 rounded" 
                              title="Receive"
                              onClick={() => handleReceive(po)}
                            >
                              <Package className="w-4 h-4 text-blue-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Receiving Tab */}
      {activeTab === 'receiving' && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-100">
            <h3 className="font-bold text-green-800">{lang === 'th' ? 'รายการรอรับสินค้า' : 'Goods Receipt Queue'}</h3>
            <p className="text-sm text-green-600">{lang === 'th' ? 'เลือก PO เพื่อรับสินค้าเข้าคลัง' : 'Select PO to receive goods into inventory'}</p>
          </div>
          <div className="divide-y">
            {purchaseOrders.filter(po => po.status !== 'received').map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <div key={po.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${po.type === 'import' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {po.type === 'import' ? '🚢' : '🏠'}
                    </div>
                    <div>
                      <div className="font-mono text-[#1A5276] font-bold">{po.id}</div>
                      <div className="text-sm text-gray-600">{vendor?.name}</div>
                      <div className="text-xs text-gray-400">
                        {po.items?.length || 0} {lang === 'th' ? 'รายการ' : 'items'} • 
                        {lang === 'th' ? ' กำหนดส่ง: ' : ' Due: '}{formatDate(po.deliveryDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่า' : 'Value'}</div>
                      <div className="font-bold text-[#2ECC40]">{formatCurrency(po.total)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" icon={Printer} onClick={() => handlePrePrint(po)}>
                        {lang === 'th' ? 'ฉลากล่วงหน้า' : 'Pre-print'}
                      </Button>
                      <Button size="sm" icon={Package} onClick={() => handleReceive(po)}>
                        {lang === 'th' ? 'รับสินค้า' : 'Receive'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            {purchaseOrders.filter(po => po.status !== 'received').length === 0 && (
              <div className="p-8 text-center text-gray-400">
                {lang === 'th' ? 'ไม่มีรายการรอรับ' : 'No items pending receipt'}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'Code'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ติดต่อ' : 'Contact'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'เครดิต' : 'Terms'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendors.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[#1A5276]">{v.code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-gray-500">{v.nameTh}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={v.type === 'import' ? 'info' : 'success'}>
                        {v.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{v.category}</td>
                    <td className="px-4 py-3">
                      <div>{v.contact}</div>
                      <div className="text-sm text-gray-500">{v.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-center">{v.paymentTerms} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PO Form Modal */}
      {showPOModal && (
        <Modal isOpen={showPOModal} onClose={() => setShowPOModal(false)} title={lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'New Purchase Order'} size="xl">
          <PurchaseOrderForm
            vendors={vendors}
            categories={categories}
            lang={lang}
            onSave={(poData) => {
              const newPO = {
                id: `PO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
                ...poData,
                status: 'pending',
                entity: poData.type === 'import' ? 'IND' : 'IND',
              }
              setPurchaseOrders([...purchaseOrders, newPO])
              setShowPOModal(false)
            }}
            onCancel={() => setShowPOModal(false)}
          />
        </Modal>
      )}

      {/* GRN Modal */}
      {showGRNModal && selectedPO && (
        <Modal isOpen={showGRNModal} onClose={() => setShowGRNModal(false)} title={lang === 'th' ? 'รับสินค้า' : 'Goods Receipt'} size="xl">
          <GoodsReceiptForm
            po={selectedPO}
            vendors={vendors}
            lang={lang}
            onSave={handleGRNSave}
            onCancel={() => setShowGRNModal(false)}
          />
        </Modal>
      )}

      {/* Smart Upload Modal */}
      <SmartDocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        module="purchase"
        lang={lang}
        categories={categories}
        vendors={vendors}
        onProcessed={handleDocumentProcessed}
      />

      {/* Label Print Modal */}
      <LabelPrintModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        lots={pendingLots}
        lang={lang}
        title={lang === 'th' ? 'พิมพ์ฉลากล่วงหน้า' : 'Pre-print Labels'}
        isPrePrint={true}
      />
    </div>
  )
}

// ============================================
// PURCHASE ORDER FORM (With 13 Import Cost Types)
// ============================================
const PurchaseOrderForm = ({ po, vendors, categories, onSave, onCancel, lang }) => {
  const rmCategories = categories.filter(c => c.type === 'raw_material')
  const [formData, setFormData] = useState({
    type: po?.type || 'local',
    vendorId: po?.vendorId || '',
    poDate: po?.poDate || new Date().toISOString().split('T')[0],
    vendorInvoice: po?.vendorInvoice || '',
    vendorInvoiceDate: po?.vendorInvoiceDate || '',
    container: po?.container || '',
    blNumber: po?.blNumber || '',
    deliveryDate: po?.deliveryDate || '',
    currency: po?.currency || 'THB',
    exchangeRate: po?.exchangeRate || 1,
    items: po?.items || [{ id: 1, categoryId: '', thickness: 0, width: 0, length: 0, qty: 0, unit: 'pcs', unitPrice: 0 }],
    importCosts: po?.importCosts || {},
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

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: prev.items.length + 1, categoryId: '', thickness: 0, width: 0, length: 0, qty: 0, unit: 'pcs', unitPrice: 0 }]
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
  const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.unitPrice * formData.exchangeRate), 0)
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
      vat: vat7,
      withholding: withholding3,
      total: grandTotal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type & Vendor */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ประเภทการซื้อ' : 'Purchase Type'}
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ผู้ขาย *' : 'Vendor *'}
          </label>
          <select
            required
            value={formData.vendorId}
            onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276]"
          >
            <option value="">{lang === 'th' ? 'เลือกผู้ขาย' : 'Select Vendor'}</option>
            {vendors.filter(v => formData.type === 'all' || v.type === formData.type).map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates & Invoice */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันที่ PO *' : 'PO Date *'}
          </label>
          <input
            type="date"
            required
            value={formData.poDate}
            onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เลขที่ใบแจ้งหนี้' : 'Vendor Invoice #'}
          </label>
          <input
            type="text"
            value={formData.vendorInvoice}
            onChange={(e) => setFormData({ ...formData, vendorInvoice: e.target.value })}
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
        {formData.type === 'import' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'เลขตู้' : 'Container #'}
            </label>
            <input
              type="text"
              value={formData.container}
              onChange={(e) => setFormData({ ...formData, container: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="MSCU1234567"
            />
          </div>
        )}
      </div>

      {/* Currency for Import */}
      {formData.type === 'import' && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'สกุลเงิน' : 'Currency'}
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="THB">THB (฿)</option>
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
          <div className="flex items-end">
            <div className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
              1 {formData.currency} = ฿{formData.exchangeRate.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {lang === 'th' ? 'รายการสินค้า' : 'Order Items'}
          </label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            + {lang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                <th className="px-3 py-2 text-left">{lang === 'th' ? 'ขนาด T x W x L (mm)' : 'T x W x L (mm)'}</th>
                <th className="px-3 py-2 text-right">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                <th className="px-3 py-2 text-left">{lang === 'th' ? 'หน่วย' : 'Unit'}</th>
                <th className="px-3 py-2 text-right">{lang === 'th' ? 'ราคา/หน่วย' : 'Unit Price'}</th>
                <th className="px-3 py-2 text-right">{lang === 'th' ? 'รวม' : 'Total'}</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2">
                    <select
                      value={item.categoryId}
                      onChange={(e) => updateItem(idx, 'categoryId', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">{lang === 'th' ? 'เลือก' : 'Select'}</option>
                      {rmCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.code} - {c.nameEn}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="T"
                        value={item.thickness || ''}
                        onChange={(e) => updateItem(idx, 'thickness', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="W"
                        value={item.width || ''}
                        onChange={(e) => updateItem(idx, 'width', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="L"
                        value={item.length || ''}
                        onChange={(e) => updateItem(idx, 'length', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                    </div>
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
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatCurrency(item.qty * item.unitPrice * formData.exchangeRate)}
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

      {/* Import Costs - 13 Types */}
      {formData.type === 'import' && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'th' ? 'ค่าใช้จ่ายนำเข้า (13 ประเภท)' : 'Import Costing (13 Types)'}
          </label>
          <div className="grid grid-cols-4 gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            {IMPORT_COST_TYPES.map(cost => (
              <div key={cost.id}>
                <label className="block text-xs text-gray-600 mb-1">
                  {lang === 'th' ? cost.nameTh : cost.nameEn}
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
          <div className="mt-2 text-right text-sm text-blue-700">
            {lang === 'th' ? 'รวมค่านำเข้า:' : 'Total Import Costs:'} <strong>{formatCurrency(totalImportCosts)}</strong>
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{lang === 'th' ? 'ค่าวัสดุ' : 'Subtotal (Materials)'}</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {formData.type === 'import' && (
              <div className="flex justify-between">
                <span className="text-gray-600">{lang === 'th' ? 'ค่านำเข้า' : 'Import Costs'}</span>
                <span className="font-medium text-orange-600">{formatCurrency(totalImportCosts)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">VAT 7%</span>
              <span className="font-medium">{formatCurrency(vat7)}</span>
            </div>
            {formData.type === 'import' && (
              <div className="flex justify-between">
                <span className="text-gray-600">{lang === 'th' ? 'หัก ณ ที่จ่าย 3%' : 'Withholding 3%'}</span>
                <span className="font-medium text-red-600">-{formatCurrency(withholding3)}</span>
              </div>
            )}
          </div>
          <div className="flex items-end justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'รวมทั้งสิ้น' : 'Grand Total'}</div>
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

// ============================================
// GOODS RECEIPT FORM
// ============================================
const GoodsReceiptForm = ({ po, vendors, onSave, onCancel, lang }) => {
  const vendor = vendors.find(v => v.id === po.vendorId)
  const [grnItems, setGrnItems] = useState(
    po.items.map(item => ({
      ...item,
      qtyToReceive: item.qty - (item.qtyReceived || 0),
      actualThickness: item.thickness,
      actualWidth: item.width,
      actualLength: item.length,
      varianceReason: '',
    }))
  )
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const updateGrnItem = (idx, field, value) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      poId: po.id,
      grnDate,
      notes,
      items: grnItems.map(item => ({
        id: item.id,
        category: item.categoryId,
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
            <div className="text-gray-500">{lang === 'th' ? 'เลขที่ PO' : 'PO Number'}</div>
            <div className="font-bold text-[#1A5276]">{po.id}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</div>
            <div className="font-medium">{vendor?.name}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoice'}</div>
            <div className="font-medium">{po.vendorInvoice || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ประเภท' : 'Type'}</div>
            <Badge variant={po.type === 'import' ? 'info' : 'success'}>{po.type}</Badge>
          </div>
        </div>
      </div>

      {/* GRN Date */}
      <div className="grid grid-cols-3 gap-4">
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
      </div>

      {/* Items to Receive */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {lang === 'th' ? 'รายการรับ (แก้ไขได้)' : 'Items to Receive (Editable)'}
        </label>
        <div className="space-y-4">
          {grnItems.map((item, idx) => {
            const remaining = item.qty - (po.items[idx].qtyReceived || 0)
            const hasVariance = item.qtyToReceive !== remaining || 
                               item.actualThickness !== item.thickness ||
                               item.actualWidth !== item.width ||
                               item.actualLength !== item.length
            
            return (
              <Card key={idx} className={`p-4 ${hasVariance ? 'border-amber-300 bg-amber-50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{item.categoryId}</Badge>
                      <span className="text-sm text-gray-500">
                        {lang === 'th' ? 'สั่ง:' : 'Ordered:'} {item.qty} | 
                        {lang === 'th' ? ' รับแล้ว:' : ' Received:'} {po.items[idx].qtyReceived || 0} | 
                        {lang === 'th' ? ' คงเหลือ:' : ' Remaining:'} {remaining}
                      </span>
                    </div>
                  </div>
                  {hasVariance && (
                    <Badge variant="warning">⚠️ {lang === 'th' ? 'ต่างจากที่สั่ง' : 'Variance'}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'จำนวนรับ *' : 'Qty to Receive *'}
                    </label>
                    <input
                      type="number"
                      value={item.qtyToReceive}
                      onChange={(e) => updateGrnItem(idx, 'qtyToReceive', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg ${item.qtyToReceive !== remaining ? 'border-amber-400 bg-amber-50' : ''}`}
                      max={remaining}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'หนา (จริง)' : 'Actual Thickness'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualThickness}
                      onChange={(e) => updateGrnItem(idx, 'actualThickness', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualThickness !== item.thickness ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'กว้าง (จริง)' : 'Actual Width'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualWidth}
                      onChange={(e) => updateGrnItem(idx, 'actualWidth', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualWidth !== item.width ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'ยาว (จริง)' : 'Actual Length'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actualLength}
                      onChange={(e) => updateGrnItem(idx, 'actualLength', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg ${item.actualLength !== item.length ? 'border-amber-400 bg-amber-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'มูลค่า' : 'Value'}
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg font-medium text-[#2ECC40]">
                      {formatCurrency(item.qtyToReceive * item.unitPrice * (po.exchangeRate || 1))}
                    </div>
                  </div>
                </div>

                {hasVariance && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      {lang === 'th' ? 'เหตุผลที่ต่าง *' : 'Variance Reason *'}
                    </label>
                    <input
                      type="text"
                      value={item.varianceReason}
                      onChange={(e) => updateGrnItem(idx, 'varianceReason', e.target.value)}
                      placeholder={lang === 'th' ? 'ระบุเหตุผล เช่น ขาด 2 ชิ้น, สั้นกว่า 10mm' : 'e.g., 2 pieces short, 10mm shorter'}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'หมายเหตุ' : 'Notes'}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-green-800">
              {lang === 'th' ? 'สรุปการรับ' : 'Receipt Summary'}
            </div>
            <div className="text-sm text-green-600">
              {grnItems.reduce((sum, i) => sum + i.qtyToReceive, 0)} {lang === 'th' ? 'รายการจะเข้าคลัง' : 'items will be added to inventory'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(grnItems.reduce((sum, i) => sum + (i.qtyToReceive * i.unitPrice * (po.exchangeRate || 1)), 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>
          {lang === 'th' ? 'ยืนยันรับสินค้า' : 'Confirm Receipt'}
        </Button>
      </div>
    </form>
  )
}

// ============================================
// PRODUCTION MODULE (With Costing Analysis)
// ============================================
const ProductionModule = ({ workOrders, setWorkOrders, departments, customers, inventory, setInventory, categories, stores, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showWOModal, setShowWOModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [selectedWO, setSelectedWO] = useState(null)
  const [filterDept, setFilterDept] = useState('all')

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: lang === 'th' ? 'ใบสั่งผลิต' : 'Work Orders', icon: ClipboardList },
    { id: 'floor', label: lang === 'th' ? 'หน้างาน' : 'Floor View', icon: Factory },
    { id: 'costing', label: lang === 'th' ? 'ต้นทุน' : 'Costing', icon: Calculator },
  ]

  // Stats
  const stats = {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    inProgress: workOrders.filter(wo => wo.status === 'in_progress').length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
    totalRevenue: workOrders.reduce((sum, wo) => sum + (wo.totalRevenue || 0), 0),
    totalCost: workOrders.reduce((sum, wo) => sum + (wo.costs?.total || 0), 0),
  }

  const handleStartOperation = (woId, dept) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id !== woId) return wo
      const newOps = [...(wo.operations || []), {
        dept,
        status: 'in_progress',
        startTime: new Date().toISOString(),
        endTime: null,
        hours: 0,
        operator: 'Current User',
      }]
      return { ...wo, status: 'in_progress', operations: newOps }
    }))
  }

  const handleCompleteOperation = (woId, dept) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id !== woId) return wo
      const newOps = wo.operations.map(op => {
        if (op.dept !== dept || op.status !== 'in_progress') return op
        const endTime = new Date()
        const startTime = new Date(op.startTime)
        const hours = (endTime - startTime) / (1000 * 60 * 60)
        return { ...op, status: 'completed', endTime: endTime.toISOString(), hours }
      })
      return { ...wo, operations: newOps }
    }))
  }

  const handleIssue = (wo) => {
    setSelectedWO(wo)
    setShowIssueModal(true)
  }

  const handleMaterialIssue = (issueData) => {
    // Deduct from inventory
    issueData.items.forEach(item => {
      setInventory(inv => inv.map(i => 
        i.lotNo === item.lotNo ? { ...i, qty: i.qty - item.qty } : i
      ))
    })

    // Update WO with issued materials
    setWorkOrders(workOrders.map(wo => {
      if (wo.id !== selectedWO.id) return wo
      const newIssued = [...(wo.materialsIssued || []), ...issueData.items]
      const materialCost = newIssued.reduce((sum, i) => sum + (i.cost || 0), 0)
      return {
        ...wo,
        materialsIssued: newIssued,
        costs: {
          ...wo.costs,
          material: materialCost,
          total: materialCost + (wo.costs?.labor || 0) + (wo.costs?.overhead || 0),
        },
      }
    }))
    
    setShowIssueModal(false)
    setSelectedWO(null)
  }

  // Filter WOs by department
  const filteredWOs = filterDept === 'all' 
    ? workOrders 
    : workOrders.filter(wo => wo.department === filterDept)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.production', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการการผลิตและต้นทุน' : 'Manage production and costing'}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">{lang === 'th' ? 'ทุกแผนก' : 'All Depts'}</option>
            {departments.filter(d => d.isActive).map(d => (
              <option key={d.id} value={d.id}>{d.code} - {d.nameEn}</option>
            ))}
          </select>
          <Button icon={Plus} onClick={() => setShowWOModal(true)}>
            {lang === 'th' ? 'สร้างใบสั่งผลิต' : 'New WO'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ผลิต' : 'In Progress'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'เสร็จ' : 'Completed'}</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้' : 'Revenue'}</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ต้นทุน' : 'Cost'}</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalCost)}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active WOs */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'งานที่กำลังผลิต' : 'Active Work Orders'}</h3>
            <div className="space-y-3">
              {workOrders.filter(wo => wo.status === 'in_progress').slice(0, 5).map(wo => {
                const customer = customers.find(c => c.id === wo.customerId)
                const progress = wo.quantity > 0 ? ((wo.completedQty || 0) / wo.quantity * 100) : 0
                return (
                  <div key={wo.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-[#1A5276] font-medium">{wo.id}</div>
                      <Badge variant={wo.department === 'C1' ? 'danger' : wo.department === 'C2' ? 'orange' : 'info'}>
                        {wo.department}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{wo.productName}</div>
                    <div className="text-xs text-gray-400">{customer?.name}</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{wo.completedQty || 0} / {wo.quantity}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1A5276] to-[#2ECC40]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Department Status */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'สถานะแผนก' : 'Department Status'}</h3>
            <div className="grid grid-cols-2 gap-3">
              {departments.filter(d => d.isActive).slice(0, 6).map(dept => {
                const deptWOs = workOrders.filter(wo => wo.department === dept.id && wo.status === 'in_progress')
                const typeColor = DEPARTMENT_TYPES.find(t => t.id === dept.type)?.color || '#gray'
                return (
                  <div key={dept.id} className="p-3 rounded-lg border" style={{ borderLeftWidth: 4, borderLeftColor: typeColor }}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{dept.code}</div>
                      <Badge variant={deptWOs.length > 0 ? 'success' : 'default'}>
                        {deptWOs.length} {lang === 'th' ? 'งาน' : 'jobs'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{dept.nameEn}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Work Orders List */}
      {activeTab === 'orders' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'WO #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'แผนก' : 'Dept'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Material'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ต้นทุน' : 'Cost'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredWOs.map(wo => {
                  const customer = customers.find(c => c.id === wo.customerId)
                  return (
                    <tr key={wo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-[#1A5276] font-medium">{wo.id}</div>
                        <div className="text-xs text-gray-400">{wo.soId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{wo.productName}</div>
                        <div className="text-xs text-gray-400">{wo.materialType}</div>
                      </td>
                      <td className="px-4 py-3">{customer?.name || wo.customerId}</td>
                      <td className="px-4 py-3 text-right">
                        <div>{wo.completedQty || 0} / {wo.quantity}</div>
                        <div className="text-xs text-gray-400">
                          {wo.quantity > 0 ? ((wo.completedQty || 0) / wo.quantity * 100).toFixed(0) : 0}%
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="info">{wo.department}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">{formatCurrency(wo.costs?.material || 0)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(wo.costs?.total || 0)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          wo.status === 'completed' ? 'success' :
                          wo.status === 'in_progress' ? 'info' :
                          'warning'
                        }>
                          {wo.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="Issue Materials"
                            onClick={() => handleIssue(wo)}
                          >
                            <Package className="w-4 h-4 text-blue-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded" title="View">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Floor View */}
      {activeTab === 'floor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.filter(d => d.isActive).map(dept => {
            const deptWOs = workOrders.filter(wo => wo.department === dept.id)
            const activeWOs = deptWOs.filter(wo => wo.status === 'in_progress')
            const typeColor = DEPARTMENT_TYPES.find(t => t.id === dept.type)?.color || '#6B7280'
            
            return (
              <Card key={dept.id} className="overflow-hidden">
                <div className="p-4" style={{ backgroundColor: typeColor + '20' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">{dept.code}</div>
                      <div className="text-sm text-gray-600">{dept.nameEn}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: typeColor }}>{activeWOs.length}</div>
                      <div className="text-xs text-gray-500">{lang === 'th' ? 'งานกำลังทำ' : 'active'}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {activeWOs.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      {lang === 'th' ? 'ไม่มีงาน' : 'No active jobs'}
                    </p>
                  ) : (
                    activeWOs.map(wo => (
                      <div key={wo.id} className="p-2 bg-gray-50 rounded flex items-center justify-between">
                        <div>
                          <div className="font-mono text-sm text-[#1A5276]">{wo.id}</div>
                          <div className="text-xs text-gray-500">{wo.productName}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => handleCompleteOperation(wo.id, dept.id)}
                        >
                          ✓
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Costing Tab - THE FEATURE USER LOVES */}
      {activeTab === 'costing' && (
        <ProductionCosting workOrders={workOrders} customers={customers} lang={lang} />
      )}

      {/* WO Form Modal */}
      {showWOModal && (
        <Modal isOpen={showWOModal} onClose={() => setShowWOModal(false)} title={lang === 'th' ? 'สร้างใบสั่งผลิต' : 'New Work Order'} size="lg">
          <WorkOrderForm
            customers={customers}
            departments={departments}
            inventory={inventory}
            categories={categories}
            lang={lang}
            onSave={(woData) => {
              const newWO = {
                id: `WO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(workOrders.length + 1).padStart(3, '0')}`,
                ...woData,
                status: 'pending',
                completedQty: 0,
                operations: [],
                materialsIssued: [],
                costs: { material: 0, labor: 0, overhead: 0, total: 0, perUnit: 0 },
                profit: { amount: 0, margin: 0 },
                createdAt: new Date().toISOString().split('T')[0],
              }
              setWorkOrders([...workOrders, newWO])
              setShowWOModal(false)
            }}
            onCancel={() => setShowWOModal(false)}
          />
        </Modal>
      )}

      {/* Material Issue Modal */}
      {showIssueModal && selectedWO && (
        <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} title={lang === 'th' ? 'เบิกวัสดุ' : 'Issue Materials'} size="lg">
          <MaterialIssueForm
            wo={selectedWO}
            inventory={inventory}
            lang={lang}
            onIssue={handleMaterialIssue}
            onCancel={() => setShowIssueModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

// ============================================
// PRODUCTION COSTING (Customer Profitability & WO Analysis)
// ============================================
const ProductionCosting = ({ workOrders, customers, lang }) => {
  const completedWOs = workOrders.filter(wo => wo.status === 'completed' || wo.status === 'delivered')
  
  const totalRevenue = completedWOs.reduce((sum, wo) => sum + (wo.totalRevenue || 0), 0)
  const totalCost = completedWOs.reduce((sum, wo) => sum + (wo.costs?.total || 0), 0)
  const totalProfit = totalRevenue - totalCost
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0

  // Customer profitability analysis
  const customerStats = customers.map(cust => {
    const custWOs = completedWOs.filter(wo => wo.customerId === cust.id)
    const revenue = custWOs.reduce((sum, wo) => sum + (wo.totalRevenue || 0), 0)
    const cost = custWOs.reduce((sum, wo) => sum + (wo.costs?.total || 0), 0)
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
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Total Revenue'}</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ต้นทุนรวม' : 'Total Cost'}</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำไรรวม' : 'Total Profit'}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'อัตรากำไรเฉลี่ย' : 'Avg Margin'}</div>
          <div className={`text-2xl font-bold ${avgMargin >= 20 ? 'text-green-600' : avgMargin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
            {avgMargin.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Customer Profitability Ranking */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">
          {lang === 'th' ? 'จัดอันดับกำไรตามลูกค้า' : 'Customer Profitability Ranking'}
        </h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'อันดับ' : 'Rank'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ออเดอร์' : 'Orders'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รายได้' : 'Revenue'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ต้นทุน' : 'Cost'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'กำไร' : 'Profit'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'อัตรากำไร' : 'Margin'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customerStats.map((cust, idx) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    idx === 1 ? 'bg-gray-200 text-gray-700' : 
                    idx === 2 ? 'bg-amber-100 text-amber-700' : 
                    'bg-gray-100 text-gray-500'
                  }`}>
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
            {customerStats.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  {lang === 'th' ? 'ยังไม่มีข้อมูลการผลิตที่เสร็จสิ้น' : 'No completed production data yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Work Order Cost Details */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 mb-4">
          {lang === 'th' ? 'รายละเอียดต้นทุนใบสั่งผลิต' : 'Work Order Cost Details'}
        </h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'WO #'}</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Material'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'แรงงาน' : 'Labor'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'โสหุ้ย' : 'Overhead'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'รวม' : 'Total'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'ต่อหน่วย' : '$/Unit'}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'กำไร' : 'Margin'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {workOrders.slice(0, 10).map(wo => (
              <tr key={wo.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-[#1A5276]">{wo.id}</td>
                <td className="px-3 py-2">{wo.productName}</td>
                <td className="px-3 py-2 text-right">{wo.quantity}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs?.material || 0)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs?.labor || 0)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs?.overhead || 0)}</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(wo.costs?.total || 0)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(wo.costs?.perUnit || 0)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`font-medium ${(wo.profit?.margin || 0) >= 20 ? 'text-green-600' : (wo.profit?.margin || 0) >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                    {(wo.profit?.margin || 0).toFixed(1)}%
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
// WORK ORDER FORM
// ============================================
const WorkOrderForm = ({ wo, customers, departments, inventory, categories, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    customerId: wo?.customerId || '',
    soId: wo?.soId || '',
    productName: wo?.productName || '',
    quantity: wo?.quantity || 0,
    materialType: wo?.materialType || '',
    department: wo?.department || '',
    priority: wo?.priority || 'medium',
    targetDate: wo?.targetDate || '',
    totalRevenue: wo?.totalRevenue || 0,
    entity: wo?.entity || 'IND',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const rmCategories = categories.filter(c => c.type === 'raw_material')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
            <option value="">{lang === 'th' ? 'เลือกลูกค้า' : 'Select Customer'}</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'เลขที่ใบสั่งขาย' : 'Sales Order #'}
          </label>
          <input
            type="text"
            value={formData.soId}
            onChange={(e) => setFormData({ ...formData, soId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="SO-2501-001"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'ชื่อสินค้า *' : 'Product Name *'}
        </label>
        <input
          type="text"
          required
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Pallet 1100x950x950"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'จำนวน *' : 'Quantity *'}
          </label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ประเภทวัสดุ *' : 'Material Type *'}
          </label>
          <select
            required
            value={formData.materialType}
            onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">{lang === 'th' ? 'เลือก' : 'Select'}</option>
            {rmCategories.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'มูลค่ารวม' : 'Total Revenue'}
          </label>
          <input
            type="number"
            value={formData.totalRevenue}
            onChange={(e) => setFormData({ ...formData, totalRevenue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'แผนก *' : 'Department *'}
          </label>
          <select
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">{lang === 'th' ? 'เลือก' : 'Select'}</option>
            {departments.filter(d => d.isActive).map(d => (
              <option key={d.id} value={d.id}>{d.code} - {d.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ความสำคัญ' : 'Priority'}
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
            <option value="medium">{lang === 'th' ? 'ปานกลาง' : 'Medium'}</option>
            <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'กำหนดส่ง' : 'Target Date'}
          </label>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
      </div>
    </form>
  )
}

// ============================================
// MATERIAL ISSUE FORM
// ============================================
const MaterialIssueForm = ({ wo, inventory, onIssue, onCancel, lang }) => {
  const [selectedItems, setSelectedItems] = useState([])
  
  // Filter inventory by material type
  const availableInventory = inventory.filter(i => 
    i.category === wo.materialType && i.qty > 0
  )

  const toggleItem = (item, qty) => {
    const existing = selectedItems.find(i => i.lotNo === item.lotNo)
    if (existing) {
      setSelectedItems(selectedItems.filter(i => i.lotNo !== item.lotNo))
    } else {
      setSelectedItems([...selectedItems, { ...item, issueQty: qty || item.qty }])
    }
  }

  const updateQty = (lotNo, qty) => {
    setSelectedItems(selectedItems.map(i => 
      i.lotNo === lotNo ? { ...i, issueQty: qty } : i
    ))
  }

  const totalCost = selectedItems.reduce((sum, i) => {
    const unitCost = i.cost / i.qty
    return sum + (i.issueQty * unitCost)
  }, 0)

  const handleSubmit = () => {
    onIssue({
      woId: wo.id,
      items: selectedItems.map(i => ({
        lotNo: i.lotNo,
        category: i.category,
        code: i.code,
        qty: i.issueQty,
        cost: (i.cost / i.qty) * i.issueQty,
      }))
    })
  }

  return (
    <div className="space-y-4">
      {/* WO Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'ใบสั่งผลิต' : 'Work Order'}</div>
            <div className="font-bold text-[#1A5276]">{wo.id}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'สินค้า' : 'Product'}</div>
            <div className="font-medium">{wo.productName}</div>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'วัสดุ' : 'Material'}</div>
            <Badge variant="info">{wo.materialType}</Badge>
          </div>
        </div>
      </div>

      {/* Available Inventory */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {lang === 'th' ? 'สินค้าคงคลังที่มี' : 'Available Inventory'} ({wo.materialType})
        </label>
        <div className="border rounded-lg max-h-60 overflow-y-auto">
          {availableInventory.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {lang === 'th' ? 'ไม่มีสินค้าในหมวดหมู่นี้' : 'No inventory available for this material type'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2 text-left">{lang === 'th' ? 'ล็อต' : 'Lot'}</th>
                  <th className="px-3 py-2 text-left">{lang === 'th' ? 'รหัส' : 'Code'}</th>
                  <th className="px-3 py-2 text-right">{lang === 'th' ? 'มี' : 'Avail'}</th>
                  <th className="px-3 py-2 text-right">{lang === 'th' ? 'เบิก' : 'Issue'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {availableInventory.map(item => {
                  const selected = selectedItems.find(i => i.lotNo === item.lotNo)
                  return (
                    <tr key={item.lotNo} className={`hover:bg-gray-50 ${selected ? 'bg-green-50' : ''}`}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleItem(item)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-[#1A5276]">{item.lotNo}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{item.code}</td>
                      <td className="px-3 py-2 text-right">{item.qty}</td>
                      <td className="px-3 py-2 text-right">
                        {selected && (
                          <input
                            type="number"
                            value={selected.issueQty}
                            onChange={(e) => updateQty(item.lotNo, parseInt(e.target.value) || 0)}
                            max={item.qty}
                            className="w-20 px-2 py-1 border rounded text-right"
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedItems.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-800">
                {lang === 'th' ? 'สรุปการเบิก' : 'Issue Summary'}
              </div>
              <div className="text-sm text-green-600">
                {selectedItems.length} {lang === 'th' ? 'รายการ' : 'items'} • 
                {selectedItems.reduce((sum, i) => sum + i.issueQty, 0)} {lang === 'th' ? 'ชิ้น' : 'pcs'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600">{lang === 'th' ? 'มูลค่า' : 'Cost'}</div>
              <div className="text-xl font-bold text-green-700">{formatCurrency(totalCost)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button 
          onClick={handleSubmit} 
          icon={Package}
          disabled={selectedItems.length === 0}
        >
          {lang === 'th' ? 'เบิกวัสดุ' : 'Issue Materials'}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD
// ============================================
const Dashboard = ({ stores, inventory, categories, purchaseOrders, workOrders, salesOrders, invoices, deliveries, lang }) => {
  // Calculate stats
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.cost || 0), 0)
  const totalLots = inventory.length
  const lowStockCount = inventory.filter(i => i.status === 'low').length
  
  const pendingPOs = (purchaseOrders || []).filter(po => po.status === 'pending').length
  const activeWOs = (workOrders || []).filter(wo => wo.status === 'in_progress').length
  const unpaidInvoices = (invoices || []).filter(inv => inv.balance > 0).length
  const todayDeliveries = (deliveries || []).filter(d => d.date === new Date().toISOString().split('T')[0]).length

  // Category distribution
  const categoryStats = categories.filter(c => c.type === 'raw_material').map(cat => {
    const catItems = inventory.filter(i => i.category === cat.id)
    const value = catItems.reduce((sum, i) => sum + (i.cost || 0), 0)
    return { ...cat, items: catItems.length, value }
  }).sort((a, b) => b.value - a.value)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.dashboard', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมธุรกิจ' : 'Business Overview'}</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4 col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่าคลัง' : 'Inventory Value'}</div>
              <div className="text-2xl font-bold text-[#2ECC40]">{formatCurrency(totalInventoryValue)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ล็อตสินค้า' : 'Total Lots'}</div>
          <div className="text-2xl font-bold text-gray-800">{totalLots}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'สินค้าใกล้หมด' : 'Low Stock'}</div>
          <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอรับสินค้า' : 'Pending POs'}</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingPOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'กำลังผลิต' : 'Active WOs'}</div>
          <div className="text-2xl font-bold text-blue-600">{activeWOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอชำระ' : 'Unpaid Inv'}</div>
          <div className="text-2xl font-bold text-orange-600">{unpaidInvoices}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-cyan-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ส่งวันนี้' : 'Today Del'}</div>
          <div className="text-2xl font-bold text-cyan-600">{todayDeliveries}</div>
        </Card>
      </div>

      {/* Store Cards */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">{lang === 'th' ? 'คลังสินค้า (6 คลัง)' : 'Stores (6 Warehouses)'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stores.map(store => {
            const storeItems = inventory.filter(i => i.store === store.id)
            const storeValue = storeItems.reduce((sum, i) => sum + (i.cost || 0), 0)
            return (
              <Card key={store.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#1A5276] font-medium">{store.code}</span>
                  <Badge variant={store.type === 'raw_material' ? 'success' : store.type === 'finished_goods' ? 'info' : 'default'}>
                    {storeItems.length}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 truncate">{lang === 'th' ? store.nameTh : store.nameEn}</div>
                <div className="font-bold text-[#2ECC40] mt-2">{formatCurrency(storeValue)}</div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'มูลค่าตามหมวดหมู่' : 'Value by Category'}</h3>
          <div className="space-y-3">
            {categoryStats.slice(0, 8).map(cat => {
              const maxValue = Math.max(...categoryStats.map(c => c.value))
              const percent = maxValue > 0 ? (cat.value / maxValue * 100) : 0
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-mono" style={{ color: cat.color }}>{cat.code}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-medium">{formatCurrency(cat.value)}</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-medium text-gray-800">{lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'New PO'}</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                <Factory className="w-5 h-5 text-orange-600" />
              </div>
              <div className="font-medium text-gray-800">{lang === 'th' ? 'สร้างใบสั่งผลิต' : 'New WO'}</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                <Receipt className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-medium text-gray-800">{lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'New Invoice'}</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-2">
                <Truck className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="font-medium text-gray-800">{lang === 'th' ? 'กำหนดการส่ง' : 'Schedule Delivery'}</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ============================================
// SALES MODULE (Simplified)
// ============================================
const SalesModule = ({ salesOrders, setSalesOrders, invoices, setInvoices, customers, workOrders, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: lang === 'th' ? 'ใบสั่งขาย' : 'Sales Orders', icon: ClipboardList },
    { id: 'invoices', label: lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoices', icon: Receipt },
    { id: 'payments', label: lang === 'th' ? 'การชำระ' : 'Payments', icon: CreditCard },
  ]

  const stats = {
    totalOrders: salesOrders.length,
    pendingOrders: salesOrders.filter(so => so.status === 'confirmed').length,
    totalInvoices: invoices.length,
    unpaidInvoices: invoices.filter(inv => inv.balance > 0).length,
    totalRevenue: invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0),
    totalReceived: invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.sales', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการการขายและใบแจ้งหนี้' : 'Manage sales and invoices'}</p>
        </div>
        <Button icon={Plus}>
          {lang === 'th' ? 'สร้างใบสั่งขาย' : 'New Sales Order'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งขาย' : 'Orders'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอผลิต' : 'Pending'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoices'}</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ยังไม่ชำระ' : 'Unpaid'}</div>
          <div className="text-2xl font-bold text-red-600">{stats.unpaidInvoices}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Revenue'}</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalReceived)}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#1A5276] text-[#1A5276]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sales Orders */}
      {activeTab === 'orders' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'SO #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'PO ลูกค้า' : 'Customer PO'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salesOrders.map(so => {
                  const customer = customers.find(c => c.id === so.customerId)
                  return (
                    <tr key={so.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{so.id}</td>
                      <td className="px-4 py-3">{customer?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{so.customerPO}</td>
                      <td className="px-4 py-3">{formatDate(so.orderDate)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(so.grandTotal)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          so.status === 'delivered' ? 'success' :
                          so.status === 'in_production' ? 'info' :
                          'warning'
                        }>
                          {so.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Invoice #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ชำระแล้ว' : 'Paid'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Balance'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map(inv => {
                  const customer = customers.find(c => c.id === inv.customerId)
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{inv.id}</td>
                      <td className="px-4 py-3">{customer?.name}</td>
                      <td className="px-4 py-3">{formatDate(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(inv.grandTotal)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(inv.paidAmount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(inv.balance)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          inv.status === 'paid' ? 'success' :
                          inv.status === 'partial' ? 'warning' :
                          'info'
                        }>
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Dashboard / Payments placeholder */}
      {(activeTab === 'dashboard' || activeTab === 'payments') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'ใบแจ้งหนี้ล่าสุด' : 'Recent Invoices'}</h3>
            <div className="space-y-3">
              {invoices.slice(0, 5).map(inv => {
                const customer = customers.find(c => c.id === inv.customerId)
                return (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-mono text-[#1A5276] font-medium">{inv.id}</div>
                      <div className="text-sm text-gray-500">{customer?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(inv.grandTotal)}</div>
                      <Badge variant={inv.balance > 0 ? 'warning' : 'success'}>
                        {inv.balance > 0 ? (lang === 'th' ? 'ค้างชำระ' : 'Outstanding') : (lang === 'th' ? 'ชำระแล้ว' : 'Paid')}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'สรุปรายได้' : 'Revenue Summary'}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">{lang === 'th' ? 'รายได้รวม' : 'Total Revenue'}</div>
                <div className="text-3xl font-bold text-green-700">{formatCurrency(stats.totalRevenue)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">{lang === 'th' ? 'ได้รับแล้ว' : 'Received'}</div>
                  <div className="text-xl font-bold text-blue-700">{formatCurrency(stats.totalReceived)}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600">{lang === 'th' ? 'ค้างชำระ' : 'Outstanding'}</div>
                  <div className="text-xl font-bold text-red-700">{formatCurrency(stats.totalRevenue - stats.totalReceived)}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ============================================
// STORE BUILDER (Admin)
// ============================================
const StoreBuilder = ({ stores, setStores, categories, lang }) => {
  const [showForm, setShowForm] = useState(false)
  const [editStore, setEditStore] = useState(null)

  const handleSave = (storeData) => {
    if (editStore) {
      setStores(stores.map(s => s.id === editStore.id ? { ...s, ...storeData } : s))
    } else {
      const newStore = {
        id: `STORE${stores.length + 1}`,
        code: `STORE${stores.length + 1}`,
        ...storeData,
        isActive: true,
        itemCount: 0,
        value: 0,
      }
      setStores([...stores, newStore])
    }
    setShowForm(false)
    setEditStore(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.stores', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการคลังสินค้า 6 คลัง' : 'Manage 6 warehouse locations'}</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditStore(null); setShowForm(true) }}>
          {lang === 'th' ? 'เพิ่มคลัง' : 'Add Store'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map(store => (
          <Card key={store.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-bold text-xl text-[#1A5276]">{store.code}</div>
                <div className="text-gray-600">{lang === 'th' ? store.nameTh : store.nameEn}</div>
              </div>
              <Badge variant={store.isActive ? 'success' : 'danger'}>
                {store.isActive ? (lang === 'th' ? 'ใช้งาน' : 'Active') : (lang === 'th' ? 'ปิด' : 'Inactive')}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'ประเภท' : 'Type'}</span>
                <span className="font-medium">{store.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'สาขา' : 'Branch'}</span>
                <span className="font-medium">{store.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'หมวดหมู่' : 'Categories'}</span>
                <span className="font-medium">{store.categories?.length || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                icon={Edit3}
                onClick={() => { setEditStore(store); setShowForm(true) }}
              >
                {t('action.edit', lang)}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editStore ? 'Edit Store' : 'New Store'} size="md">
          <StoreForm 
            store={editStore} 
            categories={categories}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            lang={lang}
          />
        </Modal>
      )}
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
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (TH)</label>
          <input
            type="text"
            required
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {STORE_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="IND">IND</option>
            <option value="IND-2">IND-2</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
      </div>
    </form>
  )
}

// ============================================
// CATEGORY MANAGER (Admin)
// ============================================
const CategoryManager = ({ categories, setCategories, lang }) => {
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState(null)

  const handleSave = (catData) => {
    if (editCat) {
      setCategories(categories.map(c => c.id === editCat.id ? { ...c, ...catData } : c))
    } else {
      const newCat = {
        id: catData.code,
        ...catData,
        isActive: true,
      }
      setCategories([...categories, newCat])
    }
    setShowForm(false)
    setEditCat(null)
  }

  const rmCategories = categories.filter(c => c.type === 'raw_material')
  const otherCategories = categories.filter(c => c.type !== 'raw_material')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.categories', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการหมวดหมู่วัสดุ 12 หมวดหมู่' : 'Manage 12 material categories'}</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditCat(null); setShowForm(true) }}>
          {lang === 'th' ? 'เพิ่มหมวดหมู่' : 'Add Category'}
        </Button>
      </div>

      {/* Raw Materials (8 Wood Types) */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">
          {lang === 'th' ? 'วัตถุดิบไม้ (8 ประเภท)' : 'Raw Materials - Wood Types (8)'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rmCategories.map(cat => (
            <Card key={cat.id} className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: cat.color }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-lg" style={{ color: cat.color }}>{cat.code}</div>
                  <div className="text-sm text-gray-600">{lang === 'th' ? cat.nameTh : cat.nameEn}</div>
                </div>
                <Badge variant={cat.isActive ? 'success' : 'default'}>{cat.isActive ? '✓' : '✗'}</Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {lang === 'th' ? 'วิธีคิดต้นทุน:' : 'Cost Method:'} <strong>{cat.costMethod}</strong>
              </div>
              <button 
                onClick={() => { setEditCat(cat); setShowForm(true) }}
                className="mt-2 text-sm text-[#1A5276] hover:underline"
              >
                {t('action.edit', lang)}
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Categories */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">
          {lang === 'th' ? 'หมวดหมู่อื่นๆ (4 ประเภท)' : 'Other Categories (4)'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherCategories.map(cat => (
            <Card key={cat.id} className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: cat.color }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-lg" style={{ color: cat.color }}>{cat.code}</div>
                  <div className="text-sm text-gray-600">{lang === 'th' ? cat.nameTh : cat.nameEn}</div>
                </div>
                <Badge variant={cat.isActive ? 'success' : 'default'}>{cat.isActive ? '✓' : '✗'}</Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {lang === 'th' ? 'วิธีคิดต้นทุน:' : 'Cost Method:'} <strong>{cat.costMethod}</strong>
              </div>
              <button 
                onClick={() => { setEditCat(cat); setShowForm(true) }}
                className="mt-2 text-sm text-[#1A5276] hover:underline"
              >
                {t('action.edit', lang)}
              </button>
            </Card>
          ))}
        </div>
      </div>

      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editCat ? 'Edit Category' : 'New Category'} size="md">
          <CategoryForm 
            category={editCat}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            lang={lang}
          />
        </Modal>
      )}
    </div>
  )
}

const CategoryForm = ({ category, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    code: category?.code || '',
    nameEn: category?.nameEn || '',
    nameTh: category?.nameTh || '',
    color: category?.color || '#6B7280',
    costMethod: category?.costMethod || 'FIFO',
    type: category?.type || 'raw_material',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          className="w-full px-3 py-2 border rounded-lg font-mono"
          disabled={!!category}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (TH)</label>
          <input
            type="text"
            required
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full h-10 border rounded-lg cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Method</label>
          <select
            value={formData.costMethod}
            onChange={(e) => setFormData({ ...formData, costMethod: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="FIFO">FIFO</option>
            <option value="AVG">Average</option>
            <option value="STD">Standard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="raw_material">Raw Material</option>
            <option value="consumables">Consumables</option>
            <option value="finished_goods">Finished Goods</option>
            <option value="office">Office</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
      </div>
    </form>
  )
}

// ============================================
// DEPARTMENT MANAGER (Admin)
// ============================================
const DepartmentManager = ({ departments, setDepartments, lang }) => {
  const [showForm, setShowForm] = useState(false)
  const [editDept, setEditDept] = useState(null)

  const handleSave = (deptData) => {
    if (editDept) {
      setDepartments(departments.map(d => d.id === editDept.id ? { ...d, ...deptData } : d))
    } else {
      const newDept = {
        id: deptData.code,
        ...deptData,
        isActive: true,
      }
      setDepartments([...departments, newDept])
    }
    setShowForm(false)
    setEditDept(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แผนกการผลิต' : 'Production Departments'}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการแผนกการผลิต 10 แผนก' : 'Manage 10 production departments'}</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditDept(null); setShowForm(true) }}>
          {lang === 'th' ? 'เพิ่มแผนก' : 'Add Department'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => {
          const typeInfo = DEPARTMENT_TYPES.find(t => t.id === dept.type)
          return (
            <Card key={dept.id} className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: typeInfo?.color || '#6B7280' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-lg">{dept.code}</div>
                  <div className="text-sm text-gray-600">{lang === 'th' ? dept.nameTh : dept.nameEn}</div>
                </div>
                <Badge variant={dept.isActive ? 'success' : 'default'}>{dept.isActive ? '✓' : '✗'}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                <div>{lang === 'th' ? 'ประเภท:' : 'Type:'} <strong>{typeInfo?.nameEn}</strong></div>
                <div>{lang === 'th' ? 'ค่าแรง/ชม:' : 'Rate:'} <strong>฿{dept.hourlyRate}</strong></div>
                <div>{lang === 'th' ? 'ลำดับ:' : 'Seq:'} <strong>{dept.sequence}</strong></div>
              </div>
              <button 
                onClick={() => { setEditDept(dept); setShowForm(true) }}
                className="mt-3 text-sm text-[#1A5276] hover:underline"
              >
                {t('action.edit', lang)}
              </button>
            </Card>
          )
        })}
      </div>

      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editDept ? 'Edit Department' : 'New Department'} size="md">
          <DepartmentForm 
            department={editDept}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            lang={lang}
          />
        </Modal>
      )}
    </div>
  )
}

const DepartmentForm = ({ department, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    code: department?.code || '',
    nameEn: department?.nameEn || '',
    nameTh: department?.nameTh || '',
    type: department?.type || 'cutting',
    hourlyRate: department?.hourlyRate || 180,
    sequence: department?.sequence || 1,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          className="w-full px-3 py-2 border rounded-lg font-mono"
          disabled={!!department}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (TH)</label>
          <input
            type="text"
            required
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {DEPARTMENT_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (฿)</label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
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
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>{t('action.save', lang)}</Button>
      </div>
    </form>
  )
}

// ============================================
// ADMIN HUB
// ============================================
const AdminHub = ({ stores, setStores, categories, setCategories, departments, setDepartments, vendors, customers, lang }) => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: lang === 'th' ? 'ภาพรวม' : 'Overview', icon: Settings },
    { id: 'stores', label: lang === 'th' ? 'คลังสินค้า' : 'Stores', icon: Warehouse, count: stores.length },
    { id: 'categories', label: lang === 'th' ? 'หมวดหมู่' : 'Categories', icon: Tag, count: categories.length },
    { id: 'departments', label: lang === 'th' ? 'แผนก' : 'Departments', icon: Factory, count: departments.length },
    { id: 'vendors', label: lang === 'th' ? 'ผู้ขาย' : 'Vendors', icon: Users, count: vendors.length },
    { id: 'customers', label: lang === 'th' ? 'ลูกค้า' : 'Customers', icon: Building2, count: customers.length },
    { id: 'users', label: lang === 'th' ? 'ผู้ใช้งาน' : 'Users', icon: Shield, count: DEMO_USERS.length },
  ]

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <h2 className="font-bold text-gray-800 mb-4">{t('nav.admin', lang)}</h2>
        <nav className="space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                activeSection === section.id 
                  ? 'bg-[#1A5276] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                {section.label}
              </div>
              {section.count !== undefined && (
                <Badge variant={activeSection === section.id ? 'default' : 'info'}>{section.count}</Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeSection === 'overview' && (
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'ศูนย์จัดการระบบ' : 'Admin Control Center'}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sections.filter(s => s.count !== undefined).map(section => (
                <Card 
                  key={section.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A5276]/10 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-[#1A5276]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{section.count}</div>
                      <div className="text-sm text-gray-500">{section.label}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* System Info */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'ข้อมูลระบบ' : 'System Information'}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{lang === 'th' ? 'เวอร์ชัน' : 'Version'}</span>
                  <span className="font-mono font-bold text-[#1A5276]">{VERSION}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{lang === 'th' ? 'วันที่' : 'Build Date'}</span>
                  <span className="font-mono">{VERSION_DATE}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{lang === 'th' ? 'นิติบุคคล' : 'Entities'}</span>
                  <span className="font-mono">IND, IND2</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">{lang === 'th' ? 'ภาษา' : 'Languages'}</span>
                  <span className="font-mono">6</span>
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeSection === 'stores' && (
          <StoreBuilder stores={stores} setStores={setStores} categories={categories} lang={lang} />
        )}
        {activeSection === 'categories' && (
          <CategoryManager categories={categories} setCategories={setCategories} lang={lang} />
        )}
        {activeSection === 'departments' && (
          <DepartmentManager departments={departments} setDepartments={setDepartments} lang={lang} />
        )}
        {activeSection === 'vendors' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.vendors', lang)}</h1>
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'Code'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ติดต่อ' : 'Contact'}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'เครดิต' : 'Terms'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{v.code}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{v.name}</div>
                        <div className="text-sm text-gray-500">{v.nameTh}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={v.type === 'import' ? 'info' : 'success'}>{v.type}</Badge>
                      </td>
                      <td className="px-4 py-3">{v.category}</td>
                      <td className="px-4 py-3">
                        <div>{v.contact}</div>
                        <div className="text-sm text-gray-500">{v.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{v.paymentTerms} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {activeSection === 'customers' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.customers', lang)}</h1>
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'Code'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ติดต่อ' : 'Contact'}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ที่อยู่ส่ง' : 'Delivery'}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'เครดิต' : 'Terms'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{c.code}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-gray-500">{c.nameTh}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{c.contact}</div>
                        <div className="text-sm text-gray-500">{c.phone}</div>
                      </td>
                      <td className="px-4 py-3">{c.deliveryAddress}</td>
                      <td className="px-4 py-3 text-center">{c.paymentTerms} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {activeSection === 'users' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.users', lang)}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEMO_USERS.map(user => {
                const role = ROLES[user.role]
                return (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center text-white font-bold`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{user.name}</div>
                        <div className="text-sm text-gray-500 truncate">{user.nameTh}</div>
                        <Badge variant="info" className="mt-1">{role.name}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>{lang === 'th' ? 'ผู้ใช้' : 'Username'}</span>
                        <span className="font-mono">{user.username}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>{lang === 'th' ? 'แผนก' : 'Dept'}</span>
                        <span>{user.department}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  // Authentication
  const [currentUser, setCurrentUser] = useState(null)
  const [lang, setLang] = useState('en')

  // Master Data State
  const [stores, setStores] = useState(INITIAL_STORES)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS)
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS)
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT)

  // Transaction State
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS)
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS)
  const [salesOrders, setSalesOrders] = useState(INITIAL_SALES_ORDERS)
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [deliveryOrders, setDeliveryOrders] = useState(INITIAL_DELIVERY_ORDERS)
  const [scheduledDeliveries, setScheduledDeliveries] = useState(INITIAL_SCHEDULED_DELIVERIES)
  const [maintenanceTasks, setMaintenanceTasks] = useState(INITIAL_MAINTENANCE_TASKS)

  // UI State
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Auth handlers
  const handleLogin = (user) => {
    setCurrentUser(user)
    setActiveModule('dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveModule('dashboard')
  }

  // Check role permissions
  const hasAccess = (module) => {
    if (!currentUser) return false
    const role = ROLES[currentUser.role]
    return role?.modules.includes(module) || role?.permissions.includes('all')
  }

  // Navigation items based on role
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', lang), icon: Home, color: 'text-blue-500' },
    { id: 'admin', label: t('nav.admin', lang), icon: Settings, color: 'text-purple-500' },
    { id: 'inventory', label: t('nav.inventory', lang), icon: Package, color: 'text-green-500' },
    { id: 'purchase', label: t('nav.purchase', lang), icon: ShoppingCart, color: 'text-yellow-500' },
    { id: 'production', label: t('nav.production', lang), icon: Factory, color: 'text-orange-500' },
    { id: 'sales', label: t('nav.sales', lang), icon: Receipt, color: 'text-pink-500' },
    { id: 'hr', label: t('nav.hr', lang), icon: Users, color: 'text-indigo-500' },
    { id: 'transport', label: t('nav.transport', lang), icon: Truck, color: 'text-cyan-500' },
    { id: 'maintenance', label: t('nav.maintenance', lang), icon: Wrench, color: 'text-amber-500' },
  ].filter(item => hasAccess(item.id))

  // Show login if not authenticated
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} lang={lang} setLang={setLang} />
  }

  const role = ROLES[currentUser.role]

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <AuthContext.Provider value={{ user: currentUser, logout: handleLogout }}>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col transition-all duration-300`}>
            {/* Logo */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <img src={IND_LOGO_SVG} alt="IND" className="w-10 h-10" />
                {sidebarOpen && (
                  <div>
                    <div className="font-bold text-[#1A5276]">IND Thai</div>
                    <div className="text-xs text-gray-500">ERP v{VERSION}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeModule === item.id
                      ? 'bg-gradient-to-r from-[#1A5276] to-[#2ECC40] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-white' : item.color}`} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center text-white font-bold`}>
                  {currentUser.name.charAt(0)}
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 truncate">{role.name}</div>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  {t('action.logout', lang)}
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                  <h1 className="font-bold text-gray-800">
                    {navItems.find(n => n.id === activeModule)?.label || 'Dashboard'}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <Badge variant={currentUser.entity}>{currentUser.entity}</Badge>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              {activeModule === 'dashboard' && (
                <Dashboard 
                  stores={stores}
                  inventory={inventory}
                  categories={categories}
                  purchaseOrders={purchaseOrders}
                  workOrders={workOrders}
                  salesOrders={salesOrders}
                  invoices={invoices}
                  deliveries={scheduledDeliveries}
                  lang={lang}
                />
              )}
              {activeModule === 'admin' && (
                <AdminHub 
                  stores={stores}
                  setStores={setStores}
                  categories={categories}
                  setCategories={setCategories}
                  departments={departments}
                  setDepartments={setDepartments}
                  vendors={vendors}
                  customers={customers}
                  lang={lang}
                />
              )}
              {activeModule === 'inventory' && (
                <InventoryModule
                  inventory={inventory}
                  setInventory={setInventory}
                  stores={stores}
                  categories={categories}
                  lang={lang}
                />
              )}
              {activeModule === 'purchase' && (
                <PurchaseModule
                  purchaseOrders={purchaseOrders}
                  setPurchaseOrders={setPurchaseOrders}
                  vendors={vendors}
                  categories={categories}
                  stores={stores}
                  inventory={inventory}
                  setInventory={setInventory}
                  lang={lang}
                />
              )}
              {activeModule === 'production' && (
                <ProductionModule
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
              )}
              {activeModule === 'sales' && (
                <SalesModule
                  salesOrders={salesOrders}
                  setSalesOrders={setSalesOrders}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  customers={customers}
                  workOrders={workOrders}
                  lang={lang}
                />
              )}
              {activeModule === 'hr' && (
                <HRModule
                  employees={employees}
                  setEmployees={setEmployees}
                  lang={lang}
                />
              )}
              {activeModule === 'transport' && (
                <TransportModule
                  deliveries={scheduledDeliveries}
                  setDeliveries={setScheduledDeliveries}
                  trucks={trucks}
                  employees={employees}
                  salesOrders={salesOrders}
                  lang={lang}
                />
              )}
              {activeModule === 'maintenance' && (
                <MaintenanceModule
                  tasks={maintenanceTasks}
                  setTasks={setMaintenanceTasks}
                  equipment={equipment}
                  employees={employees}
                  lang={lang}
                />
              )}
            </div>
          </main>
        </div>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  )
}
