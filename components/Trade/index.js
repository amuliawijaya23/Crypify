import { useState } from 'react';

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
  Collapse,
  Link,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DataArrayIcon from '@mui/icons-material/DataArray';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddIcon from '@mui/icons-material/Add';
import RemooveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Trade = ({ asset, index, onBuy, onSell, remove }) => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);

  const handleOnClickBuy = () => {
    onBuy();
    setMenu(null);
  };

  const handleOnClickSell = () => {
    onSell();
    setMenu(null);
  };

  return (
    <>
      <TableRow key={`row-${index}`}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.last_transaction &&
            formatDistanceToNow(fromUnixTime(asset.last_transaction), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.buy_date &&
            formatDistanceToNow(fromUnixTime(asset.buy_date), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.symbol}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.amount}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.profit}
        </TableCell>
        <TableCell align='right' padding='normal' sx={{ display: { sx: 'none', lg: 'flex' } }}>
          <IconButton>
            <MoreVertIcon onClick={(e) => setMenu(e.currentTarget)} />
          </IconButton>
          <Popover
            open={Boolean(menu)}
            anchorEl={menu}
            onClose={() => setMenu(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOnClickBuy}>
                  <ListItemText primary='Buy' primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOnClickSell}>
                  <ListItemText primary='Sell' primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[0]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText primary='Chart' primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[1]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText
                    primary='Verify Token'
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[2]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText primary='Etherscan' primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
            </List>
          </Popover>
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
                  {asset?.data?.map((t, i) => (
                    <TableRow key={`transactions-row-${i}`}>
                      <TableCell>
                        {formatDistanceToNow(fromUnixTime(t.date), { addSuffix: true })}
                      </TableCell>
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
