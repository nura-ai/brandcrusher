// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrandCrusher is ReentrancyGuard, Ownable {
    // Constants
    uint256 public constant MIN_AD_PRICE = 0.0003 ether;  // ~$1
    uint256 public constant MIN_PRIZE_POOL = 0.003 ether; // ~$10
    uint256 public constant PRIZE_PERCENTAGE = 70;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 30;
    uint256 public constant ROUND_DURATION = 300; // 5 minutes

    // Structures
    struct Advertisement {
        address advertiser;
        uint256 amount;
        string adContent;
        string brandName;
        uint256 timestamp;
        bool isActive;
    }

    struct GameRound {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 totalAdPool;
        uint256 prizePool;
        uint256 platformFee;
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
        string playerName;
    }

    // State variables
    uint256 public currentRoundId;
    mapping(uint256 => Advertisement[]) public roundAds;
    mapping(uint256 => GameRound) public rounds;
    mapping(address => uint256) public playerBalances;
    mapping(uint256 => PlayerScore[]) public roundScores;
    mapping(address => bool) public civicVerifiedPlayers;

    // Events
    event AdRegistered(address indexed advertiser, uint256 amount, uint256 roundId, string brandName);
    event RoundStarted(uint256 indexed roundId, uint256 startTime);
    event ScoreSubmitted(address indexed player, uint256 score, uint256 roundId, bool civicVerified);
    event RoundEnded(uint256 indexed roundId, address winner, uint256 prize);
    event PrizeClaimed(address indexed winner, uint256 amount);
    event PlatformFeeCollected(uint256 amount);
    event CivicVerificationUpdated(address indexed player, bool verified);

    constructor() Ownable(msg.sender) {
        // Start first round
        _startNewRound();
    }

    function registerAdvertisement(
        string memory _brandName,
        string memory _adContent
    ) external payable {
        require(msg.value >= MIN_AD_PRICE, "Payment too low");
        require(bytes(_brandName).length > 0, "Brand name required");

        // Create advertisement
        Advertisement memory newAd = Advertisement({
            advertiser: msg.sender,
            amount: msg.value,
            adContent: _adContent,
            brandName: _brandName,
            timestamp: block.timestamp,
            isActive: true
        });

        // Add to current round
        roundAds[currentRoundId].push(newAd);

        // Update round totals
        GameRound storage currentRound = rounds[currentRoundId];
        currentRound.totalAdPool += msg.value;
        currentRound.prizePool = (currentRound.totalAdPool * PRIZE_PERCENTAGE) / 100;
        currentRound.platformFee = (currentRound.totalAdPool * PLATFORM_FEE_PERCENTAGE) / 100;

        emit AdRegistered(msg.sender, msg.value, currentRoundId, _brandName);
    }

    function submitScore(
        uint256 _score,
        bool _civicVerified,
        string memory _playerName
    ) external {
        require(_score > 0, "Score must be greater than 0");
        require(rounds[currentRoundId].isActive, "No active round");

        PlayerScore memory newScore = PlayerScore({
            player: msg.sender,
            score: _score,
            roundId: currentRoundId,
            civicVerified: _civicVerified,
            playerName: _playerName
        });

        roundScores[currentRoundId].push(newScore);
        rounds[currentRoundId].playerCount++;

        emit ScoreSubmitted(msg.sender, _score, currentRoundId, _civicVerified);
    }

    function endRound() external {
        GameRound storage currentRound = rounds[currentRoundId];
        require(currentRound.isActive, "No active round");
        require(block.timestamp >= currentRound.endTime, "Round not finished");

        // Find winner
        PlayerScore[] memory scores = roundScores[currentRoundId];
        if (scores.length > 0) {
            uint256 maxScore = 0;
            address winner = address(0);
            
            for (uint256 i = 0; i < scores.length; i++) {
                if (scores[i].score > maxScore) {
                    maxScore = scores[i].score;
                    winner = scores[i].player;
                }
            }

            if (winner != address(0) && currentRound.prizePool > 0) {
                currentRound.winner = winner;
                currentRound.winningScore = maxScore;
                playerBalances[winner] += currentRound.prizePool;
                
                emit RoundEnded(currentRoundId, winner, currentRound.prizePool);
            }
        }

        // Transfer platform fee to owner
        if (currentRound.platformFee > 0) {
            payable(owner()).transfer(currentRound.platformFee);
            emit PlatformFeeCollected(currentRound.platformFee);
        }

        currentRound.isActive = false;
        _startNewRound();
    }

    function claimPrize() external nonReentrancy {
        uint256 balance = playerBalances[msg.sender];
        require(balance > 0, "No prize to claim");

        playerBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit PrizeClaimed(msg.sender, balance);
    }

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

        emit RoundStarted(currentRoundId, block.timestamp);
    }

    // View functions
    function getCurrentPrizePool() external view returns (uint256) {
        return rounds[currentRoundId].prizePool;
    }

    function getRoundDifficulty(uint256 _roundId) external view returns (string memory) {
        uint256 totalPool = rounds[_roundId].totalAdPool;
        if (totalPool < MIN_PRIZE_POOL) return "Easy";
        if (totalPool < 0.01 ether) return "Medium";
        if (totalPool < 0.1 ether) return "Hard";
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

    function getCurrentRound() external view returns (GameRound memory) {
        return rounds[currentRoundId];
    }

    function updateCivicVerification(bool verified) external {
        civicVerifiedPlayers[msg.sender] = verified;
        emit CivicVerificationUpdated(msg.sender, verified);
    }

    function getPlayerBalance(address player) external view returns (uint256) {
        return playerBalances[player];
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        rounds[currentRoundId].isActive = false;
    }

    function withdrawEmergency() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}