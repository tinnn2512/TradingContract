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


//   const transactionContract = await hre.ethers.deployContract("TransactionContract"[landLicenseRegistry.target]);
//   await transactionContract.waitForDeployment();
//   console.log("transactionContract deploy at:", transactionContract.target);
  // Deploy TransactionContract
  const TransactionContract = await ethers.getContractFactory("TransactionContract"); // Check the correct name
  const transactionContract = await TransactionContract.deploy(landLicenseRegistry.target); // Ensure valid parameter
  await transactionContract.waitForDeployment(); // Ensure successful deployment
  console.log("TransactionContract deployed at:", transactionContract.target);
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

