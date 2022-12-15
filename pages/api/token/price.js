// import puppeteer
import puppeteer from 'puppeteer';

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
