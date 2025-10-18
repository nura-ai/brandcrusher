import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Validating private key format...");
  
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  
  if (!privateKey) {
    console.log("❌ No private key found in environment");
    return;
  }
  
  console.log("Private key length:", privateKey.length);
  console.log("Starts with 0x:", privateKey.startsWith("0x"));
  console.log("First 10 characters:", privateKey.substring(0, 10));
  console.log("Last 10 characters:", privateKey.substring(privateKey.length - 10));
  
  // Check if it's the correct length
  if (privateKey.length !== 66) {
    console.log("❌ Wrong length! Should be 66 characters (0x + 64 hex)");
    console.log("Current length:", privateKey.length);
    return;
  }
  
  // Check if it starts with 0x
  if (!privateKey.startsWith("0x")) {
    console.log("❌ Missing 0x prefix!");
    console.log("Add 0x to the beginning of your private key");
    return;
  }
  
  // Check if it's valid hex
  const hexPart = privateKey.substring(2);
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
    console.log("❌ Contains invalid characters! Only 0-9, a-f, A-F allowed");
    return;
  }
  
  // Try to create wallet
  try {
    const wallet = new ethers.Wallet(privateKey);
    console.log("✅ Private key format is valid!");
    console.log("Wallet address:", wallet.address);
    
    // Check balance
    const provider = ethers.provider;
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    
    console.log("Balance:", balanceInEth, "ETH");
    
    if (balance > 0n) {
      console.log("🎉 Wallet has funds! Ready to deploy!");
    } else {
      console.log("❌ Wallet has no funds - needs funding");
    }
    
  } catch (error) {
    console.log("❌ Invalid private key:", error.message);
  }
}

main().catch(console.error);

