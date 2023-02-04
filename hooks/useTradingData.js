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
  return { selected };
};

export default useTradingData;
