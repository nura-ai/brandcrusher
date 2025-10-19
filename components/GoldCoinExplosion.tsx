"use client";

import { useEffect, useState } from "react";

interface Coin {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
}

interface GoldCoinExplosionProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export default function GoldCoinExplosion({ x, y, onComplete }: GoldCoinExplosionProps) {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // Create 15 coins
    const newCoins: Coin[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x,
      y,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: Math.random() * -8 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 1,
    }));
    setCoins(newCoins);

    // Animation loop
    const gravity = 0.5;
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => ({
          ...coin,
          x: coin.x + coin.velocityX,
          y: coin.y + coin.velocityY,
          velocityY: coin.velocityY + gravity,
          rotation: coin.rotation + coin.rotationSpeed,
          opacity: Math.max(0, coin.opacity - 0.02),
        }))
      );
    }, 16);

    // Cleanup after 1.5s
    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [x, y, onComplete]);

  return (
    <>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute pointer-events-none"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            transform: `translate(-50%, -50%) rotateY(${coin.rotation}deg) scale(${coin.scale})`,
            opacity: coin.opacity,
            transition: "none",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            className="drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
          >
            <defs>
              <radialGradient id={`goldGradient-${coin.id}`}>
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF8C00" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill={`url(#goldGradient-${coin.id})`} />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FFFF00" strokeWidth="2" />
            <text
              x="50"
              y="65"
              fontSize="50"
              fill="#8B4513"
              textAnchor="middle"
              fontWeight="bold"
            >
              $
            </text>
          </svg>
        </div>
      ))}
    </>
  );
}

