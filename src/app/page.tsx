"use client";

import Image from 'next/image'
import Link from 'next/link'
import PiggyBank from '@/assets/images/piggybank.png'
import { caprasimo, newsReader } from '@/assets/fonts';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const {isSignedIn, currentUser } = useAuth()
  return (
    <div>
      
      {/* Hero Section with Piggy Bank */}
      <div className="relative w-full h-[70vh] flex justify-center items-center">
        <Image
          src={PiggyBank}
          alt="Piggy Bank"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      {/* Content */}
    <div className="-mt-30 md:-mt-8 p-6 space-y-8 bg-blue backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
        
        {/* Title Section */}
        <div className='md:w-[80%]'>
          <h1 className={`text-3xl font-bold mb-3 ${caprasimo.className}`}>
            The yearly summer holiday can be expensive
          </h1>
          <p className={`${newsReader.className} mb-4 leading-5`}>
            The average family pays €2800 per year on a holiday. What if you could budget for your holiday, while entering to win no-loss lottery prizes?
          </p>
   
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* How it works */}
        <div>
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">●</span>
              <span>Choose holiday dates & convert fiat to USDC</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">●</span>
              <span>Deposit into Holibobs vault & start earning</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">●</span>
              <span>Withdraw savings + interest to spend on your holiday</span>
            </li>
          </ul>
        </div>

        {/* Savings Calculator */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Savers get a chance to win
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
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
          <div className="text-6xl text-center">🏝️</div>
        </div>

        </div>

        {/* Previous Winners */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Previous winners</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Ali Gonzalez</span>
              <span className="text-gray-600">Won $499 + $5.00 OP</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">ETH Jogger</span>
              <span className="text-gray-600">Won $100 + $12.22 OP</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">0x0f Yoghurt</span>
              <span className="text-gray-600">Won $10 + $3.12 OP</span>
            </div>
          </div>
        </div>

        {/* Deposits & Withdrawals */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Deposits & withdrawals
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>Add money</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>Withdraw</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Pause</span>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </div>

        {/* Where does the prize money come from */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Where does the prize money come from?
          </h2>
          <div className="bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-500 rounded-2xl p-6 shadow-md">
            <p className="text-white text-sm leading-relaxed">
              Your deposited USDC is moved into a smart vault. A small percentage goes directly towards paying out winners.
            </p>
          </div>
        </div>

        {/* Total Earning Interest */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Total Earning Interest
          </h2>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-center shadow-md">
            <div className="text-white text-3xl font-bold">$800.00</div>
          </div>
        </div>


                     <Link 
            href={isSignedIn && currentUser ? '/dashboard' : '/signup'}
            className="fixed z-10 from-blue-400 to-blue-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all shadow-md"
          >
            {isSignedIn && currentUser ? 'Go to Dashboard' : 'Sign Up'}
          </Link>

      </div>

    </div>
  )
}
