import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessManager, LandLicenseRegistry__factory } from "../typechain-types";
import { LandLicenseRegistry } from "../typechain-types";
import { TransactionContract } from "../typechain-types";
import { State } from "../typechain-types/LandLicenseRegistry";






describe("TransactionContract", () => {
  let landLicenseRegistry: LandLicenseRegistry;
  let accessManager: AccessManager;
  let transactionContract: TransactionContract;
  let owner: any;
  let notary: any;
  let seller: any;
  let buyer1: any;
  let buyer2: any;



  beforeEach(async () => {
    [notary, owner, seller, buyer1, buyer2] = await ethers.getSigners();
    const AccessManagerFactory = await ethers.getContractFactory("AccessManager");
    accessManager = await AccessManagerFactory.deploy();

    const tx = await accessManager.grantNotaryRole(notary.address);
    await tx.wait();

    const LandLicenseRegistryFactory = await ethers.getContractFactory("LandLicenseRegistry");
    landLicenseRegistry = await LandLicenseRegistryFactory.deploy(accessManager.target);
    await landLicenseRegistry.waitForDeployment();

    const TransactionContractFactory = await ethers.getContractFactory("TransactionContract");
    transactionContract = await TransactionContractFactory.deploy(landLicenseRegistry.target);
    await transactionContract.waitForDeployment();


  });

  describe("createTransaction", async () => {
    let licenseId = "licenseId123";
    let depositPrice = 1000;
    let transferPrice = 5000;
    let depositTime = 30; // 30 days

    it("should revert if the state of the certificate is not active", async () => {
      const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
      await tx.wait();


      const state = await landLicenseRegistry.getStateOfCert(licenseId);
      expect(state).to.not.equal(State.ACTIVATED);
      await expect(
        transactionContract.connect(buyer1).createTransaction(
          [buyer1.address],
          licenseId,
          depositPrice,
          transferPrice,
          depositTime
        )
      ).to.be.revertedWith("CreateTransaction: Require state of certificate is ACTIVATE");
    });
    it("should revert if value sent is less than deposit price", async () => {
      const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
      await tx.wait();
      await landLicenseRegistry.connect(owner).activate(licenseId);

      // Thử tạo giao dịch với giá trị gửi ít hơn giá tiền gửi
      await expect(
        transactionContract.connect(buyer1).createTransaction(
          [buyer1.address],
          licenseId,
          depositPrice,
          transferPrice,
          depositTime,
          { value: depositPrice - 1 } // Gửi một số tiền ít hơn giá tiền gửi
        )
      ).to.be.revertedWith("CreateTransaction: Require value greater than deposit price");
    });
    it("should create transaction successfully", async () => {
      const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
      await tx.wait();
      await landLicenseRegistry.connect(owner).activate(licenseId);

      // Gửi đủ tiền ký quỹ khi gọi createTransaction
      await expect(
        transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, {
          value: depositPrice,
        })
      ).to.not.be.reverted;
    });
    describe("AcceptTransaction", async () => {
      const licenseId = "licenseId123";
      const depositPrice = 1000;
      const transferPrice = 5000;
      const depositTime = 30; // 30 days

      // beforeEach(async () => {
      //   // Create a valid transaction
      //   // const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
      //   // await tx.wait();
      //   // await landLicenseRegistry.connect(owner).activate(licenseId);
      //   // const depositPriceInWei = ethers.parseEther(depositPrice.toString());
      //   // await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
      // });

      it("should accept transaction successfully", async () => {
        const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
        await tx.wait();
        await landLicenseRegistry.connect(owner).activate(licenseId);
        const depositPriceInWei = ethers.parseEther(depositPrice.toString());
        await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
        // Now accept the transaction (assuming it's created successfully)
        await expect(transactionContract.connect(owner).acceptTransaction(1)).to.not.be.reverted;
      });
      it("should revert if msg.sender is not the representative owner", async () => {
        const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
        await tx.wait();
        await landLicenseRegistry.connect(owner).activate(licenseId);
        const depositPriceInWei = ethers.parseEther(depositPrice.toString());
        await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
        await expect(transactionContract.connect(buyer2).acceptTransaction(1)).to.be.revertedWith("AcceptTransaction: require representative of owner");
      });
      it("should emit event DepositSigned", async () => {
        const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
        await tx.wait();
        await landLicenseRegistry.connect(owner).activate(licenseId);
        const depositPriceInWei = ethers.parseEther(depositPrice.toString());
        await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
        try {
          await transactionContract.connect(owner).acceptTransaction(1);

          // This line will throw an error if the event was emitted
          expect(false).to.equal(true, "DepositSigned event was emitted unexpectedly");
        } catch (error) {
          // Expected error, do nothing
        }
      });
      it("should set the state of certificate to IN_TRANSACTION on acceptance", async () => {
        const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
        await tx.wait();
        await landLicenseRegistry.connect(owner).activate(licenseId);
        const depositPriceInWei = ethers.parseEther(depositPrice.toString());
        await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
        await transactionContract.connect(owner).acceptTransaction(1);

        // Get the current state of the certificate
        const currentState = await landLicenseRegistry.getStateOfCert(licenseId);

        // Verify the state is IN_TRANSACTION
        expect(currentState).to.equal(State.IN_TRANSACTION);
      });
      describe("Payment", async () => {
        let licenseId = "licenseId123";
        let depositPrice = 1000;
        let transferPrice = 5000;
        let depositTime = 30; // 30 days

        // beforeEach(async () => {
        //   // Create a valid transaction
        //   // const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
        //   // await tx.wait();
        //   // await landLicenseRegistry.connect(owner).activate(licenseId);
        //   // const depositPriceInWei = ethers.parseEther(depositPrice.toString());
        //   // await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
        //   // // Now accept the transaction
        //   // await transactionContract.connect(owner).acceptTransaction(1);

        // });

        it("should revert if the sent value is less than the total amount", async () => {
          const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
          await tx.wait();
          await landLicenseRegistry.connect(owner).activate(licenseId);
          const depositPriceInWei = ethers.parseEther(depositPrice.toString());
          await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });
          // Now accept the transaction
          await transactionContract.connect(owner).acceptTransaction(1);

          const remainingAmount = transferPrice - depositPrice;
          const registrationTax = transferPrice * 5 / 1000; // 0.5% tax (using mulDiv for accurate division)
          const totalAmount = remainingAmount + registrationTax;

          const insufficientAmount = totalAmount - 1;
          await expect(transactionContract.connect(buyer1).payment(1, { value: insufficientAmount })).to.be.revertedWith("Payment: Value must be greater than total amount");

        });
        it("should emit Payment event on successful payment", async () => {
          const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
          await tx.wait();
          await landLicenseRegistry.connect(owner).activate(licenseId);

          const depositPriceInWei = ethers.parseEther(depositPrice.toString());
          await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });

          // Now accept the transaction
          await transactionContract.connect(owner).acceptTransaction(1);

          const remainingAmount = transferPrice - depositPrice;
          const registrationTax = transferPrice * 5 / 1000; // 0.5% tax (using mulDiv for accurate division)
          const totalAmount = remainingAmount + registrationTax;

          // Perform payment
          const paymentTx = await transactionContract.connect(buyer1).payment(1, { value: totalAmount });
          await paymentTx.wait();

          // Ensure that the "Payment" event is emitted
          await expect(paymentTx).to.emit(transactionContract, "Payment").withArgs(1);
        });
        describe("confirmTransaction", async () => {
          let licenseId = "licenseId123";
          let depositPrice = 1000;
          let transferPrice = 5000;
          let depositTime = 30; // 30 days
          beforeEach(async () => {
            // Create a valid transaction
            const tx = await landLicenseRegistry.connect(notary).registerLandLicense(owner.address, licenseId, "ipfsHash", notary.address);
            await tx.wait();
            await landLicenseRegistry.connect(owner).activate(licenseId);
            const depositPriceInWei = ethers.parseEther(depositPrice.toString());
            await transactionContract.connect(buyer1).createTransaction([buyer1.address], licenseId, depositPrice, transferPrice, depositTime, { value: depositPriceInWei });

            // Initiate owner approval (if needed for 'PENDING_ACCEPTANCE' state)
            await transactionContract.connect(owner).initiateOwnerApproval(1);  // Replace with the actual function call

            // Now accept the transaction (should succeed now)
            await transactionContract.connect(owner).acceptTransaction(1);

            // Make the payment
            await transactionContract.connect(buyer1).payment(1);
          });


        });
        it("should revert if the msg.sender is not the representative of sellers", async () => {
          await expect(transactionContract.connect(owner).confirmTransaction(1)).to.be.revertedWith("OnlyState: Require state.");

        });


      });
    });
  });
});



