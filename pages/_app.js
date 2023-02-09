import { Provider } from 'react-redux';
import { wrapper, store } from '../state/store';

// import from MUI
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

// import custom component
import { Navigation } from '../components/Navigation';
import Loading from '../components/Loading';

// import custom hooks
import useAppData from '../hooks/useAppData';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

// eslint-disable-next-line func-style
function MyApp({ Component, pageProps }) {
  const { loading } = useAppData();

  return (
    <Provider store={store}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navigation />
        <Box component='main' sx={{ flexGrow: 1, p: 2, mt: 2 }}>
          <DrawerHeader />
          {loading && (
            <Box
              sx={{
                width: '100%',
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Loading />
            </Box>
          )}
          {!loading && <Component {...pageProps} />}
        </Box>
      </Box>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
// export default wrapper.useWrappedStore(MyApp);
