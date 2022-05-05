import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "hardhat-deploy";

import { HardhatUserConfig, task } from "hardhat/config";

// import { alchemyApiKey, etherscanApiKey, privateKeys } from "./secrets.json";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  networks: {
    hardhat: {
      saveDeployments: false,
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
      //   blockNumber: 14231600,
      //},
    },
    // rinkeby: {
    //   url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
    //   accounts: privateKeys,
    // },
    // mainnet: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
    //   accounts: privateKeys,
    // },
  },
  // etherscan: {
  //   apiKey: etherscanApiKey,
  // },
  mocha: {
    timeout: 60 * 30 * 1000,
  },
};

export default config;
