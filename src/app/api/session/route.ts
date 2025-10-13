import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/utils';

// ============================================
// Configuration
// ============================================

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // max 10 requests per window per IP
};

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
].filter(Boolean);

// ============================================
// In-Memory Rate Limiting
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { 
  allowed: boolean; 
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up old entries (prevent memory leak)
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + RATE_LIMIT.windowMs;
    rateLimitMap.set(ip, {
      count: 1,
      resetTime,
    });
    return { 
      allowed: true, 
      remaining: RATE_LIMIT.maxRequests - 1,
      resetTime,
    };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return { 
    allowed: true, 
    remaining: RATE_LIMIT.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// ============================================
// Helper Functions
// ============================================

function getClientIp(request: NextRequest): string {
  if (process.env.NODE_ENV === 'development') {
    return '8.8.8.8';
  }
  
  // In production, get real IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  
  if (vercelIp) return vercelIp.split(',')[0].trim();
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  
  return '8.8.8.8';
}

function validateRequest(body: { addresses: { address: string; blockchains: string[] }[]; assets: string[] }): { valid: boolean; error?: string } {
  // Check addresses field
  if (!body.addresses || !Array.isArray(body.addresses)) {
    return { valid: false, error: 'addresses must be an array' };
  }

  if (body.addresses.length === 0) {
    return { valid: false, error: 'addresses array cannot be empty' };
  }

  if (body.addresses.length > 10) {
    return { valid: false, error: 'maximum 10 addresses allowed' };
  }

  // Validate each address
  for (const addr of body.addresses) {
    if (!addr.address || typeof addr.address !== 'string') {
      return { valid: false, error: 'each address must have an address field' };
    }

    // Basic Ethereum address validation (0x + 40 hex chars)
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr.address)) {
      return { valid: false, error: 'invalid Ethereum address format' };
    }

    if (!addr.blockchains || !Array.isArray(addr.blockchains)) {
      return { valid: false, error: 'each address must have blockchains array' };
    }

    if (addr.blockchains.length === 0) {
      return { valid: false, error: 'blockchains array cannot be empty' };
    }

    // Validate blockchain names
    const validBlockchains = ['base', 'ethereum', 'polygon'];
    for (const chain of addr.blockchains) {
      if (!validBlockchains.includes(chain)) {
        return { valid: false, error: `invalid blockchain: ${chain}` };
      }
    }
  }

  // Validate assets if provided
  if (body.assets) {
    if (!Array.isArray(body.assets)) {
      return { valid: false, error: 'assets must be an array' };
    }

    if (body.assets.length === 0) {
      return { valid: false, error: 'assets array cannot be empty' };
    }
  }

  return { valid: true };
}

function checkOrigin(request: NextRequest): { allowed: boolean } {
  const origin = request.headers.get('origin');
  
  // Allow requests with no origin (e.g., server-to-server)
  if (!origin) {
    return { allowed: true };
  }

  const allowed = ALLOWED_ORIGINS.some(allowedOrigin => {
    if (!allowedOrigin) return false;
    return origin === allowedOrigin || origin.startsWith(allowedOrigin);
  });

  return { allowed };
}

// ============================================
// POST Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Check CORS
    const originCheck = checkOrigin(request);
    if (!originCheck.allowed) {
      const origin = request.headers.get('origin');
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    // 2. Get client IP
    const clientIp = getClientIp(request);

    // 3. Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // 4. Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // 5. Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    const { addresses, assets } = body;

    // 6. Log request (sanitized)
    console.log('Session token request:', {
      ip: clientIp,
      addressCount: addresses.length,
      blockchains: addresses[0]?.blockchains,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 50),
    });

    // 7. Create session token
    const result = await createSessionToken({
      addresses,
      assets: assets || ['USDC'],
      clientIp,
    });

    // 8. Return success with rate limit headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
      },
    });

  } catch (error) {
    console.error('Session token error:', error);
    
    // Don't expose internal error details to client
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error';
    
    // Log full error internally
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', errorMessage);
    }
    
    return NextResponse.json(
      { error: 'Failed to create session token' },
      { status: 500 }
    );
  }
}

// ============================================
// Block Other HTTP Methods
// ============================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' },
    }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' },
    }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' },
    }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' },
    }
  );
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowed = origin && ALLOWED_ORIGINS.includes(origin);

  if (!allowed) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
