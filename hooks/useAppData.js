import { useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
// import reducers
import { login, logout } from '../state/reducers/user';
import { setAssets, setAssetTransactions, clearAssets } from '../state/reducers/trades';

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
        const myAssets = assets.filter((asset) => asset.users.indexOf(user) !== -1);
        dispatch(setAssets(myAssets));
        const assetIds = myAssets.map((asset) => asset.id);
        for (const id of assetIds) {
          const transactionsRef = collection(db, `assets/${id}/transactions`);
          onSnapshot(transactionsRef, (snapshot) => {
            const transactions = snapshot.docs.map((t) => ({
              ...t.data(),
              id: t.id,
              date: t.data().date.seconds
            }));
            const myTransactions = transactions
              .filter((t) => t.user === user)
              .sort((a, b) => b.date - a.date);
            dispatch(setAssetTransactions({ id: id, transactions: myTransactions }));
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

  return {};
};

export default useAppData;
