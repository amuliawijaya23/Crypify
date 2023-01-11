// import from MUI
import { IconButton, TableCell, TableRow, Typography, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArticleIcon from '@mui/icons-material/Article';

// import from date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';

// import NumericFormat from react-number-format;
import { NumericFormat } from 'react-number-format';

// state management
import { useSelector } from 'react-redux';

const Transfer = ({ transfer }) => {
	// global state
	const pool = useSelector((state) => state.pool.value);

	const address = pool?.profile?.token0?.id?.toLowerCase();
	const pair = pool?.profile?.address?.toLowerCase();
	const transferFrom = transfer?.from?.toLowerCase();
	const transferTo = transfer?.to?.toLowerCase();

	const transferTypeColor = (() => {
		switch (transfer?.type) {
			case 'Buy':
				return '#EDF7ED';
			case 'Sell':
				return '#E57373';
			default:
				return '#D4D1D1';
		}
	})();

  return (
    <TableRow key={transfer?.transactionHash} sx={{backgroundColor: transferTypeColor}}>
			<TableCell component='th' scope='row'>
				<Tooltip title={transfer?.transactionHash}>
					<Typography component='span'>
						{`${transfer?.transactionHash?.slice(0, 4)} ...${transfer?.transactionHash?.slice(55)}`}
					</Typography>
				</Tooltip>
				<IconButton
					edge='end'
					size='small'
					onClick={() => navigator.clipboard.writeText(transfer?.transactionHash)}>
					<ContentCopyIcon sx={{ width: 15 }} />
				</IconButton>
			</TableCell>
			<TableCell>
				{formatDistanceToNow(fromUnixTime(transfer?.timestamp), {
					addSuffix: true
				})}
			</TableCell>
			<TableCell component='th' scope='row'>
				{(transferFrom === pair || transferFrom === address) &&
					<Tooltip title='Contract'>
						<ArticleIcon fontSize='xs' sx={{ mr: 0.5 }} />
					</Tooltip>}
				<Tooltip title={transferFrom}>
					<Typography component='span'>
						{transferFrom === pair ? `${pool?.profile?.pool}: ${pool?.profile?.token0?.symbol}` : ` ${transferFrom?.slice(0, 4)} ...${transferFrom?.slice(35)}`}
					</Typography>
				</Tooltip>
				<IconButton
					edge='end'
					size='small'
					onClick={() => navigator.clipboard.writeText(transferFrom)}>
					<ContentCopyIcon sx={{ width: 15 }} />
				</IconButton>
			</TableCell>
			<TableCell component='th' scope='row'>
				{(transferTo === pair || transferTo === address) &&
					<Tooltip title='Contract'>
						<ArticleIcon fontSize='xs' sx={{ mr: 0.5 }} />
					</Tooltip>}
				<Tooltip title={transferTo}>
					<Typography component='span'>
						{transferTo === pair ? `${pool?.profile?.pool}: ${pool?.profile?.token0?.symbol}` : `${transferTo?.slice(0, 4)} ...${transferTo?.slice(35)}`}
					</Typography>
				</Tooltip>
				<IconButton
					edge='end'
					size='small'
					onClick={() => navigator.clipboard.writeText(transferTo)}>
					<ContentCopyIcon sx={{ width: 15 }} />
				</IconButton>
			</TableCell>
			<TableCell align='right'>
				<b>
				<NumericFormat
						value={transfer?.amount}
						displayType='text'
						decimalScale={5}
						thousandSeparator
					/>
				</b>
			</TableCell>
		</TableRow>
  )
}

export default Transfer