import axios from 'axios';

// import react hooks
import { useState, useCallback, useEffect } from 'react';

// import from Date-fns
import getUnixTime from 'date-fns/getUnixTime';
import startOfDay from 'date-fns/startOfDay';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useSelector, useDispatch } from 'react-redux';

// reducers
import { 
  setToken, 
  setTokenProfile, 
  setTransfersStartDate, 
  setTransfersEndDate, 
  setTransfersData 
} from '../state/reducers/token';

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  // global state
  const token = useSelector((state) => state.token.value);

  // local state
  const [ loading, setLoading ] = useState(false);

  const getTokenData = useCallback(async (token) => {
    try {
      setLoading(true);
      const start = getUnixTime(startOfDay(new Date()));
      const end = getUnixTime(new Date());

      const [profile, transfers] = await Promise.all([
        axios.post('/api/token/profile', { address: token }),
        axios.post('/api/token/transfers', { address: token, start: start, end: end})
      ]);

      dispatch(setToken({
        profile: profile.data,
        transfers: {
          start: start,
          end: end,
          data: transfers.data
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
    }
  }, [address, getTokenData]);

  const setStart = (input) => {
    const newStart = getUnixTime(input);
    dispatch(setTransfersStartDate(newStart));
  };

  const setEnd = (input) => {
    const newEnd = getUnixTime(input);
    dispatch(setTransfersEndDate(newEnd));
  };

  const getTokenTransfers = async () => {
    const tokenAddress = token.profile.address;
    const start = token.transfers.start;
    const end = token.transfers.end;
    const { data } = await axios.post('/api/token/transfers', { address: tokenAddress, start: start, end: end });
    dispatch(setTransfersData(data));
  };

  return {
    loading,
    setStart,
    setEnd,
    getTokenTransfers
  };
};
