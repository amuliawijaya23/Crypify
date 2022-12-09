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
      
      // const abi = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_KEY}`);

      // const tokenContract = new ethers.Contract(address, abi.data.result, provider);
      // const decimals = await tokenContract.decimals();
      // const totalSupply = await (await tokenContract.totalSupply()).toString();
      // const pair = await tokenContract.uniswapV2Pair();

      // token screening from honepot.is
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const honeypotURL = `https://honeypot.is/ethereum?address=${address}`
      await page.goto(honeypotURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#shitcoin > div', { visible: true });

      const screeningData = await page.evaluate(() => {
        const result = document.querySelector('#shitcoin > div > div').innerText;

        const data = { result: result };

        if (result !== 'Yup, honeypot. Run the fuck away.') {
          const taxes = document.querySelector('#shitcoin > div > p:nth-child(6)').innerText.split('\n');
          const buyTax = taxes[0].split(':')[1].trim();
          const sellTax = taxes[1].split(':')[1].trim();

          data.buyTax = buyTax;
          data.sellTax = sellTax;
        };
    
        return data;
      });

      await browser.close();
      
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
