# 🎮 Brand Crusher

**An innovative Web3 mini-game that combines advertising, gaming, and blockchain technology to create a unique economic model where brands pay for player engagement and players earn real rewards.**

[![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-blue)](https://github.com/scaffold-eth/scaffold-eth-2)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)

## 🚀 **Live Demo**

- **Local Development**: http://localhost:3000
- **GitHub Repository**: https://github.com/nura-ai/brandcrusher
- **BuidlGuidl Application**: [View Presentation](./BUIDLGUIDL_PRESENTATION.md)

## 🎯 **Key Features**

### ** Core Gameplay**
- **Word Puzzle Game** - Players solve brand-related puzzles
- **Real-time Scoring** - Dynamic difficulty based on ad payments
- **Prize Pool System** - 70% to players, 30% to platform
- **Free & Paid Modes** - Accessible to all players

### **💰 Economic Model**
- **Advertiser Payments** - Brands pay to increase game difficulty
- **Player Rewards** - Real ETH prizes for top performers
- **Platform Revenue** - Sustainable business model
- **Dynamic Pricing** - Market-driven difficulty scaling

### **🔐 Identity Verification**
- **Civic Auth Integration** - KYC verification for score multipliers
- **Anti-Fraud Protection** - Prevents bot accounts
- **Trust System** - Verified players get 1.5x score multiplier
- **Privacy-First** - Minimal data collection

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection and management
- **Wagmi** - React hooks for Ethereum

### **Backend**
- **Hardhat** - Ethereum development environment
- **Solidity 0.8.19** - Smart contract language
- **Scaffold-ETH 2** - Web3 development framework

### **Blockchain**
- **Ethereum** - Smart contract platform
- **Local Development** - Hardhat network
- **Testnet Ready** - Goerli, Sepolia support

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/nura-ai/brandcrusher.git
cd brandcrusher
```

2. **Install dependencies**
```bash
npm install
```

3. **Start local blockchain**
```bash
npm run chain
```

4. **Deploy contracts**
```bash
npm run deploy
```

5. **Start frontend**
```bash
npm run start
```

6. **Open in browser**
```
http://localhost:3000
```

## 🎮 **How to Play**

### **For Players**
1. **Connect Wallet** - Use RainbowKit to connect your wallet
2. **Choose Mode** - Play free or for real prizes
3. **Solve Puzzles** - Complete word puzzles to earn points
4. **Submit Score** - Submit your score to the leaderboard
5. **Claim Prizes** - Win ETH rewards for top performance

### **For Advertisers**
1. **Register Ad** - Submit your brand content
2. **Set Payment** - Choose how much to pay for engagement
3. **Increase Difficulty** - Higher payments = harder puzzles
4. **Track Engagement** - Monitor player interaction with your content

### **For Verified Players**
1. **Verify Identity** - Complete Civic KYC verification
2. **Get Multiplier** - Earn 1.5x score multiplier
3. **Enhanced Rewards** - Higher prize potential
4. **Trust Benefits** - Build reputation in the community

## 📊 **Game Mechanics**

### **Scoring System**
- **Base Score** - Points earned from puzzle completion
- **Time Bonus** - Faster completion = higher score
- **Difficulty Multiplier** - Harder puzzles = more points
- **Verification Bonus** - 1.5x multiplier for verified players

### **Prize Distribution**
- **70% to Players** - Distributed based on performance
- **30% to Platform** - Sustainable business model
- **Minimum Prize Pool** - 0.1 ETH to start rounds
- **Dynamic Scaling** - Prize pool grows with ad payments

### **Difficulty Scaling**
- **Base Difficulty** - Standard puzzle difficulty
- **Ad Payments** - Higher payments = harder puzzles
- **Player Count** - More players = increased difficulty
- **Time Pressure** - Limited time adds challenge

## 🔧 **Development**

### **Project Structure**
```
brand-crusher/
├── packages/
│   ├── hardhat/                 # Smart contract development
│   │   ├── contracts/
│   │   │   └── BrandCrusher.sol # Main game contract
│   │   ├── deploy/
│   │   └── test/
│   └── nextjs/                  # Frontend application
│       ├── app/                 # Next.js App Router
│       ├── components/         # React components
│       ├── hooks/               # Custom React hooks
│       └── contracts/           # Contract ABIs and addresses
└── docs/                        # Documentation
```

### **Smart Contract Functions**
```solidity
// Core game functions
function registerAdvertisement(string memory brandName, string memory content, uint256 payment) external payable
function submitScore(uint256 score) external
function claimPrize() external
function getCurrentPrizePool() external view returns (uint256)
function getRoundDifficulty() external view returns (uint256)
function getActivePlayersCount() external view returns (uint256)
```

### **Frontend Components**
- **GameBoard** - Main game interface
- **AdRegistrationModal** - Advertiser registration
- **StatsDashboard** - Live game statistics
- **CivicAuth** - Identity verification

## 📱 **Mobile Support**

### **Responsive Design**
- **Mobile-First** - Optimized for mobile devices
- **Touch Controls** - Mobile-friendly interactions
- **Performance** - Fast loading on mobile networks
- **PWA Ready** - Progressive Web App features

### **Farcaster Integration**
- **Mini-App** - Designed for Farcaster platform
- **Social Features** - Share scores and achievements
- **Community** - Connect with other players
- **Notifications** - Game updates and alerts

## 🔐 **Security**

### **Smart Contract Security**
- **Input Validation** - All inputs are validated
- **Access Control** - Proper permission management
- **Reentrancy Protection** - Safe external calls
- **Overflow Protection** - Safe math operations

### **Frontend Security**
- **Input Sanitization** - XSS prevention
- **Wallet Security** - Secure wallet connections
- **Data Validation** - Client-side validation
- **Error Handling** - Graceful error management

## 📈 **Analytics**

### **User Metrics**
- **Game Sessions** - Track user engagement
- **Score Distribution** - Analyze player performance
- **Ad Performance** - Measure brand engagement
- **Error Tracking** - Monitor and fix issues

### **Economic Metrics**
- **Prize Pool Growth** - Track reward distribution
- **Platform Revenue** - Monitor business health
- **Brand Adoption** - Measure advertiser participation
- **User Retention** - Track long-term engagement

## 🚀 **Deployment**

### **Local Development**
```bash
# Start local blockchain
npm run chain

# Deploy contracts
npm run deploy

# Start frontend
npm run start
```

### **Production Deployment**
- **Smart Contracts** - Deploy to Ethereum mainnet/testnet
- **Frontend** - Deploy to Vercel/IPFS
- **Domain** - Configure custom domain
- **SSL** - HTTPS security

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- **TypeScript** - Use TypeScript for all new code
- **ESLint** - Follow ESLint rules
- **Prettier** - Use Prettier for code formatting
- **Testing** - Add tests for new features

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Scaffold-ETH 2** - Amazing Web3 development framework
- **BuidlGuidl** - Web3 developer community and support
- **Civic** - Identity verification technology
- **Farcaster** - Social Web3 platform
- **Ethereum Community** - For building the future of Web3

## 📞 **Support**

- **GitHub Issues** - Report bugs and request features
- **Discord** - Join our community
- **Twitter** - Follow for updates
- **Email** - Contact the team

## 🎯 **Roadmap**

### **Phase 1: MVP (Current)**
- ✅ Core game mechanics
- ✅ Smart contract implementation
- ✅ Basic UI/UX
- ✅ Civic Auth integration (demo)

### **Phase 2: Enhancement**
- 🔄 Advanced game features
- 🔄 Mobile optimization
- 🔄 Analytics dashboard
- 🔄 Social features

### **Phase 3: Scale**
- 📋 Multi-chain support
- 📋 NFT integration
- 📋 Advanced AI difficulty
- 📋 Community governance

---

**Ready to revolutionize Web3 gaming? Let's build the future together!** 🚀🎮✨

**Built with ❤️ by the Brand Crusher team**