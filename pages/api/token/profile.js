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
  try {
    if (req.method === "POST") {
      const address = req.body.address;
      
      const abi = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_KEY}`);

      const tokenContract = new ethers.Contract(address, abi.data.result, provider);
      const decimals = await tokenContract.decimals();
      const totalSupply = await (await tokenContract.totalSupply()).toString();
      const pair = await tokenContract.uniswapV2Pair();

      // token screening from honepot.is
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const honeypotURL = `https://honeypot.is/ethereum?address=${address}`
      await page.goto(honeypotURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#shitcoin > div', { visible: true });

      const screeningData = await page.evaluate(() => {
        const result = document.querySelector('#shitcoin > div > div').innerText;
        const taxes = document.querySelector('#shitcoin > div > p:nth-child(6)').innerText.split('\n');
        const buyTax = taxes[0].split(':')[1].trim();
        const sellTax = taxes[1].split(':')[1].trim();
    
        return { result: result, buyTax: buyTax, sellTax: sellTax };
      });

      // get data from coinmarketcap
      const coinmarketcapURL = `https://coinmarketcap.com/dexscan/ethereum/${pair}`
      await page.goto(coinmarketcapURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span', { visible: true });

      const coinData = await page.evaluate(() => {
        const price = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-priceSection > div.priceSection-core > span.sc-e225a64a-0.ilVuwe > span').innerHTML;
        const liquidity = document.querySelector('#__next > div.sc-d08ac376-0.fAgomI > div.sc-d08ac376-4.gFnUlM > div.sc-d08ac376-9.cKBJSW > div.dexscan-detail-stats-section > main > dl:nth-child(1) > dd > span').innerText;

        return { price: price, liquidity: liquidity};
      });

      await browser.close();
      
      const tokenInfo = {
        address: address,
        pair: pair,
        name: await tokenContract.name(),
        symbol: await tokenContract.symbol(),
        decimals: decimals,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
        owner: await tokenContract.owner(),
        honeypotScreen: screeningData.result,
        buyTax: screeningData.buyTax,
        sellTax: screeningData.sellTax,
        price: coinData.price,
        liquidity: coinData.liquidity
      };

      res.send(tokenInfo);
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}
