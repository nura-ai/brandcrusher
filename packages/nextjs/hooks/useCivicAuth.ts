"use client";

import { useState, useEffect } from "react";

interface CivicAuthState {
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  verificationId: string | null;
}

export const useCivicAuth = () => {
  const [state, setState] = useState<CivicAuthState>({
    isVerified: false,
    isLoading: false,
    error: null,
    verificationId: null,
  });

  // Load verification status from localStorage on mount
  useEffect(() => {
    const savedVerification = localStorage.getItem('civic-verification');
    if (savedVerification) {
      try {
        const data = JSON.parse(savedVerification);
        setState(prev => ({
          ...prev,
          isVerified: data.isVerified,
          verificationId: data.verificationId,
        }));
      } catch (error) {
        console.error('Error loading Civic verification:', error);
      }
    }
  }, []);

  const verify = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Real Civic integration would use their SDK
      // For now, we'll simulate the process with a more realistic flow
      
      // Step 1: Open Civic verification modal
      const verificationWindow = window.open(
        'https://civic.com/verify',
        'civic-verify',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Step 2: Listen for verification completion
      const checkVerification = () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Verification timeout'));
          }, 30000); // 30 second timeout

          const messageHandler = (event: MessageEvent) => {
            if (event.origin !== 'https://civic.com') return;
            
            if (event.data.type === 'CIVIC_VERIFICATION_SUCCESS') {
              clearTimeout(timeout);
              window.removeEventListener('message', messageHandler);
              verificationWindow?.close();
              resolve(event.data);
            } else if (event.data.type === 'CIVIC_VERIFICATION_ERROR') {
              clearTimeout(timeout);
              window.removeEventListener('message', messageHandler);
              verificationWindow?.close();
              reject(new Error(event.data.error));
            }
          };

          window.addEventListener('message', messageHandler);
        });
      };

      // For demo purposes, simulate the verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a mock verification ID
      const verificationId = `civic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to localStorage
      const verificationData = {
        isVerified: true,
        verificationId,
        timestamp: Date.now(),
      };
      localStorage.setItem('civic-verification', JSON.stringify(verificationData));
      
      setState(prev => ({ 
        ...prev, 
        isVerified: true, 
        isLoading: false,
        verificationId,
      }));
      
      console.log("Civic verification successful!", { verificationId });
      
      // In a real implementation, you would also:
      // 1. Send verification to your backend
      // 2. Update the smart contract with verification status
      // 3. Store verification proof on-chain
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Verification failed" 
      }));
    }
  };

  const reset = () => {
    localStorage.removeItem('civic-verification');
    setState({
      isVerified: false,
      isLoading: false,
      error: null,
      verificationId: null,
    });
  };

  const getVerificationProof = () => {
    if (!state.isVerified || !state.verificationId) return null;
    
    return {
      verificationId: state.verificationId,
      timestamp: Date.now(),
      // In a real implementation, this would include cryptographic proof
      proof: `civic_proof_${state.verificationId}`,
    };
  };

  return {
    isVerified: state.isVerified,
    isLoading: state.isLoading,
    error: state.error,
    verificationId: state.verificationId,
    verify,
    reset,
    getVerificationProof,
  };
};
