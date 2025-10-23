'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSendUserOperation } from '@coinbase/cdp-hooks';
import { Address, encodeFunctionData } from 'viem';
import { CHAIN, CONTRACTS } from '@/lib/constants';
import { SendEvmTransactionWithEndUserAccountBodyNetwork } from '@coinbase/cdp-core';
import { isSandbox } from '@/lib/utils';

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface TransactionContextType {
  deposit: (amount: bigint, receiver: Address) => Promise<any>;
  withdraw: (amount: bigint, receiver: Address) => Promise<any>;
  status: string;
  data: any;
  error: any;
  isProcessing: boolean;
}

const prizeVaultAbi = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'onBehalfOf', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
    outputs: [],
  },
];

const erc20Abi = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const prizeVaultAddress = CONTRACTS.vault;
const usdcAddress = CONTRACTS.token;

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { sendUserOperation, status, data, error } = useSendUserOperation();
  const [isProcessing, setIsProcessing] = useState(false);

  const deposit = async (amount: bigint, smartAccount: Address) => {
    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [prizeVaultAddress, amount],
    });

    const depositData = encodeFunctionData({
      abi: prizeVaultAbi,
      functionName: 'deposit',
      args: [amount, smartAccount],
    });

    setIsProcessing(true);

    if (isSandbox) {
      console.log('Sandbox mode: Skipping actual user operation send.');
      return { userOperationHash: '0xsandboxmodehash' };
    }

    try {
      const result = await sendUserOperation({
        evmSmartAccount: smartAccount,
        network: CHAIN.name as SendEvmTransactionWithEndUserAccountBodyNetwork,
        calls: [
          { to: usdcAddress, value: BigInt(0), data: approveData }, // allowance
          { to: prizeVaultAddress, value: BigInt(0), data: depositData }, // deposit
        ],
        useCdpPaymaster: true,
      });
      console.log('Deposit UserOperationHash:', result.userOperationHash);
      return result;
    } catch (err) {
      console.error('Failed to send deposit user operation:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const withdraw = async (amount: bigint, smartAccount: Address) => {
    const withdrawData = encodeFunctionData({
      abi: prizeVaultAbi,
      functionName: 'withdraw',
      args: [amount, smartAccount],
    });

    setIsProcessing(true);

    if (isSandbox) {
      console.log('Sandbox mode: Skipping actual user operation send.');
      setIsProcessing(false);
      return { userOperationHash: '0xsandboxmodehash' };
    }

    try {
      const result = await sendUserOperation({
        evmSmartAccount: smartAccount,
        network: CHAIN.name as SendEvmTransactionWithEndUserAccountBodyNetwork,
        calls: [
          { to: prizeVaultAddress, value: BigInt(0), data: withdrawData },
        ],
        useCdpPaymaster: true,
      });
      console.log('Withdraw User Operation Hash:', result.userOperationHash);
      return result;
    } catch (err) {
      console.error('Failed to send withdraw user operation:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{ deposit, withdraw, status, data, error, isProcessing }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}
