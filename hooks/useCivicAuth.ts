"use client";

import { useState, useEffect } from "react";

export function useCivicAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load verification status from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("civic_verified");
    if (stored === "true") {
      setIsVerified(true);
    }
  }, []);

  const verify = async () => {
    setIsVerifying(true);
    
    // Simulate Civic verification process
    console.log("🔐 Starting Civic verification...");
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("✅ Civic verification successful!");
    
    setIsVerified(true);
    setIsVerifying(false);
    
    // Save to localStorage
    localStorage.setItem("civic_verified", "true");
  };

  const reset = () => {
    setIsVerified(false);
    localStorage.removeItem("civic_verified");
  };

  return {
    isVerified,
    isVerifying,
    verify,
    reset,
  };
}

