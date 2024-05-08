import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
require("dotenv").config();

const { API_URL, PRIVATE_KEY, API_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },

  // //test network local
  // defaultNetwork: "hardhat",
  // networks: {
  // },

  etherscan: {
    apiKey: {
      sepolia: "DEEWM3R6UIHKE152PRJHHYFQBM5T7R47A4",
    },
  },
};


export default config;
