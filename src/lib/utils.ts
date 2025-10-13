import { generateJwt } from '@coinbase/cdp-sdk/auth';

export type RampType = 'onramp' | 'offramp';

export interface SessionTokenRequest {
  addresses: Array<{
    address: string;
    blockchains: string[];
  }>;
  assets?: string[];
  clientIp?: string;
}

export interface SessionTokenResponse {
  token: string;
  channel_id?: string;
}

export async function createSessionToken(
  request: SessionTokenRequest
): Promise<SessionTokenResponse> {
  const path = '/onramp/v1/token'; // for both onramp AND offramp

  const jwt = await generateJwt({
    apiKeyId: process.env.CDP_API_KEY_NAME!,
    apiKeySecret: process.env.CDP_API_KEY_PRIVATE_KEY!,
    requestMethod: 'POST',
    requestHost: 'api.developer.coinbase.com',
    requestPath: path,
    expiresIn: 120,
  });

   const payload = {
    ...request,
    clientIp: request.clientIp || '8.8.8.8',
  };

  const response = await fetch(`https://api.developer.coinbase.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create session token: ${error}`);
  }

  return response.json();
}

export const isSandbox = process.env.NEXT_PUBLIC_IS_SANDBOX === 'true';

export function buildRampURL(
  type: RampType,
  sessionToken: string,
  params: Record<string, string> = {}
): string {
  const domain = isSandbox ? 'pay-sandbox.coinbase.com' : 'pay.coinbase.com';

  // Production uses paths, sandbox doesn't
  let path = '';
  if (!isSandbox) {
    path = type === 'onramp' ? '/buy/select-asset' : '/v3/sell/input';
  }

  const url = new URL(`https://${domain}${path}`);

  url.searchParams.set('sessionToken', sessionToken);
  
  const allowedParams = [
    'defaultNetwork',
    'defaultAsset',
    'fiatCurrency',
    'presetFiatAmount',
    'presetCryptoAmount',
    'partnerUserId',
    'redirectUrl',
  ];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value && allowedParams.includes(key)) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}
