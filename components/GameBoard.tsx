"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCivicAuth } from "@/hooks/useCivicAuth";
import AdRegistrationModal from "./AdRegistrationModal";
import CivicVerificationModal from "./CivicVerificationModal";
import { Advertisement, Ball } from "@/types";

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

  // Calculate difficulty based on total ad spend
  const calculateDifficulty = () => {
    const totalSpend = advertisements.reduce((sum, ad) => sum + ad.amount, 0);
    return Math.max(1, totalSpend / MIN_BID); // 1x base speed, increases with spend
  };

  // Animation loop
  useEffect(() => {
    if (!gameStarted) return;

    const difficulty = calculateDifficulty();
    const baseSpeed = 0.5;
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

    // Sort ads by amount (highest first) and take top 16
    const sortedAds = [...advertisements]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 16);

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
  };

  const crushBall = (id: number) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== id));
    const points = isVerified ? 20 : 10;
    setScore((prev) => prev + points);
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
          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all font-semibold"
            >
              📢 Register Ad
            </button>
            {isConnected && (
              <button
                onClick={() => isVerified ? null : setIsCivicModalOpen(true)}
                disabled={isVerified}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  isVerified
                    ? "bg-green-500/20 text-green-400 border border-green-400 cursor-default"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                } disabled:opacity-50`}
              >
                {isVerified ? "✓ Verified (2x)" : "🔐 Verify ID"}
              </button>
            )}
            <ConnectButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Prize Pool (70%)</p>
            <p className="text-xl font-bold text-green-400">${prizePool.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Active Ads</p>
            <p className="text-xl font-bold text-blue-400">{advertisements.length}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Your Score</p>
            <p className="text-xl font-bold text-yellow-400">{score}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xs text-gray-400">Difficulty</p>
            <p className="text-xl font-bold text-red-400">{calculateDifficulty().toFixed(1)}x</p>
          </div>
        </div>

        {/* Game Controls */}
        {!gameStarted && (
          <button
            onClick={startGame}
            disabled={!isConnected || advertisements.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold disabled:opacity-50 mb-6"
          >
            {!isConnected
              ? "Connect Wallet to Play"
              : advertisements.length === 0
              ? "Register an Ad to Start"
              : "Start Game"}
          </button>
        )}

        {/* Game Board */}
        <div className="relative w-full h-[500px] bg-gradient-to-b from-purple-900/30 to-slate-900/30 backdrop-blur rounded-2xl border border-white/20 overflow-hidden">
          {balls.map((ball) => (
            <button
              key={ball.id}
              onClick={() => crushBall(ball.id)}
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

          {gameStarted && balls.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">🏆</p>
                <h2 className="text-3xl font-bold mb-2">Round Complete!</h2>
                <p className="text-2xl text-yellow-400 mb-4">Score: {score}</p>
                <p className="text-green-400 mb-6">
                  You can claim ${(prizePool * (score / 1000)).toFixed(2)} from prize pool!
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
