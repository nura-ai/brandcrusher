import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployBrandCrusherV2: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("🚀 Deploying BrandCrusherV2...");

  const brandCrusherV2 = await deploy("BrandCrusherV2", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("✅ BrandCrusherV2 deployed to:", brandCrusherV2.address);
  console.log("📋 Contract features:");
  console.log("  • Advertisement registration with payment");
  console.log("  • Prize pool calculation (70/30 split)");
  console.log("  • Round-based gameplay");
  console.log("  • Civic verification bonus");
  console.log("  • Winner determination & payout");
  console.log("  • Platform fee collection");
};

export default deployBrandCrusherV2;
deployBrandCrusherV2.tags = ["BrandCrusherV2"];
