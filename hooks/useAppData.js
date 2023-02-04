import { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
// import reducers
import { login, logout } from '../state/reducers/user';
import { setAssets, clearAssets } from '../state/reducers/trades';

// import Firebase
import { db } from '../firebase-config';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';

const useAppData = () => {
  const dispatch = useDispatch();

  const getTradingData = useCallback(
    async (user) => {
      const assetsRef = collection(db, 'assets');
      onSnapshot(assetsRef, async (snapshot) => {
        const assets = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          // eslint-disable-next-line camelcase
          date_added: doc.data().date_added.seconds
        }));

        const result = [];
        const myAssets = assets.filter((asset) => asset.users.indexOf(user) !== -1);

        for (const asset of myAssets) {
          const transactionsRef = collection(db, `assets/${asset.id}/transactions`);
          const transactionsQuery = await query(transactionsRef, where('user', '==', user));
          const transactionsQueryResult = await getDocs(transactionsQuery);
          const transactions = transactionsQueryResult.docs.map((t) => ({
            id: t.id,
            ...t.data(),
            date: t.data().date.seconds
          }));

          result.push({
            ...asset,
            transactions: transactions
          });
        }
        // const myAssets = assets.filter((asset) => asset.users.includes(user));
        dispatch(setAssets(result));
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      dispatch(login(userData));
      getTradingData(userData.uid);
    }

    return () => {
      dispatch(logout());
      dispatch(clearAssets());
    };
  }, [dispatch, getTradingData]);

  return {};
};

export default useAppData;
