import exp from "constants";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { zeroAddress } from "ethereumjs-util";
import { BigNumber, BigNumberish, BytesLike, Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { Fallback, Hacker } from "../typechain";

chai.use(solidity);

describe("DepoExchange", () => {
  let owner: SignerWithAddress;
  let hacker: SignerWithAddress;

  let fallbackInstance: Fallback;
  let hackerInstance: Hacker;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    hacker = signers[1];

    //deploy Fallback
    let receipt = await deployments.deploy("Fallback", {
      from: owner.address,
      args: [],
      log: true,
    });
    fallbackInstance = await ethers.getContractAt("Fallback", receipt.address);

    //deploy Hacker
    receipt = await deployments.deploy("Hacker", {
      from: hacker.address,
      args: [],
      log: true,
    });
    hackerInstance = await ethers.getContractAt("Hacker", receipt.address);
  });

  describe("Hacker", async () => {
    it("hacking should be successed", async () => {
      await hackerInstance.connect(hacker).attack(fallbackInstance.address, {
        value: ethers.utils.parseEther("0.001"),
      });
      expect(await fallbackInstance.owner()).to.be.equal(
        hackerInstance.address
      );
      expect(
        await ethers.provider.getBalance(fallbackInstance.address)
      ).to.be.equal(0);
    });
  });
});
