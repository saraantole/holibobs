import { useSendUserOperation, useCurrentUser } from '@coinbase/cdp-hooks';
import { Address, encodeFunctionData } from 'viem';
import { CHAIN, CONTRACTS } from '@/lib/constants';
import { SendEvmTransactionWithEndUserAccountBodyNetwork } from '@coinbase/cdp-core';

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

export function useDeposit() {
  const { sendUserOperation, status, data, error } = useSendUserOperation();

  async function deposit(amount: bigint, receiver: Address) {
    const prizeVaultAddress = CONTRACTS.vault;
    const usdcAddress = CONTRACTS.token;

    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [prizeVaultAddress, amount],
    });

    // Encode deposit data
    const depositData = encodeFunctionData({
      abi: prizeVaultAbi,
      functionName: 'deposit',
      args: [amount, receiver],
    });

    // Step 2: Deposit to PrizeVault
    try {
      const result = await sendUserOperation({
        evmSmartAccount: receiver,
        network: CHAIN.name as SendEvmTransactionWithEndUserAccountBodyNetwork,
        calls: [
          {
            to: usdcAddress,
            value: BigInt(0),
            data: approveData,
          },
          {
            to: prizeVaultAddress,
            value: BigInt(0),
            data: depositData,
          },
        ],
        useCdpPaymaster: true, // optional gas sponsorship
      });

      console.log('Deposit UserOperationHash:', result.userOperationHash);
      return result;
    } catch (err) {
      console.error('Failed to send deposit user operation:', err);
      throw err;
    }
  }

  async function withdraw(amount: bigint, receiver: Address) {
    const prizeVaultAddress = CONTRACTS.vault;

    // Encode withdraw call
    const withdrawData = encodeFunctionData({
      abi: prizeVaultAbi,
      functionName: 'withdraw',
      args: [amount, receiver],
    });

    try {
      const result = await sendUserOperation({
        evmSmartAccount: receiver,
        network: CHAIN.name as SendEvmTransactionWithEndUserAccountBodyNetwork,
        calls: [
          {
            to: prizeVaultAddress,
            value: BigInt(0),
            data: withdrawData,
          },
        ],
        useCdpPaymaster: true, // optional gas sponsorship
      });
      console.log('Withdraw User Operation Hash:', result.userOperationHash);
      return result;
    } catch (err) {
      console.error('Failed to send withdraw user operation:', err);
      throw err;
    }
  }

  return { deposit, withdraw, status, data, error };
}
