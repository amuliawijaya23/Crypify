import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
  DialogContentText,
  TextField,
  Grid,
  Box,
  CircularProgress,
  LinearProgress,
  Snackbar,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// import NumericFormat from react-number-format;
import { NumericFormat } from 'react-number-format';

// variables for visual modes
const BUY = 'BUY';
const SELL = 'SELL';
const CONFIRM = 'CONFIRM';
const ERROR = 'ERROR';
const LOADING = 'LOADING';

const TradeForm = ({
  open,
  handleClose,
  disableSearch,
  buy,
  date,
  pair,
  swapPair,
  amount,
  swapAmount,
  price,
  swapPrice,
  fee,
  loading,
  error,
  resetErrorAlert,
  handleDateChange,
  setAmount,
  setSwapAmount,
  setSwapPrice,
  setFee,
  getTokenData,
  getSwapData,
  addTransaction,
  resetForm
}) => {
  const pool = useSelector((state) => state.pool.value.profile);
  const trades = useSelector((state) => state.trades.value);
  let currentAmount = 0;

  if (!buy) {
    const index = trades.assets.map((a) => a.pool).indexOf(pair);
    const id = trades.assets[index].id;
    currentAmount = trades.transactions.find((t) => t.asset_id === id);
  }

  const [mode, setMode] = useState(buy ? BUY : SELL);

  useEffect(() => {
    if (!buy && mode === BUY) {
      setMode(SELL);
    }

    if (buy && mode === SELL) {
      setMode(BUY);
    }
  }, [mode, setMode, buy]);

  const handleFormOnClose = () => {
    handleClose();
    resetForm();
    setMode(buy ? BUY : SELL);
  };

  const handleFormSubmit = async () => {
    try {
      setMode(LOADING);
      await addTransaction();
      setMode(CONFIRM);
    } catch (error) {
      setMode(ERROR);
      console.error(error.response ? error.response.body : error);
    }
  };

  return (
    <>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={resetErrorAlert}>
        <Alert onClose={resetErrorAlert} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleFormOnClose}>
        {mode === LOADING && (
          <Box
            sx={{
              minWidth: 400,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 1
            }}>
            <Typography component='div' variant='body1'>
              Creating Transaction...
            </Typography>
            <CircularProgress size='3rem' sx={{ mt: 3 }} />
          </Box>
        )}
        {(mode === BUY || mode === SELL) && (
          <>
            <DialogTitle>
              {disableSearch
                ? `${mode[0]}${mode.toLowerCase().substring(1)} ${pool?.token0?.symbol || 'Token'}`
                : 'Create New Transaction'}
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
              <Grid container spacing={2} padding={1}>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      maxDate={new Date()}
                      label='Date and Time'
                      value={date}
                      onChange={handleDateChange}
                      error={error && !date ? true : false}
                      helperText={error && !date ? 'Fill in the transaction date' : ''}
                      renderInput={(params) => (
                        <TextField {...params} size='small' sx={{ my: 1 }} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <FormControl margin='dense' size='small' sx={{ width: 150 }}>
                    <InputLabel id='swap-select-label'>Swap Token</InputLabel>
                    <Select
                      labelId='swap-select-label'
                      id='swap-select'
                      value={swapPair}
                      onChange={(e) => getSwapData(e.target.value)}
                      label='Swap Coin'>
                      <MenuItem value={'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}>USDC</MenuItem>
                      <MenuItem value={'0xdac17f958d2ee523a2206206994597c13d831ec7'}>USDT</MenuItem>
                      <MenuItem value={'0x6b175474e89094c44da98b954eedeac495271d0f'}>DAI</MenuItem>
                      <MenuItem value={'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'}>WETH</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <NumericFormat
                    value={swapPrice}
                    decimalScale={10}
                    prefix={'$ '}
                    thousandSeparator
                    fullWidth
                    label='Swap Price'
                    size='small'
                    displayType='input'
                    margin='dense'
                    variant='outlined'
                    sx={{ my: 1 }}
                    customInput={TextField}
                    onValueChange={({ formattedValue, value, floatValue }) => {
                      setSwapPrice(floatValue);
                    }}
                    error={error && !swapPrice ? true : false}
                    helperText={error && !swapPrice ? `Enter the price of the token` : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <NumericFormat
                    value={swapAmount}
                    decimalScale={10}
                    thousandSeparator
                    fullWidth
                    label='Swap Amount'
                    size='small'
                    margin='dense'
                    variant='outlined'
                    sx={{ my: 1 }}
                    customInput={TextField}
                    onValueChange={({ formattedValue, value, floatValue }) => {
                      setSwapAmount(floatValue);
                    }}
                    error={error && !swapAmount ? true : false}
                    helperText={error && !swapAmount ? `Enter transaction value in USD` : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogContentText variant='body2' sx={{ p: 1 }}>
                    Enter pair address to fetch Token information. If you are unable to find your
                    token, it is currently not supported.
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
                    error={error && !pool?.address ? true : false}
                    helperText={
                      error && (!pair || !pool?.address) ? 'Enter a valid pair address' : ''
                    }
                    disabled={disableSearch}
                  />
                  {pair && (
                    <>
                      {loading && <LinearProgress sx={{ mb: 1 }} />}
                      {!loading && pool?.address && (
                        <Alert severity='info'>
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
                    error={error && !amount ? true : false}
                    helperText={error && !amount ? `Enter the amount of token` : ''}
                  />
                </Grid>
                <Grid item xs={6}>
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
                    error={error && !fee ? true : false}
                    helperText={error && !fee ? `Enter the transaction fee` : ''}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant='outlined' onClick={handleFormOnClose}>
                Cancel
              </Button>
              <Button variant='outlined' onClick={handleFormSubmit}>
                Create
              </Button>
            </DialogActions>
          </>
        )}
        {mode === CONFIRM && (
          <>
            <DialogContent sx={{ p: 2, minWidth: 450 }}>
              <Typography variant='h6' component='div' sx={{ mb: 1 }}>
                Transaction Created
              </Typography>
              <Alert severity='success'>
                <Typography variant='body2' component='div'>
                  <b>
                    {pool.pool}: {pool.token0.symbol}
                  </b>
                </Typography>
                <Typography variant='caption' component='div'>
                  {pool.token0.symbol} / {pool.token1.symbol}
                </Typography>
                <Typography variant='caption' component='div'>
                  Amount: {amount}
                  <br />
                  Price: {price}
                  <br />
                  Total Price in USD: {swapAmount}
                  <br />
                  Fee: {fee}
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions sx={{ p: 1 }}>
              <Button variant='outlined' onClick={handleFormOnClose}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

TradeForm.propTypes = {
  transaction: PropTypes.bool,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default TradeForm;
