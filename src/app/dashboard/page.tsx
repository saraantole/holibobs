'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [balance] = useState(2000.00)
  const { isSignedIn, handleSignOut, currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn && !currentUser) {
      router.replace('/')
    }
  }, [isSignedIn, currentUser]) 

  return (
    <div className="max-w-md mx-auto mt-40 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
        
        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Savings Balance */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Savings</h1>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center shadow-lg">
              <div className="text-white text-5xl font-bold mb-2">
                ${balance.toFixed(2)}
              </div>
              <div className="text-blue-100 text-sm">Total Balance</div>
            </div>

<button onClick={handleSignOut}>Sign Out</button>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-br from-blue-400 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all shadow-md">
              Top Up
            </button>
            <button className="bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-2xl font-semibold hover:border-blue-400 transition-all">
              Withdraw
            </button>
          </div>

          {/* Upcoming Draw */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming draw</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 text-center shadow-md">
                <div className="text-white font-bold text-lg">1mo</div>
                <div className="text-white text-xs mt-1">$300</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 text-center shadow-md">
                <div className="text-white font-bold text-lg">3mo</div>
                <div className="text-white text-xs mt-1">$900</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-center shadow-md">
                <div className="text-white font-bold text-lg">6mo</div>
                <div className="text-white text-xs mt-1">$1,800</div>
              </div>
            </div>
          </div>

          {/* My Previous Draws */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My previous draws</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">6.05.2025</span>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">Participant 5.4.2025 OP</div>
                  <div className="text-gray-600">You $0.00</div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">5.04.2025</span>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">Participant 1.3.2025 OP</div>
                  <div className="text-gray-600">You $100.00</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  )
}
