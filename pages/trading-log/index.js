import React from 'react'

// import from MUI
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
 } from '@mui/material';

const TradingLog = () => {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Column</b>
              </TableCell>
              <TableCell>
                <b>Column</b>
              </TableCell>
              <TableCell>
                <b>Column</b>
              </TableCell>
              <TableCell>
                <b>Column</b>
              </TableCell>
              <TableCell align='right'>
                <b>Column</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        rowsPerPageOptions={[10, 25, 100]}
        component={Paper}
        size='small'
      />
    </Box>
  )
};

export default TradingLog;