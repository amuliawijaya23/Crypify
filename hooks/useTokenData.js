import { useCallback } from 'react';

// import ethers js
import { ethers } from 'ethers';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useDispatch } from 'react-redux';

// reducers
import { setToken } from '../state/reducers/token';

// import from Date-fns
import startOfDay from 'date-fns/startOfDay';
import getUnixTime from 'date-fns/getUnixTime';

// set default start and end date for transactions query
const defaultStart = startOfDay(new Date());
const defaultEnd = new Date();

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  const getTokenData = useCallback(async () => {
    try {
      
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  }, []);

  return {
    address
  };
};
