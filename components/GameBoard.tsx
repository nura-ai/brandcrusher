"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCivicAuth } from "@/hooks/useCivicAuth";
import AdRegistrationModal from "./AdRegistrationModal";
import CivicVerificationModal from "./CivicVerificationModal";
import Leaderboard from "./Leaderboard";
import GoldCoinExplosion from "./GoldCoinExplosion";
import { Advertisement, Ball, LeaderboardEntry } from "@/types";

const DEFAULT_LOGOS = [
  "/logos/IMG_6942.JPG",
  "/logos/IMG_6943.jpg",
  "/logos/IMG_6944.jpg",
  "/logos/IMG_6945.JPG",
  "/logos/IMG_6946.JPG",
  "/logos/IMG_6947.JPG",
  "/logos/IMG_6948.PNG",
  "/logos/IMG_6949.JPG",
  "/logos/IMG_6950.JPG",
  "/logos/IMG_6951.JPG",
  "/logos/IMG_6952.PNG",
  "/logos/IMG_6953.JPG",
  "/logos/IMG_6954.JPG",
  "/logos/IMG_6955.PNG",
  "/logos/IMG_6956.JPG",
  "/logos/IMG_6957.JPG",
];

const MIN_BID = 1; // $1 minimum
const MAX_SLOTS = 16; // Maximum 16 balls at once
const GAME_DURATION = 60; // 60 seconds per round

