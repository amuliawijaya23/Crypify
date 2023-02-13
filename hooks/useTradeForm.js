import axios from 'axios';
import { useState } from 'react';

// state management
import { useSelector, useDispatch } from 'react-redux';
import { setPoolProfile, resetPool } from '../state/reducers/pool';

// firestore
import { db } from '../firebase-config';
import {
  collection,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

// Common Base Addresses
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

let cancelToken;

const tradesRef = collection(db, 'trades');

const useTradeForm = () => {
  // text field states
  const [buy, setBuy] = useState(true);
  const [disableSearch, setDisableSearch] = useState(false);
  const [date, setDate] = useState(new Date());
  const [pair, setPair] = useState('');
  const [swapPair, setSwapPair] = useState('');
  const [amount, setAmount] = useState(0);
  const [swapAmount, setSwapAmount] = useState(0);
  const [swapPrice, setSwapPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const pool = useSelector((state) => state.pool.value.profile);

  const resetForm = () => {
    dispatch(resetPool());
    setBuy(true);
    setDisableSearch(false);
    setPair('');
    setSwapPair('');
    setDate(new Date());
    setAmount(0);
    setSwapPrice(0);
    setFee(0);
    setSwapAmount(0);
    setLoading(false);
    setError('');
  };

  const resetErrorAlert = () => {
    setError('');
  };

  const handleDateChange = (input) => {
    setDate(input);
  };

  const getTokenData = async (address) => {
    try {
      setLoading(true);
      setPair(address);
      if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel('Canceling previous search request');
      }

      cancelToken = axios.CancelToken.source();
      const { data } = await axios.post('/api/pool', {
        address: address,
        cancelToken: cancelToken.token
      });

      if (data.pool) {
        const poolData = {
          ...data,
          address: address
        };
        dispatch(setPoolProfile(poolData));
      } else {
        dispatch(resetPool());
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error.response ? error.response.body : error);
    }
  };

  const getSwapData = async (address) => {
    try {
      setLoading(true);
      setSwapPair(address);
      if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel('Cancelingn previous search request');
      }

      if (address === USDC || address === USDT) {
        setSwapPrice(1);
      } else {
        const { data } = await axios.post('api/token/price', {
          address: address
        });
        setSwapPrice(data.price);
      }
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  };

  const addTransaction = async () => {
    try {
      if (pool?.address && amount && fee && swapAmount && swapPrice && date) {
        const tradesQuery = await query(
          tradesRef,
          where('pool', '==', pool.address),
          where('swap_token_address', '==', swapPair),
          where('user', '==', user.data.uid)
        );
        const queryResult = await getDocs(tradesQuery);
        const trades = queryResult.docs;

        let assetDocId;

        if (trades.length < 1) {
          const swapToken = (() => {
            switch (swapPair) {
              case DAI:
                return 'DAI';
              case WETH:
                return 'WETH';
              case USDC:
                return 'USDC';
              case USDT:
                return 'USDT';
              default:
                return '';
            }
          })();
          const newDoc = await addDoc(tradesRef, {
            // eslint-disable-next-line camelcase
            token_address: pool.token0.id,
            name: pool.token0.name,
            symbol: pool.token0.symbol,
            pool: pool.address,
            // eslint-disable-next-line camelcase
            swap_token_address: swapPair,
            // eslint-disable-next-line camelcase
            swap_token_symbol: swapToken,
            user: user.data.uid,
            links: [
              `https://www.dextools.io/app/en/ether/pair-explorer/${pool.address}`,
              `https://etherscan.io/token/${pool.token0.id}`,
              `https://tokensniffer.com/token/eth/${pool.token0.id}`
            ],
            // eslint-disable-next-line camelcase
            date_added: date
          });
          assetDocId = newDoc.id;
        } else {
          assetDocId = trades[0].id;
        }
        const transactionsRef = collection(db, `trades/${assetDocId}/transactions`);
        await addDoc(transactionsRef, {
          date: date,
          amount: amount,
          price: (swapAmount / amount) * swapPrice,
          fee: fee,
          // eslint-disable-next-line camelcase
          swap_amount: swapAmount,
          // eslint-disable-next-line camelcase
          swap_price: swapPrice,
          // eslint-disable-next-line camelcase
          price_usd: swapAmount * swapPrice,
          // eslint-disable-next-line camelcase
          is_buy: buy
        });
      } else {
        if (!pair) {
          setError('Please enter a valid pair address');
        } else {
          let errorPrompt = 'Fill in the ';

          const reqFields = [
            {
              field: 'Pair Address',
              isFilled: Boolean(pool?.address)
            },
            {
              field: 'Swap Pair',
              isFilled: Boolean(swapPair)
            },
            {
              field: 'Swap Price',
              isFilled: Boolean(swapPrice)
            },
            {
              field: 'Amount',
              isFilled: Boolean(amount)
            },
            {
              field: 'Swap Amount',
              isFilled: Boolean(swapAmount)
            },
            {
              field: 'Transaction Fee',
              isFilled: Boolean(fee)
            },
            {
              field: 'Date',
              isFilled: Boolean(date)
            }
          ];

          const missingFields = reqFields.filter((f) => !f.isFilled);
          for (const [i, f] of missingFields.entries()) {
            if (i === missingFields.length - 1) {
              i > 0 ? (errorPrompt += ` and ${f.field}`) : (errorPrompt += `${f.field}`);
            } else {
              i > 0 ? (errorPrompt += `, ${f.field}`) : (errorPrompt += `${f.field}`);
            }
          }

          errorPrompt += ' field to proceed.';
          setError(errorPrompt);
        }
      }
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  };

  const removeAsset = async (id) => {
    const docRef = doc(db, 'trades', id);
    const trade = await getDoc(docRef);
    const currentUsers = [...trade.data().users];
    const newUsers = currentUsers.filter((u) => u !== user.data.uid);
    await updateDoc(docRef, {
      users: newUsers
    });
  };

  return {
    buy,
    pair,
    swapPair,
    date,
    amount,
    swapPrice,
    fee,
    swapAmount,
    loading,
    error,
    disableSearch,
    setBuy,
    setDisableSearch,
    resetErrorAlert,
    handleDateChange,
    setAmount,
    setSwapPrice,
    setFee,
    setSwapAmount,
    getTokenData,
    getSwapData,
    addTransaction,
    removeAsset,
    resetForm
  };
};

export default useTradeForm;
