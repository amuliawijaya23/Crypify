// import ethers.js
import { ethers } from 'ethers';

// import uniswap sdk
import { ChainId, Token, Fetcher, Route, TradeType, TokenAmount, Trade } from '@uniswap/sdk'

// constants
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
      const tokenAddress = req.body.tokenAddress;
      const tokenDecimals = req.body.tokenDecimals;
      
      const baseAddress = req.body.baseAddress;
      const baseDecimals = req.body.baseDecimals;

      const tradeToken = new Token(ChainId.MAINNET, tokenAddress, Number(tokenDecimals));
      const baseToken = new Token(ChainId.MAINNET, baseAddress, Number(baseDecimals));

      const pool = await Fetcher.fetchPairData(tradeToken, baseToken);

      const routeToken = new Route([pool], tradeToken);
      const trade = new Trade(routeToken, new TokenAmount(tradeToken, BigInt(1E18)), TradeType.EXACT_INPUT);
      const usdcToken = new Token(ChainId.MAINNET, USDC, 6);

      let basePair;
      let baseRoute;
      let baseTrade;

      console.log('trade Price', trade.executionPrice.toSignificant(6));

      const price = await (async () => {
        switch (baseAddress) {
          case WETH:
            basePair = await Fetcher.fetchPairData(baseToken, usdcToken);
            baseRoute = new Route([basePair], baseToken);
            baseTrade = new Trade(baseRoute, new TokenAmount(baseToken, BigInt(1E18)), TradeType.EXACT_INPUT)
            return baseTrade.executionPrice.toSignificant(12) * trade.executionPrice.toSignificant(12);

          case DAI:
            const wethToken = new Token(ChainId.MAINNET, WETH, 18);
            basePair = await Fetcher.fetchPairData(baseToken, wethToken);
            baseRoute = new Route([basePair], baseToken);
            baseTrade = new Trade(baseRoute, new TokenAmount(baseToken, BigInt(1E18)), TradeType.EXACT_INPUT)

            // const wethUsdc = await Fetcher.fetchPairData(wethToken, usdcToken);
            // const wethUsdcRoute = new Route([wethUsdc], wethToken);
            // const wethUsdcTrade = new Trade(wethUsdcRoute, new TokenAmount(wethToken, BigInt(1E18)), TradeType.EXACT_INPUT);

            return trade.executionPrice.toSignificant(12) / baseTrade.executionPrice.toSignificant(12);








          default:
            return trade.executionPrice.toSignificant(6);
        }
      })();





      console.log('price', price);




    res.send('ok');


    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
