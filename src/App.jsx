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
  Fuel, MapPinned, Navigation, FileImage, FileScan, Brain,
  Cog, AlertOctagon, ClipboardCheck, Timer, BadgeCheck
} from 'lucide-react'

// ============================================
// VERSION INFO
// ============================================
const VERSION = '7.6'
const VERSION_DATE = '2026-02-01'

// v7.6 NEW FEATURES (Inspired by Odoo, ClickUp, ERPNext, SAP):
// 1. GLOBAL SEARCH (⌘K / Ctrl+K) - Search all: customers, WOs, invoices, inventory, POs, employees
// 2. NOTIFICATION CENTER - Overdue WOs, Low stock alerts, Pending PO approvals, QC labels pending
// 3. QUICK ACTIONS (Q key) - New WO, SO, PO, Invoice, Maintenance Request shortcuts
// 4. KANBAN BOARD - Drag-drop WOs between departments (C1→C2→P1→P2→P3→ASM1→ASM2→OVN→QC→FG)
// 5. PRODUCTION VIEW TOGGLE - Switch between Tabs and Kanban board views
// 6. KEYBOARD SHORTCUTS - ⌘K (search), Q (quick actions), ESC (close all)
// 7. ENHANCED MAINTENANCE - 7 tabs: Dashboard, Requests, MWO, Equipment, Building, Store, PM Schedule

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
  // STORE1 - MLH (LP prefix)
  { id: 1, lotNo: 'LP14899', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 700, cbm: 0.859, cost: 4218, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber Co., Ltd' },
  { id: 2, lotNo: 'LP14900', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 650, cbm: 0.797, cost: 3914, costPerCbm: 4912, status: 'available', dateIn: '2024-07-03', vendor: 'Thai Timber Co., Ltd' },
  { id: 3, lotNo: 'LP14901', category: 'MLH', code: 'IND-MLH/0.5/3/1', store: 'STORE1', qty: 45, cbm: 0.055, cost: 271, costPerCbm: 4912, status: 'low', dateIn: '2024-07-03', vendor: 'Thai Timber Co., Ltd' },
  { id: 4, lotNo: 'LP14902', category: 'MLH', code: 'IND-MLH/0.5/3.4/1.3', store: 'STORE1', qty: 241, cbm: 0.344, cost: 1689, costPerCbm: 4912, status: 'available', dateIn: '2024-05-25', vendor: 'Green Wood Enterprise' },
  { id: 5, lotNo: 'LP14903', category: 'MLH', code: 'IND-MLH/0.5/3.8/1.3', store: 'STORE1', qty: 254, cbm: 0.405, cost: 1990, costPerCbm: 4912, status: 'available', dateIn: '2024-04-30', vendor: 'Green Wood Enterprise' },
  // STORE1 - PW (Vendor initials prefix: TH=Thongsiri, ARC=ARC Wood, SE=SE Trading)
  { id: 6, lotNo: 'TH14904', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 128, cbm: 2.87, cost: 8500, costPerCbm: 2962, status: 'low', dateIn: '2024-06-15', vendor: 'Thongsiri' },
  { id: 7, lotNo: 'TH14905', category: 'PW', code: 'IND-PW/39/145/3960', store: 'STORE1', qty: 350, cbm: 7.84, cost: 23200, costPerCbm: 2962, status: 'available', dateIn: '2024-06-20', vendor: 'Thongsiri' },
  { id: 8, lotNo: 'ARC14906', category: 'PW', code: 'IND-PW/40/100/4000', store: 'STORE1', qty: 200, cbm: 3.2, cost: 12800, costPerCbm: 4000, status: 'available', dateIn: '2024-07-10', vendor: 'ARC Wood Supply' },
  { id: 9, lotNo: 'SE14907', category: 'PW', code: 'IND-PW/38/95/3800', store: 'STORE1', qty: 180, cbm: 2.6, cost: 10400, costPerCbm: 4000, status: 'available', dateIn: '2024-07-12', vendor: 'SE Trading' },
  // STORE1 - More PW
  { id: 10, lotNo: 'TH14908', category: 'PW', code: 'IND-PW/38/140/3900', store: 'STORE1', qty: 450, cbm: 9.35, cost: 18700, costPerCbm: 2000, status: 'available', dateIn: '2024-07-08', vendor: 'Thongsiri' },
  { id: 11, lotNo: 'ARC14909', category: 'PW', code: 'IND-PW/40/150/4000', store: 'STORE1', qty: 320, cbm: 7.68, cost: 15360, costPerCbm: 2000, status: 'available', dateIn: '2024-07-15', vendor: 'ARC Wood Supply' },
  // STORE2 - PLYWW (category prefix)
  { id: 12, lotNo: 'PLYWW14910', category: 'PLYWW', code: 'IND2-PLYWW/12/1220/2440', store: 'STORE2', qty: 150, cbm: 5.34, cost: 45000, costPerCbm: 8427, status: 'available', dateIn: '2024-07-01', vendor: 'Malaysia Wood Import' },
  { id: 13, lotNo: 'PLYWW14911', category: 'PLYWW', code: 'IND2-PLYWW/18/1220/2440', store: 'STORE2', qty: 80, cbm: 4.27, cost: 42000, costPerCbm: 9836, status: 'available', dateIn: '2024-07-05', vendor: 'Malaysia Wood Import' },
  // STORE2 - PLYRR (category prefix)
  { id: 14, lotNo: 'PLYRR14912', category: 'PLYRR', code: 'IND2-PLYRR/15/1220/2440', store: 'STORE2', qty: 100, cbm: 4.46, cost: 52000, costPerCbm: 11659, status: 'available', dateIn: '2024-07-02', vendor: 'Malaysia Wood Import' },
  { id: 15, lotNo: 'PLYRR14913', category: 'PLYRR', code: 'IND2-PLYRR/12/1220/2440', store: 'STORE2', qty: 65, cbm: 2.31, cost: 27500, costPerCbm: 11905, status: 'low', dateIn: '2024-07-08', vendor: 'Malaysia Wood Import' },
  // STORE2 - PLYRW (category prefix)
  { id: 16, lotNo: 'PLYRW14914', category: 'PLYRW', code: 'IND2-PLYRW/12/1220/2440', store: 'STORE2', qty: 120, cbm: 4.27, cost: 38000, costPerCbm: 8900, status: 'available', dateIn: '2024-07-03', vendor: 'Malaysia Wood Import' },
  { id: 17, lotNo: 'PLYRW14915', category: 'PLYRW', code: 'IND2-PLYRW/15/1220/2440', store: 'STORE2', qty: 90, cbm: 4.01, cost: 36000, costPerCbm: 8978, status: 'available', dateIn: '2024-07-10', vendor: 'Malaysia Wood Import' },
  // STORE1 - PRTB (category prefix)
  { id: 18, lotNo: 'PRTB14916', category: 'PRTB', code: 'IND-PRTB/9/70/2440', store: 'STORE1', qty: 500, cbm: 0.77, cost: 3500, costPerCbm: 4545, status: 'available', dateIn: '2024-07-10', vendor: 'Thai Timber Co., Ltd' },
  { id: 19, lotNo: 'PRTB14917', category: 'PRTB', code: 'IND-PRTB/12/100/2440', store: 'STORE1', qty: 300, cbm: 0.88, cost: 4200, costPerCbm: 4773, status: 'available', dateIn: '2024-07-12', vendor: 'Thai Timber Co., Ltd' },
  // More recent receipts
  { id: 20, lotNo: 'LP14918', category: 'MLH', code: 'IND-MLH/0.5/4/1.5', store: 'STORE1', qty: 500, cbm: 1.23, cost: 6042, costPerCbm: 4912, status: 'available', dateIn: '2024-07-20', vendor: 'Thai Timber Co., Ltd' },
]

