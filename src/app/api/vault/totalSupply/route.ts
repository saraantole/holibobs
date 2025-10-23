import { baseChain, vaultAddress } from '@/lib/constants';

export async function GET() {
  const address = vaultAddress.mainnet;
  const apiKey = process.env.MORALIS_API_KEY;
  const chain = baseChain.name;

  try {
    const res = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chain}&addresses=${address}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': apiKey as string,
        },
      }
    );

    if (!res.ok) throw new Error(`Moralis error: ${res.status}`);
    const data = await res.json();

    const token = data[0];

    return Response.json({
      totalSupply: token.total_supply_formatted,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to fetch token stats' },
      { status: 500 }
    );
  }
}
