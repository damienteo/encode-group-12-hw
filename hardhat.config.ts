import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

const { INFURA_API_KEY, GOERLI_PRIVATE_KEY_1, GOERLI_PRIVATE_KEY_2 } =
  process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY_1, GOERLI_PRIVATE_KEY_2],
    },
  },
};

export default config;
