// import from MUI
import { IconButton, TableCell, TableRow, Typography, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// import from date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';

const UNISWAP_V3 = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45';
const UNISWAP_V2 = '0xaf37c86f4fac3512de41739a822b08011a7981c0';

const Transfer = ({ transfer }) => {
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
				<Tooltip title={transfer?.from}>
					<Typography component='span'>
						{(() => {
							switch (transfer?.from) {
								case UNISWAP_V2:
									return 'Uniswap V2';

								case UNISWAP_V3:
									return 'Uniswap V3';

								default:
									return `${transfer?.from?.slice(0, 4)} ...${transfer?.from?.slice(35)}`;
							}
						})()}
					</Typography>
				</Tooltip>
				<IconButton
					edge='end'
					size='small'
					onClick={() => navigator.clipboard.writeText(transfer?.from)}>
					<ContentCopyIcon sx={{ width: 15 }} />
				</IconButton>
			</TableCell>
			<TableCell component='th' scope='row'>
				<Tooltip title={transfer?.to}>
					<Typography component='span'>
						{(() => {
							switch (transfer?.to) {
								case UNISWAP_V2:
									return 'Uniswap V2';

								case UNISWAP_V3:
									return 'Uniswap V3';

								default:
									return `${transfer?.to?.slice(0, 4)} ...${transfer?.to?.slice(35)}`;
							}
						})()}
					</Typography>
				</Tooltip>
				<IconButton
					edge='end'
					size='small'
					onClick={() => navigator.clipboard.writeText(transfer?.to)}>
					<ContentCopyIcon sx={{ width: 15 }} />
				</IconButton>
			</TableCell>
			<TableCell align='right'>{transfer?.amount}</TableCell>
		</TableRow>
  )
}

export default Transfer