const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Generate a new wallet
const wallet = ethers.Wallet.createRandom();

console.log("🔑 New Wallet Generated:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("");

// Create .env file
const envContent = `DEPLOYER_PRIVATE_KEY=${wallet.privateKey}
ARBISCAN_API_KEY=your_arbiscan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
`;

fs.writeFileSync(path.join(__dirname, "../.env"), envContent);

console.log("✅ .env file created with new wallet");
console.log("");
console.log("⚠️  IMPORTANT:");
console.log("1. Fund this wallet with Arbitrum Sepolia ETH");
console.log("2. Get ETH from: https://bridge.arbitrum.io/");
console.log("3. Or use faucet: https://faucet.quicknode.com/arbitrum/sepolia");
console.log("");
console.log("🚀 Ready to deploy!");

