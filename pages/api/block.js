import axios from 'axios';

const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const start = req.body.start;
      const end = req.body.end;
      const [block0, block1] = await Promise.all([
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${start}&closest=before&apikey=${ETHERSCAN_KEY}`),
        axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${end}&closest=before&apikey=${ETHERSCAN_KEY}`)
      ]);

      const startBlock = parseFloat(block0.data.result);
      const endBlock = parseFloat(block1.data.result);
      
      res.send({start: startBlock, end: endBlock});
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}
