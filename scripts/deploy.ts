import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  // Triển khai hợp đồng AccessManager
  const AccessManager = await ethers.getContractFactory("AccessManager");
  const accessManager = await AccessManager.deploy();

  console.log("AccessManager deployed at:", accessManager.target);

  // Triển khai hợp đồng LandLicenseRegistry và chuyển địa chỉ của AccessManager đã triển khai

  const landLicenseRegistry = await hre.ethers.deployContract("LandLicenseRegistry", [accessManager.target]);

  await landLicenseRegistry.waitForDeployment();
  console.log("landLiceneContract deployed at:", landLicenseRegistry.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
