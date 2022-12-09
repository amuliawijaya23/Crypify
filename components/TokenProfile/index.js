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
  const pool = useSelector((state) => state.pool.value);

  return (
    <Card sx={{ width: '100%', height: '100%', p: 0.5 }}>
      <CardHeader
				title={<b>{pool?.profile?.token0?.name}</b>}
				titleTypographyProps={{ variant: 'body1' }}
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
        <Typography component='div' variant='body2'>
					<b>Pool:</b> {pool?.profile?.pool}
				</Typography>
      </CardContent>
			<Divider />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography component='div' variant='body2'>
					    <b>Address:</b> {`${pool?.profile?.token0?.id?.slice(0, 4)} ...${pool?.profile?.token0?.id?.slice(37)}`}
					    <IconButton
						    edge='end'
						    size='small'
						    onClick={() => navigator.clipboard.writeText(pool?.profile?.token0?.id)}>
						      <ContentCopyIcon sx={{ width: 15 }} />
					    </IconButton>
				    </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component='div' variant='body2'>
					    <b>Pair:</b> {`${pool?.profile?.address?.slice(0, 4)} ...${pool?.profile?.address?.slice(37)}`}
					    <IconButton
						    edge='end'
						    size='small'
						    onClick={() => navigator.clipboard.writeText(pool?.profile?.address)}>
						      <ContentCopyIcon sx={{ width: 15 }} />
					    </IconButton>
				    </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
					<b>Decimals:</b> {pool?.profile?.token0?.decimals}
				</Typography>
      </CardContent>
    </Card>
  )
}

export default TokenProfile