import axios from 'axios';
import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setPoolProfile, resetPool } from '../state/reducers/pool';

import { db } from '../firebase-config';
import { collection, query, where, addDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

let cancelToken;

const useTradingForm = () => {
  const [pair, setPair] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const pool = useSelector((state) => state.pool.value.profile);

  const resetForm = () => {
    dispatch(resetPool());
    setPair('');
    setDate(new Date());
    setAmount(0);
    setPrice(0);
    setFee(0);
    setPriceUSD(0);
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
        const price = await axios.post('/api/token/price', {
          pairAddress: address,
          tokenAddress: data.token0.id,
          tokenDecimals: data.token0.decimals,
          baseAddress: data.token1.id,
          baseDecimals: data.token1.decimals,
          cancelToken: cancelToken.token
        });
        const poolData = {
          ...data,
          address: address,
          token0: {
            ...data.token0,
            price: price.data.price
          }
        };
        dispatch(setPoolProfile(poolData));
        setPrice(price.data.price);
      } else {
        dispatch(resetPool());
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error.response ? error.response.body : error);
    }
  };

  const addTransaction = async () => {
    try {
      if (pool?.address && price && amount && priceUSD && date) {
        setLoading('Processing Transaction');
        const assetsRef = collection(db, 'assets');
        const assetQuery = await query(assetsRef, where('address', '==', pool.address));
        const queryResult = await getDocs(assetQuery);
        const asset = queryResult.docs;

        let assetDocId;

        if (asset.length < 1) {
          const newDoc = await addDoc(assetsRef, {
            address: pool.address,
            // eslint-disable-next-line camelcase
            token_address: pool.token0.id,
            name: pool.token0.name,
            pool: pool.pool,
            users: [user.data.uid],
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
          assetDocId = asset[0].id;
          const holders = asset[0].data().users;
          if (holders.indexOf(user.data.uid) === -1) {
            const newHolders = [...holders, user.data.uid];
            const assetDoc = doc(db, 'assets', assetDocId);
            await updateDoc(assetDoc, { users: newHolders });
          }
        }
        const transactionsRef = collection(db, `assets/${assetDocId}/transactions`);
        await addDoc(transactionsRef, {
          date: date,
          user: user.data.uid,
          price: price,
          amount: amount,
          fee: fee,
          // eslint-disable-next-line camelcase
          total_price_usd: priceUSD,
          // eslint-disable-next-line camelcase
          is_buy: true
        });
        setLoading(false);
      } else {
        if (pair) {
          setError('Please enter a valid pair address');
        } else {
          let errorPrompt = 'Fill in the ';

          const reqFields = [
            {
              field: 'Pair Address',
              isFilled: Boolean(pool?.address)
            },
            {
              field: 'Price',
              isFilled: Boolean(price)
            },
            {
              field: 'Amount',
              isFilled: Boolean(amount)
            },
            {
              field: 'Price USD',
              isFilled: Boolean(priceUSD)
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

  return {
    pair,
    date,
    amount,
    price,
    fee,
    priceUSD,
    loading,
    error,
    resetErrorAlert,
    handleDateChange,
    setAmount,
    setPrice,
    setFee,
    setPriceUSD,
    getTokenData,
    addTransaction,
    resetForm
  };
};

export default useTradingForm;
