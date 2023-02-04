// react hooks
import { useEffect } from 'react';

// state management
import { useDispatch } from 'react-redux';

// import Firebase
import { auth, provider } from '../firebase-config';
import { signInWithPopup, signOut } from 'firebase/auth';

// import login reducer
import { login, logout } from '../state/reducers/user';

export const useUserData = () => {
  const dispatch = useDispatch();

  // const array = ['Marry', 'James', 'Marry', 'Mike', 'Katie', 'Marry', 'Jimmy', 'Mike', 'Rose', 'Sam', 'Marry'];
  // console.log('Array', array);

  // const unique = [...new Set(array)];

  // console.log('UNIQUE', unique);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      dispatch(login(userData));
    }

    return () => {
      dispatch(logout());
    };
  }, [dispatch]);

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      dispatch(
        login({
          id: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          picture: user?.photoURL
        })
      );
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          picture: user?.photoURL
        })
      );
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  };

  const signOutFromGoogle = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      localStorage.clear('user');
    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  };
  return {
    signInWithGoogle,
    signOutFromGoogle
  };
};
