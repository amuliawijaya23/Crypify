import axios from 'axios';

// import react hooks
import { useState, useCallback, useEffect } from 'react';

// import from Date-fns
import getUnixTime from 'date-fns/getUnixTime';
import subHours from 'date-fns/subHours';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useSelector, useDispatch } from 'react-redux';

// reducers
import { 
  setPool, 
  setTransfersStartDate, 
  setTransfersEndDate, 
  setTransfersData,
  setTransfersHolders,
  resetPool
} from '../state/reducers/pool';

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  // global state
  const pool = useSelector((state) => state.pool.value);

  // local state
  const [ loading, setLoading ] = useState(false);
  const [ loadTransfers, setLoadTransfers ] = useState(false);

  const getTokenData = useCallback(async (pairAddress) => {
    try {
      setLoading(true);
      const start = getUnixTime(subHours(new Date(), 24));
      const end = getUnixTime(new Date());

      const { data } = await axios.post('/api/pool', { address: pairAddress });

      const [ transfers, priceData, screenData ] = await Promise.all([
        axios.post('/api/token/transfers', { 
          token: data?.token0?.id, 
          decimals: data?.token0?.decimals, 
          pair: pairAddress, 
          start: start, 
          end: end 
        }),
        axios.post('/api/token/price', { 
          pairAddress: pairAddress, 
          tokenAddress: data?.token0?.id,
          tokenDecimals: data?.token0?.decimals,
          baseAddress: data?.token1?.id,
          baseDecimals: data?.token1?.decimals
        }),
        axios.post('/api/token/screening', { address: data?.token0?.id })
      ]);

      dispatch(setPool({
        profile: { 
          ...data, 
          address: pairAddress,
          screenResult: screenData.data.screenResult,
          token0: { 
            ...data?.token0, 
            price: priceData.data.price, 
            buyTax: screenData.data.buyTax,
            sellTax: screenData.data.sellTax
          },
        },
        transfers: {
          start: start,
          end: end,
          data: transfers.data.events,
        }
      }));

      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error(error.response ? error.response.body : error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (address) {
      getTokenData(address)
    };

    return () => {
      dispatch(resetPool());
    };
  }, [address, getTokenData, dispatch]);

  const setStart = (input) => {
    const newStart = getUnixTime(input);
    dispatch(setTransfersStartDate(newStart));
  };

  const setEnd = (input) => {
    const newEnd = getUnixTime(input);
    dispatch(setTransfersEndDate(newEnd));
  };

  const getTokenTransfers = async () => {
    try {
      setLoadTransfers(true);
      const tokenAddress = pool?.profile?.token0?.id;
      const start = pool?.transfers?.start;
      const end = pool?.transfers?.end;
      const { data } = await axios.post('/api/token/transfers', { 
        token: tokenAddress,
        decimals: pool?.profile?.token0?.decimals,
        pair: pool?.profile?.address,
        start: start, 
        end: end 
      });

      dispatch(setTransfersData(data?.events));
      dispatch(setTransfersHolders(data?.holders));
      setLoadTransfers(false);
    } catch (error) {
      setLoadTransfers(false);
      console.error(error.response ? error.response.body : error);
    }
  };

  const getHolderTransfers = async () => {
    
  };

  return {
    loading,
    loadTransfers,
    setStart,
    setEnd,
    getTokenTransfers,
    getHolderTransfers
  };
};
