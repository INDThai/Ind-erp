import React, { useState } from 'react'
import {
  MessageCircle, Send, Bot, User, Globe, Phone, Mail,
  Package, Truck, FileText, Calculator, Clock, CheckCircle,
  AlertCircle, Settings, Shield, Users, Key, Eye, Edit3,
  Lock, Unlock, UserPlus, Trash2, Search, Filter, ChevronRight,
  ChevronDown, Menu, X, Home, ShoppingCart, Factory, Receipt,
  BarChart3, Bell, Building2, Clipboard, QrCode,
  Smartphone, Image, Paperclip,
  MoreVertical, Star, RefreshCw, Zap,
  Volume2, Camera, MapPin, Calendar, Hash, Info,
  ExternalLink, Copy, Download, Upload, Plus, Minus, Save
} from 'lucide-react'

export default function INDLineAndAccessSystem() {
  const [activeTab, setActiveTab] = useState('line-chat')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'สวัสดีครับ! 🙏 ยินดีต้อนรับสู่ IND Thai Packwell', time: '09:00' },
    { id: 2, type: 'bot', text: 'I can help you with:\n📦 Order Status\n💰 Quotations\n🚚 Delivery Tracking', time: '09:00' },
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (!inputMessage.trim()) return
    
    const newMsg = { id: Date.now(), type: 'user', text: inputMessage, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
    setChatMessages([...chatMessages, newMsg])
    setInputMessage('')

    // Simulate bot response
    setTimeout(() => {
      let response = { id: Date.now() + 1, type: 'bot', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
      
      if (inputMessage.toLowerCase().includes('wo') || inputMessage.toLowerCase().includes('order') || inputMessage.toLowerCase().includes('สถานะ')) {
        response.text = '📋 WO-2601-024\nCustomer: Furukawa\nStatus: ✅ In Progress (75%)\nDelivery: 28-Jan-2026'
      } else if (inputMessage.toLowerCase().includes('delivery') || inputMessage.toLowerCase().includes('ส่ง')) {
        response.text = '🚚 Delivery Status:\nTruck: 1 (Somchai)\nDestination: Bangkok\nETA: 14:30 today'
      } else {
        response.text = 'Thank you for your message! Our team will assist you shortly. 🙏'
      }
      
      setChatMessages(prev => [...prev, response])
    }, 1000)
  }

  const roles = [
    { name: 'Administrator', users: 2, permissions: 'Full Access', color: 'red' },
    { name: 'Manager', users: 5, permissions: 'View, Edit, Approve', color: 'blue' },
    { name: 'Staff', users: 12, permissions: 'View, Edit', color: 'green' },
    { name: 'Viewer', users: 25, permissions: 'View Only', color: 'gray' },
  ]

  const richMenuButtons = [
    { icon: Package, label: 'Check Order', labelTh: 'เช็คออเดอร์', color: 'blue' },
    { icon: Calculator, label: 'Get Quote', labelTh: 'ขอใบเสนอราคา', color: 'green' },
    { icon: Truck, label: 'Track Delivery', labelTh: 'ติดตามการส่ง', color: 'orange' },
    { icon: Phone, label: 'Contact Us', labelTh: 'ติดต่อเรา', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between ml-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">LINE Integration & Access Control</h1>
              <p className="text-green-200 text-sm">Chat Agent • Rich Menus • Role Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('line-chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'line-chat' ? 'bg-white text-green-700' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              💬 LINE Chat
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'access' ? 'bg-white text-green-700' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              🔐 Access Control
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'line-chat' ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Chat Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 bg-green-500 text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">IND Thai Packwell</div>
                  <div className="text-xs text-green-100">LINE Official Account</div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-4 bg-blue-50 h-80 overflow-y-auto">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 mb-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    {msg.type === 'bot' && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">IND</div>
                    )}
                    <div className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-green-500 text-white rounded-tr-none' 
                        : 'bg-white rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-green-100' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {/* Language Support */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Multilingual Support
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">🇹🇭</div>
                    <div className="font-medium">Thai</div>
                    <div className="text-xs text-gray-500">ภาษาไทย</div>
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">🇬🇧</div>
                    <div className="font-medium">English</div>
                    <div className="text-xs text-gray-500">Auto-detect</div>
                  </div>
                </div>
              </div>

              {/* Rich Menu */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Menu className="w-5 h-5 text-green-600" />
                  Rich Menu Buttons
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {richMenuButtons.map((btn, i) => (
                    <div key={i} className={`p-3 bg-${btn.color}-50 rounded-lg text-center cursor-pointer hover:bg-${btn.color}-100 transition-colors`}>
                      <btn.icon className={`w-6 h-6 mx-auto mb-1 text-${btn.color}-600`} />
                      <div className="text-sm font-medium">{btn.label}</div>
                      <div className="text-xs text-gray-500">{btn.labelTh}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Chat Statistics
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">1,240</div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">89%</div>
                    <div className="text-xs text-gray-500">Auto-resolved</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">2.3s</div>
                    <div className="text-xs text-gray-500">Avg Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Access Control Tab */
          <div className="grid grid-cols-2 gap-6">
            {/* Roles */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Access Roles
                </h3>
                <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Role
                </button>
              </div>
              <div className="divide-y">
                {roles.map((role, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${role.color}-100 rounded-lg flex items-center justify-center`}>
                        <Shield className={`w-5 h-5 text-${role.color}-600`} />
                      </div>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-gray-500">{role.permissions}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{role.users} users</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Permissions */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-600" />
                  Module Permissions
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[
                    { module: 'Dashboard', view: true, edit: true, delete: false },
                    { module: 'Inventory', view: true, edit: true, delete: false },
                    { module: 'Purchase', view: true, edit: false, delete: false },
                    { module: 'Production', view: true, edit: true, delete: false },
                    { module: 'Sales', view: true, edit: false, delete: false },
                    { module: 'HR', view: false, edit: false, delete: false },
                    { module: 'Reports', view: true, edit: false, delete: false },
                  ].map((perm, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">{perm.module}</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={perm.view} readOnly className="rounded" />
                          View
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={perm.edit} readOnly className="rounded" />
                          Edit
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={perm.delete} readOnly className="rounded" />
                          Delete
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
