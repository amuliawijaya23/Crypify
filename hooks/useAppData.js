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
        const result = [];
        dispatch(setAssets(myAssets));
        const assetIds = myAssets.map((asset) => asset.id);
        for (const [i, id] of assetIds.entries()) {
          const transactionsRef = collection(db, `assets/${id}/transactions`);
          const transactionsQuery = await query(transactionsRef, where('user', '==', user));
          const queryResult = await getDocs(transactionsQuery);
          const assetTransactions = queryResult.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
              date: doc.data().date.seconds
            }))
            .sort((a, b) => b.date - a.date);

          const buy = assetTransactions?.filter((t) => t.is_buy);
          const sell = assetTransactions?.filter((t) => !t.is_buy);
          const totalFee = assetTransactions?.map((t) => t.fee).reduce((a, b) => a + b, 0);

          const amountPurchased = buy?.map((t) => t.amount).reduce((a, b) => a + b, 0);
          const amountSold = sell?.map((t) => t.amount).reduce((a, b) => a + b, 0);

          const buyPriceUSD = buy?.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);
          const sellPriceUSD = sell?.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);

          const asset = {
            ...myAssets[i],
            amount: amountPurchased - amountSold,
            profit: sellPriceUSD - (buyPriceUSD + totalFee),
            // eslint-disable-next-line camelcase
            last_transaction: assetTransactions[0]?.date,
            // eslint-disable-next-line camelcase
            transactions: assetTransactions
          };
          result.push(asset);

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
