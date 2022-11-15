import { Provider } from 'react-redux';
import { wrapper, store } from '../state/store';

// import from MUI
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

// import custom component
import { Navigation } from '../components/Navigation';

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}));

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
        <Navigation />
				<Box component='main' sx={{ flexGrow: 1, p: 2, mt: 2 }}>
					<DrawerHeader />
					<Component {...pageProps} />
				</Box>
      </Box>
    </Provider>
    )
}

export default wrapper.withRedux(MyApp);
// export default wrapper.useWrappedStore(MyApp);
