export interface Advertisement {
  id: number;
  advertiser: string;
  logoUrl: string;
  brandName: string;
  amount: number; // in USD
  timestamp: number;
  active: boolean;
}

export interface GameRound {
  id: number;
  totalPrizePool: number;
  totalAds: number;
  difficulty: number; // speed multiplier
  startTime: number;
  endTime?: number;
  winners: string[];
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  brand: string;
  logo: string;
  adId: number;
  amount: number;
}

export interface LeaderboardEntry {
  address: string;
  totalScore: number;
  totalTime: number; // in seconds
  gamesPlayed: number;
  lastPlayed: number;
  verified: boolean;
}
