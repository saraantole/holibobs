"use client";

import { useState } from "react";
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useCurrentUser,
  useIsSignedIn,
  useSignOut,
  useEvmAddress,
} from "@coinbase/cdp-hooks";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [isEmailPending, setIsEmailPending] = useState(false);
  const [isVerifyPending, setIsVerifyPending] = useState(false);

  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { currentUser } = useCurrentUser();
  const { isSignedIn } = useIsSignedIn();
  const { signOut } = useSignOut();
  const { evmAddress } = useEvmAddress();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailPending(true);
    
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsEmailPending(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) return;

    setIsVerifyPending(true);

    try {
      const { isNewUser } = await verifyEmailOTP({ flowId, otp });
      if (isNewUser) {
        alert("Welcome! Your wallet has been created automatically 🎉");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyPending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setFlowId(null);
    setEmail("");
    setOtp("");
  };

  if (isSignedIn && currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome! 🏝️</h2>
            <p className="text-sm text-gray-600 mt-1">{email || "Logged in"}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Your Wallet</p>
          <code className="text-xs bg-white px-2 py-1 rounded border break-all">
            {evmAddress}
          </code>
        </div>
      </div>
    );
  }

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
            onClick={() => { setFlowId(null); setOtp(""); }}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            Use different email
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
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
