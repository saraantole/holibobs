"use client";

import { useIsSignedIn } from "@coinbase/cdp-hooks";
import Auth from "@/components/Auth";
import PrizeSimulator from "@/components/PrizeSimulator";
import SaveFlow from "@/components/SaveFlow";
import WithdrawFlow from "@/components/WithdrawFlow";

export default function Home() {
  const { isSignedIn } = useIsSignedIn();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">🏝️ Holibobs</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Auth />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SaveFlow />
            <PrizeSimulator />
          </div>
          <WithdrawFlow />
        </div>
      </main>
    </div>
  );
}
