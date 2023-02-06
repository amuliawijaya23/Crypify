import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Typography,
  Card,
  CardContent,
  DialogContentText,
  TextField,
  Grid,
  Box,
  CircularProgress,
  LinearProgress,
  Snackbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// import NumericFormat from react-number-format;
import { NumericFormat } from 'react-number-format';

// import custom hook
import useTradingForm from '../../hooks/useTradingForm';

const TradingLogForm = ({ open, handleClose }) => {
  const {
    pair,
    date,
    amount,
    price,
    fee,
    priceUSD,
    loading,
    error,
    resetErrorAlert,
    handleDateChange,
    setAmount,
    setPrice,
    setFee,
    setPriceUSD,
    getTokenData,
    addTransaction,
    resetForm
  } = useTradingForm();

  const pool = useSelector((state) => state.pool.value.profile);

  const handleFormOnClose = () => {
    handleClose();
    resetForm();
  };

  return (
    <>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={resetErrorAlert}>
        <Alert onClose={resetErrorAlert} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleFormOnClose}>
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <Grid container spacing={2} padding={1}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  maxDate={new Date()}
                  label='Date and Time'
                  value={date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} size='small' sx={{ my: 1 }} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <DialogContentText variant='body2' sx={{ p: 1 }}>
                Enter pair address to fetch Token information. If you are unable to find your token,
                it is currently not supported.
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Pair Address'
                value={pair}
                onChange={(e) => getTokenData(e.target.value)}
                fullWidth
                size='small'
                margin='dense'
                variant='outlined'
                sx={{ my: 1 }}
              />
              {pair && (
                <>
                  {loading && <LinearProgress sx={{ mb: 1 }} />}
                  {!loading && pool?.address && (
                    <Alert severity='success'>
                      <b>
                        {pool.pool}: {pool.token0.symbol}
                      </b>
                      <br />
                      {pool.token0.name}
                      <br />
                      {pool.token0.symbol} / {pool.token1.symbol}
                    </Alert>
                  )}
                  {!loading && !pool?.address && (
                    <Alert severity='error' sx={{ width: '100%' }}>
                      <b>Token not found</b>
                    </Alert>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={6}>
              <NumericFormat
                value={amount}
                decimalScale={5}
                thousandSeparator
                fullWidth
                label='Amount'
                size='small'
                margin='dense'
                variant='outlined'
                sx={{ my: 1 }}
                customInput={TextField}
                onValueChange={({ formattedValue, value, floatValue }) => {
                  setAmount(floatValue);
                }}
              />
              <NumericFormat
                value={price}
                decimalScale={10}
                prefix={'$ '}
                thousandSeparator
                fullWidth
                label='Price'
                size='small'
                displayType='input'
                margin='dense'
                variant='outlined'
                sx={{ my: 1 }}
                customInput={TextField}
                onValueChange={({ formattedValue, value, floatValue }) => {
                  setPrice(floatValue);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <NumericFormat
                value={priceUSD}
                decimalScale={10}
                prefix={'$ '}
                thousandSeparator
                fullWidth
                label='Price USD'
                size='small'
                margin='dense'
                variant='outlined'
                sx={{ my: 1 }}
                customInput={TextField}
                onValueChange={({ formattedValue, value, floatValue }) => {
                  setPriceUSD(floatValue);
                }}
              />
              <NumericFormat
                label='Transaction Fee'
                decimalScale={10}
                prefix={'$ '}
                thousandSeparator
                value={fee}
                fullWidth
                size='small'
                margin='dense'
                variant='outlined'
                sx={{ my: 1 }}
                customInput={TextField}
                onValueChange={({ formattedValue, value, floatValue }) => {
                  setFee(floatValue);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='error' variant='outlined' onClick={handleFormOnClose}>
            Cancel
          </Button>
          <Button color='success' variant='outlined' onClick={addTransaction}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TradingLogForm.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default TradingLogForm;
