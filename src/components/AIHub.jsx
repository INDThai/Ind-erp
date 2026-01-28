import React from 'react'

export default function INDAIAgentsHub() {
  return (
    <div className="min-h-screen bg-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">AI Hub</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">✂️ Cutting Optimizer</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">23%</div>
                <div className="text-xs text-gray-500">Waste Saved</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">฿1.2M</div>
                <div className="text-xs text-gray-500">Cost Saved</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-xs text-gray-500">Plans Made</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📷 Document OCR</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">98%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3s</div>
                <div className="text-xs text-gray-500">Avg Time</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1,240</div>
                <div className="text-xs text-gray-500">Scanned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
