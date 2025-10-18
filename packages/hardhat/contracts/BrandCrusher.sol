// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BrandCrusher {
    struct GameScore {
        address player;
        uint256 score;
        uint256 timestamp;
        bool civicVerified;
        string playerName;
    }
    
    struct PlayerStats {
        uint256 totalGames;
        uint256 highScore;
        uint256 totalScore;
        bool civicVerified;
    }
    
    // State variables
    GameScore[] public allScores;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => GameScore[]) public playerGames;
    
    uint256 public constant CIVIC_BONUS_MULTIPLIER = 150; // 1.5x = 150%
    uint256 public constant BASE_MULTIPLIER = 100;
    
    // Events
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 finalScore,
        bool civicVerified,
        uint256 timestamp
    );
    
    event CivicVerificationUpdated(address indexed player, bool verified);
    
    // Submit score after game
    function submitScore(
        uint256 _score,
        bool _civicVerified,
        string memory _playerName
    ) external returns (uint256 finalScore) {
        require(_score > 0, "Score must be positive");
        
        // Calculate final score with Civic bonus
        if (_civicVerified) {
            finalScore = (_score * CIVIC_BONUS_MULTIPLIER) / BASE_MULTIPLIER;
        } else {
            finalScore = _score;
        }
        
        // Create game record
        GameScore memory newGame = GameScore({
            player: msg.sender,
            score: finalScore,
            timestamp: block.timestamp,
            civicVerified: _civicVerified,
            playerName: _playerName
        });
        
        // Update storage
        allScores.push(newGame);
        playerGames[msg.sender].push(newGame);
        
        // Update player stats
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalGames++;
        stats.totalScore += finalScore;
        stats.civicVerified = _civicVerified;
        
        if (finalScore > stats.highScore) {
            stats.highScore = finalScore;
        }
        
        emit ScoreSubmitted(
            msg.sender,
            _score,
            finalScore,
            _civicVerified,
            block.timestamp
        );
        
        return finalScore;
    }
    
    // Get leaderboard (top N scores)
    function getTopScores(uint256 limit) external view returns (GameScore[] memory) {
        uint256 length = allScores.length;
        if (length == 0) {
            return new GameScore[](0);
        }
        
        uint256 resultSize = length < limit ? length : limit;
        GameScore[] memory topScores = new GameScore[](resultSize);
        
        // Simple sorting (for production use more efficient algorithm)
        for (uint256 i = 0; i < resultSize; i++) {
            uint256 maxIndex = 0;
            uint256 maxScore = 0;
            
            for (uint256 j = 0; j < length; j++) {
                bool alreadyAdded = false;
                for (uint256 k = 0; k < i; k++) {
                    if (allScores[j].player == topScores[k].player && 
                        allScores[j].timestamp == topScores[k].timestamp) {
                        alreadyAdded = true;
                        break;
                    }
                }
                
                if (!alreadyAdded && allScores[j].score > maxScore) {
                    maxScore = allScores[j].score;
                    maxIndex = j;
                }
            }
            
            topScores[i] = allScores[maxIndex];
        }
        
        return topScores;
    }
    
    // Get player's game history
    function getPlayerGames(address player) external view returns (GameScore[] memory) {
        return playerGames[player];
    }
    
    // Get player stats
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    // Get total games count
    function getTotalGames() external view returns (uint256) {
        return allScores.length;
    }
    
    // Update Civic verification status
    function updateCivicVerification(bool verified) external {
        playerStats[msg.sender].civicVerified = verified;
        emit CivicVerificationUpdated(msg.sender, verified);
    }
}

