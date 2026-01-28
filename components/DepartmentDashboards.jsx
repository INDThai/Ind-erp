import React, { useState } from 'react'
import {
  Users, DollarSign, ShoppingCart, Package, Factory, Receipt,
  Truck, Wrench, Calendar, Clock, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, FileText, Bell, ChevronRight, ChevronLeft,
  Home, Settings, Search, Filter, Plus, Eye, Edit3, Printer,
  Download, Upload, BarChart3, PieChart, Activity, Target,
  UserCheck, UserX, CreditCard, Wallet, Building2, MapPin
} from 'lucide-react'

export default function DepartmentDashboards() {
  const [activeDept, setActiveDept] = useState('overview')

  const departments = [
    { id: 'overview', name: 'Overview', icon: Home, color: 'gray' },
    { id: 'hr', name: 'HR', icon: Users, color: 'purple' },
    { id: 'accounting', name: 'Accounting', icon: DollarSign, color: 'green' },
    { id: 'purchase', name: 'Purchase', icon: ShoppingCart, color: 'blue' },
    { id: 'inventory', name: 'Inventory', icon: Package, color: 'amber' },
    { id: 'production', name: 'Production', icon: Factory, color: 'orange' },
    { id: 'sales', name: 'Sales', icon: Receipt, color: 'cyan' },
    { id: 'transport', name: 'Transport', icon: Truck, color: 'indigo' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'red' },
  ]

  const deptData = {
    hr: {
      stats: [
        { label: 'Total Employees', value: '67', icon: Users, color: 'purple' },
        { label: 'Active Today', value: '58', icon: UserCheck, color: 'green' },
        { label: 'On Leave', value: '6', icon: UserX, color: 'amber' },
        { label: 'Pending Actions', value: '5', icon: AlertTriangle, color: 'red' },
      ]
    },
    accounting: {
