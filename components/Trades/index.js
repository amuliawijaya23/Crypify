import { useState } from 'react';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Trades = ({ asset, index }) => {
  const [open, setOpen] = useState(false);

  const buy = asset.transactions.filter((t) => t.is_buy);
  const sell = asset.transactions.filter((t) => !t.is_buy);

  const amountPurchased = buy.map((t) => t.amount).reduce((a, b) => a + b, 0);
  const amountSold = sell.map((t) => t.amount).reduce((a, b) => a + b, 0);

  const totalFee = asset.transactions.map((t) => t.fee).reduce((a, b) => a + b, 0);
  const buyPriceUSD = buy.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);
  const sellPriceUSD = sell.map((t) => t.total_price_usd).reduce((a, b) => a + b, 0);
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
          {amountPurchased - amountSold}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {sellPriceUSD - (buyPriceUSD + totalFee)}
        </TableCell>
        <TableCell align='right' padding='normal'>
          PLACEHOLDER
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