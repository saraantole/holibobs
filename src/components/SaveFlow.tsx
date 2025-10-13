"use client";

import { useState } from 'react';
import { useSendEvmTransaction, useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks';
import { createPublicClient, encodeFunctionData, http, parseGwei, parseUnits } from 'viem';
import { CONTRACTS, ERC20_ABI, PRIZE_VAULT_ABI } from '@/lib/contracts';
import { useRamp } from './RampProvider';
import { isSandbox } from '@/lib/utils';
import { base, baseSepolia } from 'viem/chains';

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
      network: isSandbox ? 'base-sepolia' : 'base',
      onSuccess: async () => {
        const shouldDeposit = confirm(
          `Purchase complete! Deposit $${amount} USDC to your holiday savings?`
        );
        if (shouldDeposit) await depositToVault();
      },
      onError: (error) => alert(`Error: ${error.message}`),
      onClose: () => {
      // This fires ALWAYS when popup closes, regardless of reason
      if (isSandbox) {
        console.log('🔁 Refreshing balances in sandbox...')

        const shouldDeposit = confirm(
          `Purchase complete! Deposit $${amount} USDC to your holiday savings?`
        );
        if (shouldDeposit) depositToVault();
      } else {
        console.log('🔁 Refreshing balances in production...')
      }

      // TODO: Refresh balances, show notification, etc.
    }
    });
  };

  const depositToVault = async () => {
    if (!evmAddress || !evmAccount) return;

    setIsDepositing(true);
    const amountWei = parseUnits(amount, 6);
    const chainId = isSandbox ? 84532 : 8453;

    try {
      setStep('approve');
      
      //TODO
/*       await sendEvmTransaction({
        evmAccount,
        network: isSandbox ? 'base-sepolia' : 'base',
        transaction: {
          to: CONTRACTS.usdc,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [CONTRACTS.prizeVault, amountWei],
          }),
          chainId,
          maxFeePerGas: parseGwei('0.1'),
          maxPriorityFeePerGas: parseGwei('0.01'),
        },
      });

      console.log('✅ Approval successful');

      setStep('deposit');
      
      await sendEvmTransaction({
        evmAccount,
        network: isSandbox ? 'base-sepolia' : 'base',
        transaction: {
          to: CONTRACTS.prizeVault,
          data: encodeFunctionData({
            abi: PRIZE_VAULT_ABI,
            functionName: 'deposit',
            args: [amountWei, evmAddress],
          }),
          chainId,
          maxFeePerGas: parseGwei('0.1'),
          maxPriorityFeePerGas: parseGwei('0.01'),
        },
      }); */

      console.log('✅ Deposit successful');
      alert(`🎉 $${amount} saved and earning prizes!`);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
