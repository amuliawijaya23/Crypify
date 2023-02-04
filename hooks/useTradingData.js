import { useState, useEffect, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setAssets } from '../state/reducers/trades';

import { db } from '../firebase-config';
import {
  collection,
  query,
  where,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc
} from 'firebase/firestore';

const useTradingData = () => {
  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getTradingData = async () => {
      const assetsRef = collection(db, 'assets');
      const assetsQuery = await query(assetsRef, where('users', 'array-contains', user.data.uid));
      const assetsQueryResult = await getDocs(assetsQuery);

      const assets = await Promise.all(
        assetsQueryResult.docs.map(async (asset) => {
          const transactionsRef = collection(db, `assets/${asset.id}/transactions`);
          const transactionQuery = await query(transactionsRef, where('user', '==', user.data.uid));
          const transactionQueryResult = await getDocs(transactionQuery);
          const transactions = transactionQueryResult.docs.map((transaction) => ({
            id: transaction.id,
            ...transaction.data()
          }));

          return {
            id: asset.id,
            transactions: transactions,
            ...asset.data()
          };
        })
      );
      dispatch(setAssets(assets));
    };
    if (user?.data?.uid) {
      getTradingData();
    }
  }, [user.data?.uid, dispatch]);

  return { selected };
};

export default useTradingData;
