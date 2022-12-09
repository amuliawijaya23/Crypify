import axios from 'axios';

// import ethers
import { ethers } from 'ethers';

// import puppeteer
import puppeteer from 'puppeteer';

// variables
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;

// ethers provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
      const address = req.body.address;

      // get data from coinmarketcap
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const coinmarketcapURL = `https://coinmarketcap.com/dexscan/ethereum/${address}`
      await page.goto(coinmarketcapURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span', { visible: true });

      const coinData = await page.evaluate(() => {
        const price = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span').innerHTML;
        const liquidity = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-stats-section > main > dl:nth-child(1) > dd > span').innerText;

        return { price: price, liquidity: liquidity};
      });

      await browser.close();

      res.send({ price: coinData.price, liquidity: coinData.liquidity });

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
