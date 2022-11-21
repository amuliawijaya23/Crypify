import { useState } from 'react'

// import from MUI
import { 
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
 } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import DateRangeIcon from '@mui/icons-material/DateRange';

// state management
import { useSelector } from 'react-redux';

const TokenTransfers = ({ loading, setStart, setEnd, getTokenTransfers }) => {
  // global state
  const transfers = useSelector((state) => state.token.value.transfers);

  // local state
  const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

  if (loading) {
		return (
			<Card
				sx={{
					minHeight: 300,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<Typography component='div' variant='body1'>
					Fetching Data...
				</Typography>
				<LinearProgress sx={{ width: '35%' }} />
			</Card>
		);
	};

  return (
    <Card>
			<Toolbar>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						maxDate={new Date()}
						label='Start'
						value={transfers?.start}
						onChange={setStart}
						renderInput={(params) => <TextField {...params} size='small' sx={{ mx: 1 }} />}
					/>
					<DateTimePicker
						maxDate={new Date()}
						label='End'
						value={transfers?.end}
						onChange={setEnd}
						renderInput={(params) => <TextField {...params} size='small' sx={{ mx: 1 }} />}
					/>
				</LocalizationProvider>
				<Button
					variant='outlined'
					sx={{ mx: 0.5 }}
					startIcon={<DateRangeIcon />}
					onClick={getTokenTransfers}>
					Search
				</Button>
			</Toolbar>
			<TableContainer component={Paper} sx={{ maxHeight: 550, mt: 2 }}>
				<Table stickyHeader aria-label='collapsible table' size='small'>
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Hash</b>
							</TableCell>
							<TableCell>
								<b>Date</b>
							</TableCell>
							<TableCell>
								<b>From</b>
							</TableCell>
							<TableCell>
								<b>To</b>
							</TableCell>
							<TableCell align='right'>
								<b>Amount</b>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{transfers?.data
							?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((transfer, i) => (
                <></>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{transfers?.data?.length > 0 && (
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component={Paper}
					count={transfers?.data?.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					size='small'
				/>
			)}
		</Card>
  )
}

export default TokenTransfers