// ============================================
// VENDORS
// ============================================
const INITIAL_VENDORS = [
  { id: 'V001', code: 'V001', name: 'Thai Timber Co., Ltd', nameTh: 'บริษัท ไทยทิมเบอร์ จำกัด', initials: 'TT', type: 'local', category: 'MLH', paymentTerms: 30, contact: 'Somchai', phone: '081-234-5678', isActive: true },
  { id: 'V002', code: 'V002', name: 'Thongsiri', nameTh: 'ทองศิริ', initials: 'TH', type: 'local', category: 'PW', paymentTerms: 30, contact: 'Wilai', phone: '089-876-5432', isActive: true },
  { id: 'V003', code: 'V003', name: 'ARC Wood Supply', nameTh: 'บริษัท อาร์ค วู้ด ซัพพลาย', initials: 'ARC', type: 'local', category: 'PW', paymentTerms: 30, contact: 'Prasert', phone: '086-333-4444', isActive: true },
  { id: 'V004', code: 'V004', name: 'SE Trading', nameTh: 'บริษัท เอสอี เทรดดิ้ง', initials: 'SE', type: 'local', category: 'PW', paymentTerms: 45, contact: 'Sakchai', phone: '087-555-6666', isActive: true },
  { id: 'V005', code: 'V005', name: 'Green Wood Enterprise', nameTh: 'บริษัท กรีนวูด เอ็นเตอร์ไพรส์', initials: 'GW', type: 'local', category: 'MLH', paymentTerms: 45, contact: 'Prasit', phone: '086-111-2222', isActive: true },
  { id: 'V006', code: 'V006', name: 'Malaysia Wood Import', nameTh: 'นำเข้าไม้มาเลเซีย', initials: 'MY', type: 'import', category: 'MLH', paymentTerms: 60, contact: 'Mr. Lee', phone: '+60-12-345-6789', isActive: true },
  { id: 'V007', code: 'V007', name: 'Vietnam Pine Export', nameTh: 'ส่งออกไม้สนเวียดนาม', initials: 'VN', type: 'import', category: 'PW', paymentTerms: 60, contact: 'Mr. Nguyen', phone: '+84-90-123-4567', isActive: true },
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
// APPROVAL HIERARCHY (Spec 7)
// PM ≤฿10k | GM ฿10k-50k | CEO >฿50k
// ============================================
const APPROVAL_THRESHOLDS = {
  pm: { min: 0, max: 10000, role: 'production_manager', title: 'Production Manager', titleTh: 'ผู้จัดการฝ่ายผลิต' },
  gm: { min: 10001, max: 50000, role: 'general_manager', title: 'General Manager', titleTh: 'ผู้จัดการทั่วไป' },
  ceo: { min: 50001, max: Infinity, role: 'ceo', title: 'CEO', titleTh: 'ผู้บริหารสูงสุด' },
}

const getRequiredApprover = (amount) => {
  if (amount <= APPROVAL_THRESHOLDS.pm.max) return APPROVAL_THRESHOLDS.pm
  if (amount <= APPROVAL_THRESHOLDS.gm.max) return APPROVAL_THRESHOLDS.gm
  return APPROVAL_THRESHOLDS.ceo
}

const canUserApprove = (userRole, requiredLevel) => {
  const roleHierarchy = ['staff', 'supervisor', 'production_manager', 'general_manager', 'ceo', 'admin']
  const userLevel = roleHierarchy.indexOf(userRole)
  const requiredIdx = roleHierarchy.indexOf(requiredLevel)
  return userLevel >= requiredIdx
}

// ============================================
// REJECTION REASONS (for GRN - Spec 3-4)
// ============================================
const REJECTION_REASONS = [
  { id: 'damaged', labelEn: 'Damaged goods', labelTh: 'สินค้าเสียหาย' },
  { id: 'wrong_spec', labelEn: 'Wrong specification', labelTh: 'สเปคไม่ตรง' },
  { id: 'wrong_qty', labelEn: 'Wrong quantity', labelTh: 'จำนวนไม่ตรง' },
  { id: 'quality_issue', labelEn: 'Quality issue', labelTh: 'คุณภาพไม่ผ่าน' },
  { id: 'not_ordered', labelEn: 'Not ordered', labelTh: 'ไม่ได้สั่ง' },
  { id: 'late_delivery', labelEn: 'Too late / Rejected', labelTh: 'ส่งช้าเกินไป' },
  { id: 'other', labelEn: 'Other', labelTh: 'อื่นๆ' },
]

// ============================================
// VARIANCE TYPES (for GRN)
// ============================================
const VARIANCE_TYPES = [
  { id: 'qty_short', labelEn: 'Quantity Short', labelTh: 'จำนวนขาด' },
  { id: 'qty_over', labelEn: 'Quantity Over', labelTh: 'จำนวนเกิน' },
  { id: 'size_different', labelEn: 'Size Different', labelTh: 'ขนาดต่าง' },
  { id: 'mixed_sizes', labelEn: 'Mixed Sizes', labelTh: 'ขนาดผสม' },
  { id: 'damaged_partial', labelEn: 'Some Damaged', labelTh: 'บางส่วนเสียหาย' },
]

// ============================================
// IMPORT TRACKING STATUS (Spec 11 - G Thru)
// ============================================
const IMPORT_STATUS = [
  { id: 'pending', label: 'Pending Shipment', labelTh: 'รอส่ง', color: 'bg-gray-500' },
  { id: 'shipped', label: 'Shipped', labelTh: 'ส่งแล้ว', color: 'bg-blue-500' },
  { id: 'in_transit', label: 'In Transit', labelTh: 'ระหว่างขนส่ง', color: 'bg-yellow-500' },
  { id: 'at_port', label: 'At Port', labelTh: 'ถึงท่าเรือ', color: 'bg-orange-500' },
  { id: 'customs', label: 'Customs Clearance', labelTh: 'ผ่านศุลกากร', color: 'bg-purple-500' },
  { id: 'released', label: 'Released', labelTh: 'ปล่อยแล้ว', color: 'bg-green-500' },
  { id: 'delivered', label: 'Delivered', labelTh: 'ส่งถึงแล้ว', color: 'bg-emerald-500' },
]

// ============================================
// CUSTOMS STATUS
// ============================================
const CUSTOMS_STATUS = [
  { id: 'not_started', label: 'Not Started', labelTh: 'ยังไม่เริ่ม' },
  { id: 'docs_submitted', label: 'Documents Submitted', labelTh: 'ส่งเอกสารแล้ว' },
  { id: 'inspection', label: 'Under Inspection', labelTh: 'กำลังตรวจ' },
  { id: 'duty_paid', label: 'Duty Paid', labelTh: 'จ่ายภาษีแล้ว' },
  { id: 'cleared', label: 'Cleared', labelTh: 'ผ่านแล้ว' },
]

// ============================================
// LC STATUS (Spec 12 - Letter of Credit)
// ============================================
const LC_STATUS = [
  { id: 'not_required', label: 'Not Required', labelTh: 'ไม่ต้องใช้' },
  { id: 'pending', label: 'Pending Opening', labelTh: 'รอเปิด' },
  { id: 'opened', label: 'LC Opened', labelTh: 'เปิดแล้ว' },
  { id: 'amended', label: 'Amended', labelTh: 'แก้ไขแล้ว' },
  { id: 'docs_submitted', label: 'Documents Submitted', labelTh: 'ส่งเอกสารแล้ว' },
  { id: 'negotiated', label: 'Negotiated', labelTh: 'เจรจาแล้ว' },
  { id: 'paid', label: 'Paid', labelTh: 'จ่ายแล้ว' },
  { id: 'closed', label: 'Closed', labelTh: 'ปิดแล้ว' },
]

// ============================================
// CREDIT NOTE REASONS
// ============================================
const CREDIT_NOTE_REASONS = [
  { id: 'qty_short', label: 'Quantity Short', labelTh: 'จำนวนขาด' },
  { id: 'damaged', label: 'Damaged Goods', labelTh: 'สินค้าเสียหาย' },
  { id: 'wrong_spec', label: 'Wrong Specification', labelTh: 'สเปคผิด' },
  { id: 'price_error', label: 'Price Error', labelTh: 'ราคาผิด' },
  { id: 'returned', label: 'Goods Returned', labelTh: 'คืนสินค้า' },
  { id: 'other', label: 'Other', labelTh: 'อื่นๆ' },
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
      { lotNo: 'LP14899', category: 'MLH', code: 'IND-MLH/0.5/3/1', qty: 400, cbm: 0.49, cost: 2407 },
      { lotNo: 'LP14900', category: 'MLH', code: 'IND-MLH/0.5/3/1', qty: 350, cbm: 0.43, cost: 2112 },
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
          { code: 'IND-MLH/0.5/3/1', lotNo: 'LP14899', counted: 695, system: 700, variance: -5 },
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
    { id: 'routes', label: lang === 'th' ? 'เส้นทาง' : 'Routes', icon: Navigation },
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
// ============================================
// MAINTENANCE MODULE - ENHANCED v7.5
// Types: Equipment, Vehicle, Building/Facility
// Features: Add Equipment, Request Form, Store, MWO
// MWO Format: MWO-YYMMDD-XXX
// ============================================
const MaintenanceModule = ({ tasks, setTasks, equipment, setEquipment, maintenanceStore, setMaintenanceStore, employees, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMWOModal, setShowMWOModal] = useState(false)
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // New equipment form state
  const [newEquipment, setNewEquipment] = useState({
    name: '', type: 'machine', category: 'equipment', location: '', 
    brand: '', model: '', serialNo: '', serviceInterval: 90, notes: ''
  })

  // New request form state
  const [newRequest, setNewRequest] = useState({
    department: '', requestedBy: '', category: 'equipment', 
    subject: '', description: '', priority: 'medium'
  })

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'หน้าหลัก' : 'Dashboard', icon: Home },
    { id: 'requests', label: lang === 'th' ? 'คำขอซ่อม' : 'Requests', icon: Bell },
    { id: 'mwo', label: lang === 'th' ? 'ใบงาน' : 'Work Orders', icon: ClipboardList },
    { id: 'equipment', label: lang === 'th' ? 'เครื่องจักร' : 'Equipment', icon: Cog },
    { id: 'building', label: lang === 'th' ? 'อาคาร' : 'Building', icon: Building2 },
    { id: 'store', label: lang === 'th' ? 'คลังอะไหล่' : 'Parts Store', icon: Package },
    { id: 'pm', label: lang === 'th' ? 'PM Schedule' : 'PM Schedule', icon: Calendar },
  ]

  // Maintenance Categories
  const MAINT_CATEGORIES = {
    equipment: { label: lang === 'th' ? 'เครื่องจักร' : 'Equipment', color: 'blue' },
    vehicle: { label: lang === 'th' ? 'ยานพาหนะ' : 'Vehicle', color: 'green' },
    building: { label: lang === 'th' ? 'อาคาร' : 'Building', color: 'purple' },
    electrical: { label: lang === 'th' ? 'ไฟฟ้า' : 'Electrical', color: 'yellow' },
    plumbing: { label: lang === 'th' ? 'ประปา' : 'Plumbing', color: 'cyan' },
  }

  // Equipment Types
  const EQUIPMENT_TYPES = [
    { id: 'machine', label: lang === 'th' ? 'เครื่องจักร' : 'Machine' },
    { id: 'forklift', label: lang === 'th' ? 'รถยก' : 'Forklift' },
    { id: 'oven', label: lang === 'th' ? 'เตาอบ' : 'Oven/Kiln' },
    { id: 'compressor', label: lang === 'th' ? 'ปั๊มลม' : 'Compressor' },
    { id: 'saw', label: lang === 'th' ? 'เลื่อย' : 'Saw' },
    { id: 'tool', label: lang === 'th' ? 'เครื่องมือ' : 'Tool' },
  ]

  // Building Work Types
  const BUILDING_WORK_TYPES = [
    { id: 'painting', label: lang === 'th' ? 'ทาสี' : 'Painting', icon: '🎨' },
    { id: 'repair', label: lang === 'th' ? 'ซ่อมแซม' : 'Repair', icon: '🔧' },
    { id: 'electrical', label: lang === 'th' ? 'งานไฟฟ้า' : 'Electrical', icon: '⚡' },
    { id: 'plumbing', label: lang === 'th' ? 'งานประปา' : 'Plumbing', icon: '🚿' },
    { id: 'carpentry', label: lang === 'th' ? 'งานไม้' : 'Carpentry', icon: '🪚' },
  ]

  // Departments that can request maintenance
  const DEPARTMENTS = [
    { id: 'C1', label: 'C1 - Cutting 1' },
    { id: 'C2', label: 'C2 - Cutting 2' },
    { id: 'P1', label: 'P1 - Processing 1' },
    { id: 'P2', label: 'P2 - Processing 2' },
    { id: 'ASM1', label: 'ASM1 - Assembly 1' },
    { id: 'ASM2', label: 'ASM2 - Assembly 2' },
    { id: 'OVN', label: 'OVN - Oven/HT' },
    { id: 'QC', label: 'QC - Quality Control' },
    { id: 'warehouse', label: lang === 'th' ? 'คลังสินค้า' : 'Warehouse' },
    { id: 'office', label: lang === 'th' ? 'สำนักงาน' : 'Office' },
    { id: 'housing', label: lang === 'th' ? 'หอพัก' : 'Staff Housing' },
  ]

  // Sample equipment data
  const equipmentList = equipment || [
    { id: 'EQ-001', name: 'Forklift 1', type: 'forklift', category: 'equipment', location: 'Warehouse', status: 'operational', brand: 'Toyota', lastService: '2026-01-15', nextService: '2026-04-15' },
    { id: 'EQ-002', name: 'Forklift 2', type: 'forklift', category: 'equipment', location: 'Production', status: 'operational', brand: 'Toyota', lastService: '2026-01-10', nextService: '2026-04-10' },
    { id: 'EQ-003', name: 'Table Saw 1', type: 'saw', category: 'equipment', location: 'C1', status: 'operational', brand: 'Makita', lastService: '2025-12-20', nextService: '2026-03-20' },
    { id: 'EQ-004', name: 'Table Saw 2', type: 'saw', category: 'equipment', location: 'C2', status: 'operational', brand: 'Makita', lastService: '2025-12-20', nextService: '2026-03-20' },
    { id: 'EQ-005', name: 'Heat Treatment Oven', type: 'oven', category: 'equipment', location: 'OVN', status: 'operational', brand: 'Custom', lastService: '2026-01-05', nextService: '2026-07-05' },
    { id: 'EQ-006', name: 'Air Compressor', type: 'compressor', category: 'equipment', location: 'Production', status: 'maintenance', brand: 'Atlas Copco', lastService: '2025-11-15', nextService: '2026-02-15' },
    { id: 'BLD-001', name: 'Production Building', type: 'building', category: 'building', location: 'Main', status: 'operational', lastPaint: '2024-06-01' },
    { id: 'BLD-002', name: 'Office Building', type: 'building', category: 'building', location: 'Front', status: 'operational', lastPaint: '2024-03-01' },
    { id: 'BLD-003', name: 'Staff Housing Block A', type: 'building', category: 'building', location: 'Housing', status: 'operational' },
  ]

  // Sample maintenance requests
  const [requests, setRequests] = useState([
    { id: 'REQ-001', date: '2026-02-01', department: 'C1', requestedBy: 'Singh', category: 'equipment', subject: 'Table Saw blade replacement', description: 'Blade is dull, need replacement', priority: 'high', status: 'pending' },
    { id: 'REQ-002', date: '2026-01-31', department: 'office', requestedBy: 'Noon', category: 'building', subject: 'AC not cooling', description: 'Office AC unit not cooling properly', priority: 'medium', status: 'pending' },
    { id: 'REQ-003', date: '2026-01-30', department: 'housing', requestedBy: 'Worker', category: 'plumbing', subject: 'Toilet leak Room 5', description: 'Water leaking from toilet', priority: 'high', status: 'in_progress' },
  ])

  // Maintenance store items
  const storeItems = maintenanceStore || [
    { id: 'MS-001', name: 'Motor Oil 15W-40', category: 'Lubricants', qty: 24, unit: 'L', minQty: 10, unitCost: 180, location: 'Shelf A1' },
    { id: 'MS-002', name: 'Hydraulic Fluid', category: 'Lubricants', qty: 15, unit: 'L', minQty: 5, unitCost: 250, location: 'Shelf A2' },
    { id: 'MS-003', name: 'V-Belt A68', category: 'Belts', qty: 4, unit: 'pcs', minQty: 2, unitCost: 450, location: 'Shelf B1' },
    { id: 'MS-004', name: 'Bearing 6205', category: 'Bearings', qty: 8, unit: 'pcs', minQty: 4, unitCost: 180, location: 'Shelf B2' },
    { id: 'MS-005', name: 'Diesel', category: 'Fuel', qty: 50, unit: 'L', minQty: 20, unitCost: 32, location: 'Tank' },
    { id: 'MS-006', name: 'Welding Rod 2.6mm', category: 'Consumables', qty: 100, unit: 'pcs', minQty: 50, unitCost: 5, location: 'Shelf C1' },
    { id: 'MS-007', name: 'Paint - White', category: 'Paint', qty: 20, unit: 'L', minQty: 10, unitCost: 350, location: 'Shelf D1' },
    { id: 'MS-008', name: 'Paint - Blue (IND)', category: 'Paint', qty: 10, unit: 'L', minQty: 5, unitCost: 380, location: 'Shelf D1' },
    { id: 'MS-009', name: 'Saw Blade 10"', category: 'Blades', qty: 3, unit: 'pcs', minQty: 2, unitCost: 850, location: 'Shelf B3' },
    { id: 'MS-010', name: 'Electrical Wire 2.5mm', category: 'Electrical', qty: 100, unit: 'm', minQty: 50, unitCost: 15, location: 'Shelf E1' },
  ]

  // MWO list (tasks)
  const tasksList = tasks || []

  // Generate MWO Number
  const generateMWONumber = () => {
    const now = new Date()
    const dateStr = `${now.getFullYear().toString().slice(-2)}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`
    const seq = (tasksList.length + 1).toString().padStart(3, '0')
    return `MWO-${dateStr}-${seq}`
  }

  // Stats
  const stats = {
    totalMWO: tasksList.length,
    open: tasksList.filter(t => t.status === 'open').length,
    inProgress: tasksList.filter(t => t.status === 'in_progress').length,
    completed: tasksList.filter(t => t.status === 'completed').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    equipmentCount: equipmentList.filter(e => e.category === 'equipment').length,
    buildingCount: equipmentList.filter(e => e.category === 'building').length,
    needsService: equipmentList.filter(e => e.nextService && new Date(e.nextService) <= new Date(Date.now() + 30*24*60*60*1000)).length,
    lowStock: storeItems.filter(i => i.qty <= i.minQty).length,
    storeValue: storeItems.reduce((sum, i) => sum + (i.qty * (i.unitCost || 0)), 0),
  }

  // Convert request to MWO
  const convertRequestToMWO = (request) => {
    const newMWO = {
      id: Date.now(),
      mwoNumber: generateMWONumber(),
      requestId: request.id,
      category: request.category,
      equipment: request.subject,
      description: request.description,
      priority: request.priority,
      status: 'open',
      requestedBy: request.requestedBy,
      department: request.department,
      createdAt: new Date().toISOString(),
    }
    if (setTasks) setTasks([...tasksList, newMWO])
    setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'converted', mwoNumber: newMWO.mwoNumber } : r))
  }

  // Submit maintenance request
  const handleSubmitRequest = () => {
    const newReq = {
      id: `REQ-${(requests.length + 1).toString().padStart(3, '0')}`,
      ...newRequest,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    setRequests([newReq, ...requests])
    setNewRequest({ department: '', requestedBy: '', category: 'equipment', subject: '', description: '', priority: 'medium' })
    setShowRequestModal(false)
  }

  // Add equipment
  const handleAddEquipment = () => {
    const newEq = {
      id: newEquipment.category === 'building' 
        ? `BLD-${(equipmentList.filter(e => e.category === 'building').length + 1).toString().padStart(3, '0')}`
        : `EQ-${(equipmentList.filter(e => e.category === 'equipment').length + 1).toString().padStart(3, '0')}`,
      ...newEquipment,
      status: 'operational',
    }
    if (setEquipment) setEquipment([...equipmentList, newEq])
    setNewEquipment({ name: '', type: 'machine', category: 'equipment', location: '', brand: '', model: '', serialNo: '', serviceInterval: 90, notes: '' })
    setShowAddEquipmentModal(false)
  }

  const priorityColors = { low: 'bg-gray-100 text-gray-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', open: 'bg-blue-100 text-blue-700', in_progress: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', converted: 'bg-gray-100 text-gray-700' }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.maintenance', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการซ่อมบำรุง เครื่องจักร อาคาร และอะไหล่' : 'Manage equipment, building & parts maintenance'}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" icon={Bell} onClick={() => setShowRequestModal(true)}>
            {lang === 'th' ? 'แจ้งซ่อม' : 'Request'}
            {stats.pendingRequests > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{stats.pendingRequests}</span>}
          </Button>
          <Button variant="outline" icon={Cog} onClick={() => setShowAddEquipmentModal(true)}>
            {lang === 'th' ? 'เพิ่มเครื่อง' : 'Add Equipment'}
          </Button>
          <Button icon={Plus} onClick={() => setShowMWOModal(true)}>
            {lang === 'th' ? 'สร้างใบงาน' : 'New MWO'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
        <Card className="p-3 border-l-4 border-l-orange-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'คำขอรอ' : 'Pending'}</div>
          <div className="text-xl font-bold text-orange-600">{stats.pendingRequests}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-blue-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'ใบงาน' : 'MWO'}</div>
          <div className="text-xl font-bold text-blue-600">{stats.totalMWO}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-yellow-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'รอทำ' : 'Open'}</div>
          <div className="text-xl font-bold text-yellow-600">{stats.open}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-purple-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'กำลังทำ' : 'In Prog'}</div>
          <div className="text-xl font-bold text-purple-600">{stats.inProgress}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-green-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'เสร็จ' : 'Done'}</div>
          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-cyan-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'เครื่องจักร' : 'Equipment'}</div>
          <div className="text-xl font-bold text-cyan-600">{stats.equipmentCount}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-indigo-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'อาคาร' : 'Building'}</div>
          <div className="text-xl font-bold text-indigo-600">{stats.buildingCount}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-red-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'ถึงบำรุง' : 'Due PM'}</div>
          <div className="text-xl font-bold text-red-600">{stats.needsService}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-pink-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'สต็อกต่ำ' : 'Low Stock'}</div>
          <div className="text-xl font-bold text-pink-600">{stats.lowStock}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-emerald-500">
          <div className="text-xs text-gray-500">{lang === 'th' ? 'มูลค่าสต็อก' : 'Stock Value'}</div>
          <div className="text-lg font-bold text-emerald-600">฿{stats.storeValue.toLocaleString()}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-[#1A5276] text-[#1A5276] bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'requests' && stats.pendingRequests > 0 && <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{stats.pendingRequests}</span>}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-orange-50 flex items-center justify-between">
              <h3 className="font-bold text-orange-800 flex items-center gap-2"><Bell className="w-5 h-5" />{lang === 'th' ? 'คำขอซ่อมรอดำเนินการ' : 'Pending Requests'}</h3>
              <Button size="sm" variant="outline" onClick={() => setActiveTab('requests')}>{lang === 'th' ? 'ดูทั้งหมด' : 'View All'}</Button>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {requests.filter(r => r.status === 'pending').slice(0, 5).map(req => (
                <div key={req.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-orange-600">{req.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[req.priority]}`}>{req.priority}</span>
                      </div>
                      <div className="font-medium mt-1">{req.subject}</div>
                      <div className="text-sm text-gray-500">{req.department} • {req.requestedBy}</div>
                    </div>
                    <Button size="sm" onClick={() => convertRequestToMWO(req)}><ArrowRight className="w-4 h-4 mr-1" />MWO</Button>
                  </div>
                </div>
              ))}
              {requests.filter(r => r.status === 'pending').length === 0 && (
                <div className="p-8 text-center text-gray-400"><CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" /><p>{lang === 'th' ? 'ไม่มีคำขอค้าง' : 'No pending requests'}</p></div>
              )}
            </div>
          </Card>

          {/* Equipment Due Service */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-red-50">
              <h3 className="font-bold text-red-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{lang === 'th' ? 'เครื่องจักรถึงกำหนดบำรุง' : 'Equipment Due for Service'}</h3>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {equipmentList.filter(e => e.nextService && new Date(e.nextService) <= new Date(Date.now() + 30*24*60*60*1000)).map(eq => (
                <div key={eq.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{eq.name}</div>
                      <div className="text-sm text-gray-500">{eq.location} • {eq.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${new Date(eq.nextService) <= new Date() ? 'text-red-600' : 'text-orange-600'}`}>{formatDate(eq.nextService)}</div>
                      <div className="text-xs text-gray-400">{new Date(eq.nextService) <= new Date() ? 'OVERDUE' : 'Due Soon'}</div>
                    </div>
                  </div>
                </div>
              ))}
              {equipmentList.filter(e => e.nextService && new Date(e.nextService) <= new Date(Date.now() + 30*24*60*60*1000)).length === 0 && (
                <div className="p-6 text-center text-gray-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" /><p>{lang === 'th' ? 'ไม่มีเครื่องถึงกำหนด' : 'All equipment OK'}</p></div>
              )}
            </div>
          </Card>

          {/* Low Stock Alert */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-pink-50 flex items-center justify-between">
              <h3 className="font-bold text-pink-800 flex items-center gap-2"><Package className="w-5 h-5" />{lang === 'th' ? 'อะไหล่ใกล้หมด' : 'Low Stock Parts'}</h3>
              <Button size="sm" variant="outline" onClick={() => setActiveTab('store')}>{lang === 'th' ? 'ดูคลัง' : 'View Store'}</Button>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {storeItems.filter(i => i.qty <= i.minQty).map(item => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.category} • {item.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{item.qty} {item.unit}</div>
                      <div className="text-xs text-gray-500">Min: {item.minQty}</div>
                    </div>
                  </div>
                </div>
              ))}
              {storeItems.filter(i => i.qty <= i.minQty).length === 0 && (
                <div className="p-6 text-center text-gray-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" /><p>{lang === 'th' ? 'สต็อกเพียงพอ' : 'Stock levels OK'}</p></div>
              )}
            </div>
          </Card>

          {/* Building Work Types Quick Access */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-purple-50">
              <h3 className="font-bold text-purple-800 flex items-center gap-2"><Building2 className="w-5 h-5" />{lang === 'th' ? 'งานอาคาร' : 'Building Maintenance'}</h3>
            </div>
            <div className="p-4 grid grid-cols-5 gap-3">
              {BUILDING_WORK_TYPES.map(work => (
                <button key={work.id} onClick={() => { setNewRequest({...newRequest, category: 'building', subject: work.label}); setShowRequestModal(true) }}
                  className="p-3 text-center hover:bg-purple-50 rounded-lg transition-colors">
                  <div className="text-2xl mb-1">{work.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{work.label}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-bold text-orange-800">{lang === 'th' ? 'คำขอซ่อมจากแผนกอื่น' : 'Maintenance Requests'}</h3>
                  <p className="text-sm text-orange-600">{lang === 'th' ? 'แผนกอื่นสามารถแจ้งซ่อมได้ที่นี่' : 'Departments can submit repair requests here'}</p>
                </div>
              </div>
              <Button icon={Plus} onClick={() => setShowRequestModal(true)}>{lang === 'th' ? 'แจ้งซ่อมใหม่' : 'New Request'}</Button>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Request #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'แผนก' : 'Department'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เรื่อง' : 'Subject'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ความสำคัญ' : 'Priority'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-orange-600">{req.id}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(req.date)}</td>
                    <td className="px-4 py-3">{req.department}</td>
                    <td className="px-4 py-3"><div className="font-medium">{req.subject}</div><div className="text-xs text-gray-500">{req.requestedBy}</div></td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[req.priority]}`}>{req.priority}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[req.status]}`}>{req.status === 'converted' ? `→ ${req.mwoNumber}` : req.status}</span></td>
                    <td className="px-4 py-3 text-center">{req.status === 'pending' && <Button size="sm" onClick={() => convertRequestToMWO(req)}><ArrowRight className="w-4 h-4 mr-1" />{lang === 'th' ? 'สร้าง MWO' : 'Create MWO'}</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-700">{lang === 'th' ? 'รายการเครื่องจักร/อุปกรณ์' : 'Equipment Registry'}</h3>
            <Button icon={Plus} onClick={() => { setNewEquipment({...newEquipment, category: 'equipment'}); setShowAddEquipmentModal(true) }}>{lang === 'th' ? 'เพิ่มเครื่องจักร' : 'Add Equipment'}</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.filter(eq => eq.category === 'equipment').map(eq => (
              <Card key={eq.id} className="overflow-hidden">
                <div className={`p-4 ${eq.status === 'operational' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cog className={`w-8 h-8 ${eq.status === 'operational' ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-bold">{eq.name}</div>
                        <div className="text-sm text-gray-600">{eq.id}</div>
                      </div>
                    </div>
                    <Badge variant={eq.status === 'operational' ? 'success' : 'danger'}>{eq.status}</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'ประเภท' : 'Type'}</span><span className="font-medium capitalize">{eq.type}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'ที่ตั้ง' : 'Location'}</span><span className="font-medium">{eq.location}</span></div>
                  {eq.brand && <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'ยี่ห้อ' : 'Brand'}</span><span className="font-medium">{eq.brand}</span></div>}
                  {eq.nextService && <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'บำรุงถัดไป' : 'Next Service'}</span><span className={new Date(eq.nextService) <= new Date() ? 'text-red-500 font-medium' : ''}>{formatDate(eq.nextService)}</span></div>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Building Tab */}
      {activeTab === 'building' && (
        <div className="space-y-4">
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-bold text-purple-800">{lang === 'th' ? 'งานอาคารและสิ่งปลูกสร้าง' : 'Building & Facility Maintenance'}</h3>
                  <p className="text-sm text-purple-600">{lang === 'th' ? 'ทาสี ซ่อมแซม งานไฟฟ้า ประปา' : 'Painting, repairs, electrical, plumbing'}</p>
                </div>
              </div>
              <Button icon={Plus} onClick={() => { setNewEquipment({...newEquipment, category: 'building', type: 'building'}); setShowAddEquipmentModal(true) }}>{lang === 'th' ? 'เพิ่มพื้นที่' : 'Add Area'}</Button>
            </div>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {BUILDING_WORK_TYPES.map(work => (
              <Card key={work.id} className="p-4 text-center hover:bg-purple-50 cursor-pointer transition-colors" onClick={() => { setNewRequest({...newRequest, category: 'building', subject: work.label}); setShowRequestModal(true) }}>
                <div className="text-3xl mb-2">{work.icon}</div>
                <div className="font-medium">{work.label}</div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.filter(eq => eq.category === 'building').map(bld => (
              <Card key={bld.id} className="overflow-hidden">
                <div className="p-4 bg-purple-50">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-bold">{bld.name}</div>
                      <div className="text-sm text-gray-600">{bld.id}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'ที่ตั้ง' : 'Location'}</span><span className="font-medium">{bld.location}</span></div>
                  {bld.lastPaint && <div className="flex justify-between"><span className="text-gray-500">{lang === 'th' ? 'ทาสีล่าสุด' : 'Last Painted'}</span><span>{formatDate(bld.lastPaint)}</span></div>}
                </div>
                <div className="p-3 border-t bg-gray-50">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setShowRequestModal(true)}><Wrench className="w-4 h-4 mr-1" />{lang === 'th' ? 'แจ้งซ่อม' : 'Request Repair'}</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MWO Tab */}
      {activeTab === 'mwo' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b flex gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              <option value="all">{lang === 'th' ? 'ทุกสถานะ' : 'All Status'}</option>
              <option value="open">{lang === 'th' ? 'รอดำเนินการ' : 'Open'}</option>
              <option value="in_progress">{lang === 'th' ? 'กำลังทำ' : 'In Progress'}</option>
              <option value="completed">{lang === 'th' ? 'เสร็จ' : 'Completed'}</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'MWO #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'อุปกรณ์/พื้นที่' : 'Equipment/Area'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รายละเอียด' : 'Description'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ความสำคัญ' : 'Priority'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasksList.filter(t => filterStatus === 'all' || t.status === filterStatus).map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{task.mwoNumber}</td>
                  <td className="px-4 py-3">{task.equipment}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{task.description}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>{task.status}</span></td>
                </tr>
              ))}
              {tasksList.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">{lang === 'th' ? 'ยังไม่มีใบงาน' : 'No work orders yet'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {/* Store Tab */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-emerald-50 flex items-center justify-between">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2"><Package className="w-5 h-5" />{lang === 'th' ? 'คลังอะไหล่และวัสดุซ่อมบำรุง' : 'Maintenance Parts Store'}</h3>
              <div className="text-right">
                <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
                <div className="text-lg font-bold text-emerald-600">฿{stats.storeValue.toLocaleString()}</div>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'Code'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รายการ' : 'Item'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'หมวด' : 'Category'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Qty'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ขั้นต่ำ' : 'Min'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {storeItems.map(item => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${item.qty <= item.minQty ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-right font-medium">{item.qty} {item.unit}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{item.minQty}</td>
                    <td className="px-4 py-3 text-right font-medium">฿{(item.qty * (item.unitCost || 0)).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{item.qty <= item.minQty ? <Badge variant="danger">{lang === 'th' ? 'ต่ำ' : 'Low'}</Badge> : <Badge variant="success">{lang === 'th' ? 'ปกติ' : 'OK'}</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* PM Schedule Tab */}
      {activeTab === 'pm' && (
        <div className="space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-800">{lang === 'th' ? 'ตารางบำรุงรักษาเชิงป้องกัน' : 'Preventive Maintenance Schedule'}</h3>
            <p className="text-sm text-blue-600">{lang === 'th' ? 'กำหนดการบำรุงรักษาตามเวลา' : 'Time-based maintenance schedule'}</p>
          </Card>
          <div className="space-y-3">
            {equipmentList.filter(e => e.nextService).map(eq => (
              <Card key={eq.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${new Date(eq.nextService) <= new Date() ? 'bg-red-500' : new Date(eq.nextService) <= new Date(Date.now() + 7*24*60*60*1000) ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <div>
                      <div className="font-medium">{eq.name}</div>
                      <div className="text-sm text-gray-500">{eq.location} • {eq.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${new Date(eq.nextService) <= new Date() ? 'text-red-600' : 'text-gray-700'}`}>{formatDate(eq.nextService)}</div>
                    <div className="text-xs text-gray-500">{new Date(eq.nextService) <= new Date() ? 'OVERDUE' : `${Math.ceil((new Date(eq.nextService) - new Date()) / (1000*60*60*24))} days`}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <Modal isOpen={showAddEquipmentModal} onClose={() => setShowAddEquipmentModal(false)} title={lang === 'th' ? 'เพิ่มเครื่องจักร/อุปกรณ์' : 'Add Equipment'} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ประเภท' : 'Category'}</label>
                <select value={newEquipment.category} onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="equipment">{lang === 'th' ? 'เครื่องจักร/อุปกรณ์' : 'Equipment/Machinery'}</option>
                  <option value="building">{lang === 'th' ? 'อาคาร/สิ่งปลูกสร้าง' : 'Building/Facility'}</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ชื่อ' : 'Name'} *</label>
                <input type="text" value={newEquipment.name} onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder={lang === 'th' ? 'เช่น Table Saw 3' : 'e.g., Table Saw 3'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ประเภทย่อย' : 'Type'}</label>
                <select value={newEquipment.type} onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  {EQUIPMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ที่ตั้ง' : 'Location'}</label>
                <input type="text" value={newEquipment.location} onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder={lang === 'th' ? 'เช่น C1, Warehouse' : 'e.g., C1, Warehouse'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ยี่ห้อ' : 'Brand'}</label>
                <input type="text" value={newEquipment.brand} onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'รอบบำรุง (วัน)' : 'Service Interval (days)'}</label>
                <input type="number" value={newEquipment.serviceInterval} onChange={(e) => setNewEquipment({...newEquipment, serviceInterval: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddEquipmentModal(false)}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</Button>
              <Button className="flex-1" onClick={handleAddEquipment} disabled={!newEquipment.name}><Plus className="w-4 h-4 mr-2" />{lang === 'th' ? 'เพิ่ม' : 'Add'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Maintenance Request Modal */}
      {showRequestModal && (
        <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title={lang === 'th' ? 'แจ้งซ่อม / ขอบริการซ่อมบำรุง' : 'Maintenance Request Form'} size="lg">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">{lang === 'th' ? 'แบบฟอร์มนี้สำหรับแผนกอื่นแจ้งซ่อมหรือขอบริการซ่อมบำรุง' : 'Use this form to request maintenance service'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'แผนกที่แจ้ง' : 'Department'} *</label>
                <select value={newRequest.department} onChange={(e) => setNewRequest({...newRequest, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">{lang === 'th' ? '-- เลือกแผนก --' : '-- Select --'}</option>
                  {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ผู้แจ้ง' : 'Requested By'} *</label>
                <input type="text" value={newRequest.requestedBy} onChange={(e) => setNewRequest({...newRequest, requestedBy: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder={lang === 'th' ? 'ชื่อผู้แจ้ง' : 'Your name'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ประเภทงาน' : 'Category'}</label>
                <select value={newRequest.category} onChange={(e) => setNewRequest({...newRequest, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  {Object.entries(MAINT_CATEGORIES).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ความเร่งด่วน' : 'Priority'}</label>
                <select value={newRequest.priority} onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
                  <option value="medium">{lang === 'th' ? 'ปานกลาง' : 'Medium'}</option>
                  <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
                  <option value="critical">{lang === 'th' ? 'วิกฤต' : 'Critical'}</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'เรื่อง' : 'Subject'} *</label>
                <input type="text" value={newRequest.subject} onChange={(e) => setNewRequest({...newRequest, subject: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder={lang === 'th' ? 'เช่น เครื่องตัดเสีย, ท่อน้ำรั่ว' : 'e.g., Machine breakdown, Pipe leak'} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'รายละเอียด' : 'Description'}</label>
                <textarea value={newRequest.description} onChange={(e) => setNewRequest({...newRequest, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3" placeholder={lang === 'th' ? 'อธิบายปัญหา...' : 'Describe the issue...'} />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowRequestModal(false)}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</Button>
              <Button className="flex-1" onClick={handleSubmitRequest} disabled={!newRequest.department || !newRequest.requestedBy || !newRequest.subject}><Send className="w-4 h-4 mr-2" />{lang === 'th' ? 'ส่งคำขอ' : 'Submit'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MWO Modal */}
      {showMWOModal && (
        <Modal isOpen={showMWOModal} onClose={() => setShowMWOModal(false)} title={lang === 'th' ? 'สร้างใบงานซ่อมบำรุง' : 'Create MWO'} size="lg">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="font-mono text-lg font-bold text-blue-700">{generateMWONumber()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ประเภท' : 'Category'}</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  {Object.entries(MAINT_CATEGORIES).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'ความสำคัญ' : 'Priority'}</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
                  <option value="medium">{lang === 'th' ? 'ปานกลาง' : 'Medium'}</option>
                  <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
                  <option value="critical">{lang === 'th' ? 'วิกฤต' : 'Critical'}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'อุปกรณ์/พื้นที่' : 'Equipment/Area'}</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option value="">{lang === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                {equipmentList.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.location})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'th' ? 'รายละเอียดงาน' : 'Description'}</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows="3" placeholder={lang === 'th' ? 'อธิบายงานที่ต้องทำ...' : 'Describe the work...'}></textarea>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowMWOModal(false)}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</Button>
              <Button className="flex-1">{lang === 'th' ? 'สร้างใบงาน' : 'Create MWO'}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================
// v7.6 FEATURES - GLOBAL SEARCH (Cmd+K)
// Search across all records: customers, WOs, invoices, inventory
// ============================================
const GlobalSearch = ({ isOpen, onClose, customers, workOrders, salesOrders, invoices, inventory, purchaseOrders, employees, onNavigate, lang }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ customers: [], workOrders: [], invoices: [], inventory: [], purchaseOrders: [], employees: [] })
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ customers: [], workOrders: [], invoices: [], inventory: [], purchaseOrders: [], employees: [] })
      return
    }
    const q = query.toLowerCase()
    setResults({
      customers: (customers || []).filter(c => c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)).slice(0, 5),
      workOrders: (workOrders || []).filter(wo => wo.woNumber?.toLowerCase().includes(q) || wo.productName?.toLowerCase().includes(q) || wo.id?.toString().includes(q)).slice(0, 5),
      invoices: (invoices || []).filter(inv => inv.invoiceNumber?.toLowerCase().includes(q) || inv.customerName?.toLowerCase().includes(q)).slice(0, 5),
      inventory: (inventory || []).filter(item => item.name?.toLowerCase().includes(q) || item.sku?.toLowerCase().includes(q) || item.lotNumber?.toLowerCase().includes(q)).slice(0, 5),
      purchaseOrders: (purchaseOrders || []).filter(po => po.poNumber?.toLowerCase().includes(q) || po.vendorName?.toLowerCase().includes(q)).slice(0, 5),
      employees: (employees || []).filter(emp => emp.name?.toLowerCase().includes(q) || emp.empId?.toLowerCase().includes(q)).slice(0, 5),
    })
  }, [query, customers, workOrders, invoices, inventory, purchaseOrders, employees])

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
  const handleSelect = (type, item) => { onNavigate(type, item); onClose(); setQuery('') }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'th' ? 'ค้นหาลูกค้า, WO, ใบแจ้งหนี้, สินค้า...' : 'Search customers, WOs, invoices, inventory...'}
            className="flex-1 text-lg outline-none" />
          <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">ESC</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{lang === 'th' ? 'พิมพ์เพื่อค้นหา...' : 'Start typing to search...'}</p>
              <p className="text-sm mt-1">{lang === 'th' ? 'กด ⌘K หรือ Ctrl+K เพื่อเปิด' : 'Press ⌘K or Ctrl+K to open'}</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-gray-400"><p>{lang === 'th' ? 'ไม่พบผลลัพธ์สำหรับ' : 'No results for'} "{query}"</p></div>
          ) : (
            <div className="divide-y">
              {results.customers.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" />{lang === 'th' ? 'ลูกค้า' : 'Customers'}</div>
                  {results.customers.map(c => (
                    <button key={c.id} onClick={() => handleSelect('customer', c)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{c.code?.substring(0, 2) || c.name?.charAt(0)}</div>
                      <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.code}</div></div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                </div>
              )}
              {results.workOrders.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2"><Factory className="w-4 h-4" />{lang === 'th' ? 'ใบสั่งผลิต' : 'Work Orders'}</div>
                  {results.workOrders.map(wo => (
                    <button key={wo.id} onClick={() => handleSelect('workOrder', wo)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg text-left">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><Factory className="w-4 h-4 text-orange-600" /></div>
                      <div className="flex-1"><div className="font-mono font-medium text-orange-600">{wo.woNumber || wo.id}</div><div className="text-xs text-gray-500">{wo.productName} • {wo.quantity} pcs</div></div>
                      <Badge variant={wo.status === 'completed' ? 'success' : wo.status === 'in_progress' ? 'warning' : 'default'}>{wo.status}</Badge>
                    </button>
                  ))}
                </div>
              )}
              {results.inventory.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2"><Package className="w-4 h-4" />{lang === 'th' ? 'สินค้าคงคลัง' : 'Inventory'}</div>
                  {results.inventory.map(item => (
                    <button key={item.id} onClick={() => handleSelect('inventory', item)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg text-left">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Package className="w-4 h-4 text-purple-600" /></div>
                      <div className="flex-1"><div className="font-medium">{item.name}</div><div className="text-xs text-gray-500">{item.sku}</div></div>
                      <div className="text-right"><div className="font-medium">{item.quantity} {item.unit}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-4"><span>↑↓ Navigate</span><span>Enter Select</span></div>
          <div>{totalResults} {lang === 'th' ? 'ผลลัพธ์' : 'results'}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// v7.6 FEATURES - NOTIFICATION CENTER
// ============================================
const NotificationCenter = ({ isOpen, onClose, notifications, onAction, lang }) => {
  const [filter, setFilter] = useState('all')
  if (!isOpen) return null

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-[#1A5276] to-[#2ECC40]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2"><Bell className="w-5 h-5" />{lang === 'th' ? 'การแจ้งเตือน' : 'Notifications'}{unreadCount > 0 && <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">{unreadCount}</span>}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-2 mt-3">
          {[{ id: 'all', label: lang === 'th' ? 'ทั้งหมด' : 'All' }, { id: 'alert', label: lang === 'th' ? 'แจ้งเตือน' : 'Alerts' }, { id: 'task', label: lang === 'th' ? 'งาน' : 'Tasks' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === f.id ? 'bg-white text-[#1A5276]' : 'text-white/80 hover:bg-white/20'}`}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400"><Bell className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>{lang === 'th' ? 'ไม่มีการแจ้งเตือน' : 'No notifications'}</p></div>
        ) : filtered.map(notif => (
          <div key={notif.id} className={`p-4 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                {notif.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800">{notif.title}</div>
                <div className="text-sm text-gray-600">{notif.message}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">{notif.time}</span>
                  {notif.action && <button onClick={() => onAction(notif)} className="text-xs font-medium text-[#1A5276] hover:underline">{notif.action}</button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// v7.6 FEATURES - QUICK ACTIONS (Press Q)
// ============================================
const QuickActionsMenu = ({ isOpen, onClose, onAction, lang }) => {
  if (!isOpen) return null
  const actions = [
    { id: 'new_wo', label: lang === 'th' ? 'สร้าง Work Order' : 'New Work Order', icon: Factory, color: 'bg-orange-100 text-orange-600' },
    { id: 'new_so', label: lang === 'th' ? 'สร้างใบสั่งขาย' : 'New Sales Order', icon: Receipt, color: 'bg-pink-100 text-pink-600' },
    { id: 'new_po', label: lang === 'th' ? 'สร้างใบสั่งซื้อ' : 'New Purchase Order', icon: ShoppingCart, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'new_invoice', label: lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'New Invoice', icon: FileText, color: 'bg-green-100 text-green-600' },
    { id: 'maint_request', label: lang === 'th' ? 'แจ้งซ่อม' : 'Maintenance Request', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  ]
  return (
    <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
      <div className="p-3 border-b bg-gray-50"><h3 className="font-bold text-gray-700 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" />{lang === 'th' ? 'ทางลัด' : 'Quick Actions'}</h3></div>
      <div className="p-2">
        {actions.map(action => (
          <button key={action.id} onClick={() => { onAction(action.id); onClose() }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-left">
            <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}><action.icon className="w-4 h-4" /></div>
            <span className="font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-400 text-center">{lang === 'th' ? 'กด Q เพื่อเปิด' : 'Press Q to open'}</div>
    </div>
  )
}

// ============================================
// v7.6 FEATURES - KANBAN BOARD for Production
// ============================================
const KanbanBoard = ({ workOrders, setWorkOrders, customers, lang }) => {
  const [draggedWO, setDraggedWO] = useState(null)
  const DEPT_FLOW = ['C1', 'C2', 'P1', 'P2', 'P3', 'ASM1', 'ASM2', 'OVN', 'QC', 'FG']
  const DEPT_COLORS = {
    C1: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', header: 'bg-red-100' },
    C2: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', header: 'bg-orange-100' },
    P1: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', header: 'bg-yellow-100' },
    P2: { bg: 'bg-lime-50', border: 'border-lime-300', text: 'text-lime-700', header: 'bg-lime-100' },
    P3: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', header: 'bg-green-100' },
    ASM1: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-700', header: 'bg-teal-100' },
    ASM2: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-700', header: 'bg-cyan-100' },
    OVN: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', header: 'bg-blue-100' },
    QC: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', header: 'bg-purple-100' },
    FG: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', header: 'bg-emerald-100' },
  }
  const getWOsForDept = (deptCode) => workOrders.filter(wo => (wo.currentDept || wo.department || 'C1') === deptCode && wo.status !== 'completed')
  const handleDragStart = (e, wo) => { setDraggedWO(wo); e.dataTransfer.effectAllowed = 'move' }
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const handleDrop = (e, targetDept) => {
    e.preventDefault()
    if (!draggedWO) return
    setWorkOrders(workOrders.map(wo => wo.id === draggedWO.id ? { ...wo, currentDept: targetDept, status: targetDept === 'FG' ? 'completed' : 'in_progress' } : wo))
    setDraggedWO(null)
  }
  return (
    <div className="h-full overflow-x-auto p-4">
      <div className="flex gap-3 min-w-max">
        {DEPT_FLOW.map(deptCode => {
          const wos = getWOsForDept(deptCode)
          const colors = DEPT_COLORS[deptCode]
          return (
            <div key={deptCode} className={`w-56 flex-shrink-0 rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, deptCode)}>
              <div className={`p-3 ${colors.header} border-b ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <div className={`font-bold ${colors.text}`}>{deptCode}</div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>{wos.length}</div>
                </div>
              </div>
              <div className="p-2 space-y-2 min-h-64 max-h-96 overflow-y-auto">
                {wos.map(wo => {
                  const customer = customers?.find(c => c.id === wo.customerId)
                  return (
                    <div key={wo.id} draggable onDragStart={(e) => handleDragStart(e, wo)} className="bg-white rounded-lg shadow-sm border p-3 cursor-move hover:shadow-md">
                      <div className="font-mono text-sm font-bold text-[#1A5276]">{wo.woNumber || wo.id}</div>
                      <div className="text-sm mt-1 truncate">{wo.productName}</div>
                      <div className="text-xs text-gray-500 mt-1">{customer?.name}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium">{wo.quantity} pcs</span>
                        {wo.targetDate && <span className={`text-xs ${new Date(wo.targetDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-400'}`}>{formatDate(wo.targetDate)}</span>}
                      </div>
                    </div>
                  )
                })}
                {wos.length === 0 && <div className={`p-4 text-center ${colors.text} opacity-50 text-sm`}>{lang === 'th' ? 'ว่าง' : 'Empty'}</div>}
              </div>
            </div>
          )
        })}
      </div>
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
  
  // GLOBAL LOT SEQUENCE - shared across ALL materials
  const [globalLotSequence, setGlobalLotSequence] = useState(14926)
  
  // Generate lot number with correct prefix based on material and vendor
  const generateLotNumber = (categoryCode, vendor) => {
    const seq = globalLotSequence + 1
    setGlobalLotSequence(seq)
    
    let prefix
    switch (categoryCode) {
      case 'MLH':
        prefix = 'LP'
        break
      case 'PW':
        // Use vendor initials for PW
        prefix = vendor?.initials || vendor?.name?.substring(0, 2).toUpperCase() || 'PW'
        break
      case 'PLYRR':
        prefix = 'PLYRR'
        break
      case 'PLYRW':
        prefix = 'PLYRW'
        break
      case 'PLYWW':
        prefix = 'PLYWW'
        break
      case 'PLYWB':
        prefix = 'PLYWB'
        break
      case 'PRTB':
        prefix = 'PRTB'
        break
      case 'PRTW':
        prefix = 'PRTW'
        break
      default:
        prefix = categoryCode
    }
    
    return `${prefix}${seq}`
  }

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: lang === 'th' ? 'ใบสั่งซื้อ' : 'Purchase Orders', icon: FileText },
    { id: 'receiving', label: lang === 'th' ? 'รับสินค้า' : 'Goods Receipt', icon: Package },
    { id: 'import', label: lang === 'th' ? 'นำเข้า' : 'Import Tracking', icon: Truck },
    { id: 'vendors', label: lang === 'th' ? 'ผู้ขาย' : 'Vendors', icon: Users },
    { id: 'reports', label: lang === 'th' ? 'รายงาน' : 'Reports', icon: PieChart },
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
    const vendor = vendors.find(v => v.id === po.vendorId)
    const lots = po.items.map((item, idx) => {
      const entityPrefix = po.type === 'import' ? 'IND2' : 'IND'
      return {
        lotNo: generateLotNumber(item.categoryId, vendor),
        code: `${entityPrefix}-${item.categoryId}/${item.thickness}/${item.width}/${item.length}`,
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
    
    const vendor = vendors.find(v => v.id === selectedPO.vendorId)
    
    // Add to inventory
    const newItems = grnData.items.map((item, idx) => {
      const entityPrefix = selectedPO.type === 'import' ? 'IND2' : 'IND'
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
        lotNo: generateLotNumber(item.category, vendor),
        category: item.category,
        code: `${entityPrefix}-${item.category}/${item.thickness}/${item.width}/${item.length}`,
        store,
        qty: item.qtyReceived,
        cbm,
        cost: item.qtyReceived * unitCost,
        costPerCbm: cbm > 0 ? (item.qtyReceived * unitCost) / cbm : 0,
        status: 'available',
        dateIn: grnData.grnDate,
        vendor: vendor?.name || '',
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

      {/* GRN Modal - Enhanced with Split Lots */}
      {showGRNModal && selectedPO && (
        <Modal isOpen={showGRNModal} onClose={() => setShowGRNModal(false)} title={lang === 'th' ? 'รับสินค้า' : 'Goods Receipt'} size="xl">
          <GoodsReceiptForm
            po={selectedPO}
            vendors={vendors}
            categories={categories}
            globalLotSequence={globalLotSequence}
            setGlobalLotSequence={setGlobalLotSequence}
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
// REJECT ITEM MODAL
// ============================================
const RejectItemModal = ({ item, lang, onReject, onCancel }) => {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (reason) onReject(reason, note)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {lang === 'th' ? 'ปฏิเสธรายการ' : 'Reject Item'}
            </h3>
            <p className="text-sm text-gray-500">
              {item.categoryId} - {item.thickness}×{item.width}×{item.length}mm
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'เหตุผลการปฏิเสธ *' : 'Rejection Reason *'}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder={lang === 'th' ? 'ระบุรายละเอียด...' : 'Specify details...'}
            />
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {lang === 'th' 
              ? 'การปฏิเสธจะถูกบันทึก และต้องแจ้ง Vendor เพื่อออกใบแจ้งหนี้ใหม่ (Revised Invoice)' 
              : 'Rejection will be recorded. Vendor must be notified for Revised Invoice.'}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button type="submit" variant="danger" icon={X}>
              {lang === 'th' ? 'ยืนยันปฏิเสธ' : 'Confirm Reject'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// ADD RECEIPT ITEM MODAL (Not on PO)
// ============================================
const AddReceiptItemModal = ({ categories, lang, onAdd, onCancel }) => {
  const rmCategories = categories?.filter(c => c.type === 'raw_material') || []
  const [formData, setFormData] = useState({
    categoryId: '',
    thickness: 0,
    width: 0,
    length: 0,
    qty: 0,
    unit: 'pcs',
    unitPrice: 0,
    note: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {lang === 'th' ? 'เพิ่มรายการใหม่' : 'Add New Item'}
            </h3>
            <p className="text-sm text-gray-500">
              {lang === 'th' ? 'สำหรับรายการที่ได้รับแต่ไม่อยู่ใน PO' : 'For items received but not in PO'}
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 text-sm text-blue-800">
          <Info className="w-4 h-4 inline mr-1" />
          {lang === 'th' 
            ? 'รายการนี้จะถูกบันทึกเป็น Variance และจะสร้าง Variance Report' 
            : 'This will be recorded as Variance and generate a Variance Report'}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'หมวดหมู่ *' : 'Category *'}
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">{lang === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                {rmCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'จำนวน *' : 'Quantity *'}
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.qty || ''}
                onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'หนา (mm) *' : 'Thickness *'}
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.thickness || ''}
                onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'กว้าง (mm) *' : 'Width *'}
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.width || ''}
                onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'ยาว (mm) *' : 'Length *'}
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.length || ''}
                onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'ราคา/หน่วย *' : 'Unit Price *'}
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.unitPrice || ''}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'หมายเหตุ' : 'Note'}
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder={lang === 'th' ? 'เหตุผลที่เพิ่ม...' : 'Reason for adding...'}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button type="submit" icon={Plus}>
              {lang === 'th' ? 'เพิ่มรายการ' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// ENHANCED GOODS RECEIPT FORM
// With Split Lots, Reject, Add Items (Spec 3-4)
// ============================================
const GoodsReceiptForm = ({ po, vendors, categories, globalLotSequence, setGlobalLotSequence, onSave, onCancel, lang }) => {
  const vendor = vendors.find(v => v.id === po.vendorId)
  const rmCategories = categories?.filter(c => c.type === 'raw_material') || []
  
  // State for receipt items - each PO item can have multiple lots
  const [receiptItems, setReceiptItems] = useState(
    po.items.map((item, idx) => ({
      poItemIdx: idx,
      poItem: item,
      lots: [{
        id: `lot-${idx}-0`,
        qtyToReceive: item.qty - (item.qtyReceived || 0),
        actualThickness: item.thickness,
        actualWidth: item.width,
        actualLength: item.length,
        hasVariance: false,
        varianceType: '',
        varianceNote: '',
      }],
      isRejected: false,
      rejectReason: '',
      rejectNote: '',
    }))
  )
  
  // State for newly added items (not on PO)
  const [additionalItems, setAdditionalItems] = useState([])
  
  // General receipt info
  const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0])
  const [grnNotes, setGrnNotes] = useState('')
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingItemIdx, setRejectingItemIdx] = useState(null)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [expandedItems, setExpandedItems] = useState(() => {
    const expanded = {}
    po.items.forEach((_, idx) => { expanded[idx] = true })
    return expanded
  })

  // Generate lot number
  const generateLotNumber = (categoryCode) => {
    const seq = (globalLotSequence || 14926) + 1
    if (setGlobalLotSequence) setGlobalLotSequence(seq)
    
    let prefix
    switch (categoryCode) {
      case 'MLH': prefix = 'LP'; break
      case 'PW': prefix = vendor?.initials || 'PW'; break
      case 'PWKD': prefix = vendor?.initials || 'PW'; break
      case 'PWGRN': prefix = vendor?.initials || 'PW'; break
      case 'PLYRR': prefix = 'PLYRR'; break
      case 'PLYRW': prefix = 'PLYRW'; break
      case 'PLYWW': prefix = 'PLYWW'; break
      case 'PRTB': prefix = 'PRTB'; break
      default: prefix = categoryCode
    }
    return `${prefix}${seq}`
  }

  // Toggle item expansion
  const toggleExpand = (idx) => {
    setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Add a lot to a PO item (split)
  const addLotToItem = (itemIdx) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      return {
        ...item,
        lots: [...item.lots, {
          id: `lot-${itemIdx}-${item.lots.length}`,
          qtyToReceive: 0,
          actualThickness: item.poItem.thickness,
          actualWidth: item.poItem.width,
          actualLength: item.poItem.length,
          hasVariance: false,
          varianceType: '',
          varianceNote: '',
        }]
      }
    }))
  }

  // Remove a lot from an item
  const removeLot = (itemIdx, lotIdx) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx || item.lots.length <= 1) return item
      return {
        ...item,
        lots: item.lots.filter((_, i) => i !== lotIdx)
      }
    }))
  }

  // Update a lot field
  const updateLot = (itemIdx, lotIdx, field, value) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      return {
        ...item,
        lots: item.lots.map((lot, i) => {
          if (i !== lotIdx) return lot
          const updated = { ...lot, [field]: value }
          
          // Auto-detect variance based on dimensions
          const hasVariance = 
            updated.actualThickness !== item.poItem.thickness ||
            updated.actualWidth !== item.poItem.width ||
            updated.actualLength !== item.poItem.length
          
          updated.hasVariance = hasVariance
          if (hasVariance && !updated.varianceType) {
            updated.varianceType = 'size_different'
          }
          
          return updated
        })
      }
    }))
  }

  // Get total qty in lots for an item
  const getTotalInLots = (item) => {
    return item.lots.reduce((sum, lot) => sum + (lot.qtyToReceive || 0), 0)
  }

  // Reject an item
  const handleRejectItem = (itemIdx, reason, note) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      return {
        ...item,
        isRejected: true,
        rejectReason: reason,
        rejectNote: note,
        lots: item.lots.map(lot => ({ ...lot, qtyToReceive: 0 }))
      }
    }))
    setShowRejectModal(false)
    setRejectingItemIdx(null)
  }

  // Un-reject an item
  const handleUnrejectItem = (itemIdx) => {
    setReceiptItems(items => items.map((item, idx) => {
      if (idx !== itemIdx) return item
      const remaining = item.poItem.qty - (item.poItem.qtyReceived || 0)
      return {
        ...item,
        isRejected: false,
        rejectReason: '',
        rejectNote: '',
        lots: [{
          id: `lot-${itemIdx}-0`,
          qtyToReceive: remaining,
          actualThickness: item.poItem.thickness,
          actualWidth: item.poItem.width,
          actualLength: item.poItem.length,
          hasVariance: false,
          varianceType: '',
          varianceNote: '',
        }]
      }
    }))
  }

  // Add additional item (not on PO)
  const handleAddAdditionalItem = (newItem) => {
    setAdditionalItems(items => [...items, {
      ...newItem,
      id: `ADD-${items.length + 1}`,
      isAdditional: true,
    }])
    setShowAddItemModal(false)
  }

  // Remove additional item
  const removeAdditionalItem = (idx) => {
    setAdditionalItems(items => items.filter((_, i) => i !== idx))
  }

  // Calculate totals
  const calculateTotals = () => {
    let totalLots = 0
    let totalQty = 0
    let totalValue = 0
    let totalRejected = 0
    let hasVariance = false

    receiptItems.forEach(item => {
      if (item.isRejected) {
        totalRejected++
      } else {
        item.lots.forEach(lot => {
          if (lot.qtyToReceive > 0) {
            totalLots++
            totalQty += lot.qtyToReceive
            totalValue += lot.qtyToReceive * item.poItem.unitPrice * (po.exchangeRate || 1)
            if (lot.hasVariance) hasVariance = true
          }
        })
      }
    })

    additionalItems.forEach(item => {
      totalLots++
      totalQty += item.qty
      totalValue += item.qty * item.unitPrice
      hasVariance = true
    })

    return { totalLots, totalQty, totalValue, totalRejected, hasVariance }
  }

  const totals = calculateTotals()

  // Submit receipt
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const allLots = []
    const rejections = []
    
    receiptItems.forEach(item => {
      if (item.isRejected) {
        rejections.push({
          poItemIdx: item.poItemIdx,
          category: item.poItem.categoryId,
          orderedQty: item.poItem.qty,
          reason: item.rejectReason,
          note: item.rejectNote,
        })
        return
      }
      
      item.lots.forEach(lot => {
        if (lot.qtyToReceive <= 0) return
        
        allLots.push({
          poItemIdx: item.poItemIdx,
          id: item.poItem.id,
          category: item.poItem.categoryId,
          thickness: lot.actualThickness,
          width: lot.actualWidth,
          length: lot.actualLength,
          qtyReceived: lot.qtyToReceive,
          unitPrice: item.poItem.unitPrice,
          hasVariance: lot.hasVariance,
          varianceType: lot.varianceType,
          varianceNote: lot.varianceNote || (lot.hasVariance ? `Size: ${lot.actualThickness}x${lot.actualWidth}x${lot.actualLength} vs PO: ${item.poItem.thickness}x${item.poItem.width}x${item.poItem.length}` : ''),
          varianceReason: lot.varianceNote,
        })
      })
    })
    
    // Add additional items
    additionalItems.forEach(item => {
      allLots.push({
        poItemIdx: null,
        id: item.id,
        category: item.categoryId,
        thickness: item.thickness,
        width: item.width,
        length: item.length,
        qtyReceived: item.qty,
        unitPrice: item.unitPrice,
        hasVariance: true,
        varianceType: 'not_on_po',
        varianceNote: item.note || 'Additional item not on PO',
        varianceReason: item.note || 'Additional item not on PO',
        isAdditional: true,
      })
    })
    
    onSave({
      poId: po.id,
      grnDate,
      notes: grnNotes,
      items: allLots,
      rejections,
      hasVariance: totals.hasVariance,
      summary: totals,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      {/* PO Info Header */}
      <div className="p-4 bg-gradient-to-r from-[#1A5276]/10 to-[#2ECC40]/10 rounded-lg border">
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'เลขที่ PO' : 'PO Number'}</div>
            <div className="font-bold text-[#1A5276] text-lg">{po.id}</div>
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
            <Badge variant={po.type === 'import' ? 'info' : 'success'}>
              {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
            </Badge>
          </div>
          <div>
            <div className="text-gray-500">{lang === 'th' ? 'วันที่รับ' : 'Receipt Date'}</div>
            <input
              type="date"
              required
              value={grnDate}
              onChange={(e) => setGrnDate(e.target.value)}
              className="mt-1 px-2 py-1 border rounded text-sm w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {po.items.length} {lang === 'th' ? 'รายการใน PO' : 'items in PO'}
        </div>
        <Button type="button" variant="outline" size="sm" icon={Plus} onClick={() => setShowAddItemModal(true)}>
          {lang === 'th' ? 'เพิ่มรายการใหม่ (ไม่อยู่ใน PO)' : 'Add Item (Not in PO)'}
        </Button>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800">
            <strong>{lang === 'th' ? 'คำแนะนำ:' : 'Tips:'}</strong>
            <span className="ml-1">
              {lang === 'th' 
                ? 'แก้ไขจำนวน/ขนาดตามจริง • ใช้ "แยกล็อต" หากมีหลายขนาด • ใช้ "ปฏิเสธ" หากไม่ผ่าน'
                : 'Edit qty/size as received • Use "Split Lot" for multiple sizes • Use "Reject" if failed'}
            </span>
          </div>
        </div>
      </div>

      {/* Receipt Items */}
      <div className="space-y-4">
        {receiptItems.map((item, itemIdx) => {
          const poItem = item.poItem
          const ordered = poItem.qty - (poItem.qtyReceived || 0)
          const totalInLots = getTotalInLots(item)
          const remaining = ordered - totalInLots
          const isExpanded = expandedItems[itemIdx] !== false
          const hasAnyVariance = item.lots.some(l => l.hasVariance)
          
          return (
            <div 
              key={itemIdx} 
              className={`border rounded-lg overflow-hidden ${
                item.isRejected ? 'border-red-300 bg-red-50' :
                hasAnyVariance ? 'border-amber-300' :
                'border-gray-200'
              }`}
            >
              {/* Item Header */}
              <div 
                className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                  item.isRejected ? 'bg-red-100' :
                  hasAnyVariance ? 'bg-amber-50' :
                  'bg-gray-50'
                }`}
                onClick={() => toggleExpand(itemIdx)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <Badge variant="info">{poItem.categoryId}</Badge>
                  <div>
                    <span className="font-medium">{poItem.thickness} × {poItem.width} × {poItem.length} mm</span>
                    <span className="text-gray-500 text-sm ml-2">
                      (Ord: {ordered} | Lots: {totalInLots} | Left: {remaining})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {item.isRejected && (
                    <Badge variant="danger">❌ {lang === 'th' ? 'ปฏิเสธ' : 'Rejected'}</Badge>
                  )}
                  {hasAnyVariance && !item.isRejected && (
                    <Badge variant="warning">⚠️ Variance</Badge>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t">
                  {item.isRejected ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="font-bold text-red-700">
                        {lang === 'th' ? 'รายการถูกปฏิเสธ' : 'Item Rejected'}
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        {REJECTION_REASONS.find(r => r.id === item.rejectReason)?.[lang === 'th' ? 'labelTh' : 'labelEn']}
                        {item.rejectNote && ` - ${item.rejectNote}`}
                      </div>
                      <div className="mt-2 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        {lang === 'th' ? 'Vendor ต้องออก Revised Invoice' : 'Vendor must issue Revised Invoice'}
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => handleUnrejectItem(itemIdx)}>
                        <RotateCcw className="w-4 h-4 mr-1" /> {lang === 'th' ? 'ยกเลิกปฏิเสธ' : 'Undo'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {item.lots.map((lot, lotIdx) => (
                        <div 
                          key={lot.id} 
                          className={`p-3 rounded-lg border ${
                            lot.hasVariance ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              <Layers className="w-4 h-4 inline mr-1" />
                              {lang === 'th' ? 'ล็อต' : 'Lot'} #{lotIdx + 1}
                              {lot.hasVariance && <span className="ml-2 text-amber-600">⚠️ Size differs</span>}
                            </span>
                            {item.lots.length > 1 && (
                              <button type="button" onClick={() => removeLot(itemIdx, lotIdx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">{lang === 'th' ? 'จำนวน' : 'Qty'} *</label>
                              <input
                                type="number"
                                min="0"
                                value={lot.qtyToReceive}
                                onChange={(e) => updateLot(itemIdx, lotIdx, 'qtyToReceive', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1.5 border rounded text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">T (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={lot.actualThickness}
                                onChange={(e) => updateLot(itemIdx, lotIdx, 'actualThickness', parseFloat(e.target.value) || 0)}
                                className={`w-full px-2 py-1.5 border rounded text-center ${lot.actualThickness !== poItem.thickness ? 'border-amber-400 bg-amber-50' : ''}`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">W (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={lot.actualWidth}
                                onChange={(e) => updateLot(itemIdx, lotIdx, 'actualWidth', parseFloat(e.target.value) || 0)}
                                className={`w-full px-2 py-1.5 border rounded text-center ${lot.actualWidth !== poItem.width ? 'border-amber-400 bg-amber-50' : ''}`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">L (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={lot.actualLength}
                                onChange={(e) => updateLot(itemIdx, lotIdx, 'actualLength', parseFloat(e.target.value) || 0)}
                                className={`w-full px-2 py-1.5 border rounded text-center ${lot.actualLength !== poItem.length ? 'border-amber-400 bg-amber-50' : ''}`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">CBM</label>
                              <div className="px-2 py-1.5 bg-gray-100 rounded text-center text-sm">
                                {((lot.actualThickness * lot.actualWidth * lot.actualLength * lot.qtyToReceive) / 1000000000).toFixed(3)}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">{lang === 'th' ? 'มูลค่า' : 'Value'}</label>
                              <div className="px-2 py-1.5 bg-green-50 rounded text-center text-sm font-medium text-green-700">
                                ฿{(lot.qtyToReceive * poItem.unitPrice * (po.exchangeRate || 1)).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {lot.hasVariance && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={lot.varianceNote}
                                onChange={(e) => updateLot(itemIdx, lotIdx, 'varianceNote', e.target.value)}
                                placeholder={lang === 'th' ? 'หมายเหตุ variance...' : 'Variance note...'}
                                className="w-full px-2 py-1.5 border border-amber-300 rounded bg-amber-50 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      {remaining !== 0 && (
                        <div className={`p-2 rounded text-sm text-center ${remaining > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {remaining > 0 ? `⚠️ ${remaining} pcs not assigned` : `❌ ${Math.abs(remaining)} pcs over-assigned`}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button type="button" variant="outline" size="sm" icon={Copy} onClick={() => addLotToItem(itemIdx)}>
                          {lang === 'th' ? 'แยกล็อต' : 'Split Lot'}
                        </Button>
                        <Button type="button" variant="danger" size="sm" icon={X} onClick={() => { setRejectingItemIdx(itemIdx); setShowRejectModal(true); }}>
                          {lang === 'th' ? 'ปฏิเสธ' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Additional Items */}
      {additionalItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            {lang === 'th' ? 'รายการเพิ่มเติม (ไม่อยู่ใน PO)' : 'Additional Items (Not in PO)'}
          </h4>
          {additionalItems.map((item, idx) => (
            <div key={idx} className="p-3 border-2 border-blue-300 bg-blue-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-medium">{item.categoryId}</span>
                <span className="text-gray-600 ml-2">{item.thickness}×{item.width}×{item.length}mm × {item.qty}</span>
                {item.note && <span className="text-blue-600 ml-2 text-sm">({item.note})</span>}
              </div>
              <button type="button" onClick={() => removeAdditionalItem(idx)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'หมายเหตุ' : 'Notes'}
        </label>
        <textarea
          value={grnNotes}
          onChange={(e) => setGrnNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Summary */}
      <div className={`p-4 rounded-lg border ${totals.hasVariance ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'}`}>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ล็อต' : 'Lots'}</div>
            <div className="text-2xl font-bold text-blue-600">{totals.totalLots}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">{lang === 'th' ? 'จำนวน' : 'Qty'}</div>
            <div className="text-2xl font-bold text-green-600">{totals.totalQty.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่า' : 'Value'}</div>
            <div className="text-xl font-bold text-emerald-600">฿{totals.totalValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ปฏิเสธ' : 'Rejected'}</div>
            <div className="text-2xl font-bold text-red-600">{totals.totalRejected}</div>
          </div>
        </div>
        {totals.hasVariance && (
          <div className="mt-2 text-center text-sm text-amber-700">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Variance detected - Report will be generated
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('action.cancel', lang)}</Button>
        <Button type="submit" icon={Save}>
          {lang === 'th' ? 'ยืนยันรับสินค้า' : 'Confirm Receipt'} ({totals.totalLots} lots)
        </Button>
      </div>

      {/* Modals */}
      {showRejectModal && rejectingItemIdx !== null && (
        <RejectItemModal
          item={receiptItems[rejectingItemIdx].poItem}
          lang={lang}
          onReject={(reason, note) => handleRejectItem(rejectingItemIdx, reason, note)}
          onCancel={() => { setShowRejectModal(false); setRejectingItemIdx(null); }}
        />
      )}

      {showAddItemModal && (
        <AddReceiptItemModal
          categories={categories}
          lang={lang}
          onAdd={handleAddAdditionalItem}
          onCancel={() => setShowAddItemModal(false)}
        />
      )}
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
// ============================================
// DEPARTMENT CALENDAR COMPONENT
// ============================================
const DepartmentCalendar = ({ department, events = [], workOrders = [], deliveries = [], leaves = [], lang }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  
  const monthNames = lang === 'th' 
    ? ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayNames = lang === 'th' 
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const dayEvents = []
    
    // Work Order deliveries
    workOrders.filter(wo => wo.deliveryDate === dateStr).forEach(wo => {
      dayEvents.push({ type: 'wo', color: 'bg-orange-500', title: `WO: ${wo.woNumber}` })
    })
    
    // Scheduled deliveries
    deliveries.filter(d => d.date === dateStr).forEach(d => {
      dayEvents.push({ type: 'delivery', color: 'bg-cyan-500', title: `${lang === 'th' ? 'ส่ง' : 'Delivery'}: ${d.customerName || d.id}` })
    })
    
    // Leave requests
    leaves.filter(l => l.startDate <= dateStr && l.endDate >= dateStr).forEach(l => {
      dayEvents.push({ type: 'leave', color: 'bg-pink-500', title: `${l.employeeName}: ${l.type}` })
    })
    
    // Custom events
    events.filter(e => e.date === dateStr).forEach(e => {
      dayEvents.push({ type: 'event', color: e.color || 'bg-blue-500', title: e.title })
    })
    
    return dayEvents
  }
  
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1A5276]" />
          {lang === 'th' ? 'ปฏิทินแผนก' : 'Department Calendar'}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium min-w-[150px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 bg-gray-50 rounded" />
        ))}
        
        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1
          const dayEvents = getEventsForDate(date)
          const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date).toDateString()
          
          return (
            <div 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`h-20 p-1 border rounded cursor-pointer hover:bg-gray-50 ${
                isToday ? 'border-[#1A5276] bg-blue-50' : 'border-gray-200'
              } ${selectedDate === date ? 'ring-2 ring-[#2ECC40]' : ''}`}
            >
              <div className={`text-sm font-medium ${isToday ? 'text-[#1A5276]' : 'text-gray-700'}`}>{date}</div>
              <div className="space-y-0.5 mt-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <div key={idx} className={`text-xs px-1 py-0.5 rounded truncate text-white ${event.color}`}>
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500" /> {lang === 'th' ? 'ใบสั่งผลิต' : 'Work Orders'}</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-cyan-500" /> {lang === 'th' ? 'การส่งสินค้า' : 'Deliveries'}</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-pink-500" /> {lang === 'th' ? 'ลางาน' : 'Leave'}</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500" /> {lang === 'th' ? 'กิจกรรม' : 'Events'}</div>
      </div>
    </Card>
  )
}

// ============================================
// COMPANY CALENDAR (Admin - All Departments)
// ============================================
const CompanyCalendar = ({ workOrders = [], deliveries = [], leaves = [], departments = [], lang }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  
  const monthNames = lang === 'th' 
    ? ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayNames = lang === 'th' ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  // Department colors
  const deptColors = {
    production: 'bg-orange-500',
    sales: 'bg-pink-500',
    warehouse: 'bg-yellow-500',
    hr: 'bg-indigo-500',
    accounting: 'bg-green-500',
    transport: 'bg-cyan-500',
    maintenance: 'bg-purple-500',
    office: 'bg-blue-500'
  }
  
  const getEventsForDate = (date) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const dayEvents = []
    
    workOrders.filter(wo => wo.deliveryDate === dateStr).forEach(wo => {
      dayEvents.push({ dept: 'production', color: deptColors.production, title: wo.woNumber })
    })
    
    deliveries.filter(d => d.date === dateStr).forEach(d => {
      dayEvents.push({ dept: 'transport', color: deptColors.transport, title: d.id })
    })
    
    return dayEvents
  }
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1A5276]" />
          {lang === 'th' ? 'ปฏิทินบริษัท' : 'Company Calendar'}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`e-${i}`} className="h-16 bg-gray-50 rounded" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1
          const dayEvents = getEventsForDate(date)
          const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date).toDateString()
          
          return (
            <div key={date} className={`h-16 p-1 border rounded ${isToday ? 'border-[#1A5276] bg-blue-50' : 'border-gray-200'}`}>
              <div className={`text-xs font-medium ${isToday ? 'text-[#1A5276]' : 'text-gray-700'}`}>{date}</div>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full ${e.color}`} title={e.title} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t text-xs">
        {Object.entries(deptColors).slice(0, 6).map(([dept, color]) => (
          <div key={dept} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="capitalize">{dept}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ============================================
// ROLE-BASED DASHBOARD COMPONENT
// ============================================
const Dashboard = ({ stores, inventory, categories, purchaseOrders, workOrders, salesOrders, invoices, deliveries, employees = [], lang, currentUser }) => {
  const userRole = currentUser?.role || 'admin'
  
  // Calculate stats (only for roles that need them)
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.cost || 0), 0)
  const totalLots = inventory.length
  const lowStockCount = inventory.filter(i => i.status === 'low').length
  const pendingPOs = (purchaseOrders || []).filter(po => po.status === 'pending').length
  const activeWOs = (workOrders || []).filter(wo => wo.status === 'in_progress').length
  const unpaidInvoices = (invoices || []).filter(inv => inv.balance > 0).length
  const todayDeliveries = (deliveries || []).filter(d => d.date === new Date().toISOString().split('T')[0]).length

  // Category distribution (only for inventory-related roles)
  const categoryStats = categories.filter(c => c.type === 'raw_material').map(cat => {
    const catItems = inventory.filter(i => i.category === cat.id)
    const value = catItems.reduce((sum, i) => sum + (i.cost || 0), 0)
    return { ...cat, items: catItems.length, value }
  }).sort((a, b) => b.value - a.value)

  // HR-specific dashboard
  if (userRole === 'hr') {
    const totalEmployees = employees.length
    const ftCount = employees.filter(e => e.type === 'FT').length
    const ptCount = employees.filter(e => e.type === 'PT').length
    const todayLeave = 2 // Mock data
    const pendingLeave = 3 // Mock data
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ด HR' : 'HR Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมทรัพยากรบุคคล' : 'Human Resources Overview'}</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{lang === 'th' ? 'พนักงานทั้งหมด' : 'Total Staff'}</div>
                <div className="text-2xl font-bold text-gray-800">{totalEmployees}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ประจำ' : 'Full-time'}</div>
            <div className="text-2xl font-bold text-blue-600">{ftCount}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'พาร์ทไทม์' : 'Part-time'}</div>
            <div className="text-2xl font-bold text-orange-600">{ptCount}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-pink-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ลาวันนี้' : 'On Leave'}</div>
            <div className="text-2xl font-bold text-pink-600">{todayLeave}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'รออนุมัติ' : 'Pending'}</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingLeave}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentCalendar department="hr" workOrders={[]} deliveries={[]} leaves={[]} lang={lang} />
          
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'เพิ่มพนักงาน' : 'Add Employee'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'เงินเดือน' : 'Run Payroll'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-pink-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'อนุมัติลา' : 'Approve Leave'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'ตรวจเช็ค' : 'Attendance'}</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Sales-specific dashboard
  if (userRole === 'sales') {
    const totalOrders = salesOrders.length
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0)
    const totalReceived = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
    const pendingOrders = salesOrders.filter(so => so.status === 'confirmed').length
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ดการขาย' : 'Sales Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมการขายและลูกค้า' : 'Sales & Customer Overview'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Revenue'}</div>
                <div className="text-xl font-bold text-[#2ECC40]">{formatCurrency(totalRevenue)}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalReceived)}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ค้างชำระ' : 'Outstanding'}</div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRevenue - totalReceived)}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-pink-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งขาย' : 'Orders'}</div>
            <div className="text-2xl font-bold text-pink-600">{totalOrders}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentCalendar department="sales" workOrders={workOrders} deliveries={deliveries} leaves={[]} lang={lang} />
          
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mb-2">
                  <ClipboardList className="w-5 h-5 text-pink-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'ใบสั่งขายใหม่' : 'New Order'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'New Invoice'}</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Production-specific dashboard
  if (userRole === 'production') {
    const completedWOs = workOrders.filter(wo => wo.status === 'completed').length
    const inProgressWOs = workOrders.filter(wo => wo.status === 'in_progress').length
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ดการผลิต' : 'Production Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมการผลิต' : 'Production Overview'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งผลิต' : 'Work Orders'}</div>
            <div className="text-2xl font-bold text-blue-600">{workOrders.length}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'กำลังผลิต' : 'In Progress'}</div>
            <div className="text-2xl font-bold text-orange-600">{inProgressWOs}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'เสร็จแล้ว' : 'Completed'}</div>
            <div className="text-2xl font-bold text-green-600">{completedWOs}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'วัตถุดิบใกล้หมด' : 'Low Stock'}</div>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentCalendar department="production" workOrders={workOrders} deliveries={deliveries} leaves={[]} lang={lang} />
          
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                  <Factory className="w-5 h-5 text-orange-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'ใบสั่งผลิตใหม่' : 'New WO'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'ตรวจสอบสต็อก' : 'Check Stock'}</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Transport-specific dashboard
  if (userRole === 'transport') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ดขนส่ง' : 'Transport Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมการจัดส่ง' : 'Delivery Overview'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-cyan-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ส่งวันนี้' : 'Today'}</div>
            <div className="text-2xl font-bold text-cyan-600">{todayDeliveries}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'รอส่ง' : 'Pending'}</div>
            <div className="text-2xl font-bold text-yellow-600">{deliveries.filter(d => d.status === 'scheduled').length}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ส่งแล้ว' : 'Delivered'}</div>
            <div className="text-2xl font-bold text-green-600">{deliveries.filter(d => d.status === 'delivered').length}</div>
          </Card>
        </div>

        <DepartmentCalendar department="transport" workOrders={workOrders} deliveries={deliveries} leaves={[]} lang={lang} />
      </div>
    )
  }

  // Accounting-specific dashboard
  if (userRole === 'accounting') {
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0)
    const totalReceived = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
    const totalOutstanding = totalRevenue - totalReceived
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ดบัญชี' : 'Accounting Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมการเงิน' : 'Financial Overview'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Revenue'}</div>
                <div className="text-xl font-bold text-[#2ECC40]">{formatCurrency(totalRevenue)}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalReceived)}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ค้างชำระ' : 'Outstanding'}</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoices'}</div>
            <div className="text-2xl font-bold text-orange-600">{invoices.length}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentCalendar department="accounting" workOrders={[]} deliveries={[]} leaves={[]} lang={lang} />
          
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'New Invoice'}</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="font-medium text-gray-800">{lang === 'th' ? 'บันทึกรับเงิน' : 'Record Payment'}</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Warehouse-specific dashboard  
  if (userRole === 'warehouse') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lang === 'th' ? 'แดชบอร์ดคลังสินค้า' : 'Warehouse Dashboard'}</h1>
            <p className="text-gray-500">{lang === 'th' ? 'ภาพรวมสินค้าคงคลัง' : 'Inventory Overview'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่าคลัง' : 'Value'}</div>
                <div className="text-xl font-bold text-[#2ECC40]">{formatCurrency(totalInventoryValue)}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'ล็อตสินค้า' : 'Lots'}</div>
            <div className="text-2xl font-bold text-blue-600">{totalLots}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'สินค้าใกล้หมด' : 'Low Stock'}</div>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="text-sm text-gray-500">{lang === 'th' ? 'รอรับสินค้า' : 'Pending POs'}</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingPOs}</div>
          </Card>
        </div>

        {/* Store Cards - Warehouse sees this */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">{lang === 'th' ? 'คลังสินค้า' : 'Warehouses'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stores.map(store => {
              const storeItems = inventory.filter(i => i.store === store.id)
              const storeValue = storeItems.reduce((sum, i) => sum + (i.cost || 0), 0)
              return (
                <Card key={store.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[#1A5276] font-medium">{store.code}</span>
                    <Badge variant={store.type === 'raw_material' ? 'success' : 'info'}>{storeItems.length}</Badge>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{lang === 'th' ? store.nameTh : store.nameEn}</div>
                  <div className="font-bold text-[#2ECC40] mt-2">{formatCurrency(storeValue)}</div>
                </Card>
              )
            })}
          </div>
        </div>

        <DepartmentCalendar department="warehouse" workOrders={[]} deliveries={deliveries} leaves={[]} lang={lang} />
      </div>
    )
  }

  // Admin/Default Dashboard - Full view with everything
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

      {/* Store Cards - Admin sees all stores */}
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

      {/* Three Column Layout with Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Company Calendar */}
        <CompanyCalendar workOrders={workOrders} deliveries={deliveries} leaves={[]} lang={lang} />

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
// MAIN APP COMPONENT (Basic Version)
// ============================================
function AppBasic() {
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
  const [products, setProducts] = useState(INITIAL_PRODUCTS)

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
  
  // v7.6 Features State
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [productionView, setProductionView] = useState('tabs') // 'tabs' or 'kanban'

  // Generate notifications dynamically
  const notifications = [
    ...workOrders.filter(wo => wo.targetDate && new Date(wo.targetDate) < new Date() && wo.status !== 'completed').slice(0, 3).map(wo => ({
      id: `wo-${wo.id}`, type: 'alert', title: lang === 'th' ? 'WO เลยกำหนด' : 'WO Overdue',
      message: `${wo.woNumber || wo.id} - ${wo.productName}`, time: formatDate(wo.targetDate), action: lang === 'th' ? 'ดู' : 'View', read: false
    })),
    ...inventory.filter(item => item.quantity <= (item.minQty || 10)).slice(0, 2).map(item => ({
      id: `inv-${item.id}`, type: 'alert', title: lang === 'th' ? 'สต็อกต่ำ' : 'Low Stock',
      message: `${item.name}: ${item.quantity} ${item.unit}`, time: lang === 'th' ? '1 ชม.' : '1h ago', action: lang === 'th' ? 'สร้าง PR' : 'Create PR', read: false
    })),
  ]

  // Keyboard shortcuts for v7.6 features
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowGlobalSearch(true); setShowNotifications(false); setShowQuickActions(false) }
      if (e.key === 'q' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { e.preventDefault(); setShowQuickActions(!showQuickActions); setShowNotifications(false) }
      if (e.key === 'Escape') { setShowGlobalSearch(false); setShowNotifications(false); setShowQuickActions(false) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showQuickActions])

  // Handle search navigation
  const handleSearchNavigate = (type, item) => {
    setShowGlobalSearch(false)
    switch(type) {
      case 'customer': setActiveModule('sales'); break
      case 'workOrder': setActiveModule('production'); break
      case 'inventory': setActiveModule('inventory'); break
      case 'purchaseOrder': setActiveModule('purchase'); break
      case 'employee': setActiveModule('hr'); break
    }
  }

  // Handle quick actions
  const handleQuickAction = (actionId) => {
    switch(actionId) {
      case 'new_wo': setActiveModule('production'); break
      case 'new_so': case 'new_invoice': setActiveModule('sales'); break
      case 'new_po': setActiveModule('purchase'); break
      case 'maint_request': setActiveModule('maintenance'); break
    }
  }

  // Handle notification action
  const handleNotificationAction = (notif) => {
    if (notif.id.startsWith('wo-')) setActiveModule('production')
    else if (notif.id.startsWith('inv-')) setActiveModule('inventory')
    else if (notif.id.startsWith('maint-')) setActiveModule('maintenance')
    setShowNotifications(false)
  }

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
    { id: 'accounting', label: t('nav.accounting', lang), icon: Calculator, color: 'text-emerald-500' },
    { id: 'hr', label: t('nav.hr', lang), icon: Users, color: 'text-indigo-500' },
    { id: 'transport', label: t('nav.transport', lang), icon: Truck, color: 'text-cyan-500' },
    { id: 'maintenance', label: t('nav.maintenance', lang), icon: Wrench, color: 'text-amber-500' },
    { id: 'reports', label: t('nav.reports', lang), icon: BarChart3, color: 'text-violet-500' },
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
                  employees={employees}
                  lang={lang}
                  currentUser={currentUser}
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
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Production View Toggle */}
                  <div className="p-4 bg-white border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-bold text-gray-800">{lang === 'th' ? 'การผลิต' : 'Production'}</h2>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {workOrders.filter(wo => wo.status !== 'completed').length} {lang === 'th' ? 'งาน' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setProductionView('tabs')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          productionView === 'tabs' ? 'bg-white shadow text-[#1A5276]' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <ClipboardList className="w-4 h-4 inline mr-1" />
                        {lang === 'th' ? 'แท็บ' : 'Tabs'}
                      </button>
                      <button
                        onClick={() => setProductionView('kanban')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          productionView === 'kanban' ? 'bg-white shadow text-[#1A5276]' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Layers className="w-4 h-4 inline mr-1" />
                        Kanban
                      </button>
                    </div>
                  </div>
                  {productionView === 'kanban' ? (
                    <KanbanBoard
                      workOrders={workOrders}
                      setWorkOrders={setWorkOrders}
                      customers={customers}
                      lang={lang}
                    />
                  ) : (
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
                </div>
              )}
              {activeModule === 'sales' && (
                <SalesModuleFull
                  salesOrders={salesOrders}
                  setSalesOrders={setSalesOrders}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  customers={customers}
                  workOrders={workOrders}
                  products={products}
                  lang={lang}
                />
              )}
              {activeModule === 'hr' && (
                <HRModuleFull
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
              {activeModule === 'accounting' && (
                <AccountingModule
                  invoices={invoices}
                  purchaseOrders={purchaseOrders}
                  vendors={vendors}
                  customers={customers}
                  lang={lang}
                />
              )}
              {activeModule === 'reports' && (
                <ReportsModule
                  inventory={inventory}
                  purchaseOrders={purchaseOrders}
                  workOrders={workOrders}
                  salesOrders={salesOrders}
                  invoices={invoices}
                  categories={categories}
                  stores={stores}
                  customers={customers}
                  vendors={vendors}
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

// ============================================
// ACCOUNTING MODULE (Full)
// ============================================
const AccountingModule = ({ invoices, purchaseOrders, vendors, customers, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: lang === 'th' ? 'ภาพรวม' : 'Dashboard', icon: BarChart3 },
    { id: 'ap', label: lang === 'th' ? 'เจ้าหนี้' : 'Payables (AP)', icon: FileText },
    { id: 'ar', label: lang === 'th' ? 'ลูกหนี้' : 'Receivables (AR)', icon: Receipt },
    { id: 'journal', label: lang === 'th' ? 'สมุดรายวัน' : 'Journal', icon: BookOpen },
    { id: 'cashflow', label: lang === 'th' ? 'กระแสเงินสด' : 'Cash Flow', icon: DollarSign },
  ]

  // Calculate AP (Accounts Payable)
  const apData = purchaseOrders.map(po => {
    const vendor = vendors.find(v => v.id === po.vendorId)
    const paidAmount = po.paidAmount || 0
    const balance = (po.total || po.grandTotal || 0) - paidAmount
    const dueDate = new Date(po.poDate)
    dueDate.setDate(dueDate.getDate() + (vendor?.paymentTerms || 30))
    const today = new Date()
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
    
    return {
      ...po,
      vendorName: vendor?.name || 'Unknown',
      total: po.total || po.grandTotal || 0,
      paidAmount,
      balance,
      dueDate: dueDate.toISOString().split('T')[0],
      daysOverdue: balance > 0 ? Math.max(0, daysOverdue) : 0,
      status: balance <= 0 ? 'paid' : daysOverdue > 0 ? 'overdue' : 'pending',
    }
  }).filter(po => po.balance > 0 || po.status === 'paid')

  // Calculate AR (Accounts Receivable)
  const arData = invoices.map(inv => {
    const customer = customers.find(c => c.id === inv.customerId)
    const dueDate = new Date(inv.invoiceDate)
    dueDate.setDate(dueDate.getDate() + (customer?.paymentTerms || 30))
    const today = new Date()
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
    
    return {
      ...inv,
      customerName: customer?.name || 'Unknown',
      dueDate: dueDate.toISOString().split('T')[0],
      daysOverdue: inv.balance > 0 ? Math.max(0, daysOverdue) : 0,
      status: inv.balance <= 0 ? 'paid' : daysOverdue > 0 ? 'overdue' : 'pending',
    }
  })

  // Aging buckets
  const getAgingBuckets = (data, balanceField = 'balance') => {
    return {
      current: data.filter(d => d.daysOverdue === 0 && d[balanceField] > 0).reduce((sum, d) => sum + d[balanceField], 0),
      days1to30: data.filter(d => d.daysOverdue > 0 && d.daysOverdue <= 30).reduce((sum, d) => sum + d[balanceField], 0),
      days31to60: data.filter(d => d.daysOverdue > 30 && d.daysOverdue <= 60).reduce((sum, d) => sum + d[balanceField], 0),
      days61to90: data.filter(d => d.daysOverdue > 60 && d.daysOverdue <= 90).reduce((sum, d) => sum + d[balanceField], 0),
      over90: data.filter(d => d.daysOverdue > 90).reduce((sum, d) => sum + d[balanceField], 0),
    }
  }

  const apAging = getAgingBuckets(apData)
  const arAging = getAgingBuckets(arData)

  const totalAP = apData.reduce((sum, d) => sum + d.balance, 0)
  const totalAR = arData.reduce((sum, d) => sum + d.balance, 0)

  // Mock journal entries
  const journalEntries = [
    { id: 'JE-001', date: '2025-01-28', description: 'Purchase - MLH Wood from KBB', debit: 'Inventory', credit: 'AP', amount: 245000 },
    { id: 'JE-002', date: '2025-01-27', description: 'Sales Invoice INV-2501-001', debit: 'AR', credit: 'Revenue', amount: 185000 },
    { id: 'JE-003', date: '2025-01-26', description: 'Payment to KBB Enterprise', debit: 'AP', credit: 'Cash', amount: 150000 },
    { id: 'JE-004', date: '2025-01-25', description: 'Receipt from Seagate', debit: 'Cash', credit: 'AR', amount: 320000 },
    { id: 'JE-005', date: '2025-01-24', description: 'Payroll - January', debit: 'Wage Expense', credit: 'Cash', amount: 485000 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.accounting', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการบัญชีและการเงิน' : 'Manage accounting and finance'}</p>
        </div>
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
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'เจ้าหนี้รวม (AP)' : 'Total Payables'}</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalAP)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ลูกหนี้รวม (AR)' : 'Total Receivables'}</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAR)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'สถานะสุทธิ' : 'Net Position'}</div>
              <div className={`text-2xl font-bold ${totalAR - totalAP >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalAR - totalAP)}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'เกินกำหนด' : 'Overdue'}</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(apAging.days1to30 + apAging.days31to60 + apAging.days61to90 + apAging.over90 + arAging.days1to30 + arAging.days31to60 + arAging.days61to90 + arAging.over90)}
              </div>
            </Card>
          </div>

          {/* Aging Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AP Aging */}
            <Card className="p-5">
              <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'อายุเจ้าหนี้ (AP Aging)' : 'AP Aging'}</h3>
              <div className="space-y-3">
                {[
                  { label: lang === 'th' ? 'ยังไม่ถึงกำหนด' : 'Current', value: apAging.current, color: 'bg-green-500' },
                  { label: '1-30 ' + (lang === 'th' ? 'วัน' : 'days'), value: apAging.days1to30, color: 'bg-yellow-500' },
                  { label: '31-60 ' + (lang === 'th' ? 'วัน' : 'days'), value: apAging.days31to60, color: 'bg-orange-500' },
                  { label: '61-90 ' + (lang === 'th' ? 'วัน' : 'days'), value: apAging.days61to90, color: 'bg-red-400' },
                  { label: '90+ ' + (lang === 'th' ? 'วัน' : 'days'), value: apAging.over90, color: 'bg-red-600' },
                ].map(bucket => (
                  <div key={bucket.label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bucket.color}`} />
                    <div className="flex-1 text-sm text-gray-600">{bucket.label}</div>
                    <div className="font-medium">{formatCurrency(bucket.value)}</div>
                  </div>
                ))}
                <div className="pt-3 border-t flex justify-between font-bold">
                  <span>{lang === 'th' ? 'รวม' : 'Total'}</span>
                  <span className="text-red-600">{formatCurrency(totalAP)}</span>
                </div>
              </div>
            </Card>

            {/* AR Aging */}
            <Card className="p-5">
              <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'อายุลูกหนี้ (AR Aging)' : 'AR Aging'}</h3>
              <div className="space-y-3">
                {[
                  { label: lang === 'th' ? 'ยังไม่ถึงกำหนด' : 'Current', value: arAging.current, color: 'bg-green-500' },
                  { label: '1-30 ' + (lang === 'th' ? 'วัน' : 'days'), value: arAging.days1to30, color: 'bg-yellow-500' },
                  { label: '31-60 ' + (lang === 'th' ? 'วัน' : 'days'), value: arAging.days31to60, color: 'bg-orange-500' },
                  { label: '61-90 ' + (lang === 'th' ? 'วัน' : 'days'), value: arAging.days61to90, color: 'bg-red-400' },
                  { label: '90+ ' + (lang === 'th' ? 'วัน' : 'days'), value: arAging.over90, color: 'bg-red-600' },
                ].map(bucket => (
                  <div key={bucket.label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bucket.color}`} />
                    <div className="flex-1 text-sm text-gray-600">{bucket.label}</div>
                    <div className="font-medium">{formatCurrency(bucket.value)}</div>
                  </div>
                ))}
                <div className="pt-3 border-t flex justify-between font-bold">
                  <span>{lang === 'th' ? 'รวม' : 'Total'}</span>
                  <span className="text-green-600">{formatCurrency(totalAR)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Accounts Payable */}
      {activeTab === 'ap' && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <h3 className="font-bold text-red-800">{lang === 'th' ? 'รายการเจ้าหนี้' : 'Accounts Payable'}</h3>
            <p className="text-sm text-red-600">{lang === 'th' ? 'ยอดค้างชำระผู้ขาย' : 'Outstanding vendor balances'}</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่ PO' : 'PO #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันครบกำหนด' : 'Due Date'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ชำระแล้ว' : 'Paid'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Balance'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{item.id}</td>
                  <td className="px-4 py-3">{item.vendorName}</td>
                  <td className="px-4 py-3">
                    {formatDate(item.dueDate)}
                    {item.daysOverdue > 0 && (
                      <div className="text-xs text-red-500">{item.daysOverdue} {lang === 'th' ? 'วันเกิน' : 'days over'}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.total)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(item.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(item.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={item.status === 'paid' ? 'success' : item.status === 'overdue' ? 'danger' : 'warning'}>
                      {item.status === 'paid' ? (lang === 'th' ? 'ชำระแล้ว' : 'Paid') : 
                       item.status === 'overdue' ? (lang === 'th' ? 'เกินกำหนด' : 'Overdue') : 
                       (lang === 'th' ? 'รอชำระ' : 'Pending')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Accounts Receivable */}
      {activeTab === 'ar' && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-100">
            <h3 className="font-bold text-green-800">{lang === 'th' ? 'รายการลูกหนี้' : 'Accounts Receivable'}</h3>
            <p className="text-sm text-green-600">{lang === 'th' ? 'ยอดค้างรับจากลูกค้า' : 'Outstanding customer balances'}</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่ใบแจ้งหนี้' : 'Invoice #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันครบกำหนด' : 'Due Date'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รับแล้ว' : 'Received'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Balance'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {arData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{item.id}</td>
                  <td className="px-4 py-3">{item.customerName}</td>
                  <td className="px-4 py-3">
                    {formatDate(item.dueDate)}
                    {item.daysOverdue > 0 && (
                      <div className="text-xs text-red-500">{item.daysOverdue} {lang === 'th' ? 'วันเกิน' : 'days over'}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.grandTotal)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(item.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-600">{formatCurrency(item.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={item.status === 'paid' ? 'success' : item.status === 'overdue' ? 'danger' : 'warning'}>
                      {item.status === 'paid' ? (lang === 'th' ? 'รับแล้ว' : 'Paid') : 
                       item.status === 'overdue' ? (lang === 'th' ? 'เกินกำหนด' : 'Overdue') : 
                       (lang === 'th' ? 'รอรับ' : 'Pending')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Journal Entries */}
      {activeTab === 'journal' && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-800">{lang === 'th' ? 'สมุดรายวันทั่วไป' : 'General Journal'}</h3>
              <p className="text-sm text-blue-600">{lang === 'th' ? 'รายการบันทึกบัญชี' : 'Accounting entries'}</p>
            </div>
            <Button icon={Plus} size="sm">{lang === 'th' ? 'บันทึกรายการ' : 'New Entry'}</Button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Entry #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รายละเอียด' : 'Description'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เดบิต' : 'Debit'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เครดิต' : 'Credit'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {journalEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{entry.id}</td>
                  <td className="px-4 py-3">{formatDate(entry.date)}</td>
                  <td className="px-4 py-3">{entry.description}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{entry.debit}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="success">{entry.credit}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(entry.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Cash Flow */}
      {activeTab === 'cashflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'เงินเข้า' : 'Cash In'}</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">{lang === 'th' ? 'รับชำระจากลูกค้า' : 'Customer Receipts'}</span>
                <span className="font-bold text-green-700">{formatCurrency(320000)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">{lang === 'th' ? 'รายได้อื่น' : 'Other Income'}</span>
                <span className="font-bold text-green-700">{formatCurrency(15000)}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-lg">
                <span>{lang === 'th' ? 'รวมเงินเข้า' : 'Total In'}</span>
                <span className="text-green-600">{formatCurrency(335000)}</span>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'เงินออก' : 'Cash Out'}</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">{lang === 'th' ? 'ชำระผู้ขาย' : 'Vendor Payments'}</span>
                <span className="font-bold text-red-700">{formatCurrency(150000)}</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">{lang === 'th' ? 'เงินเดือน' : 'Payroll'}</span>
                <span className="font-bold text-red-700">{formatCurrency(485000)}</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">{lang === 'th' ? 'ค่าใช้จ่ายอื่น' : 'Other Expenses'}</span>
                <span className="font-bold text-red-700">{formatCurrency(45000)}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-lg">
                <span>{lang === 'th' ? 'รวมเงินออก' : 'Total Out'}</span>
                <span className="text-red-600">{formatCurrency(680000)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ============================================
// REPORTS MODULE (Full)
// ============================================
const ReportsModule = ({ inventory, purchaseOrders, workOrders, salesOrders, invoices, categories, stores, customers, vendors, employees, lang }) => {
  const [activeReport, setActiveReport] = useState('inventory')
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-01-31' })

  const reports = [
    { id: 'inventory', label: lang === 'th' ? 'รายงานสินค้าคงคลัง' : 'Inventory Report', icon: Package },
    { id: 'purchase', label: lang === 'th' ? 'รายงานการจัดซื้อ' : 'Purchase Report', icon: ShoppingCart },
    { id: 'production', label: lang === 'th' ? 'รายงานการผลิต' : 'Production Report', icon: Factory },
    { id: 'sales', label: lang === 'th' ? 'รายงานการขาย' : 'Sales Report', icon: Receipt },
    { id: 'profitability', label: lang === 'th' ? 'รายงานกำไร' : 'Profitability Report', icon: TrendingUp },
    { id: 'payroll', label: lang === 'th' ? 'รายงานเงินเดือน' : 'Payroll Report', icon: Users },
  ]

  // Calculate inventory by store
  const inventoryByStore = stores.map(store => {
    const items = inventory.filter(i => i.store === store.id)
    return {
      store: store.code,
      storeName: lang === 'th' ? store.nameTh : store.nameEn,
      items: items.length,
      qty: items.reduce((sum, i) => sum + i.qty, 0),
      cbm: items.reduce((sum, i) => sum + (i.cbm || 0), 0),
      value: items.reduce((sum, i) => sum + (i.cost || 0), 0),
    }
  })

  // Calculate inventory by category
  const inventoryByCategory = categories.filter(c => c.type === 'raw_material').map(cat => {
    const items = inventory.filter(i => i.category === cat.id)
    return {
      category: cat.code,
      categoryName: lang === 'th' ? cat.nameTh : cat.nameEn,
      color: cat.color,
      items: items.length,
      qty: items.reduce((sum, i) => sum + i.qty, 0),
      cbm: items.reduce((sum, i) => sum + (i.cbm || 0), 0),
      value: items.reduce((sum, i) => sum + (i.cost || 0), 0),
    }
  })

  // Purchase summary
  const purchaseSummary = {
    totalPOs: purchaseOrders.length,
    localPOs: purchaseOrders.filter(po => po.type === 'local').length,
    importPOs: purchaseOrders.filter(po => po.type === 'import').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + (po.total || po.grandTotal || 0), 0),
    importCosts: purchaseOrders.reduce((sum, po) => sum + (po.totalImportCosts || 0), 0),
    pending: purchaseOrders.filter(po => po.status === 'pending').length,
    received: purchaseOrders.filter(po => po.status === 'received').length,
  }

  // Production summary
  const productionSummary = {
    totalWOs: workOrders.length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
    inProgress: workOrders.filter(wo => wo.status === 'in_progress').length,
    totalRevenue: workOrders.reduce((sum, wo) => sum + (wo.totalRevenue || 0), 0),
    totalCost: workOrders.reduce((sum, wo) => sum + (wo.costs?.total || 0), 0),
    totalProfit: workOrders.reduce((sum, wo) => sum + (wo.totalRevenue || 0), 0) - workOrders.reduce((sum, wo) => sum + (wo.costs?.total || 0), 0),
  }

  // Sales summary
  const salesSummary = {
    totalOrders: salesOrders.length,
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0),
    totalReceived: invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0),
    outstanding: invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0),
  }

  // Payroll summary
  const payrollSummary = {
    totalEmployees: employees.length,
    fullTime: employees.filter(e => e.type === 'FT').length,
    partTime: employees.filter(e => e.type === 'PT').length,
    totalSalary: employees.reduce((sum, e) => sum + (e.salary || 0), 0),
    totalGross: employees.reduce((sum, e) => sum + (e.salary || 0) + (e.positionInc || 0) + (e.diligenceInc || 0) + (e.phoneAllowance || 0), 0),
    totalSSO: employees.filter(e => e.type === 'FT').reduce((sum, e) => sum + Math.min(((e.salary || 0) + (e.positionInc || 0)) * 0.05, 750), 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.reports', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'รายงานและการวิเคราะห์' : 'Reports and Analytics'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">{lang === 'th' ? 'จาก' : 'From'}</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">{lang === 'th' ? 'ถึง' : 'To'}</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <Button variant="outline" icon={Download}>
            {lang === 'th' ? 'ส่งออก' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="flex flex-wrap gap-2">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeReport === report.id
                ? 'bg-[#1A5276] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <report.icon className="w-4 h-4" />
            {report.label}
          </button>
        ))}
      </div>

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'จำนวนล็อต' : 'Total Lots'}</div>
              <div className="text-2xl font-bold text-gray-800">{inventory.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'จำนวนรวม' : 'Total Qty'}</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(inventory.reduce((sum, i) => sum + i.qty, 0))}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ปริมาตรรวม' : 'Total CBM'}</div>
              <div className="text-2xl font-bold text-blue-600">{inventory.reduce((sum, i) => sum + (i.cbm || 0), 0).toFixed(2)} m³</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
              <div className="text-2xl font-bold text-[#2ECC40]">{formatCurrency(inventory.reduce((sum, i) => sum + (i.cost || 0), 0))}</div>
            </Card>
          </div>

          {/* By Store */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'สินค้าคงคลังตามคลัง (6 คลัง)' : 'Inventory by Store (6 Stores)'}</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'คลัง' : 'Store'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รายการ' : 'Items'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">CBM</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventoryByStore.map(row => (
                  <tr key={row.store} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-mono text-[#1A5276]">{row.store}</div>
                      <div className="text-sm text-gray-500">{row.storeName}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{row.items}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.qty)}</td>
                    <td className="px-4 py-3 text-right">{row.cbm.toFixed(3)}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#2ECC40]">{formatCurrency(row.value)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-bold">
                <tr>
                  <td className="px-4 py-3">{lang === 'th' ? 'รวม' : 'Total'}</td>
                  <td className="px-4 py-3 text-right">{inventoryByStore.reduce((sum, r) => sum + r.items, 0)}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(inventoryByStore.reduce((sum, r) => sum + r.qty, 0))}</td>
                  <td className="px-4 py-3 text-right">{inventoryByStore.reduce((sum, r) => sum + r.cbm, 0).toFixed(3)}</td>
                  <td className="px-4 py-3 text-right text-[#2ECC40]">{formatCurrency(inventoryByStore.reduce((sum, r) => sum + r.value, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          {/* By Category */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'สินค้าคงคลังตามหมวดหมู่ (8 ประเภทไม้)' : 'Inventory by Category (8 Wood Types)'}</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รายการ' : 'Items'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">CBM</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventoryByCategory.map(row => (
                  <tr key={row.category} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                        <span className="font-mono" style={{ color: row.color }}>{row.category}</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-5">{row.categoryName}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{row.items}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.qty)}</td>
                    <td className="px-4 py-3 text-right">{row.cbm.toFixed(3)}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#2ECC40]">{formatCurrency(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Purchase Report */}
      {activeReport === 'purchase' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งซื้อทั้งหมด' : 'Total POs'}</div>
              <div className="text-2xl font-bold text-gray-800">{purchaseSummary.totalPOs}</div>
              <div className="text-xs text-gray-400 mt-1">
                🏠 {purchaseSummary.localPOs} {lang === 'th' ? 'ในประเทศ' : 'Local'} | 🚢 {purchaseSummary.importPOs} {lang === 'th' ? 'นำเข้า' : 'Import'}
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(purchaseSummary.totalValue)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ค่านำเข้ารวม' : 'Import Costs'}</div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(purchaseSummary.importCosts)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'สถานะ' : 'Status'}</div>
              <div className="text-sm mt-1">
                <span className="text-yellow-600">⏳ {purchaseSummary.pending} {lang === 'th' ? 'รอ' : 'Pending'}</span>
                <span className="mx-2">|</span>
                <span className="text-green-600">✓ {purchaseSummary.received} {lang === 'th' ? 'รับแล้ว' : 'Received'}</span>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'รายการใบสั่งซื้อ' : 'Purchase Order List'}</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'PO #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Materials'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่านำเข้า' : 'Import'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รวม' : 'Total'}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchaseOrders.map(po => {
                  const vendor = vendors.find(v => v.id === po.vendorId)
                  return (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{po.id}</td>
                      <td className="px-4 py-3">{vendor?.name || po.vendorId}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={po.type === 'import' ? 'info' : 'success'}>
                          {po.type === 'import' ? '🚢' : '🏠'} {po.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">{formatCurrency(po.subtotal || 0)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(po.totalImportCosts || 0)}</td>
                      <td className="px-4 py-3 text-right font-bold">{formatCurrency(po.total || po.grandTotal || 0)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={po.status === 'received' ? 'success' : 'warning'}>{po.status}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Production Report */}
      {activeReport === 'production' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งผลิตทั้งหมด' : 'Total WOs'}</div>
              <div className="text-2xl font-bold text-gray-800">{productionSummary.totalWOs}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Total Revenue'}</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(productionSummary.totalRevenue)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ต้นทุนรวม' : 'Total Cost'}</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(productionSummary.totalCost)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'กำไรรวม' : 'Total Profit'}</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(productionSummary.totalProfit)}</div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'รายการใบสั่งผลิต' : 'Work Order List'}</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'WO #'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ต้นทุน' : 'Cost'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รายได้' : 'Revenue'}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'กำไร' : 'Margin'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {workOrders.map(wo => {
                  const customer = customers.find(c => c.id === wo.customerId)
                  const profit = (wo.totalRevenue || 0) - (wo.costs?.total || 0)
                  const margin = wo.totalRevenue > 0 ? (profit / wo.totalRevenue * 100) : 0
                  return (
                    <tr key={wo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[#1A5276]">{wo.id}</td>
                      <td className="px-4 py-3">{wo.productName}</td>
                      <td className="px-4 py-3">{customer?.name || wo.customerId}</td>
                      <td className="px-4 py-3 text-right">{wo.quantity}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(wo.costs?.total || 0)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(wo.totalRevenue || 0)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${margin >= 20 ? 'text-green-600' : margin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งขาย' : 'Sales Orders'}</div>
              <div className="text-2xl font-bold text-gray-800">{salesSummary.totalOrders}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Total Revenue'}</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(salesSummary.totalRevenue)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'รับแล้ว' : 'Received'}</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(salesSummary.totalReceived)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ค้างชำระ' : 'Outstanding'}</div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(salesSummary.outstanding)}</div>
            </Card>
          </div>
        </div>
      )}

      {/* Profitability Report */}
      {activeReport === 'profitability' && (
        <ProductionCosting workOrders={workOrders} customers={customers} lang={lang} />
      )}

      {/* Payroll Report */}
      {activeReport === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'พนักงานทั้งหมด' : 'Total Employees'}</div>
              <div className="text-2xl font-bold text-gray-800">{payrollSummary.totalEmployees}</div>
              <div className="text-xs text-gray-400 mt-1">FT: {payrollSummary.fullTime} | PT: {payrollSummary.partTime}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'เงินเดือนรวม' : 'Total Salary'}</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(payrollSummary.totalSalary)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม (Gross)' : 'Total Gross'}</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(payrollSummary.totalGross)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'ประกันสังคมรวม' : 'Total SSO'}</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(payrollSummary.totalSSO)}</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SALES ORDER FORM
// ============================================
const SalesOrderForm = ({ so, customers, products, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    customerId: so?.customerId || '',
    customerPO: so?.customerPO || '',
    orderDate: so?.orderDate || new Date().toISOString().split('T')[0],
    deliveryDate: so?.deliveryDate || '',
    items: so?.items || [{ id: 1, productName: '', qty: 0, unit: 'pcs', unitPrice: 0 }],
    notes: so?.notes || '',
    entity: so?.entity || 'IND',
  })

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: prev.items.length + 1, productName: '', qty: 0, unit: 'pcs', unitPrice: 0 }]
    }))
  }

  const updateItem = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }))
  }

  const removeItem = (idx) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== idx)
      }))
    }
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0)
  const vat = subtotal * 0.07
  const grandTotal = subtotal + vat

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      subtotal,
      vat,
      grandTotal,
      status: 'confirmed',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer & PO */}
      <div className="grid grid-cols-3 gap-4">
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
            {lang === 'th' ? 'PO ลูกค้า' : 'Customer PO #'}
          </label>
          <input
            type="text"
            value={formData.customerPO}
            onChange={(e) => setFormData({ ...formData, customerPO: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g., PO25001234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'นิติบุคคล' : 'Entity'}
          </label>
          <select
            value={formData.entity}
            onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="IND">IND Thai Packwell</option>
            <option value="IND2">IND-2 Thai Packwell</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันที่สั่งซื้อ *' : 'Order Date *'}
          </label>
          <input
            type="date"
            required
            value={formData.orderDate}
            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
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
                <th className="px-3 py-2 text-left">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
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
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Pallet 1100x950x950"
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
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    >
                      <option value="pcs">pcs</option>
                      <option value="sets">sets</option>
                      <option value="pallets">pallets</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-28 px-2 py-1 border rounded text-sm text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatCurrency(item.qty * item.unitPrice)}
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

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {lang === 'th' ? 'หมายเหตุ' : 'Notes'}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Subtotal'}</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT 7%</span>
              <span className="font-medium">{formatCurrency(vat)}</span>
            </div>
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
// INVOICE VIEW (For printing)
// ============================================
const InvoiceView = ({ invoice, customer, entity, lang }) => {
  const printRef = useRef()

  const handlePrint = () => {
    const content = printRef.current
    const printWindow = window.open('', '_blank')
    printWindow.document.write('<html><head><title>Invoice ' + invoice.id + '</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }
      body { padding: 15mm; }
      .invoice { max-width: 210mm; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
      .logo-container { display: flex; align-items: center; gap: 15px; }
      .logo img { width: 80px; height: auto; }
      .company-info { font-size: 9pt; line-height: 1.4; }
      .company-name { font-size: 14pt; font-weight: bold; color: #1A5276; }
      .company-name-th { font-size: 12pt; color: #333; }
      .invoice-header { text-align: right; }
      .invoice-title { font-size: 20pt; font-weight: bold; color: #1A5276; border: 2px solid #1A5276; padding: 5px 15px; display: inline-block; }
      .invoice-title-th { font-size: 14pt; color: #1A5276; }
      .invoice-number { font-size: 14pt; font-weight: bold; margin-top: 10px; }
      .divider { border-bottom: 2px solid #1A5276; margin: 15px 0; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
      .info-box { border: 1px solid #ddd; padding: 10px; }
      .info-label { font-size: 9pt; color: #666; margin-bottom: 3px; }
      .info-value { font-size: 11pt; font-weight: 500; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th { background: #1A5276; color: white; padding: 8px; text-align: left; font-size: 10pt; }
      th.text-right { text-align: right; }
      td { padding: 8px; border-bottom: 1px solid #eee; font-size: 10pt; }
      .text-right { text-align: right; }
      .totals-container { display: flex; justify-content: flex-end; }
      .totals { width: 250px; }
      .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
      .total-row.grand { border-top: 2px solid #1A5276; padding-top: 10px; margin-top: 5px; }
      .grand-total { font-size: 16pt; font-weight: bold; color: #2ECC40; }
      .qr-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
      .qr-code { width: 80px; height: 80px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 8pt; color: #999; }
      .signature-line { width: 150px; border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; text-align: center; font-size: 9pt; }
      .footer { margin-top: 20px; font-size: 8pt; color: #666; text-align: center; }
    `)
    printWindow.document.write('</style></head><body>')
    printWindow.document.write(content.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const companyInfo = COMPANY_ENTITIES.find(e => e.id === (entity || 'IND'))
  const invoiceDate = new Date(invoice.invoiceDate)
  const dueDate = new Date(invoiceDate.getTime() + (customer?.paymentTerms || 30) * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-4">
      <div ref={printRef} className="invoice bg-white p-6 border rounded-lg shadow-sm">
        {/* Header with Logo */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <img src={IND_LOGO_SVG} alt="IND" className="w-20 h-20" />
            <div className="text-sm">
              <div className="text-lg font-bold text-[#1A5276]">{companyInfo?.name || 'IND Thai Packwell Industries Co., Ltd.'}</div>
              <div className="text-[#1A5276]">{lang === 'th' ? 'บริษัท อินด์ ไทย แพ็คเวลล์ อินดัสตรีส์ จำกัด' : ''}</div>
              <div className="text-gray-600 mt-1">{companyInfo?.address}</div>
              <div className="text-gray-600">Tel: {companyInfo?.phone || '02-XXX-XXXX'} | Fax: {companyInfo?.fax || '02-XXX-XXXX'}</div>
              <div className="text-gray-600">{lang === 'th' ? 'เลขประจำตัวผู้เสียภาษี' : 'Tax ID'}: {companyInfo?.taxId}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block border-2 border-[#1A5276] px-4 py-2">
              <div className="text-xl font-bold text-[#1A5276]">{lang === 'th' ? 'ใบแจ้งหนี้/ใบกำกับภาษี' : 'TAX INVOICE'}</div>
              <div className="text-sm text-[#1A5276]">{lang !== 'th' ? 'ใบแจ้งหนี้/ใบกำกับภาษี' : 'TAX INVOICE'}</div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-500">{lang === 'th' ? 'เลขที่' : 'No.'}</div>
              <div className="text-lg font-bold font-mono">{invoice.id}</div>
            </div>
          </div>
        </div>

        <div className="border-b-2 border-[#1A5276] mb-4" />

        {/* Customer & Invoice Info */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500 mb-1">{lang === 'th' ? 'ลูกค้า / Customer' : 'Bill To / Customer'}</div>
            <div className="font-bold text-lg">{customer?.name}</div>
            <div className="text-sm text-gray-600">{customer?.address}</div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="text-gray-500">{lang === 'th' ? 'เลขประจำตัวผู้เสียภาษี:' : 'Tax ID:'}</span> {customer?.taxId || '-'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="text-gray-500">{lang === 'th' ? 'สาขา:' : 'Branch:'}</span> {customer?.branch || lang === 'th' ? 'สำนักงานใหญ่' : 'Head Office'}
            </div>
          </div>
          <div className="border rounded p-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">{lang === 'th' ? 'วันที่:' : 'Date:'}</div>
              <div className="font-medium">{formatDate(invoice.invoiceDate)}</div>
              
              <div className="text-gray-500">{lang === 'th' ? 'ครบกำหนด:' : 'Due Date:'}</div>
              <div className="font-medium">{formatDate(dueDate.toISOString().split('T')[0])}</div>
              
              <div className="text-gray-500">{lang === 'th' ? 'PO ลูกค้า:' : 'Customer PO:'}</div>
              <div className="font-medium">{invoice.customerPO || '-'}</div>
              
              <div className="text-gray-500">{lang === 'th' ? 'ใบสั่งขาย:' : 'Sales Order:'}</div>
              <div className="font-medium">{invoice.soId || '-'}</div>
              
              <div className="text-gray-500">{lang === 'th' ? 'เงื่อนไขชำระ:' : 'Credit Terms:'}</div>
              <div className="font-medium">{customer?.paymentTerms || 30} {lang === 'th' ? 'วัน' : 'Days'}</div>
              
              <div className="text-gray-500">{lang === 'th' ? 'พนักงานขาย:' : 'Salesperson:'}</div>
              <div className="font-medium">{invoice.salesperson || '-'}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-[#1A5276] text-white">
              <th className="px-3 py-2 text-left w-12">{lang === 'th' ? 'ลำดับ' : 'No.'}</th>
              <th className="px-3 py-2 text-left">{lang === 'th' ? 'รายละเอียดสินค้า' : 'Description'}</th>
              <th className="px-3 py-2 text-right w-24">{lang === 'th' ? 'จำนวน' : 'Qty'}</th>
              <th className="px-3 py-2 text-right w-20">{lang === 'th' ? 'หน่วย' : 'Unit'}</th>
              <th className="px-3 py-2 text-right w-28">{lang === 'th' ? 'ราคา/หน่วย' : 'Unit Price'}</th>
              <th className="px-3 py-2 text-right w-32">{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-3 py-2 text-center">{idx + 1}</td>
                <td className="px-3 py-2">
                  <div>{item.productName || item.description}</div>
                  {item.lotNo && <div className="text-xs text-gray-500">Lot: {item.lotNo}</div>}
                </td>
                <td className="px-3 py-2 text-right">{item.qty?.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{item.unit || 'pcs'}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(item.qty * item.unitPrice)}</td>
              </tr>
            ))}
            {/* Empty rows for minimum 5 lines */}
            {Array.from({ length: Math.max(0, 5 - (invoice.items || []).length) }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="border-b h-10">
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & QR Code Section */}
        <div className="flex justify-between items-end">
          {/* Thai Amount in Words */}
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">{lang === 'th' ? 'จำนวนเงินรวม (ตัวอักษร)' : 'Amount in Words'}</div>
            <div className="border rounded p-2 bg-gray-50 text-sm min-h-[40px]">
              {/* Amount in Thai words would go here */}
              {lang === 'th' ? `(${formatCurrency(invoice.grandTotal)})` : `${formatCurrency(invoice.grandTotal)} THB`}
            </div>
          </div>
          
          {/* Totals */}
          <div className="w-72 ml-4">
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">{lang === 'th' ? 'รวมเงิน' : 'Subtotal'}</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-600">{lang === 'th' ? 'ส่วนลด' : 'Discount'}</span>
                <span className="font-medium text-red-600">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">{lang === 'th' ? 'ราคาก่อน VAT' : 'Before VAT'}</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal - (invoice.discount || 0))}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-600">{lang === 'th' ? 'ภาษีมูลค่าเพิ่ม' : 'VAT'} 7%</span>
              <span className="font-medium">{formatCurrency(invoice.vat)}</span>
            </div>
            <div className="flex justify-between py-2 bg-gray-100 px-2 rounded mt-1">
              <span className="font-bold text-[#1A5276]">{lang === 'th' ? 'รวมทั้งสิ้น' : 'Grand Total'}</span>
              <span className="text-xl font-bold text-[#2ECC40]">{formatCurrency(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer with QR and Signatures */}
        <div className="flex justify-between items-end mt-6 pt-4 border-t">
          {/* QR Code */}
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
              QR Code
            </div>
            <div className="text-xs text-gray-500 mt-1">{lang === 'th' ? 'สแกนชำระเงิน' : 'Scan to Pay'}</div>
          </div>

          {/* Signature Lines */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="w-32 border-t border-gray-400 mt-10" />
              <div className="text-xs text-gray-500 mt-1">{lang === 'th' ? 'ผู้รับสินค้า' : 'Received By'}</div>
              <div className="text-xs text-gray-400">{lang === 'th' ? 'วันที่ ____/____/____' : 'Date ____/____/____'}</div>
            </div>
            <div className="text-center">
              <div className="w-32 border-t border-gray-400 mt-10" />
              <div className="text-xs text-gray-500 mt-1">{lang === 'th' ? 'ผู้มีอำนาจลงนาม' : 'Authorized Signature'}</div>
              <div className="text-xs text-gray-400">{companyInfo?.name?.split(' ')[0] || 'IND'}</div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="text-center text-xs text-gray-400 mt-4 pt-2 border-t">
          {lang === 'th' ? 'เอกสารนี้ออกโดยระบบคอมพิวเตอร์' : 'This document is computer generated'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" icon={Download}>
          {lang === 'th' ? 'ดาวน์โหลด PDF' : 'Download PDF'}
        </Button>
        <Button icon={Printer} onClick={handlePrint}>
          {lang === 'th' ? 'พิมพ์' : 'Print'}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// PAYMENT TRACKER
// ============================================
const PaymentTracker = ({ invoices, setInvoices, customers, lang }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [paymentRef, setPaymentRef] = useState('')

  const unpaidInvoices = invoices.filter(inv => inv.balance > 0)
  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + inv.balance, 0)

  const handleRecordPayment = () => {
    if (!selectedInvoice || paymentAmount <= 0) return

    setInvoices(invoices.map(inv => {
      if (inv.id !== selectedInvoice.id) return inv
      const newPaid = (inv.paidAmount || 0) + paymentAmount
      const newBalance = inv.grandTotal - newPaid
      return {
        ...inv,
        paidAmount: newPaid,
        balance: newBalance,
        status: newBalance <= 0 ? 'paid' : 'partial',
        payments: [...(inv.payments || []), {
          id: Date.now(),
          amount: paymentAmount,
          date: paymentDate,
          method: paymentMethod,
          ref: paymentRef,
        }]
      }
    }))

    setShowPaymentModal(false)
    setSelectedInvoice(null)
    setPaymentAmount(0)
    setPaymentRef('')
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบแจ้งหนี้ค้างชำระ' : 'Unpaid Invoices'}</div>
          <div className="text-2xl font-bold text-orange-600">{unpaidInvoices.length}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ยอดค้างชำระรวม' : 'Total Outstanding'}</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รับชำระแล้ว' : 'Total Received'}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0))}</div>
        </Card>
      </div>

      {/* Unpaid Invoices List */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-orange-50 border-b border-orange-100">
          <h3 className="font-bold text-orange-800">{lang === 'th' ? 'รายการรอรับชำระ' : 'Pending Payments'}</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'Invoice #'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ยอดรวม' : 'Total'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ชำระแล้ว' : 'Paid'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Balance'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {unpaidInvoices.map(inv => {
              const customer = customers.find(c => c.id === inv.customerId)
              return (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{inv.id}</td>
                  <td className="px-4 py-3">{customer?.name}</td>
                  <td className="px-4 py-3">{formatDate(inv.invoiceDate)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(inv.grandTotal)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(inv.paidAmount || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(inv.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <Button 
                      size="sm" 
                      onClick={() => { setSelectedInvoice(inv); setPaymentAmount(inv.balance); setShowPaymentModal(true) }}
                    >
                      {lang === 'th' ? 'รับชำระ' : 'Record Payment'}
                    </Button>
                  </td>
                </tr>
              )
            })}
            {unpaidInvoices.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  {lang === 'th' ? 'ไม่มีรายการค้างชำระ' : 'No outstanding invoices'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title={lang === 'th' ? 'บันทึกการรับชำระ' : 'Record Payment'} size="md">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">{lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoice'}</div>
                  <div className="font-bold text-[#1A5276]">{selectedInvoice.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500">{lang === 'th' ? 'ยอดค้างชำระ' : 'Outstanding'}</div>
                  <div className="font-bold text-red-600">{formatCurrency(selectedInvoice.balance)}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'จำนวนเงิน *' : 'Amount *'}
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                max={selectedInvoice.balance}
                className="w-full px-3 py-2 border rounded-lg text-right text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'th' ? 'วันที่รับ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'th' ? 'วิธีชำระ' : 'Method'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="transfer">{lang === 'th' ? 'โอนเงิน' : 'Bank Transfer'}</option>
                  <option value="cash">{lang === 'th' ? 'เงินสด' : 'Cash'}</option>
                  <option value="cheque">{lang === 'th' ? 'เช็ค' : 'Cheque'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'th' ? 'เลขอ้างอิง' : 'Reference'}
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder={lang === 'th' ? 'เลขที่โอน / เลขเช็ค' : 'Transfer ref / Cheque no.'}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                {t('action.cancel', lang)}
              </Button>
              <Button icon={Save} onClick={handleRecordPayment}>
                {lang === 'th' ? 'บันทึก' : 'Save Payment'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================
// HR MODULE (Full with Payroll)
// ============================================
const HRModuleFull = ({ employees, setEmployees, lang }) => {
  const [activeTab, setActiveTab] = useState('employees')
  const [selectedMonth, setSelectedMonth] = useState('01')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const tabs = [
    { id: 'employees', label: lang === 'th' ? 'พนักงาน' : 'Employees', icon: Users },
    { id: 'payroll', label: lang === 'th' ? 'เงินเดือน' : 'Payroll', icon: DollarSign },
    { id: 'attendance', label: lang === 'th' ? 'การเข้างาน' : 'Attendance', icon: Clock },
    { id: 'leave', label: lang === 'th' ? 'ลางาน' : 'Leave', icon: Calendar },
  ]

  // Payroll calculations
  const calculatePayroll = (emp) => {
    const baseSalary = emp.salary || 0
    const positionInc = emp.positionInc || 0
    const diligenceInc = emp.diligenceInc || 0
    const phoneAllowance = emp.phoneAllowance || 0
    const otHours = emp.otHours || 0
    const otRate = (baseSalary / 30 / 8) * 1.5 // OT rate = 1.5x hourly
    const otPay = otHours * otRate
    
    const gross = baseSalary + positionInc + diligenceInc + phoneAllowance + otPay
    
    // SSO calculation (5% of salary+position, max 750)
    const ssoBase = baseSalary + positionInc
    const sso = emp.type === 'FT' ? Math.min(ssoBase * 0.05, 750) : 0
    
    // Tax calculation (simplified)
    const annualIncome = gross * 12
    let tax = 0
    if (annualIncome > 150000) {
      if (annualIncome <= 300000) tax = (annualIncome - 150000) * 0.05
      else if (annualIncome <= 500000) tax = 7500 + (annualIncome - 300000) * 0.10
      else if (annualIncome <= 750000) tax = 27500 + (annualIncome - 500000) * 0.15
      else tax = 65000 + (annualIncome - 750000) * 0.20
    }
    const monthlyTax = tax / 12

    const deductions = sso + monthlyTax
    const net = gross - deductions

    return { baseSalary, positionInc, diligenceInc, phoneAllowance, otHours, otPay, gross, sso, tax: monthlyTax, deductions, net }
  }

  const ftEmployees = employees.filter(e => e.type === 'FT')
  const ptEmployees = employees.filter(e => e.type === 'PT')

  const payrollData = employees.map(emp => ({
    ...emp,
    payroll: calculatePayroll(emp)
  }))

  const totals = {
    employees: employees.length,
    ft: ftEmployees.length,
    pt: ptEmployees.length,
    totalGross: payrollData.reduce((sum, e) => sum + e.payroll.gross, 0),
    totalSSO: payrollData.reduce((sum, e) => sum + e.payroll.sso, 0),
    totalTax: payrollData.reduce((sum, e) => sum + e.payroll.tax, 0),
    totalNet: payrollData.reduce((sum, e) => sum + e.payroll.net, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.hr', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการพนักงานและเงินเดือน' : 'Manage employees and payroll'}</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingEmployee(null); setShowEmployeeForm(true) }}>
          {lang === 'th' ? 'เพิ่มพนักงาน' : 'Add Employee'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'พนักงานทั้งหมด' : 'Total'}</div>
          <div className="text-2xl font-bold text-gray-800">{totals.employees}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ประจำ (FT)' : 'Full-time'}</div>
          <div className="text-2xl font-bold text-blue-600">{totals.ft}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'พาร์ทไทม์ (PT)' : 'Part-time'}</div>
          <div className="text-2xl font-bold text-orange-600">{totals.pt}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รายได้รวม' : 'Gross'}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalGross)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">SSO</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalSSO)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ภาษี' : 'Tax'}</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(totals.totalTax)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-cyan-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'สุทธิ' : 'Net'}</div>
          <div className="text-2xl font-bold text-cyan-600">{formatCurrency(totals.totalNet)}</div>
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รหัส' : 'ID'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'แผนก' : 'Department'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ตำแหน่ง' : 'Position'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'นิติบุคคล' : 'Entity'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[#1A5276]">{emp.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{emp.nameEn}</div>
                    <div className="text-sm text-gray-500">{emp.nameTh}</div>
                  </td>
                  <td className="px-4 py-3">{emp.department}</td>
                  <td className="px-4 py-3">{emp.position}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={emp.type === 'FT' ? 'info' : 'warning'}>{emp.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(emp.salary)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={emp.entity === 'IND' ? 'success' : 'default'}>{emp.entity}</Badge>
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
        </Card>
      )}

      {/* Payroll */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Period Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">{lang === 'th' ? 'เดือน' : 'Month'}</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">{lang === 'th' ? 'ปี' : 'Year'}</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <Button variant="outline" icon={Download}>
              {lang === 'th' ? 'ส่งออก Excel' : 'Export Excel'}
            </Button>
          </div>

          {/* Payroll Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-gray-600 sticky left-0 bg-gray-50">{lang === 'th' ? 'พนักงาน' : 'Employee'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">{lang === 'th' ? 'เงินเดือน' : 'Salary'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">{lang === 'th' ? 'ค่าตำแหน่ง' : 'Position'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">{lang === 'th' ? 'ขยัน' : 'Diligence'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">{lang === 'th' ? 'โทรศัพท์' : 'Phone'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">OT</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600 bg-blue-50">{lang === 'th' ? 'รวม (Gross)' : 'Gross'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600 bg-red-50">SSO</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600 bg-red-50">{lang === 'th' ? 'ภาษี' : 'Tax'}</th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600 bg-green-50">{lang === 'th' ? 'สุทธิ (Net)' : 'Net'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payrollData.filter(e => e.type === 'FT').map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 sticky left-0 bg-white">
                        <div className="font-medium">{emp.nameEn}</div>
                        <div className="text-xs text-gray-400">{emp.position}</div>
                      </td>
                      <td className="px-3 py-3 text-right">{formatCurrency(emp.payroll.baseSalary)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(emp.payroll.positionInc)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(emp.payroll.diligenceInc)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(emp.payroll.phoneAllowance)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(emp.payroll.otPay)}</td>
                      <td className="px-3 py-3 text-right font-bold text-blue-600 bg-blue-50">{formatCurrency(emp.payroll.gross)}</td>
                      <td className="px-3 py-3 text-right text-red-600 bg-red-50">{formatCurrency(emp.payroll.sso)}</td>
                      <td className="px-3 py-3 text-right text-red-600 bg-red-50">{formatCurrency(emp.payroll.tax)}</td>
                      <td className="px-3 py-3 text-right font-bold text-green-600 bg-green-50">{formatCurrency(emp.payroll.net)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td className="px-3 py-3 sticky left-0 bg-gray-100">{lang === 'th' ? 'รวม (FT)' : 'Total (FT)'}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(ftEmployees.reduce((s, e) => s + (e.salary || 0), 0))}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(ftEmployees.reduce((s, e) => s + (e.positionInc || 0), 0))}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(ftEmployees.reduce((s, e) => s + (e.diligenceInc || 0), 0))}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(ftEmployees.reduce((s, e) => s + (e.phoneAllowance || 0), 0))}</td>
                    <td className="px-3 py-3 text-right">-</td>
                    <td className="px-3 py-3 text-right text-blue-700 bg-blue-100">{formatCurrency(payrollData.filter(e => e.type === 'FT').reduce((s, e) => s + e.payroll.gross, 0))}</td>
                    <td className="px-3 py-3 text-right text-red-700 bg-red-100">{formatCurrency(payrollData.filter(e => e.type === 'FT').reduce((s, e) => s + e.payroll.sso, 0))}</td>
                    <td className="px-3 py-3 text-right text-red-700 bg-red-100">{formatCurrency(payrollData.filter(e => e.type === 'FT').reduce((s, e) => s + e.payroll.tax, 0))}</td>
                    <td className="px-3 py-3 text-right text-green-700 bg-green-100">{formatCurrency(payrollData.filter(e => e.type === 'FT').reduce((s, e) => s + e.payroll.net, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Attendance */}
      {activeTab === 'attendance' && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{lang === 'th' ? 'ระบบลงเวลา' : 'Time Attendance'}</h3>
          <p className="text-gray-500 mb-4">{lang === 'th' ? 'เชื่อมต่อกับเครื่องสแกนลายนิ้วมือ' : 'Integration with fingerprint scanner'}</p>
          <Badge variant="warning">{lang === 'th' ? 'กำลังพัฒนา' : 'Coming Soon'}</Badge>
        </Card>
      )}

      {/* Leave */}
      {activeTab === 'leave' && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{lang === 'th' ? 'ระบบลางาน' : 'Leave Management'}</h3>
          <p className="text-gray-500 mb-4">{lang === 'th' ? 'จัดการวันลาพักร้อน ลาป่วย ลากิจ' : 'Manage annual, sick, and personal leave'}</p>
          <Badge variant="warning">{lang === 'th' ? 'กำลังพัฒนา' : 'Coming Soon'}</Badge>
        </Card>
      )}
    </div>
  )
}

// ============================================
// ENHANCED SALES MODULE
// ============================================
const SalesModuleFull = ({ salesOrders, setSalesOrders, invoices, setInvoices, customers, workOrders, products, lang }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showSOModal, setShowSOModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

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

  const handleSOSave = (soData) => {
    const newSO = {
      id: `SO-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(salesOrders.length + 1).padStart(3, '0')}`,
      ...soData,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setSalesOrders([...salesOrders, newSO])
    setShowSOModal(false)
  }

  const handleCreateInvoice = (so) => {
    const newInvoice = {
      id: `INV-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`,
      soId: so.id,
      customerId: so.customerId,
      customerPO: so.customerPO,
      invoiceDate: new Date().toISOString().split('T')[0],
      items: so.items,
      subtotal: so.subtotal,
      vat: so.vat,
      grandTotal: so.grandTotal,
      paidAmount: 0,
      balance: so.grandTotal,
      status: 'pending',
      entity: so.entity,
    }
    setInvoices([...invoices, newInvoice])
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.sales', lang)}</h1>
          <p className="text-gray-500">{lang === 'th' ? 'จัดการการขายและใบแจ้งหนี้' : 'Manage sales and invoices'}</p>
        </div>
        <Button icon={Plus} onClick={() => setShowSOModal(true)}>
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

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'SO #'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'PO ลูกค้า' : 'Customer PO'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Value'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salesOrders.map(so => {
                const customer = customers.find(c => c.id === so.customerId)
                const hasInvoice = invoices.some(inv => inv.soId === so.id)
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
                    <td className="px-4 py-3 text-center">
                      {!hasInvoice && (
                        <Button size="sm" variant="outline" onClick={() => handleCreateInvoice(so)}>
                          {lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'Create Invoice'}
                        </Button>
                      )}
                      {hasInvoice && (
                        <Badge variant="success">{lang === 'th' ? 'ออกใบแจ้งหนี้แล้ว' : 'Invoiced'}</Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card className="overflow-hidden">
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
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
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
                    <td className="px-4 py-3 text-center">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => { setSelectedInvoice(inv); setShowInvoiceModal(true) }}
                      >
                        <Printer className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <PaymentTracker invoices={invoices} setInvoices={setInvoices} customers={customers} lang={lang} />
      )}

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
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

      {/* SO Modal */}
      {showSOModal && (
        <Modal isOpen={showSOModal} onClose={() => setShowSOModal(false)} title={lang === 'th' ? 'สร้างใบสั่งขาย' : 'New Sales Order'} size="xl">
          <SalesOrderForm
            customers={customers}
            products={products || []}
            lang={lang}
            onSave={handleSOSave}
            onCancel={() => setShowSOModal(false)}
          />
        </Modal>
      )}

      {/* Invoice View Modal */}
      {showInvoiceModal && selectedInvoice && (
        <Modal isOpen={showInvoiceModal} onClose={() => { setShowInvoiceModal(false); setSelectedInvoice(null) }} title={`${lang === 'th' ? 'ใบแจ้งหนี้' : 'Invoice'} ${selectedInvoice.id}`} size="lg">
          <InvoiceView
            invoice={selectedInvoice}
            customer={customers.find(c => c.id === selectedInvoice.customerId)}
            entity={selectedInvoice.entity}
            lang={lang}
          />
        </Modal>
      )}
    </div>
  )
}

// ============================================
// UPDATED MAIN APP WITH ALL MODULES
// ============================================
// Override the previous App component export with full version
const AppFull = () => {
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
  const [products, setProducts] = useState(INITIAL_PRODUCTS)

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

  // v7.6 Feature States
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [productionView, setProductionView] = useState('tabs') // 'tabs' or 'kanban'

  // Generate notifications from data
  const notifications = [
    ...workOrders.filter(wo => wo.targetDate && new Date(wo.targetDate) < new Date() && wo.status !== 'completed')
      .map(wo => ({ id: `wo-overdue-${wo.id}`, type: 'alert', title: lang === 'th' ? 'WO เกินกำหนด' : 'Overdue WO', message: `${wo.woNumber || wo.id} - ${wo.productName}`, time: formatDate(wo.targetDate), action: lang === 'th' ? 'ดู' : 'View' })),
    ...workOrders.filter(wo => wo.currentDept === 'QC' && !wo.labelsPrinted)
      .map(wo => ({ id: `wo-qc-${wo.id}`, type: 'task', title: lang === 'th' ? 'รอพิมพ์ฉลาก' : 'Labels Pending', message: `${wo.woNumber || wo.id} at QC`, time: 'Now', action: lang === 'th' ? 'พิมพ์' : 'Print' })),
    ...inventory.filter(item => item.quantity <= (item.minQty || 10))
      .slice(0, 3).map(item => ({ id: `inv-low-${item.id}`, type: 'alert', title: lang === 'th' ? 'สต็อกต่ำ' : 'Low Stock', message: `${item.name}: ${item.quantity} ${item.unit}`, time: 'Now' })),
    ...purchaseOrders.filter(po => po.status === 'pending' && po.totalAmount > 50000)
      .map(po => ({ id: `po-approval-${po.id}`, type: 'approval', title: lang === 'th' ? 'รออนุมัติ PO' : 'PO Pending Approval', message: `${po.poNumber} - ฿${po.totalAmount?.toLocaleString()}`, time: formatDate(po.date), action: lang === 'th' ? 'อนุมัติ' : 'Approve' })),
  ]

  // Keyboard shortcuts: Cmd+K for search, Q for quick actions, ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K for Global Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowGlobalSearch(true)
        setShowNotifications(false)
        setShowQuickActions(false)
      }
      // Q for Quick Actions (only when not in input)
      if (e.key === 'q' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        setShowQuickActions(prev => !prev)
        setShowGlobalSearch(false)
        setShowNotifications(false)
      }
      // ESC to close all
      if (e.key === 'Escape') {
        setShowGlobalSearch(false)
        setShowNotifications(false)
        setShowQuickActions(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search navigation
  const handleSearchNavigate = (type, item) => {
    setShowGlobalSearch(false)
    switch (type) {
      case 'customer': setActiveModule('sales'); break
      case 'workOrder': setActiveModule('production'); break
      case 'invoice': setActiveModule('sales'); break
      case 'inventory': setActiveModule('inventory'); break
      case 'purchaseOrder': setActiveModule('purchase'); break
      case 'employee': setActiveModule('hr'); break
    }
  }

  // Handle quick actions
  const handleQuickAction = (actionId) => {
    setShowQuickActions(false)
    switch (actionId) {
      case 'new_wo': setActiveModule('production'); break
      case 'new_so': setActiveModule('sales'); break
      case 'new_po': setActiveModule('purchase'); break
      case 'new_invoice': setActiveModule('sales'); break
      case 'maint_request': setActiveModule('maintenance'); break
    }
  }

  // Handle notification action
  const handleNotificationAction = (notif) => {
    setShowNotifications(false)
    if (notif.id.startsWith('wo-')) setActiveModule('production')
    else if (notif.id.startsWith('inv-')) setActiveModule('inventory')
    else if (notif.id.startsWith('po-')) setActiveModule('purchase')
  }

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

  // Full navigation items
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', lang), icon: Home, color: 'text-blue-500' },
    { id: 'admin', label: t('nav.admin', lang), icon: Settings, color: 'text-purple-500' },
    { id: 'inventory', label: t('nav.inventory', lang), icon: Package, color: 'text-green-500' },
    { id: 'purchase', label: t('nav.purchase', lang), icon: ShoppingCart, color: 'text-yellow-500' },
    { id: 'production', label: t('nav.production', lang), icon: Factory, color: 'text-orange-500' },
    { id: 'sales', label: t('nav.sales', lang), icon: Receipt, color: 'text-pink-500' },
    { id: 'accounting', label: t('nav.accounting', lang), icon: Calculator, color: 'text-emerald-500' },
    { id: 'hr', label: t('nav.hr', lang), icon: Users, color: 'text-indigo-500' },
    { id: 'transport', label: t('nav.transport', lang), icon: Truck, color: 'text-cyan-500' },
    { id: 'maintenance', label: t('nav.maintenance', lang), icon: Wrench, color: 'text-amber-500' },
    { id: 'reports', label: t('nav.reports', lang), icon: BarChart3, color: 'text-violet-500' },
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
            {/* Top Bar with v7.6 Features */}
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
              <div className="flex items-center gap-3">
                {/* Global Search Button */}
                <button 
                  onClick={() => setShowGlobalSearch(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline">{lang === 'th' ? 'ค้นหา' : 'Search'}</span>
                  <kbd className="hidden md:inline px-1.5 py-0.5 bg-white rounded text-xs border">⌘K</kbd>
                </button>
                
                {/* Quick Actions Button */}
                <div className="relative">
                  <button 
                    onClick={() => { setShowQuickActions(!showQuickActions); setShowNotifications(false) }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={lang === 'th' ? 'ทางลัด (Q)' : 'Quick Actions (Q)'}
                  >
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </button>
                  <QuickActionsMenu 
                    isOpen={showQuickActions} 
                    onClose={() => setShowQuickActions(false)} 
                    onAction={handleQuickAction} 
                    lang={lang} 
                  />
                </div>
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => { setShowNotifications(!showNotifications); setShowQuickActions(false) }}
                    className="p-2 hover:bg-gray-100 rounded-lg relative"
                  >
                    <Bell className="w-5 h-5 text-gray-500" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  <NotificationCenter 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)} 
                    notifications={notifications} 
                    onAction={handleNotificationAction} 
                    lang={lang} 
                  />
                </div>
                
                <LanguageSwitcher />
                <Badge variant={currentUser.entity}>{currentUser.entity}</Badge>
              </div>
            </header>
            
            {/* Global Search Modal */}
            <GlobalSearch 
              isOpen={showGlobalSearch} 
              onClose={() => setShowGlobalSearch(false)}
              customers={customers}
              workOrders={workOrders}
              salesOrders={salesOrders}
              invoices={invoices}
              inventory={inventory}
              purchaseOrders={purchaseOrders}
              employees={employees}
              onNavigate={handleSearchNavigate}
              lang={lang}
            />

            {/* Content Area - All Modules */}
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
                <div className="flex flex-col h-full">
                  {/* Production View Toggle - v7.6 Feature */}
                  <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="font-bold text-gray-700">{lang === 'th' ? 'การผลิต' : 'Production'}</h2>
                      <span className="text-sm text-gray-500">
                        {workOrders.filter(wo => wo.status !== 'completed').length} {lang === 'th' ? 'งานที่กำลังดำเนินการ' : 'active WOs'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => setProductionView('tabs')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${productionView === 'tabs' ? 'bg-white shadow text-[#1A5276]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {lang === 'th' ? 'แท็บ' : 'Tabs'}
                      </button>
                      <button 
                        onClick={() => setProductionView('kanban')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${productionView === 'kanban' ? 'bg-white shadow text-[#1A5276]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Kanban
                      </button>
                    </div>
                  </div>
                  
                  {/* Production Content */}
                  <div className="flex-1 overflow-hidden">
                    {productionView === 'kanban' ? (
                      <KanbanBoard
                        workOrders={workOrders}
                        setWorkOrders={setWorkOrders}
                        customers={customers}
                        lang={lang}
                      />
                    ) : (
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
                  </div>
                </div>
              )}
              {activeModule === 'sales' && (
                <SalesModuleFull
                  salesOrders={salesOrders}
                  setSalesOrders={setSalesOrders}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  customers={customers}
                  workOrders={workOrders}
                  products={products}
                  lang={lang}
                />
              )}
              {activeModule === 'accounting' && (
                <AccountingModule
                  invoices={invoices}
                  purchaseOrders={purchaseOrders}
                  vendors={vendors}
                  customers={customers}
                  lang={lang}
                />
              )}
              {activeModule === 'hr' && (
                <HRModuleFull
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
                  setEquipment={setEquipment}
                  employees={employees}
                  lang={lang}
                />
              )}
              {activeModule === 'reports' && (
                <ReportsModule
                  inventory={inventory}
                  purchaseOrders={purchaseOrders}
                  workOrders={workOrders}
                  salesOrders={salesOrders}
                  invoices={invoices}
                  categories={categories}
                  stores={stores}
                  customers={customers}
                  vendors={vendors}
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

// Use the full version as the default export
// Uncomment the line below to switch to full version
// export default AppFull

// ============================================
// PURCHASE DASHBOARD COMPONENT
// ============================================
const PurchaseDashboard = ({ stats, purchaseOrders, vendors, onReceive, onPrePrint, lang }) => {
  const pendingOrders = purchaseOrders.filter(p => p.status !== 'received').slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'ใบสั่งซื้อทั้งหมด' : 'Total POs'}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalPOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอดำเนินการ' : 'Pending'}</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingPOs}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รับบางส่วน' : 'Partial'}</div>
          <div className="text-2xl font-bold text-orange-600">{stats.partialPOs || 0}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'มูลค่ารวม' : 'Total Value'}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">{lang === 'th' ? 'รอรับ' : 'Pending Value'}</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.pendingValue)}</div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'รอรับสินค้า' : 'Pending Receipt'}</h3>
          <div className="space-y-3">
            {pendingOrders.map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#1A5276]">{po.id}</span>
                      <Badge variant={po.type === 'import' ? 'info' : 'success'}>
                        {po.type === 'import' ? '🚢' : '🏠'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">{vendor?.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" icon={Printer} onClick={() => onPrePrint(po)}>
                      {lang === 'th' ? 'ฉลาก' : 'Labels'}
                    </Button>
                    <Button size="sm" icon={Package} onClick={() => onReceive(po)}>
                      {lang === 'th' ? 'รับ' : 'Receive'}
                    </Button>
                  </div>
                </div>
              )
            })}
            {pendingOrders.length === 0 && (
              <p className="text-gray-400 text-center py-4">{lang === 'th' ? 'ไม่มีรายการรอรับ' : 'No pending orders'}</p>
            )}
          </div>
        </Card>

        {/* Import Summary */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">{lang === 'th' ? 'สรุปการนำเข้า' : 'Import Summary'}</h3>
          <div className="space-y-4">
            {purchaseOrders.filter(po => po.type === 'import').slice(0, 3).map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <div key={po.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[#1A5276]">{po.id}</span>
                    <Badge variant={po.status === 'received' ? 'success' : 'warning'}>{po.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">{vendor?.name}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">{lang === 'th' ? 'วัสดุ:' : 'Materials:'}</span>
                      <span className="ml-1 font-medium">{formatCurrency(po.subtotal || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{lang === 'th' ? 'นำเข้า:' : 'Import:'}</span>
                      <span className="ml-1 font-medium text-orange-600">{formatCurrency(po.totalImportCosts || 0)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ============================================
// PURCHASE ORDER LIST
// ============================================
const PurchaseOrderList = ({ purchaseOrders, vendors, onEdit, onReceive, onPrintLabels, lang }) => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredPOs = purchaseOrders.filter(po => {
    const matchFilter = filter === 'all' || po.status === filter || po.type === filter
    const matchSearch = !search || 
      po.id.toLowerCase().includes(search.toLowerCase()) ||
      vendors.find(v => v.id === po.vendorId)?.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'th' ? 'ค้นหา PO หรือผู้ขาย...' : 'Search PO or vendor...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
          <option value="pending">{lang === 'th' ? 'รอดำเนินการ' : 'Pending'}</option>
          <option value="partial">{lang === 'th' ? 'รับบางส่วน' : 'Partial'}</option>
          <option value="received">{lang === 'th' ? 'รับแล้ว' : 'Received'}</option>
          <option value="local">{lang === 'th' ? 'ในประเทศ' : 'Local'}</option>
          <option value="import">{lang === 'th' ? 'นำเข้า' : 'Import'}</option>
        </select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'PO #'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ผู้ขาย' : 'Vendor'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'ประเภท' : 'Type'}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Materials'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'ค่านำเข้า' : 'Import'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{lang === 'th' ? 'รวม' : 'Total'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'จัดการ' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPOs.map(po => {
              const vendor = vendors.find(v => v.id === po.vendorId)
              return (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-mono text-[#1A5276] font-medium">{po.id}</div>
                    {po.vendorInvoice && <div className="text-xs text-gray-400">{po.vendorInvoice}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{vendor?.name}</div>
                    <div className="text-xs text-gray-400">{vendor?.country}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={po.type === 'import' ? 'info' : 'success'}>
                      {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(po.poDate)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(po.subtotal || 0)}</td>
                  <td className="px-4 py-3 text-right text-orange-600">
                    {po.type === 'import' ? formatCurrency(po.totalImportCosts || 0) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#2ECC40]">
                    {formatCurrency(po.total || po.grandTotal || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={
                      po.status === 'received' ? 'success' :
                      po.status === 'partial' ? 'warning' :
                      po.status === 'in_transit' ? 'info' :
                      'default'
                    }>
                      {po.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded" 
                        title={lang === 'th' ? 'แก้ไข' : 'Edit'}
                        onClick={() => onEdit(po)}
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                      {po.status !== 'received' && (
                        <>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title={lang === 'th' ? 'พิมพ์ฉลาก' : 'Print Labels'}
                            onClick={() => onPrintLabels(po)}
                          >
                            <Printer className="w-4 h-4 text-blue-500" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title={lang === 'th' ? 'รับสินค้า' : 'Receive'}
                            onClick={() => onReceive(po)}
                          >
                            <Package className="w-4 h-4 text-green-500" />
                          </button>
                        </>
                      )}
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

// ============================================
// GOODS RECEIPT LIST
// ============================================
const GoodsReceiptList = ({ purchaseOrders, vendors, onReceive, lang }) => {
  const pendingPOs = purchaseOrders.filter(po => po.status !== 'received')

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-green-50 border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-800">{lang === 'th' ? 'รายการรอรับสินค้า' : 'Goods Receipt Queue'}</h3>
            <p className="text-sm text-green-600">
              {pendingPOs.length} {lang === 'th' ? 'รายการรอรับ' : 'items pending receipt'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingPOs.map(po => {
          const vendor = vendors.find(v => v.id === po.vendorId)
          return (
            <Card key={po.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-[#1A5276] font-bold">{po.id}</div>
                  <Badge variant={po.type === 'import' ? 'info' : 'success'} className="mt-1">
                    {po.type === 'import' ? '🚢 Import' : '🏠 Local'}
                  </Badge>
                </div>
                <Badge variant={po.status === 'partial' ? 'warning' : 'default'}>{po.status}</Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">{vendor?.name}</div>
              <div className="text-xs text-gray-400 mb-3">
                {lang === 'th' ? 'กำหนดส่ง:' : 'Due:'} {formatDate(po.deliveryDate || po.expectedDelivery)}
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#2ECC40]">{formatCurrency(po.total || po.grandTotal || 0)}</div>
                <Button size="sm" icon={Package} onClick={() => onReceive(po)}>
                  {lang === 'th' ? 'รับสินค้า' : 'Receive'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {pendingPOs.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{lang === 'th' ? 'ไม่มีรายการรอรับ' : 'All Caught Up!'}</h3>
          <p className="text-gray-500">{lang === 'th' ? 'ใบสั่งซื้อทั้งหมดได้รับสินค้าแล้ว' : 'All purchase orders have been received'}</p>
        </Card>
      )}
    </div>
  )
}

// ============================================
// VENDOR LIST
// ============================================
const VendorList = ({ vendors, lang }) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredVendors = vendors.filter(v => {
    const matchFilter = filter === 'all' || v.type === filter
    const matchSearch = !search || 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'th' ? 'ค้นหาผู้ขาย...' : 'Search vendors...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
          <option value="local">{lang === 'th' ? 'ในประเทศ' : 'Local'}</option>
          <option value="import">{lang === 'th' ? 'นำเข้า' : 'Import'}</option>
        </select>
        <Button icon={Plus}>{lang === 'th' ? 'เพิ่มผู้ขาย' : 'Add Vendor'}</Button>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map(v => (
          <Card key={v.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-800">{v.name}</div>
                <div className="text-sm text-gray-500">{v.nameTh}</div>
              </div>
              <Badge variant={v.type === 'import' ? 'info' : 'success'}>{v.type}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'รหัส' : 'Code'}</span>
                <span className="font-mono">{v.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'หมวดหมู่' : 'Category'}</span>
                <span>{v.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'ประเทศ' : 'Country'}</span>
                <span>{v.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'th' ? 'เครดิต' : 'Terms'}</span>
                <span>{v.paymentTerms} {lang === 'th' ? 'วัน' : 'days'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm">
                <div className="text-gray-500">{lang === 'th' ? 'ติดต่อ' : 'Contact'}</div>
                <div className="font-medium">{v.contact}</div>
                <div className="text-gray-500">{v.phone}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================
// DELIVERY ORDER LIST (For Sales)
// ============================================
const DeliveryOrderList = ({ deliveryOrders, salesOrders, customers, trucks, lang }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-cyan-50 border-b border-cyan-100">
        <h3 className="font-bold text-cyan-800">{lang === 'th' ? 'ใบส่งสินค้า' : 'Delivery Orders'}</h3>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'เลขที่' : 'DO #'}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'ลูกค้า' : 'Customer'}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'วันที่' : 'Date'}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{lang === 'th' ? 'รถ' : 'Vehicle'}</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {deliveryOrders.map(d => {
            const so = salesOrders.find(s => s.id === d.soId)
            const customer = customers.find(c => c.id === (d.customerId || so?.customerId))
            const truck = trucks.find(t => t.id === d.vehicleId)
            return (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[#1A5276]">{d.id}</td>
                <td className="px-4 py-3">{customer?.name}</td>
                <td className="px-4 py-3">{formatDate(d.deliveryDate || d.date)}</td>
                <td className="px-4 py-3">
                  {truck ? `${truck.licensePlate} - ${truck.driver}` : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={
                    d.status === 'delivered' ? 'success' :
                    d.status === 'in_transit' ? 'info' :
                    'warning'
                  }>
                    {d.status}
                  </Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}


// ============================================
// PRODUCTION FLOOR VIEW (Detailed)
// ============================================
const ProductionFloorView = ({ workOrders, departments, onComplete, lang }) => {
  const activeWOs = workOrders.filter(wo => wo.status === 'in_progress')
  
  const getWOsByDepartment = (deptId) => {
    return activeWOs.filter(wo => wo.currentDepartment === deptId || wo.department === deptId)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-blue-100">{lang === 'th' ? 'กำลังผลิต' : 'In Production'}</div>
          <div className="text-3xl font-bold">{activeWOs.length}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-green-100">{lang === 'th' ? 'เสร็จวันนี้' : 'Completed Today'}</div>
          <div className="text-3xl font-bold">{workOrders.filter(wo => wo.status === 'completed' && wo.completedDate === new Date().toISOString().split('T')[0]).length}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="text-orange-100">{lang === 'th' ? 'รอวัสดุ' : 'Waiting Material'}</div>
          <div className="text-3xl font-bold">{workOrders.filter(wo => wo.status === 'waiting_material').length}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="text-purple-100">{lang === 'th' ? 'ล่าช้า' : 'Delayed'}</div>
          <div className="text-3xl font-bold">{workOrders.filter(wo => wo.status === 'delayed').length}</div>
        </Card>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map(dept => {
          const deptWOs = getWOsByDepartment(dept.id)
          const typeInfo = DEPARTMENT_TYPES.find(t => t.id === dept.type)
          return (
            <Card key={dept.id} className="overflow-hidden">
              <div 
                className="p-3 text-white flex items-center justify-between"
                style={{ backgroundColor: typeInfo?.color || '#6B7280' }}
              >
                <div>
                  <div className="font-bold">{dept.code}</div>
                  <div className="text-sm opacity-80">{lang === 'th' ? dept.nameTh : dept.nameEn}</div>
                </div>
                <div className="text-2xl font-bold">{deptWOs.length}</div>
              </div>
              <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                {deptWOs.length > 0 ? deptWOs.map(wo => (
                  <div key={wo.id} className="p-2 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#1A5276] font-medium">{wo.id}</span>
                      <Badge variant={wo.priority === 'high' ? 'danger' : wo.priority === 'medium' ? 'warning' : 'default'}>
                        {wo.priority}
                      </Badge>
                    </div>
                    <div className="text-gray-600 truncate">{wo.productName}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400">{wo.quantity} pcs</span>
                      {wo.progress !== undefined && (
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${wo.progress || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-4">{lang === 'th' ? 'ไม่มีงาน' : 'No jobs'}</p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// EMPLOYEE FORM
// ============================================
const EmployeeForm = ({ employee, departments, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    nameEn: employee?.nameEn || '',
    nameTh: employee?.nameTh || '',
    department: employee?.department || '',
    position: employee?.position || '',
    type: employee?.type || 'FT',
    salary: employee?.salary || 0,
    positionInc: employee?.positionInc || 0,
    diligenceInc: employee?.diligenceInc || 0,
    phoneAllowance: employee?.phoneAllowance || 0,
    entity: employee?.entity || 'IND',
    startDate: employee?.startDate || new Date().toISOString().split('T')[0],
    status: employee?.status || 'active',
    bankAccount: employee?.bankAccount || '',
    taxId: employee?.taxId || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ชื่อ (EN) *' : 'Name (EN) *'}
          </label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ชื่อ (TH) *' : 'Name (TH) *'}
          </label>
          <input
            type="text"
            required
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Department & Position */}
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
            <option value="">{lang === 'th' ? 'เลือกแผนก' : 'Select Department'}</option>
            {departments.map(d => (
              <option key={d.id} value={d.code}>{d.code} - {lang === 'th' ? d.nameTh : d.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ตำแหน่ง *' : 'Position *'}
          </label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'ประเภท' : 'Type'}
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="FT">{lang === 'th' ? 'ประจำ (FT)' : 'Full-time (FT)'}</option>
            <option value="PT">{lang === 'th' ? 'พาร์ทไทม์ (PT)' : 'Part-time (PT)'}</option>
            <option value="CT">{lang === 'th' ? 'สัญญาจ้าง (CT)' : 'Contract (CT)'}</option>
          </select>
        </div>
      </div>

      {/* Salary Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">{lang === 'th' ? 'ข้อมูลเงินเดือน' : 'Salary Information'}</h4>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'เงินเดือน' : 'Base Salary'}
            </label>
            <input
              type="number"
              value={formData.salary || ''}
              onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'ค่าตำแหน่ง' : 'Position Inc'}
            </label>
            <input
              type="number"
              value={formData.positionInc || ''}
              onChange={(e) => setFormData({ ...formData, positionInc: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'ค่าขยัน' : 'Diligence Inc'}
            </label>
            <input
              type="number"
              value={formData.diligenceInc || ''}
              onChange={(e) => setFormData({ ...formData, diligenceInc: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'th' ? 'ค่าโทรศัพท์' : 'Phone Allow'}
            </label>
            <input
              type="number"
              value={formData.phoneAllowance || ''}
              onChange={(e) => setFormData({ ...formData, phoneAllowance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Entity & Start Date */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'นิติบุคคล' : 'Entity'}
          </label>
          <select
            value={formData.entity}
            onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="IND">IND</option>
            <option value="IND2">IND-2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'วันเริ่มงาน' : 'Start Date'}
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'th' ? 'สถานะ' : 'Status'}
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="active">{lang === 'th' ? 'ทำงานอยู่' : 'Active'}</option>
            <option value="inactive">{lang === 'th' ? 'ลาออก' : 'Inactive'}</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('action.cancel', lang)}
        </Button>
        <Button type="submit" icon={Save}>
          {t('action.save', lang)}
        </Button>
      </div>
    </form>
  )
}

// ============================================
// PARTIAL DELIVERY MODAL
// ============================================
const PartialDeliveryModal = ({ so, customers, onClose, onCreateInvoice, lang }) => {
  const [deliveryItems, setDeliveryItems] = useState(
    (so.items || []).map(item => ({
      ...item,
      qtyToDeliver: Math.min(item.qtyRemaining || (item.qty - (item.qtyDelivered || 0)), item.qty),
      maxQty: item.qtyRemaining || (item.qty - (item.qtyDelivered || 0)),
    })).filter(item => item.maxQty > 0)
  )

  const customer = customers.find(c => c.id === so.customerId)

  const updateDeliveryQty = (idx, qty) => {
    const items = [...deliveryItems]
    items[idx].qtyToDeliver = Math.min(Math.max(0, qty), items[idx].maxQty)
    setDeliveryItems(items)
  }

  const totalToDeliver = deliveryItems.reduce((sum, item) => sum + item.qtyToDeliver, 0)
  const totalAmount = deliveryItems.reduce((sum, item) => sum + (item.qtyToDeliver * item.unitPrice), 0)

  // Determine entity based on material
  const hasPlyMaterial = deliveryItems.filter(i => i.qtyToDeliver > 0).some(item => 
    ['PLYRW', 'PLYRR', 'PLYWW', 'PRTB'].includes(item.materialType)
  )
  const entity = hasPlyMaterial ? 'IND2' : 'IND'

  const handleCreate = () => {
    const itemsToInvoice = deliveryItems.filter(item => item.qtyToDeliver > 0)
    if (itemsToInvoice.length > 0) {
      onCreateInvoice(itemsToInvoice, entity)
    }
  }

  return (
    <div className="space-y-4">
      {/* SO Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'ใบสั่งขาย:' : 'Sales Order:'}</span>
            <span className="ml-2 font-mono font-medium text-[#1A5276]">{so.id}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'PO ลูกค้า:' : 'Customer PO:'}</span>
            <span className="ml-2 font-medium">{so.customerPO || '-'}</span>
          </div>
          <div>
            <span className="text-gray-500">{lang === 'th' ? 'ลูกค้า:' : 'Customer:'}</span>
            <span className="ml-2 font-medium">{customer?.name}</span>
          </div>
        </div>
      </div>

      {/* Entity Badge */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {lang === 'th' ? 'ใบแจ้งหนี้จะออกในนาม:' : 'Invoice will be issued under:'}
        </div>
        <Badge variant={entity === 'IND2' ? 'info' : 'success'}>{entity}</Badge>
      </div>

      {/* Items Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">{lang === 'th' ? 'สินค้า' : 'Product'}</th>
              <th className="px-4 py-2 text-center font-medium text-gray-600">{lang === 'th' ? 'วัสดุ' : 'Material'}</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'คงเหลือ' : 'Remaining'}</th>
              <th className="px-4 py-2 text-center font-medium text-gray-600">{lang === 'th' ? 'จำนวนส่ง' : 'Qty to Deliver'}</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">{lang === 'th' ? 'มูลค่า' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {deliveryItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.productName}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={['PLYRW', 'PLYRR', 'PLYWW', 'PRTB'].includes(item.materialType) ? 'info' : 'default'}>
                    {item.materialType || '-'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-amber-600 font-medium">
                  {item.maxQty} {item.unit}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => updateDeliveryQty(idx, item.qtyToDeliver - 1)}
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={item.qtyToDeliver}
                      onChange={(e) => updateDeliveryQty(idx, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border rounded text-center"
                      min={0}
                      max={item.maxQty}
                    />
                    <button 
                      onClick={() => updateDeliveryQty(idx, item.qtyToDeliver + 1)}
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(item.qtyToDeliver * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-600">{lang === 'th' ? 'รวมจำนวนส่ง:' : 'Total Qty:'}</span>
            <span className="ml-2 font-bold text-lg">{totalToDeliver}</span>
          </div>
          <div>
            <span className="text-gray-600">{lang === 'th' ? 'มูลค่ารวม:' : 'Total Amount:'}</span>
            <span className="ml-2 font-bold text-lg text-[#2ECC40]">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t('action.cancel', lang)}
        </Button>
        <Button icon={Receipt} onClick={handleCreate} disabled={totalToDeliver === 0}>
          {lang === 'th' ? 'สร้างใบแจ้งหนี้' : 'Create Invoice'}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// COST METHOD SELECTOR
// ============================================
const CostMethodSelector = ({ currentMethod, onSelect, lang }) => {
  const methods = [
    { id: 'FIFO', name: 'FIFO', desc: lang === 'th' ? 'เข้าก่อนออกก่อน' : 'First In First Out' },
    { id: 'AVG', name: 'Average', desc: lang === 'th' ? 'ถัวเฉลี่ย' : 'Weighted Average' },
    { id: 'STD', name: 'Standard', desc: lang === 'th' ? 'ต้นทุนมาตรฐาน' : 'Standard Cost' },
  ]

  return (
    <div className="flex gap-2">
      {methods.map(method => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`px-3 py-2 rounded-lg border-2 transition-all ${
            currentMethod === method.id 
              ? 'border-[#1A5276] bg-[#1A5276]/5 text-[#1A5276]' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium text-sm">{method.name}</div>
          <div className="text-xs text-gray-500">{method.desc}</div>
        </button>
      ))}
    </div>
  )
}

// ============================================
// CBM CALCULATOR
// ============================================
const CBMCalculator = ({ items, lang }) => {
  const totalCBM = items.reduce((sum, item) => {
    const cbm = (item.thickness * item.width * item.length * item.qty) / 1000000000
    return sum + cbm
  }, 0)

  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0)
  const costPerCBM = totalCBM > 0 ? totalCost / totalCBM : 0

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-bold text-blue-800 mb-3">{lang === 'th' ? 'สรุป CBM' : 'CBM Summary'}</h4>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-blue-600">{lang === 'th' ? 'ปริมาตรรวม' : 'Total Volume'}</div>
          <div className="text-2xl font-bold text-blue-800">{totalCBM.toFixed(4)} m³</div>
        </div>
        <div>
          <div className="text-blue-600">{lang === 'th' ? 'ต้นทุนรวม' : 'Total Cost'}</div>
          <div className="text-2xl font-bold text-blue-800">{formatCurrency(totalCost)}</div>
        </div>
        <div>
          <div className="text-blue-600">{lang === 'th' ? 'ต้นทุน/CBM' : 'Cost per CBM'}</div>
          <div className="text-2xl font-bold text-blue-800">{formatCurrency(costPerCBM)}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// IMPORT COST BREAKDOWN
// ============================================
const ImportCostBreakdown = ({ importCosts, total, lang }) => {
  if (!importCosts || Object.keys(importCosts).length === 0) return null

  const costItems = IMPORT_COST_TYPES.map(type => ({
    ...type,
    amount: importCosts[type.id] || 0
  })).filter(c => c.amount > 0)

  const totalImportCost = costItems.reduce((sum, c) => sum + c.amount, 0)
  const percentOfTotal = total > 0 ? (totalImportCost / total * 100) : 0

  return (
    <Card className="p-4 border-orange-200 bg-orange-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-orange-800">{lang === 'th' ? 'รายละเอียดค่านำเข้า' : 'Import Cost Breakdown'}</h4>
        <Badge variant="warning">{percentOfTotal.toFixed(1)}% {lang === 'th' ? 'ของยอดรวม' : 'of total'}</Badge>
      </div>
      <div className="space-y-2">
        {costItems.map(cost => (
          <div key={cost.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{lang === 'th' ? cost.nameTh : cost.nameEn}</span>
            <span className="font-medium">{formatCurrency(cost.amount)}</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-orange-200 flex justify-between font-bold">
          <span>{lang === 'th' ? 'รวมค่านำเข้า' : 'Total Import Cost'}</span>
          <span className="text-orange-700">{formatCurrency(totalImportCost)}</span>
        </div>
      </div>
    </Card>
  )
}

// ============================================
// QUICK ACTIONS WIDGET
// ============================================
const QuickActions = ({ onAction, userRole, lang }) => {
  const actions = [
    { id: 'newPO', label: lang === 'th' ? 'สร้าง PO' : 'New PO', icon: ShoppingCart, color: 'bg-yellow-500', module: 'purchase' },
    { id: 'newWO', label: lang === 'th' ? 'สร้าง WO' : 'New WO', icon: Factory, color: 'bg-orange-500', module: 'production' },
    { id: 'newSO', label: lang === 'th' ? 'สร้างใบขาย' : 'New SO', icon: Receipt, color: 'bg-pink-500', module: 'sales' },
    { id: 'receive', label: lang === 'th' ? 'รับสินค้า' : 'Receive', icon: Package, color: 'bg-green-500', module: 'purchase' },
    { id: 'schedule', label: lang === 'th' ? 'จัดส่ง' : 'Schedule', icon: Truck, color: 'bg-cyan-500', module: 'transport' },
    { id: 'report', label: lang === 'th' ? 'รายงาน' : 'Reports', icon: BarChart3, color: 'bg-purple-500', module: 'reports' },
  ]

  const role = ROLES[userRole]
  const availableActions = actions.filter(a => role?.modules.includes(a.module) || role?.permissions.includes('all'))

  return (
    <Card className="p-4">
      <h3 className="font-bold text-gray-800 mb-3">{lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions'}</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {availableActions.map(action => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-all flex flex-col items-center justify-center gap-1`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}

// ============================================
// NOTIFICATION BADGE
// ============================================
const NotificationBadge = ({ count, onClick }) => {
  if (!count || count === 0) return null
  return (
    <button 
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg"
    >
      <Bell className="w-5 h-5 text-gray-500" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  )
}

// ============================================
// LOW STOCK ALERT
// ============================================
const LowStockAlert = ({ inventory, threshold = 100, lang }) => {
  const lowStockItems = inventory.filter(item => item.qty < threshold && item.qty > 0)
  
  if (lowStockItems.length === 0) return null

  return (
    <Card className="p-4 border-red-200 bg-red-50">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h4 className="font-bold text-red-800">{lang === 'th' ? 'สินค้าใกล้หมด' : 'Low Stock Alert'}</h4>
        <Badge variant="danger">{lowStockItems.length}</Badge>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {lowStockItems.slice(0, 5).map(item => (
          <div key={item.id} className="flex justify-between text-sm p-2 bg-white rounded">
            <span className="font-mono text-red-700">{item.code}</span>
            <span className="text-red-600 font-medium">{item.qty} {lang === 'th' ? 'ชิ้น' : 'pcs'}</span>
          </div>
        ))}
        {lowStockItems.length > 5 && (
          <p className="text-sm text-red-500 text-center">
            +{lowStockItems.length - 5} {lang === 'th' ? 'รายการเพิ่มเติม' : 'more items'}
          </p>
        )}
      </div>
    </Card>
  )
}

// ============================================
// CURRENCY DISPLAY
// ============================================
const CurrencyDisplay = ({ amount, currency = 'THB', showSymbol = true }) => {
  const symbols = { THB: '฿', USD: '$', EUR: '€', MYR: 'RM' }
  const formatted = formatCurrency(amount)
  
  if (currency === 'THB') return <span>{formatted}</span>
  return <span>{showSymbol && symbols[currency]}{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
}

// ============================================
// DATE RANGE PICKER
// ============================================
const DateRangePicker = ({ from, to, onChange, lang }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500">{lang === 'th' ? 'จาก' : 'From'}</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      <span className="text-gray-400">→</span>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500">{lang === 'th' ? 'ถึง' : 'To'}</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="px-3 py-2 border rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

// ============================================
// EXPORT BUTTON
// ============================================
const ExportButton = ({ data, filename, format = 'xlsx', lang }) => {
  const handleExport = () => {
    // In a real app, this would use xlsx library
    console.log('Exporting:', { data, filename, format })
    alert(`${lang === 'th' ? 'ส่งออกข้อมูลเป็น' : 'Exporting as'} ${filename}.${format}`)
  }

  return (
    <Button variant="outline" icon={Download} onClick={handleExport}>
      {lang === 'th' ? 'ส่งออก' : 'Export'} {format.toUpperCase()}
    </Button>
  )
}

// ============================================
// SEARCH INPUT
// ============================================
const SearchInput = ({ value, onChange, placeholder, lang }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || (lang === 'th' ? 'ค้นหา...' : 'Search...')}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent"
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// LOADING SPINNER
// ============================================
const LoadingSpinner = ({ size = 'md', text }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-[#1A5276] rounded-full animate-spin`} />
      {text && <p className="mt-4 text-gray-500">{text}</p>}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================
const EmptyState = ({ icon: Icon, title, description, action, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4 max-w-md">{description}</p>}
      {action && action}
    </div>
  )
}

// ============================================
// CONFIRMATION DIALOG
// ============================================
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant = 'danger' }) => {
  if (!isOpen) return null

  const variants = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${variants[variant]}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PROGRESS BAR
// ============================================
const ProgressBar = ({ value, max = 100, color = 'green', showLabel = true, size = 'md' }) => {
  const percent = Math.min((value / max) * 100, 100)
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  }
  const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-500 mt-1 text-right">{percent.toFixed(0)}%</div>
      )}
    </div>
  )
}

// ============================================
// TOOLTIP
// ============================================
const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false)
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap ${positions[position]}`}>
          {content}
        </div>
      )}
    </div>
  )
}

// ============================================
// TABS COMPONENT
// ============================================
const Tabs = ({ tabs, activeTab, onChange, variant = 'underline' }) => {
  const variants = {
    underline: 'border-b',
    pills: 'bg-gray-100 p-1 rounded-lg',
  }

  return (
    <div className={`flex gap-1 ${variants[variant]}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 transition-all ${
            variant === 'underline'
              ? `border-b-2 ${activeTab === tab.id ? 'border-[#1A5276] text-[#1A5276]' : 'border-transparent text-gray-500 hover:text-gray-700'}`
              : `rounded-md ${activeTab === tab.id ? 'bg-white shadow text-[#1A5276]' : 'text-gray-500 hover:text-gray-700'}`
          }`}
        >
          {tab.icon && <tab.icon className="w-4 h-4" />}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#1A5276] text-white' : 'bg-gray-200'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ============================================
// AVATAR
// ============================================
const Avatar = ({ name, size = 'md', color }) => {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg' }
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  
  return (
    <div className={`${sizes[size]} ${color || 'bg-[#1A5276]'} rounded-full flex items-center justify-center text-white font-bold`}>
      {initial}
    </div>
  )
}

// ============================================
// DROPDOWN MENU
// ============================================
const DropdownMenu = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setIsOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// FINAL VERSION INFO
// ============================================
const VersionInfo = ({ lang }) => {
  return (
    <div className="text-center text-xs text-gray-400 py-4">
      <p>IND Thai Packwell ERP v{VERSION}</p>
      <p>{VERSION_DATE}</p>
      <p>{lang === 'th' ? 'พัฒนาโดย' : 'Developed by'} Claude AI</p>
    </div>
  )
}

// End of IND ERP v7.0 - Full Build with Enhanced Purchase Module
// Total Features: 9 Modules, 6 Stores, 12 Categories, 13 Import Cost Types
// NEW in v7: Split Lots, Reject/Add Items GRN, Approval Hierarchy, Import/LC Tracking
// Languages: EN, TH, MY, KH, ZH, JP
// Roles: Admin, Sales, Production, Warehouse, HR, Accounting, Transport, Maintenance

// ============================================
// DEFAULT EXPORT
// ============================================
const App = AppFull
export default App
