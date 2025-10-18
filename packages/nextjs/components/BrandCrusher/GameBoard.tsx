"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useCivicAuth } from "~~/hooks/useCivicAuth";
import { WalletIcon, TrophyIcon, ShieldCheckIcon, BoltIcon } from "@heroicons/react/24/outline";

// Brand configuration
const BRANDS = [
  { id: 1, name: "Nike", logo: "/logos/nike.png", color: "#FF6B35", points: 10 },
  { id: 2, name: "Apple", logo: "/logos/apple.png", color: "#4ECDC4", points: 15 },
  { id: 3, name: "Google", logo: "/logos/google.png", color: "#FFE66D", points: 12 },
  { id: 4, name: "Amazon", logo: "/logos/amazon.png", color: "#FF6B9D", points: 18 },
  { id: 5, name: "Tesla", logo: "/logos/tesla.png", color: "#C7F0BD", points: 20 },
  { id: 6, name: "Meta", logo: "/logos/meta.png", color: "#95E1D3", points: 14 },
  { id: 7, name: "Netflix", logo: "/logos/netflix.png", color: "#F38181", points: 16 },
  { id: 8, name: "Spotify", logo: "/logos/spotify.png", color: "#AA96DA", points: 13 },
  { id: 9, name: "Twitter", logo: "/logos/twitter.png", color: "#FCBAD3", points: 11 },
  { id: 10, name: "Adobe", logo: "/logos/adobe.png", color: "#A8D8EA", points: 17 },
  { id: 11, name: "Intel", logo: "/logos/intel.png", color: "#FFCFDF", points: 15 },
  { id: 12, name: "Samsung", logo: "/logos/samsung.png", color: "#FEFDCA", points: 19 },
  { id: 13, name: "Sony", logo: "/logos/sony.png", color: "#E0BBE4", points: 14 },
  { id: 14, name: "Microsoft", logo: "/logos/microsoft.png", color: "#957DAD", points: 16 },
  { id: 15, name: "Oracle", logo: "/logos/oracle.png", color: "#D291BC", points: 13 },
  { id: 16, name: "IBM", logo: "/logos/ibm.png", color: "#FEC8D8", points: 12 },
];

interface FloatingBrand {
  id: string;
  brandData: typeof BRANDS[0];
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
}

export const GameBoard = () => {
  const { address, isConnected } = useAccount();
  const { isVerified, verify } = useCivicAuth();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [brands, setBrands] = useState<FloatingBrand[]>([]);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [backgroundElements, setBackgroundElements] = useState<Array<{
    id: number;
    width: number;
    height: number;
    left: number;
    top: number;
    animationDuration: number;
    animationDelay: number;
  }>>([]);

  // Smart contract interaction
  const { writeContractAsync: submitScore, isPending: isSubmitting } = useScaffoldWriteContract({
    contractName: "BrandCrusher",
  });

  // Read leaderboard
  const { data: topScores } = useScaffoldReadContract({
    contractName: "BrandCrusher",
    functionName: "getTopScores",
    args: [BigInt(10)],
  });

  // Spawn brands
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
  const startGame = () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
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

  // Generate background elements on client side to avoid hydration mismatch
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Brand Crusher
          </h1>
          
          <div className="flex gap-3">
            {isVerified ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Civic Verified (1.5x)</span>
              </div>
            ) : (
              <button
                onClick={verify}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                Verify with Civic
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        {isConnected && (
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
                <WalletIcon className="w-4 h-4 text-purple-400" />
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

        {/* Game Area */}
        <div className="relative w-full h-[500px] bg-gradient-to-b from-purple-900/30 to-slate-900/30 backdrop-blur rounded-2xl border border-white/20 overflow-hidden">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <TrophyIcon className="w-16 h-16 text-yellow-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Crush?</h2>
              <p className="text-gray-400 mb-6">Click brands to earn points!</p>
              <button
                onClick={startGame}
                disabled={!isConnected}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all font-bold text-xl disabled:opacity-50"
              >
                {isConnected ? "Start Game" : "Connect Wallet First"}
              </button>
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

        {/* Leaderboard Preview */}
        {topScores && topScores.length > 0 && (
          <div className="mt-6 p-6 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-yellow-400" />
              Leaderboard
            </h3>
            <div className="space-y-2">
              {topScores.slice(0, 5).map((score: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-500">#{i + 1}</span>
                    <div>
                      <p className="font-semibold">{score.playerName}</p>
                      <p className="text-xs text-gray-400">{score.player.slice(0, 10)}...</p>
                    </div>
                    {score.civicVerified && (
                      <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <span className="text-xl font-bold text-cyan-400">
                    {score.score.toString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
};

