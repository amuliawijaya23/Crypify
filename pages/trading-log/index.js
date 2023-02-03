import { useState } from 'react';

// import from MUI
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import {
  Box,
  Card,
  Button,
  LinearProgress,
  Typography,
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
  Grid,
  IconButton,
  Tooltip,
  Checkbox,
  TableSortLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TradingLog = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const numSelected = selected.length;

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

  return (
    <Box>
      <Toolbar
        component={Paper}
        sx={{
          mt: 1,
          alignItems: 'center',
          ...(selected.length > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          })
        }}>
        <Grid container padding={2}>
          <Grid item xs={6} padding={1}>
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' }
              }}>
              <TextField
                fullWidth
                size='small'
                variant='outlined'
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={6} padding={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
              <Tooltip title='Create New'>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  // onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all listings'
                  }}
                />
              </TableCell>
              {['Date', 'Token', 'Address', 'Pair', 'Amount', 'Profit/Loss'].map((column, i) => (
                <TableCell
                  key={column}
                  align={i < 5 ? 'left' : 'right'}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
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
    </Box>
  );
};

export default TradingLog;
