import React from 'react'

// import html parser
import parse from 'html-react-parser';

//import from MUI
import {
	Card,
	CardHeader,
	CardContent,
	Divider,
	Typography,
  Alert
} from '@mui/material';

import GppGoodIcon from '@mui/icons-material/GppGood';
import GppBadIcon from '@mui/icons-material/GppBad';

// state management
import { useSelector } from 'react-redux';

const TokenData = () => {
  // global state
  const pool = useSelector((state) => state.pool.value);

  return (
    <Card sx={{ width: '100%', height: '100%', p: 0.5 }}>
      <CardHeader
				title={<b>{parse(`${pool?.profile?.token0?.price}`)}</b>}
				titleTypographyProps={{ variant: 'body1' }}
			/>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Total Liquidity:</b> {pool?.profile?.token0?.liquidity}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Buy Tax:</b> {pool?.profile?.token0?.buyTax ? pool?.profile?.token0?.buyTax : 'N/A'}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Sell Tax:</b> {pool?.profile?.token0?.sellTax ? pool?.profile?.token0?.sellTax : 'N/A'}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2' sx={{ my: 1 }}>
          <b>Screening Result:</b>
        </Typography>
        <Typography component='div' variant='caption'>
          {pool?.profile?.screenResult ? 
          <Alert severity='success'>Token is Sellable</Alert> : 
          <Alert severity='warning'>Token is not Sellable</Alert>}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TokenData