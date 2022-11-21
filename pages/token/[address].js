// import from MUI
import { Box, Grid, Card, Typography } from '@mui/material';

// import custom components
import Loading from '../../components/Loading';
import TokenProfile from '../../components/TokenProfile';

// import custom hook
import { useTokenData } from '../../hooks/useTokenData';

// state management
import { useSelector } from 'react-redux';

const Token = () => {
  const { loading, setStart, setEnd, getTokenTransfers } = useTokenData();

  // global state
  const token = useSelector((state) => state.token);

  console.log('token', token);

  if (loading) {
    return (
      <Box sx={{ height: '80vh' }}>
				<Loading />
			</Box>
    );
  };

  return (
    <Box component='main' sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TokenProfile />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Token;