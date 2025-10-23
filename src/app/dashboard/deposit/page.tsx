'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRamp } from '@/hooks/useRamp';
import { caprasimo } from '@/assets/fonts';
import PiggyBank from '@/assets/images/piggybank-nobg.png';
import Image from 'next/image';
import { CHAIN } from '@/lib/constants';
import { isSandbox } from '@/lib/utils';
import { useTransaction } from '@/hooks/useTransaction';
import Link from 'next/link';

export default function Deposit() {
  const { isSignedIn, currentUser, evmAddress, evmSmartAddress } = useAuth();
  const { openRamp, isLoading } = useRamp();
  const [depositAmount, setDepositAmount] = useState('');
  const router = useRouter();
  const { deposit, isProcessing, balance, setBalance } = useTransaction();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isSignedIn && !currentUser) {
      router.replace('/');
    }
  }, [isSignedIn, currentUser, router]);

  const handleBuyAndSave = async () => {
    await openRamp({
      type: 'onramp',
      amount: depositAmount,
      network: CHAIN.name,
      onSuccess: async () => {
        console.log('Ramp success!');
        const hash = await deposit(
          BigInt(Number(depositAmount) * 10 ** 6),
          evmSmartAddress!
        );
        console.log('Deposit transaction hash:', hash);
        if (hash) {
          console.log('Deposit success!');
          setSuccess(true);
          setBalance((balance ?? 0) + Number(depositAmount));
        }
      },
      onError: error => {
        alert(`Ramp error: ${error.message}`);
        console.error('Ramp error:', error.message);
      },
      onClose: async () => {
        if (isSandbox) {
          console.log('Ramp widget closed in sandbox mode.');
          const hash = await deposit(
            BigInt(Number(depositAmount) * 10 ** 6),
            evmSmartAddress!
          );
          console.log('Dummy deposit transaction hash:', hash);
          setBalance((balance ?? 0) + Number(depositAmount));

          if (hash) {
            setTimeout(() => {
              setSuccess(true);
              console.log('Deposit success in sandbox mode!');
            }, 1000);
          }
        }
      },
    });
  };

  return (
    <div className="w-full pt-30 p-5 bg-blue flex flex-col items-center">
      <h1 className={`text-3xl font-bold mb-6 ${caprasimo.className}`}>
        {success ? 'Deposit successful!' : "Let's top up!"}
      </h1>
      {!success ? (
        <form
          onSubmit={async e => {
            e.preventDefault();
            await handleBuyAndSave();
          }}
          className="space-y-4 md:w-[380px] w-full"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount to save ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder={balance ? balance.toString() : '100'}
                min="1"
                step="0.01"
                className="w-full px-4 py-4 border border-darkBlue rounded-full bg-white"
                disabled={isLoading || isProcessing}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={
              !evmAddress ||
              !depositAmount ||
              Number(depositAmount) <= 0 ||
              isLoading ||
              isProcessing
            }
            className="w-full rounded-full bg-blue text-darkBlue px-8 py-4 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer disabled:opacity-50"
          >
            {isLoading || isProcessing ? 'Loading...' : 'Top Up'}
          </button>
        </form>
      ) : (
        <Link
          href="/dashboard"
          className="rounded-full bg-blue text-darkBlue my-8 px-8 py-4 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer"
        >
          Go to Dashboard
        </Link>
      )}

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