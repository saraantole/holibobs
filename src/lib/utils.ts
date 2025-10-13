import { generateJwt } from '@coinbase/cdp-sdk/auth';

interface JWTOptions {
  requestMethod: string;
  requestPath: string;
  requestHost?: string;
}

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

async function generateCoinbaseJWT(options: JWTOptions): Promise<string> {
  const { requestMethod, requestPath, requestHost = 'api.developer.coinbase.com' } = options;

  return await generateJwt({
    apiKeyId: process.env.CDP_API_KEY_NAME!,
    apiKeySecret: process.env.CDP_API_KEY_PRIVATE_KEY!,
    requestMethod,
    requestHost,
    requestPath,
    expiresIn: 120,
  });
}

export async function createSessionToken(
  request: SessionTokenRequest
): Promise<SessionTokenResponse> {
  const path = '/onramp/v1/token'; // for both onramp AND offramp
  
  const jwt = await generateCoinbaseJWT({
    requestMethod: 'POST',
    requestPath: path,
  });

   const payload = {
    ...request,
    clientIp: request.clientIp || '127.0.0.1',
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

export function buildRampURL(
  type: RampType,
  sessionToken: string,
  params: Record<string, string> = {}
): string {
  const isTestnet = params.defaultNetwork?.includes('sepolia');
  const domain = isTestnet ? 'pay-sandbox.coinbase.com' : 'pay.coinbase.com';
  
  // Production uses paths, sandbox doesn't
  let path = '';
  if (!isTestnet) {
    path = type === 'onramp' ? '/buy/select-asset' : '/v3/sell/input';
  }
  
  const url = new URL(`https://${domain}${path}?redirectUrl=http://localhost:3000`);
  
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

  console.log('Ramp URL:', url.toString());
  
  return url.toString();
}
