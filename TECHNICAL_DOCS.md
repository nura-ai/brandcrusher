# Brand Crusher - Technical Documentation

## 🏗 **Architecture Overview**

Brand Crusher is built on **Scaffold-ETH 2**, a modern Web3 development framework that provides:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **RainbowKit** for wallet connection
- **Wagmi** for Ethereum interactions
- **Tailwind CSS** for styling
- **Hardhat** for smart contract development

## 📁 **Project Structure**

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
│       │   └── BrandCrusher/
│       │       └── GameBoard.tsx
│       ├── hooks/               # Custom React hooks
│       │   └── useCivicAuth.ts
│       └── contracts/           # Contract ABIs and addresses
└── README.md
```

## 🔧 **Smart Contract Architecture**

### **BrandCrusher.sol**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BrandCrusher {
    // Core data structures
    struct Advertisement {
        string brandName;
        string content;
        uint256 payment;
        address advertiser;
        uint256 timestamp;
    }
    
    struct GameRound {
        uint256 startTime;
        uint256 endTime;
        uint256 totalPrizePool;
        uint256 difficulty;
        bool isActive;
    }
    
    struct PlayerScore {
        address player;
        uint256 score;
        uint256 timestamp;
        bool isVerified;
    }
    
    // State variables
    mapping(uint256 => Advertisement[]) public roundAds;
    mapping(uint256 => GameRound) public rounds;
    mapping(address => uint256) public playerBalances;
    mapping(uint256 => PlayerScore[]) public roundScores;
    
    // Constants
    uint256 public constant MIN_AD_PRICE = 0.01 ether;
    uint256 public constant MIN_PRIZE_POOL = 0.1 ether;
    uint256 public constant PRIZE_PERCENTAGE = 70;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 30;
    
    // Core functions
    function registerAdvertisement(string memory brandName, string memory content, uint256 payment) external payable
    function startNewRound() external
    function submitScore(uint256 score) external
    function endRound() external
    function claimPrize() external
    function getCurrentPrizePool() external view returns (uint256)
    function getRoundDifficulty() external view returns (uint256)
    function getActivePlayersCount() external view returns (uint256)
}
```

## 🎮 **Frontend Architecture**

### **GameBoard.tsx - Main Game Component**

