import React from 'react'

//import from MUI
import {
  Grid,
	Card,
	CardHeader,
	CardContent,
	Divider,
	Typography,
	Tooltip,
	IconButton
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// state management
import { useSelector } from 'react-redux';

const TokenProfile = () => {
  // global state
  const token = useSelector((state) => state.token.value);


  return (
    <Card sx={{ width: '100%', height: '100%', p: 0.5 }}>
      <CardHeader
				title={<b>{token?.profile?.name} / {token?.profile?.symbol}</b>}
				titleTypographyProps={{ variant: 'body2' }}
				action={
					<Tooltip title='Add to Favorites'>
						<IconButton>
							<StarBorderIcon />
						</IconButton>
					</Tooltip>
				}
			/>
      <Divider/>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography component='div' variant='body2'>
					    <b>Address:</b> {`${token?.profile?.address?.slice(0, 4)} ...${token?.profile?.address?.slice(37)}`}
					    <IconButton
						    edge='end'
						    size='small'
						    onClick={() => navigator.clipboard.writeText(token?.profile?.address)}>
						      <ContentCopyIcon sx={{ width: 15 }} />
					    </IconButton>
				    </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography component='div' variant='body2' sx={{ ml: 3 }}>
					    <b>Pair:</b> {`${token?.profile?.pair?.slice(0, 4)} ...${token?.profile?.pair?.slice(37)}`}
					    <IconButton
						    edge='end'
						    size='small'
						    onClick={() => navigator.clipboard.writeText(token?.profile?.pair)}>
						      <ContentCopyIcon sx={{ width: 15 }} />
					    </IconButton>
				    </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
					<b>Owner:</b> {`${token?.profile?.owner?.slice(0, 4)} ...${token?.profile?.owner?.slice(37)}`}
					<IconButton
						edge='end'
						size='small'
						onClick={() => navigator.clipboard.writeText(token?.profile?.owner)}>
						  <ContentCopyIcon sx={{ width: 15 }} />
					</IconButton>
				</Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
					<b>Decimals:</b> {token?.profile?.decimals}
				</Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
					<b>Total Supply:</b> {token?.profile?.totalSupply}
				</Typography>
      </CardContent>
    </Card>
  )
}

export default TokenProfile