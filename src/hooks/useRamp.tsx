'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { buildRampURL } from '@/lib/utils';
import { baseChain } from '@/lib/constants';

interface RampContextType {
  openRamp: (params: {
    type: 'onramp' | 'offramp';
    amount: string;
    network: string;
    redirectUrl?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onClose?: () => void;
  }) => Promise<void>;
  isLoading: boolean;
}

const RampContext = createContext<RampContextType | undefined>(undefined);

export function RampProvider({ children }: { children: ReactNode }) {
  const { evmAddress, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onSuccessRef = useRef<(() => void) | null>(null);
  const onErrorRef = useRef<((error: Error) => void) | null>(null);
  const onCloseRef = useRef<(() => void) | null>(null);
  const hasClosedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('coinbase.com')) return;

      const { eventName } = event.data;

      if (eventName === 'success' || eventName === 'exit') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setIsLoading(false);

        if (eventName === 'success' && onSuccessRef.current) {
          onSuccessRef.current();
        }

        if (!hasClosedRef.current && onCloseRef.current) {
          hasClosedRef.current = true;
          onCloseRef.current();
        }

        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
          popupRef.current = null;
        }
      }

      if (eventName === 'error') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setIsLoading(false);

        if (onErrorRef.current) {
          onErrorRef.current(
            new Error(event.data.error || 'Transaction failed')
          );
        }

        if (!hasClosedRef.current && onCloseRef.current) {
          hasClosedRef.current = true;
          onCloseRef.current();
        }

        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
          popupRef.current = null;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const openRamp = async (params: {
    type: 'onramp' | 'offramp';
    amount: string;
    network: string;
    redirectUrl?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onClose?: () => void;
  }) => {
    if (!evmAddress || !params.amount) {
      params.onError?.(new Error('Invalid parameters'));
      return;
    }

    setIsLoading(true);
    onSuccessRef.current = params.onSuccess || null;
    onErrorRef.current = params.onError || null;
    onCloseRef.current = params.onClose || null;
    hasClosedRef.current = false;

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addresses: [{ address: evmAddress, blockchains: [baseChain.name] }],
          assets: ['USDC'],
        }),
      });
      if (!response.ok) throw new Error('Session creation failed');
      const { token } = await response.json();

      const rampURL = buildRampURL(params.type, token, {
        defaultNetwork: params.network,
        defaultAsset: 'USDC',
        fiatCurrency: 'USD',
        ...(params.type === 'onramp'
          ? { presetFiatAmount: params.amount }
          : { presetCryptoAmount: params.amount }),
        partnerUserId: currentUser?.userId || '',
        redirectUrl: params.redirectUrl || '',
      });

      console.log('Ramp URL:', rampURL);

      const popup = window.open(
        rampURL,
        '_blank',
        'width=450,height=700,left=400,top=100'
      );
      if (!popup) throw new Error('Popup blocked');
      popupRef.current = popup;

      intervalRef.current = setInterval(() => {
        if (popup.closed) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsLoading(false);
          popupRef.current = null;

          if (!hasClosedRef.current && onCloseRef.current) {
            hasClosedRef.current = true;
            onCloseRef.current();
          }
        }
      }, 500);
    } catch (err) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsLoading(false);
      hasClosedRef.current = false;
      onErrorRef.current?.(err as Error);
    }
  };

  return (
    <RampContext.Provider value={{ openRamp, isLoading }}>
      {children}
    </RampContext.Provider>
  );
}

export function useRamp() {
  const context = useContext(RampContext);
  if (context === undefined) {
    throw new Error('useRamp must be used within a RampProvider');
  }
  return context;
}
