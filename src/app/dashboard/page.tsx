'use client';

import { caprasimo } from '@/assets/fonts';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ExternalLinkIcon from '@/assets/images/external-link.svg';
import Link from 'next/link';

const plans = [
  {
    price: '$90',
    frequency: '16 times per day',
    gradient: 'from-white to-orange',
    textColor: 'text-darkBlue',
    borderColor: 'border-orange',
  },
  {
    price: '$1649',
    frequency: 'Every 10 days',
    gradient: 'from-[#307dc6] to-light',
    textColor: 'text-darkBlue',
    borderColor: 'border-blue',
  },
  {
    price: '$48,571',
    frequency: 'Every 3 months',
    gradient: 'from-[#055FB9] to-darkBlue',
    textColor: 'text-white',
    borderColor: 'border-darkBlue',
  },
];

export default function Dashboard() {
  const [balance] = useState(2000.0);
  const { isSignedIn, handleSignOut, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn && !currentUser) {
      router.replace('/');
    }
  }, [isSignedIn, currentUser]);

  return (
    <div className="w-full pt-30 p-5 md:w-[380px] w-full mx-auto">
      {/* Content */}
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${caprasimo.className} text-3xl`}>Savings</h1>
        <button
          onClick={handleSignOut}
          className="underline hover:cursor-pointer"
        >
          Log out
        </button>
      </div>

      {/* Savings Balance */}
      <div className={`${caprasimo.className} text-5xl`}>
        ${balance.toFixed(2)}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <Link
          href="/dashboard/deposit"
          className="w-full rounded-full bg-blue text-darkBlue px-4 py-3 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer"
        >
          Top Up
        </Link>
        <Link
          href="/dashboard/withdraw"
          className="w-full rounded-full bg-blue text-darkBlue px-4 py-3 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center hover:cursor-pointer"
        >
          Withdraw
        </Link>
      </div>

      {/* Upcoming Draw */}
      <div>
        <h2 className={`${caprasimo.className} text-3xl`}>Upcoming draw</h2>
        <p className="text-sm my-2">In 2 hrs, 27 mins, 40 seconds</p>
        <div className="flex items-center justify-between mb-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`w-26 h-26 rounded-2xl bg-gradient-to-br ${plan.gradient} shadow-lg flex flex-col items-center justify-center p-2 ${plan.borderColor} border-2`}
            >
              <h2
                className={`${caprasimo.className} text-lg font-bold ${plan.textColor} mb-2`}
              >
                {plan.price}
              </h2>
              <p className={`text-xs ${plan.textColor} text-center`}>
                {plan.frequency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My Previous Draws */}
      <div>
        <h2 className={`${caprasimo.className} text-3xl my-6`}>
          My previous draws
        </h2>
        <div className="text-sm">
          <div className="flex justify-between py-3 border-t border-white">
            <span className="">$1200</span>
            <div className="text-right">
              <div className="flex">
                <span className="pr-2">Participated in draw on 16 Oct</span>
                <a href="">
                  <Image
                    src={ExternalLinkIcon}
                    alt="External Link"
                    className="w-4 h-4 text-darkBlue"
                  />
                </a>
              </div>
              <span>Won $200.00</span>
            </div>
          </div>
          <div className="flex justify-between py-3 border-t border-white">
            <span className="">$200</span>
            <div className="text-right">
              <div className="flex">
                <span className="pr-2">Participated in draw on 15 Oct</span>
                <a href="">
                  <Image
                    src={ExternalLinkIcon}
                    alt="External Link"
                    className="w-4 h-4 text-darkBlue"
                  />
                </a>
              </div>
              <span>No win</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
