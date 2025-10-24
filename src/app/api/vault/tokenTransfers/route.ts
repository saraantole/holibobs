import { baseChain, vaultAddress } from '@/lib/constants';

export async function GET() {
  const address = vaultAddress.mainnet;
  const apiKey = process.env.MORALIS_API_KEY;
  const chain = baseChain.name;

  try {
    // Get all transfers
    const res = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${address}/transfers?chain=${chain}&order=DESC&limit=10`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': apiKey as string,
        },
      }
    );

    const data = await res.json();
    const ZERO = '0x0000000000000000000000000000000000000000';

    // Filter only deposits (mint) and withdrawals (burn)
    const filtered = (data.result || [])
      .filter(
        (tx: { from_address: string; to_address: string }) =>
          tx.from_address === ZERO || tx.to_address === ZERO
      )
      .map(
        (tx: {
          transaction_hash: string;
          from_address: string;
          value: string;
          block_timestamp: string;
        }) => ({
          hash: tx.transaction_hash,
          value: ((Number(tx.value) / 1e18) * 0.2).toFixed(2).toString(),
          type: tx.from_address === ZERO ? 'deposit' : 'withdrawal',
          timestamp: tx.block_timestamp,
        })
      );

    return Response.json({ transfers: filtered.slice(0, 3) });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
