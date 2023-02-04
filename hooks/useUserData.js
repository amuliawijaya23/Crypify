// state management
import { useDispatch } from 'react-redux';

// import Firebase
import { auth, provider } from '../firebase-config';
import { signInWithPopup, signOut } from 'firebase/auth';

// import login reducer
import { login, logout } from '../state/reducers/user';

export const useUserData = () => {
  const dispatch = useDispatch();

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
