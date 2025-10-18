import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Testing wallet configuration...");
  
  // Check environment variable
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  console.log("Private key from env:", privateKey ? "✅ Found" : "❌ Not found");
  console.log("Private key length:", privateKey?.length || 0);
  console.log("Private key starts with 0x:", privateKey?.startsWith("0x") || false);
  
  if (privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      console.log("Wallet address:", wallet.address);
      
      // Check balance
      const provider = ethers.provider;
      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);
      
      console.log("Balance:", balanceInEth, "ETH");
      
      if (balance > 0n) {
        console.log("✅ Wallet has funds!");
      } else {
        console.log("❌ Wallet has no funds");
      }
    } catch (error) {
      console.error("❌ Error with private key:", error.message);
    }
  }
}

main().catch(console.error);

