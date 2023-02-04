import axios from 'axios';
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setPoolProfile, resetPool } from '../state/reducers/pool';

let cancelToken;

const useTradingForm = () => {
  const [pair, setPair] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
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
  };

  const handleDateChange = (input) => {
    setDate(input);
  };

  const getTokenData = async (address) => {
    try {
      setPair(address);
      setLoading(true);
      if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel('Canceling previous search request');
      }

      cancelToken = axios.CancelToken.source();
      const { data } = await axios.post('/api/pool', {
        address: address,
        cancelToken: cancelToken.token
      });
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    handleDateChange,
    setAmount,
    setPrice,
    setFee,
    setPriceUSD,
    getTokenData,
    resetForm
  };
};

export default useTradingForm;
