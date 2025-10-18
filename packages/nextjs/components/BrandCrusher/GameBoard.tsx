"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useCivicAuth } from "~~/hooks/useCivicAuth";
import { 
  WalletIcon, 
  TrophyIcon, 
  ShieldCheckIcon, 
  BoltIcon,
  CurrencyDollarIcon,
  UsersIcon,
  MegaphoneIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { parseEther, formatEther } from "viem";

// Brand configuration with real brand data
const BRANDS = [
  { id: 1, name: "Nike", logo: "/logos/IMG_6942.JPG", color: "#FF6B35", points: 10 },
  { id: 2, name: "Apple", logo: "/logos/IMG_6943.jpg", color: "#4ECDC4", points: 15 },
  { id: 3, name: "Google", logo: "/logos/IMG_6944.jpg", color: "#FFE66D", points: 12 },
  { id: 4, name: "Amazon", logo: "/logos/IMG_6945.JPG", color: "#FF6B9D", points: 18 },
  { id: 5, name: "Tesla", logo: "/logos/IMG_6946.JPG", color: "#C7F0BD", points: 20 },
  { id: 6, name: "Meta", logo: "/logos/IMG_6947.JPG", color: "#95E1D3", points: 14 },
  { id: 7, name: "Netflix", logo: "/logos/IMG_6948.PNG", color: "#F38181", points: 16 },
  { id: 8, name: "Spotify", logo: "/logos/IMG_6949.JPG", color: "#AA96DA", points: 13 },
  { id: 9, name: "Twitter", logo: "/logos/IMG_6950.JPG", color: "#FCBAD3", points: 11 },
  { id: 10, name: "Adobe", logo: "/logos/IMG_6951.JPG", color: "#A8D8EA", points: 17 },
  { id: 11, name: "Intel", logo: "/logos/IMG_6952.PNG", color: "#FFCFDF", points: 15 },
  { id: 12, name: "Samsung", logo: "/logos/IMG_6953.JPG", color: "#FEFDCA", points: 19 },
  { id: 13, name: "Sony", logo: "/logos/IMG_6954.JPG", color: "#E0BBE4", points: 14 },
  { id: 14, name: "Microsoft", logo: "/logos/IMG_6955.PNG", color: "#957DAD", points: 16 },
  { id: 15, name: "Oracle", logo: "/logos/IMG_6956.JPG", color: "#D291BC", points: 13 },
  { id: 16, name: "IBM", logo: "/logos/IMG_6957.JPG", color: "#FEC8D8", points: 12 },
];

interface FloatingBrand {
  id: string;
  brandData: typeof BRANDS[0];
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  adData?: {
    advertiser: string;
    amount: bigint;
    brandName: string;
    speedMultiplier: number;
  };
}

interface AdRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (brandName: string, adContent: string, amount: bigint) => void;
  currentPrizePool: bigint;
  activeAdsCount: number;
}

