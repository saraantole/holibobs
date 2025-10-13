"use client";

import { useState, useEffect, useCallback } from "react";
import { useEvmAddress, useSendEvmTransaction, useCurrentUser } from "@coinbase/cdp-hooks";
import { encodeFunctionData, formatUnits, parseUnits } from "viem";
import { CONTRACTS, PRIZE_VAULT_ABI } from "@/lib/contracts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { useRamp } from './RampProvider';

export default function WithdrawFlow() {
  const { evmAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { openRamp, isLoading: isOfframpLoading } = useRamp();
  
  // Vault state
  const [balance, setBalance] = useState("0");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  
  // Offramp state
  const [offrampAmount, setOfframpAmount] = useState("");

  const evmAccount = currentUser?.evmAccounts?.[0];

  // Fetch vault balance
  const fetchBalance = useCallback(async () => {
    if (!evmAddress) {
      setIsLoadingBalance(false);
      return;
    }

    try {
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      const vaultBalance = await client.readContract({
        address: CONTRACTS.prizeVault,
        abi: PRIZE_VAULT_ABI,
        functionName: "balanceOf",
        args: [evmAddress],
      });

      setBalance(formatUnits(vaultBalance as bigint, 6));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [evmAddress]);

  useEffect(() => {
    fetchBalance();
    if (!evmAddress) return;
    
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [evmAddress, fetchBalance]);

  // Withdraw from vault
  const handleWithdraw = async () => {
    if (!evmAddress || !evmAccount || !withdrawAmount || parseFloat(withdrawAmount) <= 0)
      return;

    setIsWithdrawing(true);

    try {
      const shares = parseUnits(withdrawAmount, 6);

      await sendEvmTransaction({
        evmAccount,
        network: "base",
        transaction: {
          to: CONTRACTS.prizeVault,
          data: encodeFunctionData({
            abi: PRIZE_VAULT_ABI,
            functionName: "redeem",
            args: [shares, evmAddress, evmAddress],
          }),
          chainId: 84532,
        },
      });

      alert(`✅ Withdrawn ${withdrawAmount} USDC from vault!`);
      setWithdrawAmount("");
      setTimeout(() => fetchBalance(), 2000);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Cash out (offramp)
  const handleCashOut = async () => {
    await openRamp({
      type: 'offramp',
      amount: offrampAmount,
      network: 'base-sepolia',
      onSuccess: () => {
        alert('💰 Cash out complete! Funds will arrive in your bank account (1-3 days).');
        setOfframpAmount('');
      },
      onError: (error) => alert(`Offramp error: ${error.message}`),
    });
  };

  return (
    <div className="space-y-6">
      {/* Vault Balance & Withdraw */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Your Savings Vault</h3>
            <p className="text-sm text-gray-600">Withdraw anytime</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 text-center">
          {isLoadingBalance ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <p className="text-4xl font-bold text-gray-900">{balance}</p>
              <p className="text-sm text-gray-600 mt-1">USDC</p>
            </>
          )}
        </div>

        {/* Withdraw Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Withdraw Amount
            </label>
            <button
              onClick={() => setWithdrawAmount(balance)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              disabled={parseFloat(balance) === 0}
            >
              Max
            </button>
          </div>
          <input
            type="number"
            placeholder="0"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            max={balance}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isWithdrawing || parseFloat(balance) === 0}
          />
        </div>

        <button
          onClick={handleWithdraw}
          disabled={
            !evmAddress ||
            !evmAccount ||
            !withdrawAmount ||
            isWithdrawing ||
            parseFloat(withdrawAmount) <= 0 ||
            parseFloat(withdrawAmount) > parseFloat(balance)
          }
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw from Vault"}
        </button>

        {parseFloat(balance) === 0 && (
          <p className="text-xs text-gray-500 text-center">
            No funds in vault. Start saving first!
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-500">
            THEN
          </span>
        </div>
      </div>

      {/* Cash Out (Offramp) */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏦</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Cash Out to Bank</h3>
            <p className="text-sm text-gray-600">Sell USDC → USD</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to cash out (USDC)
          </label>
          <input
            type="number"
            value={offrampAmount}
            onChange={(e) => setOfframpAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 text-2xl font-bold border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            disabled={isOfframpLoading}
          />
        </div>

        <button
          onClick={handleCashOut}
          disabled={!evmAddress || !offrampAmount || isOfframpLoading || parseFloat(offrampAmount) <= 0}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOfframpLoading ? 'Opening Coinbase...' : `💵 Cash Out $${offrampAmount || '0'}`}
        </button>

        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs text-green-800">
            <strong>💡 Note:</strong> First withdraw USDC from vault above, then cash out to your bank account. Funds arrive in 1-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
