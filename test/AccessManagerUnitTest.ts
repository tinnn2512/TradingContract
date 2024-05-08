import { assert, expect } from "chai";
import { ethers } from "hardhat";


describe("AccessManager", () => {
  let accessManager: any;
  let deployer: string;
  let notaryAccount: string;

  beforeEach(async () => {
    const AccessManager = await ethers.getContractFactory("AccessManager");
    accessManager = await AccessManager.deploy();

    const [deployerSigner, notarySigner] = await ethers.getSigners();
    deployer = deployerSigner.address;
    notaryAccount = notarySigner.address;
  });
   
  describe("Deployment", () => {
    it("should set the ADMIN_ROLE for the deployer", async () => {
      const isAdmin = await accessManager.isAdmin(deployer);
      expect(isAdmin).to.be.true;
    });
  });

  describe("grantNotaryRole", () => {
    it("should grant the NOTARY_ROLE to the specified account", async () => {
      await accessManager.grantNotaryRole(notaryAccount);
      const isNotary = await accessManager.hasNotaryRole(notaryAccount);
      expect(isNotary).to.be.true;
    });

    it("should emit a RoleGranted event for the NOTARY_ROLE", async () => {
      await expect(accessManager.grantNotaryRole(notaryAccount))
        .to.emit(accessManager, "RoleGranted")
        .withArgs(notaryAccount, "NOTARY");
    });
    it("should only allow admin to grant roles", async function () {
      const [, unauthorized] = await ethers.getSigners();
  
      await expect(
        accessManager.connect(unauthorized).grantNotaryRole(notaryAccount)
      ).to.be.revertedWith("Only admins can grant roles");
    });
  });

  describe("revokeNotaryRole", () => {
    it("should revoke the NOTARY_ROLE from the specified account", async () => {
      await accessManager.grantNotaryRole(notaryAccount);
      await accessManager.revokeNotaryRole(notaryAccount);
      const isNotary = await accessManager.hasNotaryRole(notaryAccount);
      expect(isNotary).to.be.false;
    });

    it("should emit a RoleRevoked event for the NOTARY_ROLE", async () => {
      await accessManager.grantNotaryRole(notaryAccount);
      await expect(accessManager.revokeNotaryRole(notaryAccount))
        .to.emit(accessManager, "RoleRevoked")
        .withArgs(notaryAccount, "NOTARY");
    });
    it("should only allow admin to revoke roles", async function () {
      const [, unauthorized] = await ethers.getSigners();
      await accessManager.grantNotaryRole(notaryAccount);
      await expect(
        accessManager.connect(unauthorized).revokeNotaryRole(notaryAccount)
      ).to.be.revertedWith("Only admins can revoke roles");
    });
  });
});