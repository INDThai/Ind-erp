import React, { useState } from 'react'
import {
  MessageCircle, Send, Bot, User, Globe, Phone, Mail,
  Package, Truck, FileText, Calculator, Clock, CheckCircle,
  AlertCircle, Settings, Shield, Users, Key, Eye, Edit3,
  Lock, Unlock, UserPlus, Trash2, Search, Filter, ChevronRight,
  ChevronDown, Menu, X, Home, ShoppingCart, Factory, Receipt,
  BarChart3, Bell, Building2, Clipboard, QrCode, Smartphone, Plus
} from 'lucide-react'

export default function INDLineAndAccessSystem() {
  const [activeTab, setActiveTab] = useState('line-chat')
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'สวัสดีครับ! 🙏 ยินดีต้อนรับสู่ IND Thai Packwell', time: '09:00' },
    { id: 2, type: 'bot', text: 'I can help you with:\n📦 Order Status\n💰 Quotations\n🚚 Delivery', time: '09:00' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { id: Date.now(), type: 'user', text: input, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
    setMessages([...messages, newMsg])
    setInput('')
    setTimeout(() => {
      const reply = { id: Date.now() + 1, type: 'bot', text: '📋 WO-2601-024\nCustomer: Furukawa\nStatus: ✅ In Progress (75%)\nDelivery: 28-Jan-2026', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => [...prev, reply])
    }, 1000)
  }

  const roles = [
    { name: 'Administrator', users: 2, color: 'red' },
    { name: 'Manager', users: 5, color: 'blue' },
    { name: 'Staff', users: 12, color: 'green' },
    { name: 'Viewer', users: 25, color: 'gray' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between ml-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">LINE Integration & Access Control</h1>
              <p className="text-green-200 text-sm">Chat Agent • Rich Menus • Roles</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('line-chat')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'line-chat' ? 'bg-white text-green-700' : 'bg-white/10'}`}>
              💬 LINE Chat
            </button>
            <button onClick={() => setActiveTab('access')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'access' ? 'bg-white text-green-700' : 'bg-white/10'}`}>
              🔐 Access Control
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'line-chat' ? (
          <div className="grid grid-cols-2 gap-6">
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
              
              <div className="p-4 bg-blue-50 h-80 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 mb-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    {msg.type === 'bot' && <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">IND</div>}
                    <div className={`max-w-xs p-3 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-green-500 text-white rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:border-green-500"
                />
                <button onClick={sendMessage} className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />Languages
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">🇹🇭</div>
                    <div className="font-medium">Thai</div>
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">🇬🇧</div>
                    <div className="font-medium">English</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Menu className="w-5 h-5 text-green-600" />Rich Menu
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-blue-50 rounded-lg text-center text-sm">📦 Check Order</div>
                  <div className="p-3 bg-green-50 rounded-lg text-center text-sm">💰 Get Quote</div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center text-sm">🚚 Track Delivery</div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center text-sm">📞 Contact Us</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />Stats
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
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />Access Roles
                </h3>
                <button className="text-sm text-blue-600 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Role
                </button>
              </div>
              <div className="divide-y">
                {roles.map((role, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-gray-500">{role.users} users</div>
                      </div>
                    </div>
                    <bu
