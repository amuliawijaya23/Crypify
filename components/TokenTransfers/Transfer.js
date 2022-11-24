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
	const token = useSelector((state) => state.token.value);

	const address = token?.profile?.address?.toLowerCase();
	const pair = token?.profile?.pair?.toLowerCase();
	const transferFrom = transfer?.from?.toLowerCase();
	const transferTo = transfer?.to?.toLowerCase();

  return (
    <TableRow key={transfer?.transactionHash}>
			<TableCell component='th' scope='row'>
				<Tooltip title={transfer?.transactionHash}>
					<Typography component='span'>
						{`${transfer?.transactionHash?.slice(0, 4)} ...${transfer?.transactionHash?.slice(50)}`}
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
						{transferFrom === pair ? `Uniswap V2: ${token?.profile?.symbol}` : ` ${transferFrom?.slice(0, 4)} ...${transferFrom?.slice(35)}`}
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
						{transferTo === pair ? `Uniswap V2: ${token?.profile?.symbol}` : `${transferTo?.slice(0, 4)} ...${transferTo?.slice(35)}`}
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
				<NumericFormat
						value={transfer?.amount}
						displayType='text'
						decimalScale={2}
					/>
			</TableCell>
		</TableRow>
  )
}

export default Transfer