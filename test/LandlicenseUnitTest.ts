import {  expect } from "chai";
import { ethers } from "hardhat";

import { AccessManager } from "../typechain-types"; // Assuming this is the path to your AccessManager interface
import { LandLicenseRegistry } from "../typechain-types"; // Assuming this is the path to your LandLicenseRegistry interface
import { State } from "../typechain-types/LandLicenseRegistry";


describe("LandLicenseRegistry", () => {
  let landLicenseRegistry: LandLicenseRegistry;
  let accessManager: AccessManager;
  let owner: any;
  let notary: any;
  let nonNotary: any;

  beforeEach(async () => {

    [notary, owner, nonNotary] = await ethers.getSigners(); // Destructure signers

    const AccessManager = await ethers.getContractFactory("AccessManager");
    accessManager = await AccessManager.deploy(); // Deploy AccessManager

    // Grant notary role to 'notary' address using AccessManager function
    const tx = await accessManager.grantNotaryRole(notary.address);
    await tx.wait();

    const LandLicenseRegistry = await ethers.getContractFactory("LandLicenseRegistry");
    landLicenseRegistry = await LandLicenseRegistry.deploy(accessManager.target); // Pass deployed address
  });
  describe("Deployment", () => {
    it("should deploy LandLicenseRegistry contract successfully", async () => {
      const deployedAddress = landLicenseRegistry.target;
      expect(deployedAddress).to.not.equal("0x0000000000000000000000000000000000000000"); // Check for non-zero address
    });
  });
  describe("registerLandLicense", () => {

    it("should register a land license", async () => {
      const licenseId = "LIC123";
      const ipfsHash = "Qm1234";

      const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, ipfsHash, notary.address);
      await tx.wait();

      const landLicense = await landLicenseRegistry.landLicenses(licenseId);
      expect(landLicense.owner).to.equal(owner.address);
      expect(landLicense.ipfsHash).to.equal(ipfsHash);
      expect(landLicense.notary).to.equal(notary.address);
    
    });
    it("should emit Certificate event upon registering a land license", async () => {
      const licenseId = "LIC123";
      const ipfsHash = "Qm1234";
    
      const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, ipfsHash, notary.address);
      await tx.wait();
    
      // Test emission of the Certificate event
      expect(tx)
        .to.emit(landLicenseRegistry, "Certificate")
        .withArgs(owner.address, licenseId, ipfsHash, notary.address);
    });
    
    
    it("should revert if called by a non-notary address", async () => {
      const licenseId = "LIC123";
      const ipfsHash = "Qm1234";

      await expect(landLicenseRegistry.connect(nonNotary).registerLandLicense(owner.address, licenseId, ipfsHash, notary.address)).to.be.revertedWith("Notary permission required");
    });

    it("should revert if owner and notary are the same address", async () => {
      const licenseId = "LIC123";
      const ipfsHash = "Qm1234";

      await expect(landLicenseRegistry.connect(notary).registerLandLicense(notary.address, licenseId, ipfsHash, notary.address)).to.be.revertedWith("Owner and notary cannot be the same address");
    });

    it("should revert if ipfsHash is empty", async () => {
      const licenseId = "LIC123";

      await expect(landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "", notary.address)).to.be.revertedWith("ipfsHash must be provided");
    });

    it("should revert if license ID already exists", async () => {
      const licenseId = "LIC123";
      const ipfsHash = "Qm1234";

      await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, ipfsHash, notary.address);

      await expect(landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "anotherHash", notary.address)).to.be.revertedWith("Land license with this ID already exists");
    });
    describe("Active", () => {
      it("activates land license successfully", async () => {
        const licenseId = "unique_id";
        const ipfsHash = "ipfs://example-hash";
  
        // Register the land license
        await landLicenseRegistry.registerLandLicense(owner.address, licenseId, ipfsHash, notary.address);

        await landLicenseRegistry.connect(owner).activate(licenseId);
        // Verify that the license is activated
        const state = await landLicenseRegistry.getStateOfCert(licenseId);
        expect(state).to.equal(State.ACTIVATED);
      });
      it("should emit Activate event", async () => {
        const licenseId = "unique_id";
        const ipfsHash = "ipfs://example-hash";
  
        // Register the land license
        await landLicenseRegistry.registerLandLicense(owner.address, licenseId, ipfsHash, notary.address);
  
        // Approve activation from owner
        await expect(landLicenseRegistry.connect(owner).activate(licenseId))
          .to.emit(landLicenseRegistry, "Activate")
          .withArgs(licenseId, owner.address, State.ACTIVATED);
      });
  });
});
});