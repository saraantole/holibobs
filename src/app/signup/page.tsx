'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { caprasimo } from '@/assets/fonts';
import PiggyBank from '@/assets/images/piggybank-nobg.png';
import Image from 'next/image';

export default function SignUp() {
  const {
    isSignedIn,
    currentUser,
    flowId,
    handleSendOTP,
    email,
    setEmail,
    isEmailPending,
    handleVerifyOTP,
    setOtp,
    isVerifyPending,
    otp,
    handleDifferentEmail,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && currentUser) {
      router.replace('/dashboard');
    }
  }, [isSignedIn, currentUser]);

  if (flowId) {
    return (
      <div className="w-full pt-30 p-5 bg-blue flex flex-col items-center">
        <h2 className={`text-3xl font-bold mb-6 ${caprasimo.className}`}>
          Check your email
        </h2>
        <p className="text-sm mb-2">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
        <form
          onSubmit={handleVerifyOTP}
          className="space-y-4 md:w-[380px] w-full"
        >
          <input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="w-full px-4 py-4 border border-darkBlue rounded-full bg-white"
            autoFocus
          />
          <button
            type="submit"
            disabled={isVerifyPending || otp.length !== 6}
            className="w-full rounded-full bg-blue text-darkBlue px-8 py-4 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer disabled:opacity-50"
          >
            {isVerifyPending ? 'Verifying...' : 'Continue'}
          </button>
          <button
            type="button"
            onClick={handleDifferentEmail}
            className="w-full text-sm hover:cursor-pointer"
          >
            Use different email
          </button>
        </form>

        <div>
          <Image src={PiggyBank} alt="Piggy Bank" width={300} height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-30 p-5 bg-blue flex flex-col items-center">
      <h1 className={`text-3xl font-bold mb-6 ${caprasimo.className}`}>
        Let&apos;s get some details
      </h1>
      <form onSubmit={handleSendOTP} className="space-y-4 md:w-[380px] w-full">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-4 border border-darkBlue rounded-full bg-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isEmailPending || !email}
          className="w-full rounded-full bg-blue text-darkBlue px-8 py-4 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer disabled:opacity-50"
        >
          {isEmailPending ? 'Sending...' : 'Next'}
        </button>
      </form>

      <div>
        <Image
          src={PiggyBank}
          alt="Piggy Bank"
          width={300}
          height={200}
          className="mt-10"
        />
      </div>
    </div>
  );
}
