"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCivicAuth } from "@/hooks/useCivicAuth";

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  brand: string;
  logo: string;
}

const BRANDS = [
  { name: "Brand 1", logo: "/logos/IMG_6942.JPG" },
  { name: "Brand 2", logo: "/logos/IMG_6943.jpg" },
  { name: "Brand 3", logo: "/logos/IMG_6944.jpg" },
  { name: "Brand 4", logo: "/logos/IMG_6945.JPG" },
  { name: "Brand 5", logo: "/logos/IMG_6946.JPG" },
  { name: "Brand 6", logo: "/logos/IMG_6947.JPG" },
  { name: "Brand 7", logo: "/logos/IMG_6948.PNG" },
  { name: "Brand 8", logo: "/logos/IMG_6949.JPG" },
  { name: "Brand 9", logo: "/logos/IMG_6950.JPG" },
  { name: "Brand 10", logo: "/logos/IMG_6951.JPG" },
  { name: "Brand 11", logo: "/logos/IMG_6952.PNG" },
  { name: "Brand 12", logo: "/logos/IMG_6953.JPG" },
  { name: "Brand 13", logo: "/logos/IMG_6954.JPG" },
  { name: "Brand 14", logo: "/logos/IMG_6955.PNG" },
  { name: "Brand 15", logo: "/logos/IMG_6956.JPG" },
  { name: "Brand 16", logo: "/logos/IMG_6957.JPG" },
];

export default function GameBoard() {
  const { address, isConnected } = useAccount();
  const { isVerified, isVerifying, verify } = useCivicAuth();
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          let newVx = ball.vx;
          let newVy = ball.vy;

          if (newX <= 0 || newX >= 90) newVx = -newVx;
          if (newY <= 0 || newY >= 90) newVy = -newVy;

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted]);

  const startGame = () => {
    const newBalls: Ball[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 5,
      y: Math.random() * 80 + 5,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      brand: BRANDS[i].name,
      logo: BRANDS[i].logo,
    }));
    setBalls(newBalls);
    setGameStarted(true);
    setScore(0);
  };

  const crushBall = (id: number) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== id));
    const points = isVerified ? 20 : 10; // 2x multiplier for verified users
    setScore((prev) => prev + points);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Brand Crusher
            </h1>
            <p className="text-gray-400">Crush brands, earn points!</p>
          </div>
          <div className="flex gap-3 items-center">
            {isConnected && (
              <button
                onClick={verify}
                disabled={isVerified || isVerifying}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  isVerified
                    ? "bg-green-500/20 text-green-400 border border-green-400"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                } disabled:opacity-50`}
              >
                {isVerifying ? "Verifying..." : isVerified ? "✓ Verified (2x)" : "🔐 Verify ID"}
              </button>
            )}
            <ConnectButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-2xl font-bold text-yellow-400">{score}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-gray-400">Balls Left</p>
            <p className="text-2xl font-bold text-blue-400">{balls.length}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-gray-400">Multiplier</p>
            <p className="text-2xl font-bold text-green-400">{isVerified ? "2x" : "1x"}</p>
          </div>
        </div>

        {/* Game Controls */}
        {!gameStarted && (
          <button
            onClick={startGame}
            disabled={!isConnected}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold disabled:opacity-50 mb-6"
          >
            {isConnected ? "Start Game" : "Connect Wallet to Play"}
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
                <p className="text-6xl mb-4">🎮</p>
                <h2 className="text-3xl font-bold mb-2">Ready to Crush?</h2>
                <p className="text-gray-400">Click brands to earn points!</p>
              </div>
            </div>
          )}

          {gameStarted && balls.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">🏆</p>
                <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                <p className="text-2xl text-yellow-400 mb-4">Score: {score}</p>
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
      </div>
    </div>
  );
}

