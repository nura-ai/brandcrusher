// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BrandCrusherV2 {
    // Core structures
    struct Advertisement {
        address advertiser;
        uint256 amount;          // Amount paid in ETH
        string adContent;       // IPFS hash or URL
        string brandName;
        uint256 timestamp;
        bool isActive;
        uint256 roundId;
    }
    
    struct GameRound {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 totalAdPool;
        uint256 prizePool;       // 70% of totalAdPool
        uint256 platformFee;     // 30% of totalAdPool
        address winner;
        uint256 winningScore;
        bool isActive;
        uint256 playerCount;
    }
    
    struct PlayerScore {
        address player;
        uint256 score;
        uint256 roundId;
        bool civicVerified;
        uint256 timestamp;
    }
    
    struct PlayerStats {
        uint256 totalGames;
        uint256 highScore;
        uint256 totalScore;
        bool civicVerified;
        uint256 totalWinnings;
    }
    
    // State variables
    mapping(uint256 => GameRound) public rounds;
    mapping(uint256 => PlayerScore[]) public roundScores;
    mapping(uint256 => Advertisement[]) public roundAds;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256) public playerBalances;
    
    // Round management
    uint256 public currentRoundId;
    uint256 public constant ROUND_DURATION = 300; // 5 minutes in seconds
    uint256 public constant MIN_AD_PRICE = 0.0003 ether;  // ~$1
    uint256 public constant MIN_PRIZE_POOL = 0.003 ether; // ~$10
    uint256 public constant PRIZE_PERCENTAGE = 70;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 30;
    uint256 public constant CIVIC_BONUS_MULTIPLIER = 150; // 1.5x = 150%
    uint256 public constant BASE_MULTIPLIER = 100;
    
    address public owner;
    uint256 public totalPlatformFees;
    
    // Events
    event AdRegistered(address indexed advertiser, uint256 amount, uint256 roundId, string brandName);
    event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event ScoreSubmitted(address indexed player, uint256 score, uint256 roundId, bool civicVerified);
    event RoundEnded(uint256 indexed roundId, address winner, uint256 prize, uint256 platformFee);
    event PrizeClaimed(address indexed winner, uint256 amount);
    event PlatformFeeCollected(uint256 amount);
    event CivicVerificationUpdated(address indexed player, bool verified);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyActiveRound() {
        require(rounds[currentRoundId].isActive, "No active round");
        require(block.timestamp <= rounds[currentRoundId].endTime, "Round has ended");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        _startNewRound();
    }
    
    // Register advertisement with payment
    function registerAdvertisement(
        string memory _brandName,
        string memory _adContent
    ) external payable {
        require(msg.value >= MIN_AD_PRICE, "Payment below minimum");
        require(rounds[currentRoundId].isActive, "No active round");
        require(block.timestamp <= rounds[currentRoundId].endTime, "Round has ended");
        
        // Create advertisement
        Advertisement memory newAd = Advertisement({
            advertiser: msg.sender,
            amount: msg.value,
            adContent: _adContent,
            brandName: _brandName,
            timestamp: block.timestamp,
            isActive: true,
            roundId: currentRoundId
        });
        
        // Add to current round
        roundAds[currentRoundId].push(newAd);
        rounds[currentRoundId].totalAdPool += msg.value;
        
        // Calculate prize pool (70% of ad payment)
        uint256 prizeContribution = (msg.value * PRIZE_PERCENTAGE) / 100;
        uint256 platformContribution = (msg.value * PLATFORM_FEE_PERCENTAGE) / 100;
        
        rounds[currentRoundId].prizePool += prizeContribution;
        rounds[currentRoundId].platformFee += platformContribution;
        
        emit AdRegistered(msg.sender, msg.value, currentRoundId, _brandName);
    }
    
    // Submit score during active round
    function submitScore(
        uint256 _score,
        bool _civicVerified,
        string memory _playerName
    ) external onlyActiveRound returns (uint256 finalScore) {
        require(_score > 0, "Score must be positive");
        
        // Calculate final score with Civic bonus
        if (_civicVerified) {
            finalScore = (_score * CIVIC_BONUS_MULTIPLIER) / BASE_MULTIPLIER;
        } else {
            finalScore = _score;
        }
        
        // Create player score record
        PlayerScore memory newScore = PlayerScore({
            player: msg.sender,
            score: finalScore,
            roundId: currentRoundId,
            civicVerified: _civicVerified,
            timestamp: block.timestamp
        });
        
        // Add to round scores
        roundScores[currentRoundId].push(newScore);
        rounds[currentRoundId].playerCount++;
        
        // Update player stats
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalGames++;
        stats.totalScore += finalScore;
        stats.civicVerified = _civicVerified;
        
        if (finalScore > stats.highScore) {
            stats.highScore = finalScore;
        }
        
        emit ScoreSubmitted(msg.sender, _score, currentRoundId, _civicVerified);
        
        return finalScore;
    }
    
    // End current round and determine winner
    function endRound() external {
        require(rounds[currentRoundId].isActive, "No active round");
        require(
            block.timestamp > rounds[currentRoundId].endTime || 
            rounds[currentRoundId].playerCount > 0,
            "Round not ready to end"
        );
        
        GameRound storage round = rounds[currentRoundId];
        round.isActive = false;
        
        // Find winner if there are players
        if (round.playerCount > 0 && round.prizePool > 0) {
            PlayerScore[] memory scores = roundScores[currentRoundId];
            address winner = address(0);
            uint256 highestScore = 0;
            
            for (uint256 i = 0; i < scores.length; i++) {
                if (scores[i].score > highestScore) {
                    highestScore = scores[i].score;
                    winner = scores[i].player;
                }
            }
            
            if (winner != address(0)) {
                round.winner = winner;
                round.winningScore = highestScore;
                
                // Transfer prize to winner
                playerBalances[winner] += round.prizePool;
                playerStats[winner].totalWinnings += round.prizePool;
                
                emit PrizeClaimed(winner, round.prizePool);
            }
        }
        
        // Collect platform fee
        if (round.platformFee > 0) {
            totalPlatformFees += round.platformFee;
            emit PlatformFeeCollected(round.platformFee);
        }
        
        emit RoundEnded(currentRoundId, round.winner, round.prizePool, round.platformFee);
        
        // Start new round
        _startNewRound();
    }
    
    // Start new round
    function _startNewRound() internal {
        currentRoundId++;
        rounds[currentRoundId] = GameRound({
            roundId: currentRoundId,
            startTime: block.timestamp,
            endTime: block.timestamp + ROUND_DURATION,
            totalAdPool: 0,
            prizePool: 0,
            platformFee: 0,
            winner: address(0),
            winningScore: 0,
            isActive: true,
            playerCount: 0
        });
        
        emit RoundStarted(currentRoundId, block.timestamp, block.timestamp + ROUND_DURATION);
    }
    
    // Claim prize (if any)
    function claimPrize() external {
        uint256 amount = playerBalances[msg.sender];
        require(amount > 0, "No prize to claim");
        
        playerBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit PrizeClaimed(msg.sender, amount);
    }
    
    // Update Civic verification status
    function updateCivicVerification(bool verified) external {
        playerStats[msg.sender].civicVerified = verified;
        emit CivicVerificationUpdated(msg.sender, verified);
    }
    
    // View functions
    function getCurrentPrizePool() external view returns (uint256) {
        return rounds[currentRoundId].prizePool;
    }
    
    function getCurrentRoundInfo() external view returns (
        uint256 roundId,
        uint256 startTime,
        uint256 endTime,
        uint256 totalAdPool,
        uint256 prizePool,
        uint256 playerCount,
        bool isActive
    ) {
        GameRound memory round = rounds[currentRoundId];
        return (
            round.roundId,
            round.startTime,
            round.endTime,
            round.totalAdPool,
            round.prizePool,
            round.playerCount,
            round.isActive
        );
    }
    
    function getRoundDifficulty(uint256 _roundId) external view returns (string memory) {
        GameRound memory round = rounds[_roundId];
        if (round.totalAdPool == 0) return "Easy";
        if (round.totalAdPool < 0.001 ether) return "Medium";
        if (round.totalAdPool < 0.01 ether) return "Hard";
        return "EXTREME";
    }
    
    function getActivePlayersCount() external view returns (uint256) {
        return rounds[currentRoundId].playerCount;
    }
    
    function getRoundAds(uint256 _roundId) external view returns (Advertisement[] memory) {
        return roundAds[_roundId];
    }
    
    function getRoundScores(uint256 _roundId) external view returns (PlayerScore[] memory) {
        return roundScores[_roundId];
    }
    
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    function getPlayerBalance(address player) external view returns (uint256) {
        return playerBalances[player];
    }
    
    // Emergency functions (owner only)
    function pauseRound() external onlyOwner {
        rounds[currentRoundId].isActive = false;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(owner).transfer(amount);
    }
    
    // Fallback to receive ETH
    receive() external payable {}
}
