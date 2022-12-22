// import uniswap sdk
import { ChainId, Token, Fetcher, Route, TradeType, TokenAmount, Trade } from '@uniswap/sdk';

// Common Base Addresses
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
      const pairAddress = req.body.pairAddress;
      const tokenAddress = req.body.tokenAddress;
      const tokenDecimals = req.body.tokenDecimals;
      const baseAddress = req.body.baseAddress;
      const baseDecimals = req.body.baseDecimals;

      res.send({ price: priceData });

    } catch (error) {
      console.error(error.response ? error.response.body : error);
      res.status(500).send('Timeout');
    };
  }
}
