import exp from "constants";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { zeroAddress } from "ethereumjs-util";
import { BigNumber, BigNumberish, BytesLike, Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { Fallout, Hacker } from "../typechain";

chai.use(solidity);

describe("DepoExchange", () => {
  let owner: SignerWithAddress;
  let hacker: SignerWithAddress;

  let falloutInstance: Fallout;
  let hackerInstance: Hacker;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    hacker = signers[1];

    //deploy Fallout
    let receipt = await deployments.deploy("Fallout", {
      from: owner.address,
      args: [],
      log: true,
    });
    falloutInstance = await ethers.getContractAt("Fallout", receipt.address);

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
      await hackerInstance.connect(hacker).attack(falloutInstance.address);
      expect(await falloutInstance.owner()).to.be.equal(hackerInstance.address);
    });
  });
});
