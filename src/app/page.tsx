'use client';

import Image from 'next/image';
import Link from 'next/link';
import PiggyBank from '@/assets/images/piggybank.png';
import Umbrella from '@/assets/images/umbrella.png';
import Window from '@/assets/images/window.png';
import ExternalLinkIcon from '@/assets/images/external-link.svg';
import Chart from '@/assets/images/chart.svg';
import { caprasimo, newsReader } from '@/assets/fonts';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const steps = [
  'Deposit into your HoliBobs holiday fund',
  'Automatically enter raffles to win $ prizes',
  'Withdraw your funds plus any winnings at any time!',
];

const amounts = [
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

type Winner = {
  address: string;
  amountWon: string;
  date: string;
  hash: string;
};

export default function Home() {
  const { isSignedIn, currentUser } = useAuth();
  const [supply, setSupply] = useState('0.00');
  const [holders, setHolders] = useState('0');
  const [transfers, setTransfers] = useState([]);

  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    async function load() {
      const [s, h, t, w] = await Promise.all([
        fetch('/api/vault/totalSupply').then(r => r.json()),
        fetch('/api/vault/totalHolders').then(r => r.json()),
        fetch('/api/vault/tokenTransfers').then(r => r.json()),
        fetch('/api/pool/latestWinners').then(r => r.json()),
      ]);

      setSupply(s.totalSupply);
      setHolders(h.holders);
      setTransfers(t.transfers);
      setWinners(
        w?.winners?.map(
          (winner: {
            amountUSD: string;
            to: string;
            timestamp: string;
            txHash: string;
          }) => ({
            address: winner.to,
            amountWon: winner.amountUSD,
            date: new Date(winner.timestamp).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            }),
            hash: winner.txHash,
          })
        )
      );
    }
    load();
  }, []);

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
      <div className="-mt-30 md:-mt-8 p-6 pb-10 space-y-8 bg-blue backdrop-blur-sm rounded-tr-3xl rounded-tl-3xl shadow-xl overflow-hidden">
        {/* Title Section */}
        <div className="md:w-[80%] pt-6">
          <h1 className={`text-3xl font-bold mb-3 ${caprasimo.className}`}>
            The yearly summer holiday can be expensive
          </h1>
          <p className={`${newsReader.className} mb-4 leading-5`}>
            The average family pays €2800 per year on a holiday. What if you
            could budget for your holiday, while entering to win no-loss lottery
            prizes?
          </p>
        </div>

        <div className="grid grid-cols-1 pt-6 md:grid-cols-2 lg:grid-cols-2 gap-15 border-dotted border-t-2 border-t-white">
          {/* How it works */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-8`}
            >
              How HoliBobs works
            </h2>
            <ul className="space-y-6 text-sm">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="bg-white rounded-full flex items-center justify-center w-10 h-10">
                    <span
                      className={`${caprasimo.className} text-darkBlue text-xl font-bold leading-none`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-md">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Savings Calculator */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-8`}
            >
              Savers get a chance to win
            </h2>
            <div className="flex items-center justify-between mb-6">
              {amounts.map((amount, index) => (
                <div
                  key={index}
                  className={`w-26 h-26 rounded-2xl bg-gradient-to-br ${amount.gradient} shadow-lg flex flex-col items-center justify-center p-2 ${amount.borderColor} border-2`}
                >
                  <h2
                    className={`${caprasimo.className} text-lg font-bold ${amount.textColor} mb-2`}
                  >
                    {amount.price}
                  </h2>
                  <p className={`text-xs ${amount.textColor} text-center`}>
                    {amount.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-5 md:-mt-2 p-6 space-y-8 bg-white backdrop-blur-sm rounded-tr-3xl rounded-tl-3xl border-b border-blue">
        <Image
          src={Umbrella}
          alt="Umbrella"
          width={120}
          height={115}
          className="absolute -top-10 -right-5"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-15">
          {/* Previous Winners */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-6`}
            >
              Previous winners
            </h2>
            <div className="text-sm pb-4">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-t border-blue"
                  >
                    <span>
                      {winner.address.slice(0, 6) +
                        '...' +
                        winner.address.slice(-4)}
                    </span>
                    <div className="flex">
                      <span className="pr-2">
                        Won ${winner.amountWon}, {winner.date}
                      </span>
                      <a
                        href={`https://basescan.org/tx/${winner.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={ExternalLinkIcon}
                          alt="External Link"
                          className="w-4 h-4 text-darkBlue"
                        />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p>No winners yet</p>
              )}
            </div>
          </div>

          {/* Deposits & Withdrawals */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-6`}
            >
              Deposits & withdrawals
            </h2>
            <div className="text-sm pb-4">
              {transfers.length === 0 ? (
                <p>No recent deposits or withdrawals</p>
              ) : (
                transfers.map(
                  (
                    tx: { type: string; value: number; hash: string },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-t border-blue"
                    >
                      <span>
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} of $
                        {tx.value}
                      </span>
                      <a
                        href={`https://basescan.org/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={ExternalLinkIcon}
                          alt="External Link"
                          className="w-4 h-4 text-darkBlue"
                        />
                      </a>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-15">
          {/* Where does the prize money come from */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-4`}
            >
              Where does the prize money come from?
            </h2>
            <Image
              src={Chart}
              alt="Chart"
              width={500}
              height={300}
              className="mb-4"
            />
            <p className="text-xs leading-relaxed">
              Your money is added to a pool of other people’s money. Together,
              it earns regular interest, which is then raffled off to one lucky
              depositor.
            </p>
          </div>

          {/* Total Earning Interest */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none`}
            >
              Total Earning Interest
            </h2>
            <div className="relative w-full h-[320px] flex justify-center items-center">
              <Image
                src={Window}
                alt="Window"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
              <div className="text-darkBlue absolute text-center">
                <span className={`${caprasimo.className} text-lg`}>
                  ${supply}
                </span>
                <span className="block text-xs">{holders} depositors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={isSignedIn && currentUser ? '/dashboard' : '/signup'}
        className="fixed bottom-6 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[300px] z-50 w-[85vw] mx-auto md:mx-0 rounded-full bg-blue text-darkBlue px-8 py-4 text-lg font-medium inset-shadow-sm shadow-xl/30 inset-shadow-darkBlue-500 hover:bg-darkBlue hover:text-white border border-darkBlue transition text-center  hover:cursor-pointer"
      >
        {isSignedIn && currentUser ? 'Go to Dashboard' : 'Sign Up'}
      </Link>
    </div>
  );
}
