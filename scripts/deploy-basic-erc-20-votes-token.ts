import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { BasicERC20Votes__factory } from "../typechain-types/factories/contracts/BasicERC20Votes__factory";
dotenv.config();

const { PRIVATE_KEY, ALCHEMY_API_KEY, INFURA_API_KEY } = process.env;

const TOKENS_MINTED = "1";

const [addr1, addr2, addr3] = [
  "0xd6e9b48D59D780F28a6BEEbe8098f3b095c003d7",
  "0xdE3fb8d56CB213dEf9212723fF017C6c3538598a",
  "0x17E1EbC1d6BCFDa760Af68e1eE7ab0dD7f577cF4",
];

async function deployBasicERC20Votes() {
  const options = {
    alchemy: ALCHEMY_API_KEY,
    infura: INFURA_API_KEY,
  };

  const provider = ethers.providers.getDefaultProvider("goerli", options);

  let deployer = new ethers.Wallet(PRIVATE_KEY ?? "", provider);

  const basicERC20VotesTokenFactory = new BasicERC20Votes__factory(deployer);

  const basicERC20VotesToken = await basicERC20VotesTokenFactory.deploy();
  await basicERC20VotesToken.deployed();

  console.log(`Contract deployed to ${basicERC20VotesToken.address}`);

  const totalSupply = await basicERC20VotesToken.totalSupply();
  console.log(
    `The initial total supply of contract after deployment is ${totalSupply}`
  );

  console.log("Minting new tokens for account 1");
  const mintTx = await basicERC20VotesToken.mint(
    addr1,
    ethers.utils.parseEther(TOKENS_MINTED)
  );
  await mintTx.wait();

  const nextSupply = await basicERC20VotesToken.totalSupply();
  console.log(
    `The initial total supply of contract after minting is ${nextSupply} in wei`
  );
  console.log(
    `The initial total supply of contract after minting is ${ethers.utils.formatEther(
      nextSupply
    )} in ETH`
  );

  console.log("What is the current balance of account 1?");
  const balance = await basicERC20VotesToken.balanceOf(addr1);
  console.log(`Balance: ${ethers.utils.formatEther(balance)} in ETH`);

  console.log("What is the current vote power of account 1?");
  const votingPower = await basicERC20VotesToken.getVotes(addr1);
  console.log(`Voting Power: ${votingPower}`);

  console.log("Delegating from deployer to self...");
  const delegateTx = await basicERC20VotesToken
    .connect(deployer)
    .delegate(deployer.address);
  await delegateTx.wait();

  console.log("What is the next vote power of Account 1?");
  const nextVotingPower = await basicERC20VotesToken.getVotes(addr1);
  console.log(
    `Next Voting Power: ${ethers.utils.formatEther(nextVotingPower)} in ETH`
  );

  const block = await ethers.provider.getBlock("latest");
  console.log({ block });
  console.log(`The current blockNumber is ${block.number}`);

  const mintTx2 = await basicERC20VotesToken.mint(
    addr2,
    ethers.utils.parseEther(TOKENS_MINTED)
  );
  await mintTx2.wait();

  const mintTx3 = await basicERC20VotesToken.mint(
    addr3,
    ethers.utils.parseEther(TOKENS_MINTED)
  );
  await mintTx3.wait();

  const nextBlock = await ethers.provider.getBlock("latest");
  console.log({ nextBlock });
  console.log(`The current blockNumber is ${nextBlock.number}`);

  const pastVotes = await Promise.all([
    basicERC20VotesToken.getPastVotes(addr1, 4),
    basicERC20VotesToken.getPastVotes(addr1, 3),
    basicERC20VotesToken.getPastVotes(addr1, 2),
    basicERC20VotesToken.getPastVotes(addr1, 1),
    basicERC20VotesToken.getPastVotes(addr1, 0),
  ]);
  console.log({ pastVotes });
}

deployBasicERC20Votes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
