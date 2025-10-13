"use client";

import { useState } from 'react';
import { useSendEvmTransaction, useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { encodeFunctionData, parseUnits } from 'viem';
import { CONTRACTS, ERC20_ABI, PRIZE_VAULT_ABI } from '@/lib/contracts';
import { useRamp } from './RampProvider';

export default function SaveFlow() {
  const { evmAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { openRamp, isLoading: isRampLoading } = useRamp();
  const [amount, setAmount] = useState('100');
  const [isDepositing, setIsDepositing] = useState(false);
  const [step, setStep] = useState<'idle' | 'approve' | 'deposit'>('idle');

  const evmAccount = currentUser?.evmAccounts?.[0];

  const handleSave = async () => {
    await openRamp({
      type: 'onramp',
      amount,
      network: 'base-sepolia',
      onSuccess: async () => {
        const shouldDeposit = confirm(
          `Purchase complete! Deposit $${amount} USDC to your holiday savings?`
        );
        if (shouldDeposit) await depositToVault();
      },
      onError: (error) => alert(`Error: ${error.message}`),
    });
  };

  const depositToVault = async () => {
    if (!evmAddress || !evmAccount) return;

    setIsDepositing(true);
    const amountWei = parseUnits(amount, 6);

    try {
      setStep('approve');
      await sendEvmTransaction({
        evmAccount,
        network: 'base-sepolia',
        transaction: {
          to: CONTRACTS.usdc,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [CONTRACTS.prizeVault, amountWei],
          }),
          chainId: 84532,
        },
      });

      setStep('deposit');
      await sendEvmTransaction({
        evmAccount,
        network: 'base-sepolia',
        transaction: {
          to: CONTRACTS.prizeVault,
          data: encodeFunctionData({
            abi: PRIZE_VAULT_ABI,
            functionName: 'deposit',
            args: [amountWei, evmAddress],
          }),
          chainId: 84532,
        },
      });

      alert(`🎉 $${amount} saved and earning prizes!`);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Try again later.');
    } finally {
      setStep('idle');
      setIsDepositing(false);
    }
  };

  const getButtonText = () => {
    if (isRampLoading) return 'Buying USDC...';
    if (step === 'approve') return 'Approving...';
    if (step === 'deposit') return 'Depositing...';
    return `🏝️ Save $${amount || '0'}`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-3xl">🏝️</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">Save for Holiday</h3>
          <p className="text-sm text-gray-600">Buy USDC & win prizes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border-2 border-green-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to save
        </label>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-400">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="flex-1 text-3xl font-bold text-gray-900 focus:outline-none"
            disabled={isRampLoading || isDepositing}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!evmAddress || !evmAccount || !amount || isRampLoading || isDepositing}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
      >
        {getButtonText()}
      </button>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-xs font-medium text-blue-900 mb-2">✨ Your money will:</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✅ Be deposited to PoolTogether vault</li>
          <li>✅ Earn yield automatically</li>
          <li>✅ Enter weekly prize draws</li>
          <li>✅ Stay withdrawable anytime</li>
        </ul>
      </div>
    </div>
  );
}
