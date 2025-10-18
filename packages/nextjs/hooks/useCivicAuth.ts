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
      // Show demo modal to explain this is a simulation
      const isDemo = window.confirm(
        "🔐 CIVIC VERIFICATION DEMO\n\n" +
        "This is a simulation of Civic verification.\n" +
        "In a real implementation, this would:\n" +
        "• Open Civic's verification modal\n" +
        "• Require ID document upload\n" +
        "• Take 2-5 minutes to complete\n" +
        "• Return cryptographic proof\n\n" +
        "Click OK to simulate successful verification."
      );
      
      if (!isDemo) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Simulate realistic verification steps with progress
      console.log("🔐 Starting Civic verification process...");
      
      // Step 1: Opening verification modal
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("📱 Step 1: Opening Civic verification modal...");
      
      // Step 2: Document upload
      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log("📄 Step 2: Uploading ID document...");
      
      // Step 3: Face verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("📸 Step 3: Taking selfie for face verification...");
      
      // Step 4: Processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("⚙️ Step 4: Processing verification...");
      
      // Step 5: Generating proof
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("🔑 Step 5: Generating cryptographic proof...");
      
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
      
      console.log("✅ Civic verification successful!", { verificationId });
      
      // Show success message
      alert(
        "🎉 CIVIC VERIFICATION COMPLETE!\n\n" +
        `Verification ID: ${verificationId}\n` +
        "You now have a 1.5x score multiplier!\n\n" +
        "Note: This is a demo. Real verification would take 2-5 minutes."
      );
      
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
