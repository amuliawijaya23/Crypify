import axios from 'axios';

// import ethers
import { ethers } from 'ethers';

// variables
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;

// ethers provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const address = req.body.address;
      const start = req.body.start;
      const end = req.body.end;

      const [abi, block0, block1] = await Promise.all([
        axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_KEY}`),
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${start}&closest=before&apikey=${ETHERSCAN_KEY}`),
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${end}&closest=before&apikey=${ETHERSCAN_KEY}`)
      ]);
      
      const startBlock = parseFloat(block0.data.result);
      const endBlock = parseFloat(block1.data.result) || 'latest';
      
      const contract = new ethers.Contract(address, abi.data.result, provider);

      const filter = contract.filters.Transfer();
      const filterQuery = await contract.queryFilter(filter, startBlock, endBlock);

      const decimals = await contract.decimals();
      const pair = await contract.uniswapV2Pair();

      // exceptions for wallet filtering
      const tokenAddress = address.toLowerCase();
      const pairAddress = pair.toLowerCase();
      const burn = '0x000000000000000000000000000000000000dead';

      let wallets = [];

      const transfers = await Promise.all(filterQuery.map(async(t) => {
        const transferFrom = t.args.from.toLowerCase();
        const transferTo = t.args.to.toLowerCase();

        if (transferFrom !== tokenAddress && transferFrom !== pairAddress && transferFrom !== burn) {
          wallets.push(transferFrom);
        };

        if (transferTo !== tokenAddress && transferTo !== pairAddress && transferTo !== burn) {
          wallets.push(transferTo);
        };

        return {
          blockNumber: t.blockNumber,
          logIndex: t.logIndex,
          transactionHash: t.transactionHash,
          from: t.args.from,
          to: t.args.to,
          amount: ethers.utils.formatUnits(t.args.value.toString(), decimals),
          timestamp: await (async () => (await t.getBlock()).timestamp)()
        }
      }));

      wallets = [...new Set(wallets)];

      const data = {
        events: transfers.sort((a, b) => b.timestamp - a.timestamp),
        holders: wallets,
      };

      res.send(data);
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}
