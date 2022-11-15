import axios from 'axios';

const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const address = req.body.address;
      const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_KEY}`;
      const { data } = await axios.get(url);
      res.send(data.result);
    }
  } catch (error) {
    console.error(error.response ? error.response.body : error);
  };
}
