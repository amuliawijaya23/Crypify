import axios from 'axios';

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const DAI = '0x3ace749148d15e4459481d6b82557aa411d62a9e';

const DAIWETHPAIR = '0x495b5f9b40684172cd3945a484e674967bac2ec6'

export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
        const address = req.body.address;

        let query = `
        {
          pair(id: "${address}") {
            token0 {
              name
              symbol
              id
              decimals
            }
            token1 {
              name
              symbol
              id
              decimals
            }
            createdAtTimestamp
            createdAtBlockNumber
          }
        }`;

        const uniswapV2Data = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', { query: query });

        let data = {};

        if (uniswapV2Data.data.data.pair) {

          data = {...uniswapV2Data.data.data.pair};

        } else {

          query = `
          {
            pool(id: "${address}") {
              token0 {
                name
                symbol
                id
                decimals
              }
              token1 {
                name
                symbol
                id
                decimals
              }
              createdAtTimestamp
              createdAtBlockNumber
            }
          }`;

          const uniswapV3Data = await axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', { query: query });

          data = {...uniswapV3Data.data.data.pool};
        };

        const tokenAddress = data.token0.id;

        if (tokenAddress === WETH || tokenAddress === USDC || tokenAddress === USDT || tokenAddress === DAI || address === DAIWETHPAIR) {
            const baseTokenData = { ...data.token0 };
            data.token0 = { ...data.token1 };
            data.token1 = { ...baseTokenData };
        };

        res.send(data);
      
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
