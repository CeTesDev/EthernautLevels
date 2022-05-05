import exp from "constants";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { zeroAddress } from "ethereumjs-util";
import { BigNumber, BigNumberish, BytesLike, Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { Hacker, Telephone } from "../typechain";

chai.use(solidity);

describe("Hacker", () => {
  let owner: SignerWithAddress;
  let hacker: SignerWithAddress;

  let telephoneInstance: Telephone;
  let hackerInstance: Hacker;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    hacker = signers[1];

    //deploy Telephone
    let receipt = await deployments.deploy("Telephone", {
      from: owner.address,
      args: [],
      log: true,
    });
    telephoneInstance = await ethers.getContractAt(
      "Telephone",
      receipt.address
    );
    console.log("Telephone address", receipt.address);

    //deploy Hacker
    receipt = await deployments.deploy("Hacker", {
      from: hacker.address,
      args: [],
      log: true,
    });
    hackerInstance = await ethers.getContractAt("Hacker", receipt.address);
  });

  describe("Hacker", async () => {
    context("deploy", async () => {
      it("owner should be deployer", async () => {
        expect(await telephoneInstance.owner()).to.be.equal(owner.address);
      });
    });

    context("changeowner", async () => {
      it("should be changed owner", async () => {
        await hackerInstance.connect(hacker).attack(telephoneInstance.address);
        expect(await telephoneInstance.owner()).to.be.equal(hacker.address);
      });
    });
  });
});
