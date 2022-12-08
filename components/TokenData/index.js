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
} from '@mui/material';

// state management
import { useSelector } from 'react-redux';

const TokenData = () => {
  // global state
  const pool = useSelector((state) => state.pool.value);

  return (
    <Card sx={{ width: '100%', height: '100%', p: 0.5 }}>
      <CardHeader
				title={`${pool?.profile?.token0?.symbol} / ${pool?.profile?.token1?.symbol}`}
				titleTypographyProps={{ variant: 'body1' }}
			/>
      <Divider/>
      {/* <CardContent>
        <Typography component='div' variant='body2'>
          <b>Price:</b> {parse(`${pool?.profile?.price}`)}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Total Liquidity:</b> {pool?.profile?.liquidity}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Buy Tax:</b> {pool?.profile?.buyTax}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Sell Tax:</b> {pool?.profile?.sellTax}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Honeypot Screening:</b> {pool?.profile?.honeypotScreen}
        </Typography>
      </CardContent> */}
    </Card>
  )
}

export default TokenData