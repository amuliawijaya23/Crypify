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
      
      const abi = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_KEY}`);

      const tokenContract = new ethers.Contract(address, abi.data.result, provider);
      const totalSupply = await tokenContract.totalSupply();

      const tokenInfo = {
        address: address,
        pair: await tokenContract.uniswapV2Pair(),
        name: await tokenContract.name(),
        symbol: await tokenContract.symbol(),
        decimals: await tokenContract.decimals(),
        totalSupply: await totalSupply.toString(),
        owner: await tokenContract.owner()
      };

      res.send(tokenInfo);
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}
