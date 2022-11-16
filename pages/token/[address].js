// import from MUI
import { Box, Grid } from '@mui/material';

// import custom components
import Loading from '../../components/Loading';

// import custom hook
import { useTokenData } from '../../hooks/useTokenData';

// state management
import { useSelector } from 'react-redux';

const Token = () => {
  const { } = useTokenData();

  // global state
  const token = useSelector((state) => state.token);

  console.log('token', token);


  return (
    <>
      <Box component='main' sx={{ width: '100%' }}>
        <Grid container spacing={3}>
            
        </Grid>
      </Box>
    </>
  )
}

export default Token;