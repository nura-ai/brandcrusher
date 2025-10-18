# 🚀 Brand Crusher Deployment Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Git** installed
3. **Wallet** with Arbitrum Sepolia ETH
4. **Arbiscan API Key** for contract verification
5. **Vercel Account** for frontend deployment

## Step 1: Environment Setup

### Hardhat Environment

Create `packages/hardhat/.env`:

```bash
# Replace with your actual private key (keep secure!)
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...

# Get from https://arbiscan.io/apis
ARBISCAN_API_KEY=your_arbiscan_api_key

# Optional: Get from https://dashboard.alchemyapi.io
ALCHEMY_API_KEY=your_alchemy_api_key
```

### Next.js Environment

Create `packages/nextjs/.env.local`:

```bash
# Get from Civic dashboard
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id
CIVIC_CLIENT_SECRET=your_civic_secret

# For Civic Nexus integration
OPENAI_API_KEY=your_openai_key
```

## Step 2: Smart Contract Deployment

```bash
# Navigate to hardhat package
cd packages/hardhat

# Compile contracts
npm run compile

# Deploy to Arbitrum Sepolia
npm run deploy --network arbitrumSepolia

# Verify contract on Arbiscan
npm run verify --network arbitrumSepolia
```

**Expected Output:**
```
✅ BrandCrusher deployed to: 0x1234567890abcdef...
✅ Contract verified on Arbiscan
```

## Step 3: Frontend Deployment

### Local Development

```bash
# Navigate to nextjs package
cd packages/nextjs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:3000`

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

**Vercel Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Step 4: Brand Logos Setup

Add 16 brand logos to `packages/nextjs/public/logos/`:

**Required Files:**
- nike.png (200x200px, transparent background)
- apple.png
- google.png
- amazon.png
- tesla.png
- meta.png
- netflix.png
- spotify.png
- twitter.png
- adobe.png
- intel.png
- samsung.png
- sony.png
- microsoft.png
- oracle.png
- ibm.png

**Logo Requirements:**
- Size: 200x200 pixels
- Format: PNG with transparent background
- Quality: High resolution for crisp display

## Step 5: Testing

### Smart Contract Testing

```bash
cd packages/hardhat
npm run test
```

### Frontend Testing

```bash
cd packages/nextjs
npm run test
```

### Integration Testing

1. Connect wallet to Arbitrum Sepolia
2. Verify with Civic (optional)
3. Play game and submit score
4. Check leaderboard updates
5. Verify transaction on Arbiscan

## Step 6: Verification

### Contract Verification

Check your contract on Arbiscan:
- URL: `https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS`
- Verify source code is visible
- Check constructor parameters

### Frontend Verification

Test all features:
- ✅ Wallet connection
- ✅ Civic verification
- ✅ Game mechanics
- ✅ Score submission
- ✅ Leaderboard display
- ✅ Mobile responsiveness

## Troubleshooting

### Common Issues

**1. Contract Deployment Fails**
```bash
# Check network connection
npm run deploy --network arbitrumSepolia --verbose

# Verify private key format
echo $DEPLOYER_PRIVATE_KEY
```

**2. Verification Fails**
```bash
# Wait for block confirmation
sleep 30

# Retry verification
npm run verify --network arbitrumSepolia
```

**3. Frontend Build Fails**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**4. Vercel Deployment Fails**
```bash
# Check environment variables
vercel env ls

# Redeploy
vercel --prod --force
```

## Production Checklist

- [ ] Smart contract deployed to Arbitrum Sepolia
- [ ] Contract verified on Arbiscan
- [ ] Frontend deployed to Vercel
- [ ] All 16 brand logos added
- [ ] Environment variables configured
- [ ] Wallet connection working
- [ ] Civic verification working
- [ ] Game mechanics functional
- [ ] Score submission working
- [ ] Leaderboard displaying
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)

## Security Notes

- **Never commit private keys** to version control
- **Use environment variables** for sensitive data
- **Verify contract source code** on Arbiscan
- **Test thoroughly** before mainnet deployment
- **Monitor gas usage** for optimization

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure you have sufficient ETH for gas
4. Check network connectivity
5. Review the troubleshooting section above

**Need Help?**
- GitHub Issues: Create an issue
- Discord: Buidl Guidl community
- Documentation: Check README.md

---

🎮 **Happy Deploying!** Your Brand Crusher game is ready to crush the competition!

