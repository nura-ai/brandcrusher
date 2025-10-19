"use client";

import { LeaderboardEntry } from "@/types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🏆</span>
        <div>
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          <p className="text-sm text-gray-400">Top Players by Time Played</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">🎮</p>
            <p>No players yet. Be the first!</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.address}
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border border-gray-400/40"
                  : index === 2
                  ? "bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-700/40"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-black"
                      : index === 1
                      ? "bg-gray-300 text-black"
                      : index === 2
                      ? "bg-orange-700 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {formatAddress(entry.address)}
                    </span>
                    {entry.verified && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/40">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>⏱️ {formatTime(entry.totalTime)}</span>
                    <span>•</span>
                    <span>🎮 {entry.gamesPlayed} games</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">
                  {entry.totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          ))
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">Total Players</p>
              <p className="text-lg font-bold text-white">{entries.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Games</p>
              <p className="text-lg font-bold text-white">
                {entries.reduce((sum, e) => sum + e.gamesPlayed, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Time</p>
              <p className="text-lg font-bold text-white">
                {formatTime(entries.reduce((sum, e) => sum + e.totalTime, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

