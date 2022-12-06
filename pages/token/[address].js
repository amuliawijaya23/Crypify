// import from MUI
import { Box, Grid } from '@mui/material';

// import custom components
import Loading from '../../components/Loading';
import TokenProfile from '../../components/TokenProfile';
import TokenData from '../../components/TokenData';
import TokenTransfers from '../../components/TokenTransfers';

// import custom hook
import { useTokenData } from '../../hooks/useTokenData';

const Token = () => {
  const { loading, loadTransfers, setStart, setEnd, getTokenTransfers } = useTokenData();

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
        <Grid item xs={12} m={6}>
          <TokenProfile />
        </Grid>
        <Grid item xs={12} m={6}>
          <TokenData />
        </Grid>
        <Grid item xs={12}>
          <TokenTransfers loading={loadTransfers} setStart={setStart} setEnd={setEnd} getTokenTransfers={getTokenTransfers}/>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Token;