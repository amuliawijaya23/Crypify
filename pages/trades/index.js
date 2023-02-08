import { useState } from 'react';
import { useSelector } from 'react-redux';

// import from MUI
import { alpha } from '@mui/material/styles';
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
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Tooltip,
  Checkbox,
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

import { getComparator, stableSort, descendingComparator } from '../../helpers/sortTable';

const Trades = () => {
  const {
    buy,
    pair,
    date,
    amount,
    price,
    fee,
    priceUSD,
    loading,
    error,
    find,
    setBuy,
    setFind,
    resetErrorAlert,
    handleDateChange,
    setAmount,
    setPrice,
    setFee,
    setPriceUSD,
    getTokenData,
    addTransaction,
    resetForm
  } = useTradeForm();

  const assets = useSelector((state) => state.trades.value.assets);

  // Table state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Last Transaction');
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
    setFind(true);
    getTokenData(address);
  };

  const handleSellAsset = (address) => {
    setBuy(false);
    setOpen(true);
    setFind(true);
    getTokenData(address);
  };

  const tableRows = stableSort(assets, getComparator(order, orderBy))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    ?.map((row, index) => {});

  return (
    <>
      <TradeForm
        buy={buy}
        open={open}
        pair={pair}
        date={date}
        amount={amount}
        price={price}
        fee={fee}
        priceUSD={priceUSD}
        loading={loading}
        error={error}
        find={find}
        resetErrorAlert={resetErrorAlert}
        handleDateChange={handleDateChange}
        setAmount={setAmount}
        setPrice={setPrice}
        setFee={setFee}
        setPriceUSD={setPriceUSD}
        getTokenData={getTokenData}
        addTransaction={addTransaction}
        resetForm={resetForm}
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
                  {['Last Transaction', 'Buy Date', 'Token', 'Amount', 'Profit/Loss'].map(
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
                          <b>{column}</b>
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
                    <b>Links</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets?.map((a, i) => (
                  <Trade
                    key={`trade-${i}`}
                    asset={a}
                    index={i}
                    onBuy={() => handleBuyAsset(a.address)}
                    onSell={() => handleSellAsset(a.address)}
                  />
                ))}
              </TableBody>
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
