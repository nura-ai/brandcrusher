import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployBrandCrusher: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("BrandCrusher", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const brandCrusher = await hre.ethers.getContract("BrandCrusher", deployer);
  console.log("✅ BrandCrusher deployed to:", await brandCrusher.getAddress());
};

export default deployBrandCrusher;
deployBrandCrusher.tags = ["BrandCrusher"];

