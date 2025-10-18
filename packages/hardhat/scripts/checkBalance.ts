import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🔍 Checking wallet balance...");
  console.log("Wallet address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("Balance:", balanceInEth, "ETH");
  
  if (balance === 0n) {
    console.log("❌ Wallet has 0 ETH - needs funding!");
    console.log("");
    console.log("💰 Get Arbitrum Sepolia ETH:");
    console.log("1. Bridge from Sepolia: https://bridge.arbitrum.io/");
    console.log("2. Use faucet: https://faucet.quicknode.com/arbitrum/sepolia");
    console.log("3. Check balance: https://sepolia.arbiscan.io/address/" + deployer.address);
  } else {
    console.log("✅ Wallet has ETH - ready to deploy!");
  }
}

main().catch(console.error);

