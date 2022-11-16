import axios from 'axios';

// import react hooks
import { useCallback, useEffect } from 'react';

// import from Date-fns
import getUnixTime from 'date-fns/getUnixTime';
import startOfDay from 'date-fns/startOfDay';

// import ethers js
// import { ethers } from 'ethers';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useSelector, useDispatch } from 'react-redux';

// reducers
import { setTokenProfile, setTransfersStartDate, setTransfersEndDate, setTransfersData } from '../state/reducers/token';

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  const getTokenData = useCallback(async (token) => {
    try {
      const start = getUnixTime(startOfDay(new Date()));
      const end = getUnixTime(new Date());

      const [profile, transfers] = await Promise.all([
        axios.post('/api/token/profile', { address: token }),
        axios.post('/api/token/transfers', { address: token, start: start, end: end})
      ]);

      console.log('transfers', transfers.data)

      dispatch(setTransfersStartDate(start));
      dispatch(setTransfersEndDate(end));
      dispatch(setTokenProfile(profile.data));
      dispatch(setTransfersData(transfers.data));

    } catch (error) {
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

  const getTokenTransfers = () => {

  };

  return {
    setStart,
    setEnd,
    getTokenTransfers
  };
};
