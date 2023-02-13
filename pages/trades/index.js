import { useState } from 'react';
import { useSelector } from 'react-redux';

// import from MUI
import { visuallyHidden } from '@mui/utils';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Toolbar,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  TableSortLabel,
  ClickAwayListener
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// import custom components
import TradeForm from '../../components/TradeForm';
import Trade from '../../components/Trade';

// import custom hook
import useTradeForm from '../../hooks/useTradeForm';

import { getComparator, stableSort } from '../../helpers/sortTable';

const Trades = () => {
  const {
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
    disableSearch,
    setBuy,
    setDisableSearch,
    resetErrorAlert,
    handleDateChange,
    setAmount,
    setSwapPrice,
    setFee,
    setSwapAmount,
    getTokenData,
    getSwapData,
    addTransaction,
    removeAsset,
    resetForm
  } = useTradeForm();

  const trades = useSelector((state) => state.trades.value);

  // Table state
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('last_transaction');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchBar, setSearchBar] = useState(false);
  const [open, setOpen] = useState(false);

  const rowCount = 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handleShowSearchBar = () => {
    searchBar ? setSearchBar(false) : setSearchBar(true);
  };

  const handleBuyAsset = (address) => {
    setBuy(true);
    setOpen(true);
    setDisableSearch(true);
    getTokenData(address);
  };

  const handleSellAsset = (address) => {
    setBuy(false);
    setOpen(true);
    setDisableSearch(true);
    getTokenData(address);
  };

  const tradeData = trades?.assets?.map((a) => {
    const transactions = [...trades.transactions];
    const assetTransactions = transactions.find((t) => t.asset_id === a.id);

    return {
      ...a,
      ...assetTransactions
    };
  });

  const tradeRows = stableSort(tradeData, getComparator(order, orderBy))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    ?.map((asset, index) => {
      return (
        <Trade
          key={`trade-${index}`}
          asset={asset}
          index={index}
          onBuy={() => handleBuyAsset(asset.pool)}
          onSell={() => handleSellAsset(asset.pool)}
          onRemove={() => removeAsset(asset.id)}
        />
      );
    });

  return (
    <>
      <TradeForm
        open={open}
        disableSearch={disableSearch}
        buy={buy}
        date={date}
        pair={pair}
        swapPair={swapPair}
        amount={amount}
        swapAmount={swapAmount}
        price={price}
        swapPrice={swapPrice}
        fee={fee}
        loading={loading}
        error={error}
        handleDateChange={handleDateChange}
        setAmount={setAmount}
        setSwapAmount={setSwapAmount}
        setSwapPrice={setSwapPrice}
        setFee={setFee}
        getTokenData={getTokenData}
        getSwapData={getSwapData}
        addTransaction={addTransaction}
        resetForm={resetForm}
        resetErrorAlert={resetErrorAlert}
        handleClose={() => setOpen(false)}
      />
      <Grid container>
        <Grid item xs={12}>
          <Toolbar
            component={Paper}
            sx={{
              mt: 1,
              alignItems: 'center'
            }}>
            <Grid container padding={1}>
              <Grid item xs={6} padding={1}>
                {searchBar && (
                  <ClickAwayListener onClickAway={handleShowSearchBar}>
                    <TextField
                      fullWidth
                      size='small'
                      variant='outlined'
                      placeholder='Search...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </ClickAwayListener>
                )}
                {!searchBar && (
                  <IconButton onClick={handleShowSearchBar}>
                    <SearchIcon />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={6} padding={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}>
                  <Tooltip title='Create New'>
                    <IconButton onClick={() => setOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label='collapsible table' size='small'>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {['last_transaction', 'buy_date', 'Swap Token', 'token', 'amount', 'profit'].map(
                    (column, i) => (
                      <TableCell
                        key={column}
                        align='left'
                        padding='normal'
                        sortDirection={orderBy === column ? order : false}>
                        <TableSortLabel
                          active={orderBy === column}
                          direction={orderBy === column ? order : 'asc'}
                          onClick={() => handleRequestSort(column)}>
                          <b>
                            {column.split('_')[0][0].toUpperCase()}
                            {column.split('_')[0].substring(1)}
                            {column.split('_')[1] &&
                              ` ${column.split('_')[1][0].toUpperCase()}${column
                                .split('_')[1]
                                .substring(1)}`}
                          </b>
                          {orderBy === column && (
                            <Box component='span' sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )
                  )}
                  <TableCell align='right' padding='normal'>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tradeRows}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component={Paper}
            size='small'
            rowsPerPage={rowsPerPage}
            page={page}
            count={rowCount}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Trades;
