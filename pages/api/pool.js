import axios from 'axios';


export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
      const address = req.body.address;
      
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  }
}