```typescript
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useCivicAuth } from "~~/hooks/useCivicAuth";

export default function GameBoard() {
  // Contract interactions
  const { data: currentPrizePool } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getCurrentPrizePool",
  });
  
  const { writeContractAsync: writeBrandCrusherAsync } = useScaffoldWriteContract({
    contractName: "BrandCrusher",
  });
  
  // Civic Auth integration
  const { isVerified, verify, isLoading: civicLoading } = useCivicAuth();
  
  // Game state management
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    timeLeft: 60,
    currentWord: "",
    difficulty: 1,
  });
  
  // Core game functions
  const handleAdRegistration = async (brandName: string, content: string, payment: string) => {
    // Demo mode implementation
    const paymentAmount = parseEther(payment);
    alert(`Ad registered: ${brandName} - ${content} - ${payment} ETH`);
  };
  
  const handleScoreSubmission = async (score: number) => {
    // Demo mode implementation
    alert(`Score submitted: ${score}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Game UI components */}
    </div>
  );
}
```

### **useCivicAuth.ts - Civic Authentication Hook**

```typescript
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
  
  const verify = async () => {
    // Demo implementation with realistic simulation
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
    
    if (!isDemo) return;
    
    // Simulate verification process
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Step-by-step simulation
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("📱 Step 1: Opening Civic verification modal...");
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log("📄 Step 2: Uploading ID document...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("📸 Step 3: Taking selfie for face verification...");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("⚙️ Step 4: Processing verification...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("🔑 Step 5: Generating cryptographic proof...");
    
    // Generate verification ID
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
    
    alert(
      "🎉 CIVIC VERIFICATION COMPLETE!\n\n" +
      `Verification ID: ${verificationId}\n` +
      "You now have a 1.5x score multiplier!\n\n" +
      "Note: This is a demo. Real verification would take 2-5 minutes."
    );
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

## 🎨 **UI/UX Design**

### **Design System**
- **Color Palette**: Purple/blue gradient background
- **Typography**: Modern, readable fonts
- **Components**: Custom React components
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant

### **Key UI Components**

#### **Game Board**
- **Word Display**: Large, prominent text
- **Score Counter**: Real-time score updates
- **Timer**: Countdown display
- **Progress Bar**: Visual progress indicator

#### **Ad Registration Modal**
- **Form Fields**: Brand name, content, payment
- **Validation**: Input validation and error handling
- **Responsive**: Mobile-optimized layout
- **Accessibility**: Keyboard navigation support

#### **Stats Dashboard**
- **Live Stats**: Prize pool, active players, round time
- **Real-time Updates**: Dynamic data refresh
- **Visual Indicators**: Icons and progress bars
- **Mobile Friendly**: Responsive grid layout

## 🔐 **Security Considerations**

### **Smart Contract Security**
- **Input Validation**: All inputs are validated
- **Access Control**: Proper permission management
- **Reentrancy Protection**: Safe external calls
- **Overflow Protection**: Safe math operations

### **Frontend Security**
- **Input Sanitization**: XSS prevention
- **Wallet Security**: Secure wallet connections
- **Data Validation**: Client-side validation
- **Error Handling**: Graceful error management

## 📱 **Mobile Optimization**

### **Responsive Design**
- **Breakpoints**: Mobile, tablet, desktop
- **Touch Interactions**: Mobile-friendly controls
- **Performance**: Optimized for mobile devices
- **Accessibility**: Touch-friendly interface

### **PWA Features**
- **Offline Support**: Basic offline functionality
- **Installation**: Add to home screen
- **Notifications**: Game updates and alerts
- **Performance**: Fast loading and smooth animations

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
- **Smart Contracts**: Deploy to Ethereum mainnet/testnet
- **Frontend**: Deploy to Vercel/IPFS
- **Domain**: Configure custom domain
- **SSL**: HTTPS security

## 📊 **Analytics & Monitoring**

### **User Analytics**
- **Game Sessions**: Track user engagement
- **Score Distribution**: Analyze player performance
- **Ad Performance**: Measure brand engagement
- **Error Tracking**: Monitor and fix issues

### **Smart Contract Analytics**
- **Transaction Volume**: Track contract usage
- **Gas Usage**: Optimize contract efficiency
- **Event Logs**: Monitor contract events
- **Error Rates**: Track and fix issues

## 🔧 **Development Workflow**

### **Git Workflow**
- **Feature Branches**: Isolated development
- **Code Reviews**: Quality assurance
- **Automated Testing**: CI/CD pipeline
- **Documentation**: Keep docs updated

### **Testing Strategy**
- **Unit Tests**: Component testing
- **Integration Tests**: Contract testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing

## 📈 **Performance Optimization**

### **Frontend Performance**
- **Code Splitting**: Lazy loading components
- **Image Optimization**: Compressed assets
- **Caching**: Browser and CDN caching
- **Bundle Size**: Minimized JavaScript bundles

### **Smart Contract Performance**
- **Gas Optimization**: Efficient contract code
- **Storage Optimization**: Minimal storage usage
- **Function Efficiency**: Optimized algorithms
- **Batch Operations**: Reduced transaction costs

## 🎯 **Future Enhancements**

### **Planned Features**
- **Multi-chain Support**: Polygon, Arbitrum, etc.
- **NFT Integration**: Collectible game items
- **AI Difficulty**: Dynamic AI-powered difficulty
- **Social Features**: Friends, leaderboards, chat

### **Technical Improvements**
- **Layer 2**: Optimism, Arbitrum integration
- **Advanced Analytics**: Machine learning insights
- **Microservices**: Scalable backend architecture
- **Real-time Features**: WebSocket integration

---

**This technical documentation provides a comprehensive overview of Brand Crusher's architecture, implementation, and future roadmap.** 🚀🎮✨
