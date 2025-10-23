import { baseChain, prizePoolAddress } from '@/lib/constants';

export async function GET() {
  const address = prizePoolAddress.mainnet;
  const apiKey = process.env.MORALIS_API_KEY;
  const chain = baseChain.name;

  try {
    // Get all transfers
    const res = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/verbose?chain=${chain}&order=DESC&limit=10`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': apiKey as string,
        },
      }
    );

    const data = await res.json();

    const winners = [];

    for (const tx of data.result || []) {
      for (const log of tx.logs || []) {
        const event = log.decoded_event;
        if (
          event?.label === 'Transfer' &&
          event?.params
            ?.find((p: { name: string }) => p.name === 'from')
            ?.value.toLowerCase() === address.toLowerCase()
        ) {
          winners.push({
            txHash: tx.hash,
            to: event.params.find((p: { name: string }) => p.name === 'to')
              .value,
            amount:
              Number(
                event.params.find((p: { name: string }) => p.name === 'amount')
                  .value
              ) / 1e18,
            timestamp: tx.block_timestamp,
          });
        }
      }
    }

    return Response.json({ winners: winners.slice(0, 3) });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
