import axios from 'axios';

// import react hooks
import { useCallback, useEffect } from 'react';

// import from Date-fns
import getUnixTime from 'date-fns/getUnixTime';

// import ethers js
import { ethers } from 'ethers';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useDispatch } from 'react-redux';

// reducers
import { setTokenProfile, setTransfersStartDate, setTransfersEndDate, setTransfersData } from '../state/reducers/token';

// variables
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;

// ethers provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  const setStart = (input) => {
    const newStart = getUnixTime(input);
    dispatch(setTransfersStartDate(newStart));
  };

  const setEnd = (input) => {
    const newEnd = getUnixTime(input);
    dispatch(setTransfersEndDate(newEnd));
  };

  const getTokenTransfers = async (token, decimals, start, end) => {
    try {
      const abi = [
        "event Transfer(address indexed from, address indexed to, uint amount)"
      ];

      const { data } = await axios.post('/api/block', {start: start, end: end});
  
      const contract = new ethers.Contract(token, abi, provider);
  
      const filterAll = contract.filters.Transfer();
      const transfers = await contract.queryFilter(filterAll, data.start, data.end);

      const aggregateTransfers = await Promise.all(transfers.map(async(t) => (
        {
          blockNumber: t.blockNumber,
          logIndex: t.logIndex,
          transactionHash: t.transactionHash,
          from: t.args.from,
          to: t.args.to,
          amount: ethers.utils.formatUnits(t.args.amount.toString(), decimals),
          timestamp: await (async () => (await t.getBlock()).timestamp)()
        }
      )));
      
      dispatch(setTransfersData(aggregateTransfers.sort((a, b) => b.timestamp - a.timestamp)));

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    };
  };

  // const getTokenTransfers = useCallback(async () => {

  // }, []);

  const getTokenData = useCallback(async (token) => {
    try {
      // get token abi from etherscan
      const { data } = await axios.post('/api/token/abi', { address: token });

      const tokenContract = new ethers.Contract(token, data, provider);

      // console.log('contract', tokenContract);
      const totalSupply = await tokenContract.totalSupply();

      const tokenInfo = {
        address: token,
        pair: await tokenContract.uniswapV2Pair(),
        name: await tokenContract.name(),
        symbol: await tokenContract.symbol(),
        decimals: await tokenContract.decimals(),
        totalSupply: await totalSupply.toString(),
        owner: await tokenContract.owner()
      };

      dispatch(setTokenProfile(tokenInfo));

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (address) {
      getTokenData(address)
    }
  }, [address, getTokenData]);

  return {
    setStart,
    setEnd
  };
};
