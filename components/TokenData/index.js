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
  const token = useSelector((state) => state.token.value);

  return (
    <Card sx={{ width: '100%', height: '100%', p: 0.5 }}>
      <CardHeader
				title={'UNISWAP'}
				titleTypographyProps={{ variant: 'body1' }}
			/>
      <Divider/>
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Price:</b> {parse(`${token?.profile?.price}`)}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Total Liquidity:</b> {token?.profile?.liquidity}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Buy Tax:</b> {token?.profile?.buyTax}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Sell Tax:</b> {token?.profile?.sellTax}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography component='div' variant='body2'>
          <b>Honeypot Screening:</b> {token?.profile?.honeypotScreen}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TokenData