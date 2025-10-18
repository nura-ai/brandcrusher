# Brand Crusher 🎮

Web3 game built with Scaffold-ETH, featuring Civic identity verification and deployed on Arbitrum Sepolia.

## 🎯 Project Overview

Brand Crusher is a Web3 game built on Scaffold-ETH 2, integrated with Arbitrum Sepolia, Civic Auth, and Buidl Guidl tools. Players crush floating brand logos to earn points, with Civic-verified players receiving a 1.5x multiplier bonus.

## ✨ Features

- **16 Brand Logos**: Interactive floating brand logos with physics-based gameplay
- **Civic Auth Integration**: Verified players earn 1.5x bonus points
- **On-chain Leaderboard**: All scores stored on Arbitrum Sepolia
- **Real-time Score Tracking**: Live score updates with combo multipliers
- **Web3 Integration**: Full blockchain integration with smart contracts

## 🛠 Tech Stack

- **Framework**: Scaffold-ETH 2 (Next.js 13+)
- **Blockchain**: Arbitrum Sepolia
- **Auth**: Civic Auth (embedded wallets)
- **AI**: Civic Nexus + Vercel AI SDK
- **Smart Contracts**: Solidity + Hardhat
- **Frontend**: React, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, RainbowKit

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Git
- Wallet with Arbitrum Sepolia ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/scaffold-eth/scaffold-eth-2.git brand-crusher
   cd brand-crusher
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   
   Create `packages/hardhat/.env`:
   ```bash
   DEPLOYER_PRIVATE_KEY=your_private_key_here
   ARBISCAN_API_KEY=your_arbiscan_api_key
   ALCHEMY_API_KEY=your_alchemy_api_key
   ```
   
   Create `packages/nextjs/.env.local`:
   ```bash
   NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id
   CIVIC_CLIENT_SECRET=your_civic_secret
   OPENAI_API_KEY=your_openai_key_for_nexus
   ```

4. **Deploy smart contract**
   ```bash
   cd packages/hardhat
   npm run deploy --network arbitrumSepolia
   ```

5. **Verify contract on Arbiscan**
   ```bash
   npm run verify --network arbitrumSepolia
   ```

6. **Start the frontend**
   ```bash
   cd packages/nextjs
   npm run dev
   ```

7. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 🎮 How to Play

1. **Connect Wallet**: Connect your Web3 wallet to Arbitrum Sepolia
2. **Verify Identity**: Optional Civic verification for 1.5x bonus points
3. **Start Game**: Click "Start Game" to begin the 60-second challenge
4. **Crush Brands**: Click on floating brand logos to earn points
5. **Build Combos**: Hit brands quickly to build combo multipliers
6. **Submit Score**: Your score is automatically submitted to the blockchain

## 🏆 Scoring System

- **Base Points**: Each brand has different point values (10-20 points)
- **Combo Bonus**: Consecutive hits within 2 seconds add bonus points
- **Civic Multiplier**: Verified players earn 1.5x points
- **Final Score**: `(Base Points + Combo Bonus) × Civic Multiplier`

## 📊 Smart Contract Features

### BrandCrusher.sol

- **Score Submission**: Submit game scores with Civic verification status
- **Leaderboard**: Get top N scores from all players
- **Player Stats**: Track individual player statistics
- **Civic Integration**: 1.5x multiplier for verified players
- **Events**: Emit events for score submissions and verification updates

### Key Functions

```solidity
function submitScore(uint256 _score, bool _civicVerified, string memory _playerName) external
function getTopScores(uint256 limit) external view returns (GameScore[] memory)
function getPlayerStats(address player) external view returns (PlayerStats memory)
function updateCivicVerification(bool verified) external
```

## 🔐 Civic Auth Integration

The game integrates with Civic Auth to provide identity verification:

- **Embedded Wallets**: Seamless wallet creation and management
- **Identity Verification**: KYC/AML compliance through Civic
- **Bonus Rewards**: 1.5x point multiplier for verified players
- **Privacy**: Decentralized identity without exposing personal data

## 🎨 Brand Logos

The game features 16 major brand logos:

- Nike, Apple, Google, Amazon
- Tesla, Meta, Netflix, Spotify
- Twitter, Adobe, Intel, Samsung
- Sony, Microsoft, Oracle, IBM

Each brand has unique colors, point values, and visual effects.

## 📱 Game Components

### GameBoard.tsx

Main game component featuring:
- Physics-based brand movement
- Real-time score tracking
- Combo system
- Civic verification integration
- Leaderboard display
- Responsive design

### useCivicAuth.ts

Custom hook for Civic authentication:
- Verification status management
- Local storage persistence
- Error handling
- Integration with smart contracts

## 🌐 Deployment

### Smart Contract

- **Network**: Arbitrum Sepolia
- **Verification**: Arbiscan
- **Gas Optimization**: Optimized for low-cost transactions

### Frontend

- **Platform**: Vercel
- **Domain**: Custom domain support
- **CDN**: Global content delivery
- **SSL**: Automatic HTTPS

## 🏅 Hackathon Submission

### Arbitrum ($2,000)

✅ **Deployed on Arbitrum Sepolia**
- Smart contract deployed and verified
- Full Web3 integration
- Gas-efficient transactions

### Civic

✅ **Civic Auth Integration**
- Embedded wallet support
- Identity verification
- 1.5x reward multiplier
- Civic Nexus MCP integration

### Buidl Guidl ($1,000)

✅ **Scaffold-ETH 2 Implementation**
- Complete project structure
- Smart contract development
- Frontend integration
- Documentation and README

## 🔧 Development

### Project Structure

```
brand-crusher/
├── packages/
│   ├── hardhat/           # Smart contracts
│   │   ├── contracts/     # Solidity contracts
│   │   ├── deploy/        # Deployment scripts
│   │   └── .env          # Environment variables
│   └── nextjs/           # Frontend
│       ├── app/          # Next.js app directory
│       ├── components/   # React components
│       ├── hooks/        # Custom hooks
│       └── public/      # Static assets
└── README.md
```

### Available Scripts

```bash
# Smart Contract
npm run compile          # Compile contracts
npm run deploy          # Deploy to network
npm run verify          # Verify on block explorer
npm run test           # Run tests

# Frontend
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run linter
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Scaffold-ETH 2**: Development framework
- **Arbitrum**: Layer 2 scaling solution
- **Civic**: Identity verification
- **Buidl Guidl**: Web3 development community

## 📞 Support

For support and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/brand-crusher/issues)
- Discord: Buidl Guidl community
- Twitter: [@YourHandle](https://twitter.com/yourhandle)

---

**Built with ❤️ for the Web3 community**

🎮 **Play Now**: [Your Vercel URL]
📜 **Contract**: [Arbiscan Link]
🐙 **GitHub**: [Repository Link]
