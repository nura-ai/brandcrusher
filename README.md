# 🎮 Brand Crusher - Web3 Ad Game

**Advertise, Play, Win!** A revolutionary Web3 mini-game where brands pay for engagement and players win real prizes.

## 🌟 Features

### For Advertisers
- 💰 **Purchasable Ad Slots** - Register your brand starting from $1
- 🏆 **Competitive Bidding** - Higher bids = Higher priority & visibility
- ⚡ **Dynamic Difficulty** - Your bid affects game speed (more engagement!)
- 📊 **No Limits** - Pay more for more visibility

### For Players
- 🎮 **Play & Earn** - Win 70% of total ad pool
- 🔐 **Civic Verification** - Get 2x score multiplier
- 🏅 **Skill-Based** - Higher scores = Bigger rewards
- ⚡ **Dynamic Gameplay** - Difficulty scales with ad spend

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Web3**: Wagmi, RainbowKit, Viem
- **Styling**: Tailwind CSS v3
- **Network**: Arbitrum Sepolia
- **Auth**: Civic (simulated)

## 💰 Economic Model

- **70%** to Players (Prize Pool)
- **30%** to Platform (Sustainability)
- **Minimum Bid**: $1
- **Difficulty Scaling**: Speed = √(Total Spend / $1)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID at: https://cloud.walletconnect.com/

## 🎮 How to Play

1. **Connect Wallet** - Use MetaMask or any Web3 wallet
2. **Verify Identity** (Optional) - Get 2x score multiplier with Civic
3. **Start Game** - Click "Start Game" to begin
4. **Crush Brands** - Click on moving brand logos
5. **Win Prizes** - Earn your share of the 70% prize pool!

## 📢 How to Advertise

1. **Click "Register Ad"**
2. **Fill Form**:
   - Brand Name
   - Upload Logo
   - Set Your Bid (min $1)
3. **Submit** - Your ad enters the game!
4. **Compete** - Higher bids = Higher priority

## 🔐 Civic Verification

Currently using **simulated Civic Auth** for demo purposes. 

**Benefits:**
- 2x score multiplier
- Status saved in localStorage
- 2-second verification flow

**For Production:**
- Replace with real Civic SDK
- See `CIVIC_INTEGRATION.md` for details

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 📊 Game Mechanics

### Difficulty Calculation
```typescript
difficulty = √(totalAdSpend / minBid)
ballSpeed = baseSpeed * difficulty
```

### Prize Distribution
```typescript
prizePool = totalAdSpend * 0.70
platformFee = totalAdSpend * 0.30
playerReward = prizePool * (playerScore / totalScore)
```

### Score Multiplier
- Base: 10 points per ball
- With Civic: 20 points per ball (2x)

## 🏗️ Project Structure

```
brandcrusher-v2/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameBoard.tsx      # Main game component
│   ├── AdRegistrationModal.tsx  # Ad registration
│   └── Providers.tsx      # Web3 providers
├── hooks/                 # Custom hooks
│   └── useCivicAuth.ts    # Civic auth hook
├── lib/                   # Utilities
│   └── wagmi.ts           # Wagmi config
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── public/                # Static assets
    └── logos/             # Brand logos
```

## 🤝 Contributing

This project is built for the BuidlGuidl community!

## 📝 License

MIT License

## 🔗 Links

- **Live Demo**: https://brandcrusher.vercel.app/
- **GitHub**: https://github.com/nura-ai/brandcrusher
- **BuidlGuidl**: https://buidlguidl.com/

## 💪 Built with BuidlGuidl

This project showcases:
- ✅ Web3 integration (Wagmi + RainbowKit)
- ✅ Real economic model (70/30 split)
- ✅ Dynamic gameplay mechanics
- ✅ Civic identity verification
- ✅ Modern UI/UX (Tailwind CSS)
- ✅ Production-ready deployment

---

**Made with ❤️ for the Web3 community**

