"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

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
  { name: "Apple", logo: "🍎" },
  { name: "Amazon", logo: "📦" },
  { name: "Google", logo: "🔍" },
  { name: "Meta", logo: "👤" },
  { name: "Tesla", logo: "⚡" },
  { name: "Nike", logo: "👟" },
  { name: "Coca-Cola", logo: "🥤" },
  { name: "McDonald's", logo: "🍔" },
];

export default function GameBoard() {
  const { address, isConnected } = useAccount();
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
    const newBalls: Ball[] = Array.from({ length: 8 }, (_, i) => ({
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
    setScore((prev) => prev + 10);
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
          <ConnectButton />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-2xl font-bold text-yellow-400">{score}</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-gray-400">Balls Left</p>
            <p className="text-2xl font-bold text-blue-400">{balls.length}</p>
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
              className="absolute w-16 h-16 text-4xl flex items-center justify-center bg-white/20 backdrop-blur rounded-full border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
              style={{
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {ball.logo}
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

