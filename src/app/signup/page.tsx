'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function SignUp() {
  const { isSignedIn, currentUser , flowId, handleSendOTP, email, setEmail, isEmailPending, handleVerifyOTP, setOtp, isVerifyPending, otp, handleDifferentEmail } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && currentUser) {
      router.replace('/dashboard')
    }
  }, [isSignedIn, currentUser])


  if (flowId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-sm text-gray-600 mb-6">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={isVerifyPending || otp.length !== 6}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifyPending ? "Verifying..." : "Continue"}
          </button>
          <button
            type="button"
            onClick={handleDifferentEmail}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            Use different email
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full pt-40 p-4 bg-blue">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🏝️ Holibobs</h1>
        <p className="text-gray-600">Save for your dream holiday & win prizes</p>
      </div>
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isEmailPending || !email}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEmailPending ? "Sending..." : "Continue with Email"}
        </button>
      </form>
      <p className="text-xs text-gray-500 text-center mt-6">
        A wallet will be created automatically for you
      </p>
    </div>
  );
}
