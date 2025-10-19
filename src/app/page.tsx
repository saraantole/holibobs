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

export default function Home() {
  const { isSignedIn, currentUser } = useAuth();
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
        <div className="md:w-[80%] border-dotted border-b-2 border-b-white py-6">
          <h1 className={`text-3xl font-bold mb-3 ${caprasimo.className}`}>
            The yearly summer holiday can be expensive
          </h1>
          <p className={`${newsReader.className} mb-4 leading-5`}>
            The average family pays €2800 per year on a holiday. What if you
            could budget for your holiday, while entering to win no-loss lottery
            prizes?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-15">
          {/* How it works */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-8`}
            >
              How HoliBobs works
            </h2>
            <ul className="space-y-6 text-sm">
              <li className="flex items-center gap-3">
                <div className="bg-white rounded-full flex items-center justify-center w-10 h-10">
                  <span
                    className={`${caprasimo.className} text-darkBlue text-xl font-bold leading-none`}
                  >
                    1
                  </span>
                </div>
                <span className="text-lg">
                  Deposit into your HoliBobs holiday fund
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-white rounded-full flex items-center justify-center w-10 h-10">
                  <span
                    className={`${caprasimo.className} text-darkBlue text-xl font-bold leading-none`}
                  >
                    2
                  </span>
                </div>
                <span className="text-lg">
                  Automatically enter raffles to win $ prizes
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-white rounded-full flex items-center justify-center w-10 h-10">
                  <span
                    className={`${caprasimo.className} text-darkBlue text-xl font-bold leading-none`}
                  >
                    3
                  </span>
                </div>
                <span className="text-lg">
                  Withdraw your funds plus any winnings at any time!
                </span>
              </li>
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
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$20 depositor</span>
                <div className="flex">
                  <span className="pr-2">Won $2093, 15 Oct</span>
                  <a href="">
                    <Image
                      src={ExternalLinkIcon}
                      alt="External Link"
                      className="w-4 h-4 text-darkBlue"
                    />
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$120 depositor</span>
                <div className="flex">
                  <span className="pr-2">Won $100, 14 Oct</span>
                  <a href="">
                    <Image
                      src={ExternalLinkIcon}
                      alt="External Link"
                      className="w-4 h-4 text-darkBlue"
                    />
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$200 depositor</span>
                <div className="flex">
                  <span className="pr-2">Won $10, 13 Oct</span>
                  <a href="">
                    <Image
                      src={ExternalLinkIcon}
                      alt="External Link"
                      className="w-4 h-4 text-darkBlue"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Deposits & Withdrawals */}
          <div>
            <h2
              className={`${caprasimo.className} text-darkBlue text-2xl font-bold leading-none mb-8`}
            >
              Deposits & withdrawals
            </h2>
            <div className="text-sm pb-4">
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$20 depositor</span>
                <a href="">
                  <Image
                    src={ExternalLinkIcon}
                    alt="External Link"
                    className="w-4 h-4 text-darkBlue"
                  />
                </a>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$120 depositor</span>
                <a href="">
                  <Image
                    src={ExternalLinkIcon}
                    alt="External Link"
                    className="w-4 h-4 text-darkBlue"
                  />
                </a>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-blue">
                <span className="">$200 depositor</span>
                <a href="">
                  <Image
                    src={ExternalLinkIcon}
                    alt="External Link"
                    className="w-4 h-4 text-darkBlue"
                  />
                </a>
              </div>
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
                  $823,000
                </span>
                <span className="block text-xs">1,200 depositors</span>
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