export default function GameBoard() {
  const { address, isConnected } = useAccount();
  const { isVerified, isVerifying, verify } = useCivicAuth();
  
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCivicModalOpen, setIsCivicModalOpen] = useState(false);
  const [prizePool, setPrizePool] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [coinExplosions, setCoinExplosions] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [combo, setCombo] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [gameMode, setGameMode] = useState<"demo" | "real" | null>(null);

  // Calculate difficulty based on total ad spend
  const calculateDifficulty = () => {
    const totalSpend = advertisements.reduce((sum, ad) => sum + ad.amount, 0);
    return Math.max(1, totalSpend / MIN_BID); // 1x base speed, increases with spend
  };

  // Timer countdown
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // Animation loop
  useEffect(() => {
    if (!gameStarted) return;

    const difficulty = calculateDifficulty();
    const baseSpeed = 0.8; // Increased base speed
    const speed = baseSpeed * Math.sqrt(difficulty); // Square root for smoother scaling

    const interval = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.vx * speed;
          let newY = ball.y + ball.vy * speed;
          let newVx = ball.vx;
          let newVy = ball.vy;

          if (newX <= 5 || newX >= 95) newVx = -newVx;
          if (newY <= 5 || newY >= 95) newVy = -newVy;

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, advertisements]);

  const startGame = () => {
    if (advertisements.length === 0) {
      alert("No ads registered yet! Register an ad to start playing.");
      return;
    }

    // Sort ads by amount (highest first) and take top MAX_SLOTS
    const sortedAds = [...advertisements]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, MAX_SLOTS);

    const newBalls: Ball[] = sortedAds.map((ad, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      brand: ad.brandName,
      logo: ad.logoUrl,
      adId: ad.id,
      amount: ad.amount,
    }));

    setBalls(newBalls);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameStartTime(Date.now());
  };

  const endGame = () => {
    setGameStarted(false);
    const timePlayed = Math.floor((Date.now() - gameStartTime) / 1000);
    
    // Update leaderboard
    if (address) {
      setLeaderboard((prev) => {
        const existing = prev.find((e) => e.address === address);
        if (existing) {
          return prev
            .map((e) =>
              e.address === address
                ? {
                    ...e,
                    totalScore: e.totalScore + score,
                    totalTime: e.totalTime + timePlayed,
                    gamesPlayed: e.gamesPlayed + 1,
                    lastPlayed: Date.now(),
                  }
                : e
            )
            .sort((a, b) => b.totalTime - a.totalTime);
        } else {
          return [
            ...prev,
            {
              address,
              totalScore: score,
              totalTime: timePlayed,
              gamesPlayed: 1,
              lastPlayed: Date.now(),
              verified: isVerified,
            },
          ].sort((a, b) => b.totalTime - a.totalTime);
        }
      });
    }
  };

  const crushBall = (id: number, event: React.MouseEvent) => {
    const ball = balls.find((b) => b.id === id);
    if (!ball) return;

    // Remove ball
    setBalls((prevBalls) => prevBalls.filter((b) => b.id !== id));

    // Add coin explosion at click position
    const rect = event.currentTarget.getBoundingClientRect();
    setCoinExplosions((prev) => [
      ...prev,
      { id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    ]);

    // Update combo
    const now = Date.now();
    if (now - lastHitTime < 1000) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(1);
    }
    setLastHitTime(now);

    // Calculate points with combo multiplier
    const basePoints = isVerified ? 20 : 10;
    const comboMultiplier = Math.min(combo, 5); // Max 5x combo
    const points = basePoints * (1 + comboMultiplier * 0.5);
    setScore((prev) => prev + Math.floor(points));
  };

  const handleAdSubmit = (brandName: string, logoFile: File, amount: number) => {
    // Create object URL for the uploaded image
    const logoUrl = URL.createObjectURL(logoFile);

    const newAd: Advertisement = {
      id: Date.now(),
      advertiser: address || "0x0",
      logoUrl,
      brandName,
      amount,
      timestamp: Date.now(),
      active: true,
    };

    setAdvertisements((prev) => [...prev, newAd]);

    // Update prize pool (70%) and platform fee (30%)
    setPrizePool((prev) => prev + amount * 0.7);
    setPlatformFee((prev) => prev + amount * 0.3);

    alert(`Ad registered successfully! Bid: $${amount}`);
  };

  // Load default ads on mount (demo)
  useEffect(() => {
    const defaultAds: Advertisement[] = DEFAULT_LOGOS.map((logo, i) => ({
      id: i,
      advertiser: "0xDemo",
      logoUrl: logo,
      brandName: `Brand ${i + 1}`,
      amount: MIN_BID + Math.random() * 5, // $1-6 random
      timestamp: Date.now() - i * 1000,
      active: true,
    }));
    setAdvertisements(defaultAds);
    
    const totalSpend = defaultAds.reduce((sum, ad) => sum + ad.amount, 0);
    setPrizePool(totalSpend * 0.7);
    setPlatformFee(totalSpend * 0.3);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Brand Crusher
            </h1>
            <p className="text-gray-400">Advertise, Play, Win!</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            {isConnected && !isVerified && (
              <button
                onClick={() => setIsCivicModalOpen(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition-all font-semibold text-white text-sm"
              >
                🔐 Verify ID
              </button>
            )}
            {isConnected && isVerified && (
              <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-400 rounded-xl font-semibold text-sm cursor-default">
                ✓ Verified (2x)
              </div>
            )}
            <ConnectButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Prize Pool (70%)</p>
            <p className="text-xl font-bold text-green-400">${prizePool.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Active Ads</p>
            <p className="text-xl font-bold text-blue-400">{advertisements.length}/{MAX_SLOTS}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Your Score</p>
            <p className="text-xl font-bold text-yellow-400">{score}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Time Left</p>
            <p className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>
              {gameStarted ? `${timeLeft}s` : `${GAME_DURATION}s`}
            </p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Difficulty</p>
            <p className="text-xl font-bold text-red-400">{calculateDifficulty().toFixed(1)}x</p>
          </div>
        </div>

        {/* Three Big Action Buttons */}
        <div className="space-y-4 mb-6 max-w-3xl mx-auto">
          {/* 1. Register Your Ad Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-6 px-8 rounded-2xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              border-2 border-cyan-400
              hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50
              transition-all duration-300
              text-white font-bold text-xl
              flex items-center justify-center gap-3"
          >
            <span className="text-3xl">📢</span>
            <div className="text-left">
              <div>Register Your Ad</div>
              <div className="text-sm text-cyan-300">Starting from $1 minimum</div>
            </div>
          </button>

          {/* 2. Play Demo Button */}
          <button
            onClick={() => {
              setGameMode("demo");
              startGame();
            }}
            disabled={advertisements.length === 0}
            className="w-full py-6 px-8 rounded-2xl
              bg-gray-600/20 backdrop-blur
              border-2 border-gray-500/50
              hover:bg-gray-600/40 hover:border-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              text-white font-bold text-xl
              flex items-center justify-center gap-3"
          >
            <span className="text-3xl">🎮</span>
            <div className="text-left">
              <div>Play Demo (Free Practice)</div>
              <div className="text-sm text-gray-400">No wallet required • No rewards</div>
            </div>
          </button>

          {/* 3. Play for Real Prize Button (GOLD) */}
          <button
            onClick={() => {
              if (!isConnected) {
                alert("Please connect your wallet first!");
                return;
              }
              if (prizePool < 10) {
                alert(`Prize pool too low: $${prizePool.toFixed(2)} / $10.00 minimum`);
                return;
              }
              setGameMode("real");
              startGame();
            }}
            disabled={!isConnected || prizePool < 10 || advertisements.length === 0}
            className="w-full py-6 px-8 rounded-2xl
              bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500
              border-3 border-yellow-300
              shadow-2xl shadow-yellow-500/50
              hover:scale-105 hover:shadow-yellow-400/70
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              text-black font-extrabold text-xl
              flex items-center justify-center gap-3
              relative overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              animate-shimmer" />
            
            <span className="text-3xl relative z-10">💰</span>
            <div className="text-left relative z-10">
              <div className="flex items-center gap-2">
                <span>Play for Real Prize</span>
                <span className="text-2xl">💎</span>
              </div>
              <div className="text-sm font-bold text-yellow-900">
                {!isConnected 
                  ? "⚠️ Connect Wallet First"
                  : prizePool < 10
                  ? `⚠️ Prize pool: $${prizePool.toFixed(2)} / $10.00 minimum`
                  : `Win $${prizePool.toFixed(2)} • ✓ Wallet Connected`
                }
              </div>
            </div>
          </button>
        </div>

        {/* Game Board */}
        <div className="relative w-full h-[500px] bg-gradient-to-b from-purple-900/30 to-slate-900/30 backdrop-blur rounded-2xl border border-white/20 overflow-hidden">
          {/* Game Mode Badge */}
          {gameStarted && gameMode && (
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full font-bold text-sm z-40 ${
              gameMode === "demo" 
                ? "bg-gray-500/80 text-white border-2 border-gray-400" 
                : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-2 border-yellow-300 animate-pulse"
            }`}>
              {gameMode === "demo" ? "🎮 DEMO MODE" : "💎 LIVE GAME"}
            </div>
          )}

          {balls.map((ball) => (
            <button
              key={ball.id}
              onClick={(e) => crushBall(ball.id, e)}
              className="absolute w-20 h-20 flex items-center justify-center bg-white/20 backdrop-blur rounded-full border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer overflow-hidden p-0"
              style={{
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={ball.logo}
                alt={ball.brand}
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          ))}

          {/* Gold Coin Explosions */}
          {coinExplosions.map((explosion) => (
            <GoldCoinExplosion
              key={explosion.id}
              x={explosion.x}
              y={explosion.y}
              onComplete={() => {
                setCoinExplosions((prev) => prev.filter((e) => e.id !== explosion.id));
              }}
            />
          ))}

          {/* Combo Display */}
          {combo > 1 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              text-6xl font-black text-yellow-400
              animate-bounce
              pointer-events-none z-50"
              style={{
                textShadow: "0 0 20px rgba(255,215,0,1), 0 0 40px rgba(255,215,0,0.8)",
              }}
            >
              x{combo} COMBO!
            </div>
          )}

          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">💰</p>
                <h2 className="text-3xl font-bold mb-2">Ready to Play?</h2>
                <p className="text-gray-400 mb-4">
                  {advertisements.length} ads registered
                </p>
                <p className="text-sm text-gray-500">
                  Prize Pool: ${prizePool.toFixed(2)} • Difficulty: {calculateDifficulty().toFixed(1)}x
                </p>
              </div>
            </div>
          )}

          {gameStarted && (balls.length === 0 || timeLeft === 0) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">
                  {balls.length === 0 ? "🏆" : "⏰"}
                </p>
                <h2 className="text-3xl font-bold mb-2">
                  {balls.length === 0 ? "Perfect Clear!" : "Time's Up!"}
                </h2>
                <p className="text-2xl text-yellow-400 mb-2">Final Score: {score}</p>
                <p className="text-sm text-gray-400 mb-4">
                  {balls.length === 0 
                    ? "You crushed all brands!" 
                    : `${balls.length} brands remaining`}
                </p>
                <p className="text-green-400 mb-6">
                  Potential reward: ${(prizePool * (score / 1000)).toFixed(2)}
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="mt-8">
          <Leaderboard entries={leaderboard.slice(0, 10)} />
        </div>

        {/* Ad Registration Modal */}
        <AdRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAdSubmit}
          currentCompetitors={advertisements.length}
          minBid={MIN_BID}
        />

        {/* Civic Verification Modal */}
        <CivicVerificationModal
          isOpen={isCivicModalOpen}
          onClose={() => setIsCivicModalOpen(false)}
          onVerify={() => {
            verify();
            setIsCivicModalOpen(false);
          }}
          isVerifying={isVerifying}
        />
      </div>
    </div>
  );
}
