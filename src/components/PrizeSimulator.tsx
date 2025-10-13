"use client";

import { useState } from "react";

export default function PrizeSimulator() {
  const [showWin, setShowWin] = useState(false);
  const [prizeAmount, setPrizeAmount] = useState(0);

  const simulateWin = () => {
    const prizes = [10, 25, 50, 100, 250, 500];
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setPrizeAmount(randomPrize);
    setShowWin(true);

    setTimeout(() => setShowWin(false), 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🎰</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">Prize Simulator</h3>
          <p className="text-sm text-gray-600">Demo prize draws</p>
        </div>
      </div>

      {showWin && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-center animate-pulse">
          <p className="text-3xl font-bold text-white mb-2">🎉 YOU WON! 🎉</p>
          <p className="text-4xl font-bold text-white">${prizeAmount}</p>
          <p className="text-sm text-white mt-2 opacity-90">
            Prize added to your balance!
          </p>
        </div>
      )}

      <button
        onClick={simulateWin}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600"
      >
        🎲 Simulate Prize Draw
      </button>

      <div className="bg-yellow-50 rounded p-3 space-y-2">
        <p className="text-xs font-medium text-yellow-800">Prize Stats:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-yellow-600">Weekly Pool</p>
            <p className="font-bold text-yellow-900">$20,000</p>
          </div>
          <div>
            <p className="text-yellow-600">Winners/Week</p>
            <p className="font-bold text-yellow-900">450+</p>
          </div>
        </div>
        <p className="text-xs text-yellow-700 mt-2">
          💡 Real prizes drawn automatically on mainnet
        </p>
      </div>
    </div>
  );
}
