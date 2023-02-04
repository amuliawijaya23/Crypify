import { Grid, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item container justifyContent='center' alignItems='center'>
        <CircularProgress size={'4.5rem'} />
      </Grid>
    </Grid>
  );
};

export default Loading;
