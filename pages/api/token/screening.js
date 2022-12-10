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

      // token screening from honepot.is
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const honeypotURL = `https://honeypot.is/ethereum?address=${address}`;
      await page.goto(honeypotURL, { waitUntil: 'networkidle0'});
      await page.waitForSelector('#shitcoin > div', { visible: true });

      const screenData = await page.evaluate(() => {
        const honeypotScreening = document.querySelector('#shitcoin > div > div').innerText;
        const paragraphs = document.querySelectorAll('#shitcoin > div > p');
        const taxes = document.querySelector(`#shitcoin > div > p:nth-child(${paragraphs.length + 1})`).innerText.split('\n');
    
        const buyTax = taxes[0].split(':')[1].trim();
        const sellTax = taxes[0].split(':')[1].trim();
    
        const screenResult =  (honeypotScreening === 'Does not seem like a honeypot.') ? true : false;
    
        return { screenResult: screenResult, buyTax: buyTax, sellTax: sellTax };
      });

      await browser.close();

      res.send(screenData);

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