const AdRegistrationModal = ({ isOpen, onClose, onRegister, currentPrizePool, activeAdsCount }: AdRegistrationModalProps) => {
  const [brandName, setBrandName] = useState("");
  const [adContent, setAdContent] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("0.001");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const minPayment = 0.0003; // ~$1
  const paymentInEth = parseFloat(paymentAmount);
  const speedMultiplier = 1 + (paymentInEth / minPayment);
  const estimatedVisibility = speedMultiplier > 3 ? "High" : speedMultiplier > 2 ? "Medium" : "Low";

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep modal within viewport bounds
    const maxX = window.innerWidth - 400; // modal width
    const maxY = window.innerHeight - 200; // modal height
    
    setModalPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-auto">
      <div 
        className="bg-slate-900 rounded-2xl border border-white/20 p-4 sm:p-6 w-full max-w-md shadow-2xl"
        style={{
          transform: window.innerWidth < 640 ? 'none' : `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
          position: window.innerWidth < 640 ? 'relative' : 'absolute',
          top: window.innerWidth < 640 ? 'auto' : '50%',
          left: window.innerWidth < 640 ? 'auto' : '50%',
          marginTop: window.innerWidth < 640 ? 'auto' : '-50%',
          marginLeft: window.innerWidth < 640 ? 'auto' : '-200px',
          maxHeight: window.innerWidth < 640 ? '90vh' : 'auto'
        }}
      >
        {/* Draggable Header */}
        <div 
          className="flex items-center justify-between mb-4 cursor-move select-none"
          onMouseDown={window.innerWidth >= 640 ? handleMouseDown : undefined}
        >
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <MegaphoneIcon className="w-6 h-6 text-purple-400" />
            Register Your Advertisement
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Minimum: $1 (0.0003 ETH)</p>
            <p>• No maximum - pay more for advantage</p>
            <p>• Higher payment = faster ball = harder to crush</p>
            <p>• Competition: Highest bidder gets priority</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-1">Current Round Info:</p>
            <p>• Prize Pool: ${(Number(formatEther(currentPrizePool)) * 2000).toFixed(2)}</p>
            <p>• Active Ads: {activeAdsCount}</p>
            <p>• Difficulty: {speedMultiplier > 3 ? "Hard" : speedMultiplier > 2 ? "Medium" : "Easy"}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your brand name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ad Content</label>
              <input
                type="text"
                value={adContent}
                onChange={(e) => setAdContent(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Description or image URL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Payment Amount (ETH)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0.0003"
                step="0.0001"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              <p className="text-sm text-yellow-200">
                ⚠️ Your ad visibility & difficulty:
              </p>
              <p className="text-sm">Speed multiplier: {speedMultiplier.toFixed(1)}x</p>
              <p className="text-sm">Estimated visibility: {estimatedVisibility}</p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onRegister(brandName, adContent, parseEther(paymentAmount));
              onClose();
            }}
            disabled={!brandName || paymentInEth < minPayment}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
          >
            Register Ad & Pay {paymentAmount} ETH
          </button>
        </div>
      </div>
    </div>
  );
};

export const GameBoard = () => {
  const { address, isConnected } = useAccount();
  const { isVerified, verify } = useCivicAuth();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [brands, setBrands] = useState<FloatingBrand[]>([]);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [backgroundElements, setBackgroundElements] = useState<Array<{
    id: number;
    width: number;
    height: number;
    left: number;
    top: number;
    animationDuration: number;
    animationDelay: number;
  }>>([]);

  // Smart contract interactions
  const { writeContractAsync: registerAd, isPending: isRegistering } = useScaffoldWriteContract({
    contractName: "BrandCrusher",
  });

  const { writeContractAsync: submitScore, isPending: isSubmitting } = useScaffoldWriteContract({
    contractName: "BrandCrusher",
  });

  const { writeContractAsync: claimPrize, isPending: isClaiming } = useScaffoldWriteContract({
    contractName: "BrandCrusher",
  });

  // Read contract data
  const { data: currentPrizePool } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getCurrentPrizePool",
  });

  const { data: currentRound } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getCurrentRound",
  });

  const { data: activePlayersCount } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getActivePlayersCount",
  });

  const { data: roundAds } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getRoundAds",
    args: currentRound ? [BigInt(currentRound.roundId)] : undefined,
  });

  const { data: playerBalance } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getPlayerBalance",
    args: address ? [address] : undefined,
  });

  // Calculate game state
  const prizePoolEth = currentPrizePool ? Number(formatEther(currentPrizePool)) : 0;
  const prizePoolUsd = prizePoolEth * 2000; // Approximate ETH price
  const isPrizeModeEnabled = prizePoolUsd >= 10;
  const activeAdsCount = roundAds ? roundAds.length : 0;

  // Spawn brands with ad data
  const spawnBrand = useCallback(() => {
    const brandData = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    return {
      id: `${Date.now()}-${Math.random()}`,
      brandData,
      x: Math.random() * 80 + 5,
      y: Math.random() * 80 + 5,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      size: Math.random() * 30 + 50,
    };
  }, []);

  // Start game
  const startGame = (isPaidMode: boolean = false) => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    if (isPaidMode && !isPrizeModeEnabled) {
      alert("Prize pool insufficient! Need at least $10 in ads.");
      return;
    }

    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    const initialBrands = Array.from({ length: 5 }, () => spawnBrand());
    setBrands(initialBrands);
  };

  // Crush brand
  const crushBrand = (brandId: string) => {
    const crushed = brands.find(b => b.id === brandId);
    if (!crushed) return;

    const now = Date.now();
    const comboActive = now - lastHitTime < 2000;
    const newCombo = comboActive ? combo + 1 : 1;
    
    const basePoints = crushed.brandData.points;
    const comboBonus = newCombo - 1;
    const civicMultiplier = isVerified ? 1.5 : 1;
    const finalPoints = Math.floor((basePoints + comboBonus) * civicMultiplier);

    setScore(prev => prev + finalPoints);
    setCombo(newCombo);
    setLastHitTime(now);
    
    setBrands(prev => [...prev.filter(b => b.id !== brandId), spawnBrand()]);
  };

  // Handle ad registration
  const handleAdRegistration = async (brandName: string, adContent: string, amount: bigint) => {
    try {
      await registerAd({
        functionName: "registerAdvertisement",
        args: [brandName, adContent],
        value: amount,
      });
      alert("Advertisement registered successfully!");
    } catch (error) {
      console.error("Error registering ad:", error);
      alert("Failed to register advertisement");
    }
  };

  // Handle prize claiming
  const handleClaimPrize = async () => {
    try {
      await claimPrize({
        functionName: "claimPrize",
      });
      alert("Prize claimed successfully!");
    } catch (error) {
      console.error("Error claiming prize:", error);
      alert("Failed to claim prize");
    }
  };

  // Animation loop
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setBrands(prev =>
        prev.map(brand => {
          let newX = brand.x + brand.speedX;
          let newY = brand.y + brand.speedY;
          let newSpeedX = brand.speedX;
          let newSpeedY = brand.speedY;

          if (newX <= 0 || newX >= 95) newSpeedX *= -1;
          if (newY <= 0 || newY >= 95) newSpeedY *= -1;

          return { ...brand, x: newX, y: newY, speedX: newSpeedX, speedY: newSpeedY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted]);

  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  // End game
  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      setGameStarted(false);
      handleGameEnd();
    }
  }, [timeLeft, gameStarted]);

  const handleGameEnd = async () => {
    if (score > 0 && isConnected) {
      try {
        await submitScore({
          functionName: "submitScore",
          args: [BigInt(score), isVerified, address?.slice(0, 10) || "Anonymous"],
        });
        alert(`Game Over! Final Score: ${score}\n✅ Score submitted to blockchain!`);
      } catch (error) {
        console.error("Error submitting score:", error);
        alert("Failed to submit score to blockchain");
      }
    }
  };

  // Combo reset
  useEffect(() => {
    if (combo > 0 && Date.now() - lastHitTime > 2000) {
      setCombo(0);
    }
  }, [lastHitTime, combo]);

  // Generate background elements
  useEffect(() => {
    const elements = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 10 + 10,
      animationDelay: Math.random() * 5,
    }));
    setBackgroundElements(elements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-2 sm:p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {backgroundElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              left: `${element.left}%`,
              top: `${element.top}%`,
              animation: `float ${element.animationDuration}s linear infinite`,
              animationDelay: `${element.animationDelay}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Brand Crusher
              </h1>
              <p className="text-sm text-gray-400">Web3 Ad Game • Earn Real Money</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {isVerified ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500 rounded-lg">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Verified (1.5x)</span>
              </div>
            ) : (
              <button
                onClick={verify}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-sm"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Verify with Civic</span>
                <span className="sm:hidden">Verify</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs sm:text-sm text-gray-400">Prize Pool</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-green-400">${prizePoolUsd.toFixed(2)}</p>
            <p className="text-xs text-gray-400 hidden sm:block">70% of ${(prizePoolUsd / 0.7).toFixed(2)}</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <UsersIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-400">Players</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-blue-400">{activePlayersCount?.toString() || 0}</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <MegaphoneIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs sm:text-sm text-gray-400">Ads</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-purple-400">{activeAdsCount}</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-400">Time</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-yellow-400">
              {currentRound ? Math.max(0, Number(currentRound.endTime) - Math.floor(Date.now() / 1000)) : 0}s
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        {!isPrizeModeEnabled && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-200">Free play mode only - Current prize pool insufficient (${prizePoolUsd.toFixed(2)})</span>
            </div>
            <p className="text-sm text-yellow-200 mt-1">
              💡 ${(10 - prizePoolUsd).toFixed(2)} more needed to enable real prize mode
            </p>
          </div>
        )}

        {/* Game Stats */}
        {isConnected && gameStarted && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrophyIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Score</span>
              </div>
              <p className="text-3xl font-bold text-cyan-400">{score}</p>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <ClockIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Time</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{timeLeft}s</p>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <BoltIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Combo</span>
              </div>
              <p className="text-3xl font-bold text-yellow-400">x{combo}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!gameStarted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => startGame(false)}
              disabled={!isConnected}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold disabled:opacity-50 text-sm sm:text-base"
            >
              {isConnected ? "Play Free Mode" : "Connect Wallet"}
            </button>
            
            <button
              onClick={() => startGame(true)}
              disabled={!isConnected || !isPrizeModeEnabled}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-bold disabled:opacity-50 text-sm sm:text-base"
            >
              {isPrizeModeEnabled ? `Play for Prize ($${prizePoolUsd.toFixed(2)})` : "Prize Mode Unavailable"}
            </button>
            
            <button
              onClick={() => setShowAdModal(true)}
              disabled={!isConnected}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold disabled:opacity-50 text-sm sm:text-base"
            >
              Register Ad
            </button>
            
            {playerBalance && playerBalance > 0n && (
              <button
                onClick={handleClaimPrize}
                disabled={isClaiming}
                className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-bold disabled:opacity-50 text-sm sm:text-base"
              >
                Claim ({formatEther(playerBalance)} ETH)
              </button>
            )}
          </div>
        )}

        {/* Game Area */}
        <div className="relative w-full h-[400px] sm:h-[500px] bg-gradient-to-b from-purple-900/30 to-slate-900/30 backdrop-blur rounded-2xl border border-white/20 overflow-hidden">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <TrophyIcon className="w-16 h-16 text-yellow-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Crush?</h2>
              <p className="text-gray-400 mb-6">Click brands to earn points!</p>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Current Prize Pool: ${prizePoolUsd.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Active Ads: {activeAdsCount}</p>
              </div>
            </div>
          ) : (
            brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => crushBrand(brand.id)}
                className="absolute rounded-full overflow-hidden hover:scale-110 transition-transform shadow-2xl"
                style={{
                  left: `${brand.x}%`,
                  top: `${brand.y}%`,
                  width: `${brand.size}px`,
                  height: `${brand.size}px`,
                  backgroundColor: brand.brandData.color,
                  boxShadow: `0 0 20px ${brand.brandData.color}80`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                  {brand.brandData.name}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer - Sponsors */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur rounded-xl border border-white/20">
          <p className="text-center text-sm text-gray-400 mb-3">Built with</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <span className="text-sm font-semibold">Scaffold-ETH</span>
            <span className="text-sm font-semibold">Arbitrum Sepolia</span>
            <span className="text-sm font-semibold">Civic Auth</span>
            <span className="text-sm font-semibold">Buidl Guidl</span>
          </div>
        </div>
      </div>

      {/* Ad Registration Modal */}
      <AdRegistrationModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onRegister={handleAdRegistration}
        currentPrizePool={currentPrizePool || 0n}
        activeAdsCount={activeAdsCount}
      />
    </div>
  );
};