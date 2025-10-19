# 🚀 Setup Guide

## 1. Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign up / Log in
3. Create new project
4. Copy your Project ID
5. Update `lib/wagmi.ts`:

```typescript
export const config = getDefaultConfig({
  appName: "Brand Crusher",
  projectId: "YOUR_PROJECT_ID_HERE", // Replace this!
  chains: [arbitrumSepolia],
  ssr: true,
});
```

## 2. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 3. Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Deploy!

Vercel will automatically detect Next.js and deploy.

## 4. Test on Arbitrum Sepolia

1. Connect MetaMask
2. Switch to Arbitrum Sepolia network
3. Get test ETH from faucet: https://faucet.quicknode.com/arbitrum/sepolia
4. Play the game!

## 5. Civic Verification (Optional)

Currently using simulated Civic Auth. To integrate real Civic:

See `CIVIC_INTEGRATION.md` for full guide.

---

**Ready to play!** 🎮

