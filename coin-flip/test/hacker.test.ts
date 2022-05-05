import exp from "constants";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { zeroAddress } from "ethereumjs-util";
import { BigNumber, BigNumberish, BytesLike, Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { CoinFlip, Hacker } from "../typechain";

chai.use(solidity);

describe("Hacker", () => {
  let owner: SignerWithAddress;
  let hacker: SignerWithAddress;

  let coinflipInstance: CoinFlip;
  let hackerInstance: Hacker;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    hacker = signers[1];

    //deploy CoinFlip
    let receipt = await deployments.deploy("CoinFlip", {
      from: owner.address,
      args: [],
      log: true,
    });
    coinflipInstance = await ethers.getContractAt("CoinFlip", receipt.address);

    //deploy Hacker
    receipt = await deployments.deploy("Hacker", {
      from: hacker.address,
      args: [],
      log: true,
    });
    hackerInstance = await ethers.getContractAt("Hacker", receipt.address);
  });

  describe("Hacker", async () => {
    it("should be guess the correct outcome 10 times", async () => {
      for (let i = 0; i < 10; i++) {
        await hackerInstance.connect(hacker).attack(coinflipInstance.address);
        expect(await coinflipInstance.consecutiveWins()).to.be.equal(i + 1);
      }
    });
  });
});
