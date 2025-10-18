# Civic Auth Integration Guide

## 🔐 Real Civic Auth Implementation

This document explains how to integrate real Civic Auth verification into the Brand Crusher game.

## 📋 Prerequisites

1. **Civic Developer Account**
   - Register at [Civic Developer Portal](https://developers.civic.com)
   - Create a new application
   - Get your `CLIENT_ID` and `CLIENT_SECRET`

2. **Environment Variables**
   ```bash
   # Add to packages/nextjs/.env.local
   NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id
   CIVIC_CLIENT_SECRET=your_civic_secret
   CIVIC_REDIRECT_URI=http://localhost:3000/auth/civic/callback
   ```

## 🚀 Implementation Steps

### 1. Install Civic SDK

```bash
npm install @civic/embedded-wallet-sdk
# or
npm install civic-sip-api
```

### 2. Update useCivicAuth Hook

Replace the mock implementation with real Civic integration:

```typescript
import { CivicSip } from '@civic/embedded-wallet-sdk';

export const useCivicAuth = () => {
  const [state, setState] = useState<CivicAuthState>({
    isVerified: false,
    isLoading: false,
    error: null,
    verificationId: null,
  });

  const verify = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Initialize Civic SDK
      const civic = new CivicSip({
        appId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID,
        environment: 'sandbox', // or 'production'
      });

      // Start verification process
      const result = await civic.verify();
      
      if (result.success) {
        // Store verification data
        const verificationData = {
          isVerified: true,
          verificationId: result.verificationId,
          timestamp: Date.now(),
          proof: result.proof,
        };
        
        localStorage.setItem('civic-verification', JSON.stringify(verificationData));
        
        setState(prev => ({ 
          ...prev, 
          isVerified: true, 
          isLoading: false,
          verificationId: result.verificationId,
        }));

        // Update smart contract with verification status
        await updateContractVerification(true, result.verificationId);
        
      } else {
        throw new Error(result.error || 'Verification failed');
      }
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Verification failed" 
      }));
    }
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
```

### 3. Smart Contract Integration

Update the smart contract to store Civic verification:

```solidity
mapping(address => bool) public civicVerifiedPlayers;
mapping(address => string) public civicVerificationIds;

function updateCivicVerification(bool verified, string memory verificationId) external {
    civicVerifiedPlayers[msg.sender] = verified;
    civicVerificationIds[msg.sender] = verificationId;
    emit CivicVerificationUpdated(msg.sender, verified, verificationId);
}
```

### 4. Backend Verification (Optional)

For additional security, verify Civic proofs on your backend:

```typescript
// pages/api/verify-civic.ts
import { verifyCivicProof } from '@civic/embedded-wallet-sdk';

export default async function handler(req, res) {
  const { proof, verificationId } = req.body;
  
  try {
    const isValid = await verifyCivicProof(proof, verificationId);
    
    if (isValid) {
      // Update database with verification status
      await updateUserVerification(req.body.userAddress, true);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid verification proof' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
}
```

## 🎯 Benefits of Real Civic Integration

### For Players:
- **1.5x Score Multiplier** for verified players
- **Trust & Security** - verified identity
- **Fair Play** - prevents bot accounts
- **Reputation System** - verified players get recognition

### For Advertisers:
- **Real Users** - verified human players
- **Quality Engagement** - real people seeing ads
- **Trust Metrics** - verified viewership data
- **Compliance** - KYC/AML requirements met

### For Platform:
- **Anti-Fraud** - prevents fake accounts
- **Quality Data** - real user analytics
- **Compliance** - meets regulatory requirements
- **Trust Score** - platform credibility

## 🔧 Testing

### Sandbox Mode
```typescript
const civic = new CivicSip({
  appId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID,
  environment: 'sandbox', // Use sandbox for testing
});
```

### Production Mode
```typescript
const civic = new CivicSip({
  appId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID,
  environment: 'production', // Use production for live app
});
```

## 📱 User Experience Flow

1. **User clicks "Verify with Civic"**
2. **Civic modal opens** with verification options
3. **User completes KYC** (ID verification, selfie, etc.)
4. **Civic returns verification result**
5. **App stores verification status** locally and on-chain
6. **User gets 1.5x multiplier** for all future games
7. **Verification persists** across sessions

## 🛡️ Security Considerations

- **Store verification proofs** securely
- **Validate proofs** on backend
- **Implement rate limiting** for verification attempts
- **Handle verification expiration** (re-verify periodically)
- **Protect user privacy** - minimal data collection

## 📊 Analytics & Monitoring

Track verification metrics:
- **Verification success rate**
- **Time to complete verification**
- **Drop-off points** in verification flow
- **User engagement** after verification

## 🚀 Deployment Checklist

- [ ] Civic developer account created
- [ ] Environment variables configured
- [ ] SDK installed and configured
- [ ] Smart contract updated with verification functions
- [ ] Frontend integration completed
- [ ] Backend verification endpoint (optional)
- [ ] Testing in sandbox mode
- [ ] Production deployment
- [ ] Monitoring and analytics setup

## 📞 Support

- **Civic Documentation**: https://docs.civic.com
- **Civic Support**: https://support.civic.com
- **Developer Community**: https://community.civic.com

---

**Note**: This is a comprehensive guide for real Civic integration. The current implementation uses mock data for demonstration purposes.
