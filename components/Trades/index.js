import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

// import from MUI
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Checkbox,
  Collapse
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DataArrayIcon from '@mui/icons-material/DataArray';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddIcon from '@mui/icons-material/Add';
import RemooveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Trades = ({ asset, index }) => {
  const [open, setOpen] = useState(false);

  const assetStatistics = useMemo(() => {
    const buy = asset.transactions.filter((t) => t.is_buy);
    const sell = asset.transactions.filter((t) => !t.is_buy);
    const totalFee = asset.transactions.map((t) => t.fee).reduce((a, b) => a + b, 0);

    const amountPurchased = buy.map((t) => t.amount).reduce((a, b) => a + b, 0);
    const amountSold = sell.map((t) => t.amount).reduce((a, b) => a + b, 0);

    const buyPriceUSD = buy.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);
    const sellPriceUSD = sell.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);

    return {
      amount: amountPurchased - amountSold,
      profit: sellPriceUSD - (buyPriceUSD + totalFee)
    };
  }, [asset.transactions]);

  return (
    <>
      <TableRow key={`row-${index}`}>
        <TableCell padding='checkbox'>
          <Checkbox color='primary' inputProps={{ 'aria-label': 'select row' }} />
        </TableCell>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left' padding='normal'>
          {formatDistanceToNow(fromUnixTime(asset.transactions[0].date), {
            addSuffix: true
          })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {formatDistanceToNow(
            fromUnixTime(asset.transactions[asset.transactions.length - 1].date),
            {
              addSuffix: true
            }
          )}
          ;
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.name}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {assetStatistics.amount}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {assetStatistics.profit}
        </TableCell>
        <TableCell align='right' padding='normal'>
          <Tooltip title='Buy'>
            <IconButton size='small'>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Sell'>
            <IconButton size='small'>
              <RemooveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Chart'>
            <IconButton size='small'>
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Verify Honeypot, Contract and LP Lock'>
            <IconButton size='small'>
              <VerifiedUserIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Etherscan'>
            <IconButton size='small'>
              <DataArrayIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1, padding: 1 }}>
              <Typography variant='body1' component='div' gutterBottom>
                <b>Transactions</b>
              </Typography>
              <Table size='small' aria-label='transactions'>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Date</b>
                    </TableCell>
                    <TableCell>
                      <b>Type</b>
                    </TableCell>
                    <TableCell>
                      <b>Amount</b>
                    </TableCell>
                    <TableCell>
                      <b>Price</b>
                    </TableCell>
                    <TableCell>
                      <b>Fee</b>
                    </TableCell>
                    <TableCell>
                      <b>Total Price in USD</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asset.transactions.map((t, i) => (
                    <TableRow key={`transactions-row-${i}`}>
                      <TableCell>{formatDistanceToNow(fromUnixTime(t.date))}</TableCell>
                      <TableCell>{t.is_buy ? 'Buy' : 'Sell'}</TableCell>
                      <TableCell>{t.amount}</TableCell>
                      <TableCell>{t.price}</TableCell>
                      <TableCell>{t.fee}</TableCell>
                      <TableCell>{t.total_price_usd}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Trades;
