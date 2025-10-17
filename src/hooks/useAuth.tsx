'use client'

import { createContext, useContext, ReactNode } from 'react';
import { useState } from 'react';
import { 
  useSignInWithEmail, 
  useVerifyEmailOTP, 
  useCurrentUser, 
  useIsSignedIn, 
  useSignOut, 
  useEvmAddress 
} from '@coinbase/cdp-hooks';

interface AuthContextType {
  email: string;
  otp: string;
  flowId: string | null;
  isEmailPending: boolean;
  isVerifyPending: boolean;
  currentUser: any;
  isSignedIn: boolean;
  evmAddress: `0x${string}` | null; // Changed from string | undefined
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  handleSendOTP: (e: React.FormEvent) => Promise<void>;
  handleVerifyOTP: (e: React.FormEvent) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleDifferentEmail: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [isEmailPending, setIsEmailPending] = useState(false);
  const [isVerifyPending, setIsVerifyPending] = useState(false);

  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { currentUser } = useCurrentUser();
  const { isSignedIn } = useIsSignedIn();
  const { signOut } = useSignOut();
  const { evmAddress } = useEvmAddress();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailPending(true);
    
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsEmailPending(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) return;

    setIsVerifyPending(true);

    try {
      const { isNewUser } = await verifyEmailOTP({ flowId, otp });
      if (isNewUser) {
        alert("Welcome! Your wallet has been created automatically 🎉");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyPending(false);
    }
  };

  const handleDifferentEmail = () => {
    setFlowId(null);
    setOtp("");
  };

  const handleSignOut = async () => {
    await signOut();
    setFlowId(null);
    setEmail("");
    setOtp("");
  };

  const value = {
    email,
    otp,
    flowId,
    isEmailPending,
    isVerifyPending,
    currentUser,
    isSignedIn,
    evmAddress,
    setEmail,
    setOtp,
    handleSendOTP,
    handleVerifyOTP,
    handleSignOut,
    handleDifferentEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}