import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";

import { Telephone } from "../typechain";

chai.use(solidity);

describe("Telephone", () => {
  let owner: SignerWithAddress;
  let tester: SignerWithAddress;

  let telephoneInstance: Telephone;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    tester = signers[1];

    const receipt = await deployments.deploy("Telephone", {
      from: owner.address,
      args: [],
      log: true,
    });
    telephoneInstance = await ethers.getContractAt(
      "Telephone",
      receipt.address
    );
    console.log("Telephone address", receipt.address);
  });

  describe("Telephone", async () => {
    context("deploy", async () => {
      it("owner should be deployer", async () => {
        expect(await telephoneInstance.owner()).to.be.equal(owner.address);
      });
    });

    context("changeOwner", async () => {
      it("should be not changed owner ", async () => {
        await telephoneInstance.connect(tester).changeOwner(tester.address);

        expect(await telephoneInstance.owner()).to.be.equal(owner.address);
      });
    });
  });
});
