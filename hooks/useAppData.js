import { useEffect, useCallback, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
// import reducers
import { login, logout } from '../state/reducers/user';
import { setAssets, setAssetTransactions, clearAssets } from '../state/reducers/trades';

// import Firebase
import { db } from '../firebase-config';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';

const useAppData = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getTradingData = useCallback(
    async (user) => {
      setLoading(true);
      const tradesRef = collection(db, 'trades');
      const tradesQuery = query(tradesRef, where('user', '==', user));
      onSnapshot(tradesQuery, (snapshot) => {
        const trades = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          // eslint-disable-next-line camelcase
          date_added: doc.data().date_added.seconds
        }));
        // const myTrades = trades.filter((asset) => asset.users.indexOf(user) !== -1);
        dispatch(setAssets(trades));
        const tradeIds = trades.map((t) => t.id);
        for (const id of tradeIds) {
          const transactionsRef = collection(db, `trades/${id}/transactions`);
          onSnapshot(transactionsRef, (snapshot) => {
            const transactions = snapshot.docs
              .map((t) => ({
                ...t.data(),
                id: t.id,
                date: t.data().date.seconds
              }))
              .sort((a, b) => b.date - a.date);

            dispatch(setAssetTransactions({ id: id, transactions: transactions }));
            setLoading(false);
          });
        }
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

  return {
    loading
  };
};

export default useAppData;
