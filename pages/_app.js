import { Provider } from 'react-redux';
import { wrapper, store } from '../state/store';

// import from MUI
import { Box, CssBaseline } from '@mui/material';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
        <Component {...pageProps} />
      </Box>
    </Provider>
    )
}

export default wrapper.withRedux(MyApp);
