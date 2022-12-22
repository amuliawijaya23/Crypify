// import puppeteer
import puppeteer from 'puppeteer';

// import uniswap sdk
import { ChainId, Token, Fetcher, Route, TradeType, TokenAmount, Trade } from '@uniswap/sdk'

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

      // get data from coinmarketcap
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const coinmarketcapURL = `https://coinmarketcap.com/dexscan/ethereum/${pairAddress}`
      await page.goto(coinmarketcapURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span', { visible: true });

      const priceData = await page.evaluate(() => {
        let price;
    
        const subLength = document.querySelectorAll('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span > sub').length;
    
        if (subLength > 0) {
          let lead = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span > span:nth-child(1)').innerText;
    
          let trail = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span > span:nth-child(3)').innerText;
    
          const sub = Number(document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span > sub').innerText);
    
          trail = Number(`0.${trail}`) / Math.pow(10, sub);
    
          price = Number(lead.split('$')[1]) + trail;
        } else {
          price = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span').innerText;
          price = Number(price.split('$')[1]);
        }
    
        return price;
      });

      await browser.close();

      res.send({ price: priceData });

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
