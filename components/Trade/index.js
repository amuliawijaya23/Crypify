import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

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
  Collapse,
  Link
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

const Trade = ({ asset, index, onBuy, onSell }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={`row-${index}`}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.transactions?.length > 0 &&
            formatDistanceToNow(fromUnixTime(asset.last_transaction), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.transactions?.length > 0 &&
            formatDistanceToNow(fromUnixTime(asset.date_added), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.symbol}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.amount}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.profit}
        </TableCell>
        <TableCell align='right' padding='normal'>
          <Tooltip title='Buy'>
            <IconButton size='small' onClick={onBuy}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Sell'>
            <IconButton size='small' onClick={onSell}>
              <RemooveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Chart'>
            <Link
              color='inherit'
              href={asset.links[0]}
              target='_blank'
              rel='noreferrer'
              component={IconButton}>
              <ShowChartIcon />
            </Link>
          </Tooltip>
          <Tooltip title='Verify Honeypot, Contract and LP Lock'>
            <Link
              color='inherit'
              href={asset.links[2]}
              target='_blank'
              rel='noreferrer'
              component={IconButton}>
              <VerifiedUserIcon />
            </Link>
          </Tooltip>
          <Tooltip title='Etherscan'>
            <Link
              color='inherit'
              href={asset.links[1]}
              target='_blank'
              rel='noreferrer'
              component={IconButton}>
              <DataArrayIcon />
            </Link>
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
                    <TableCell align='right'>
                      <b>Total Price in USD</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asset.transactions?.map((t, i) => (
                    <TableRow key={`transactions-row-${i}`}>
                      <TableCell>{formatDistanceToNow(fromUnixTime(t.date))}</TableCell>
                      <TableCell>{t.is_buy ? 'Buy' : 'Sell'}</TableCell>
                      <TableCell>{t.amount}</TableCell>
                      <TableCell>{t.price}</TableCell>
                      <TableCell>{t.fee}</TableCell>
                      <TableCell align='right'>{t.total_price_usd}</TableCell>
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

export default Trade;
