// import uniswap sdk
import { ChainId, Token, Fetcher, Route, TradeType, TokenAmount, Trade } from '@uniswap/sdk';

// Common Base Addresses
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const address = req.body.address;
      const decimals = req.body.decimals;

      const baseAddress = req.body.baseAddress;
      const baseDecimals = req.body.baseDecimals;

      let tradeToken;
      let baseToken;
      let pair;
      let route;
      let trade;
      let price;

      if (address === WETH || address === DAI) {
        tradeToken = new Token(ChainId.MAINNET, address, 18);
        baseToken = new Token(ChainId.MAINNET, USDC, 6);
        pair = await Fetcher.fetchPairData(tradeToken, baseToken);
        route = new Route([pair], tradeToken);
        trade = new Trade(route, new TokenAmount(tradeToken, BigInt(1e18)), TradeType.EXACT_INPUT);
        price = trade.executionPrice.toSignificant(12);
      } else if (baseAddress === WETH) {
        tradeToken = new Token(ChainId.MAINNET, address, decimals);
        baseToken = new Token(ChainId.MAINNET, baseAddress, baseDecimals);
        pair = await Fetcher.fetchPairData(tradeToken, baseToken);
        route = new Route([pair], tradeToken);
        trade = new Trade(route, new TokenAmount(tradeToken, BigInt(1e18)), TradeType.EXACT_INPUT);

        const usdcToken = new Token(ChainId.MAINNET, USDC, 6);

        const basePair = await Fetcher.fetchPairData(baseToken, usdcToken);
        const baseRoute = new Route([basePair], baseToken);
        const baseTrade = new Trade(
          baseRoute,
          new TokenAmount(baseToken, BigInt(1e18)),
          TradeType.EXACT_INPUT
        );
        price = baseTrade.executionPrice.toSignificant(12) * trade.executionPrice.toSignificant(12);
      }

      res.send({ price: price });
    } catch (error) {
      console.error(error.response ? error.response.body : error);
      res.status(500).send('Timeout');
    }
  }
}
