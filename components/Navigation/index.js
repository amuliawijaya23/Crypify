import { useState } from "react";

// import from MUI
import { styled, alpha } from '@mui/material/styles';
import {
	Drawer,
	AppBar,
	Toolbar,
	List,
	Avatar,
	ListItem,
	ListItemIcon,
	ListItemButton,
	ListItemText,
	Divider,
	InputBase,
	Button,
  ClickAwayListener
} from '@mui/material';

// import from material icons
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

// redux
import { useSelector } from 'react-redux';

// NEXT router
import { useRouter } from 'next/router';

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen
	}),
	overflowX: 'hidden'
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`
	}
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}));

const NavBar = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25)
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto'
	}
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch'
			}
		}
	}
}));

const NavDrawer = styled(Drawer, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}));

export const Navigation = ({ login, logout }) => {
  // set router
  const router = useRouter();
  // Global state
	const user = useSelector((state) => state.user.value.data);

  // local state
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [address, setAddress] = useState('');

  // style based on open state
  const buttonStyle = {
    minHeight: 48,
    justifyContent: open ? 'initial' : 'center',
    px: 2.5
  };
  
  const iconStyle = {
    minWidth: 0,
    mr: open ? 3 : 'auto',
    justifyContent: 'center'
  };

  // event handlers
  const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

  const handleSearchOpen = () => {
    setSearch(true);
  };

  const handleSearchClose = () => {
    setSearch(false);
  };

	const userHandler = () => {
		user ? logout() : login();
	};

  return (
    <>
      <NavBar position='fixed' open={open}>
				<Toolbar>
          {search && (
            <ClickAwayListener onClickAway={handleSearchClose}>
              <Search sx={{ minWidth: 300 }}>
						    <SearchIconWrapper>
							    <SearchIcon />
						    </SearchIconWrapper>
						    <StyledInputBase
							    fullWidth
							    placeholder='Search Token'
							    inputProps={{ 'aria-label': 'search' }}
							    value={address}
							    onChange={(e) => setAddress(e.target.value)}
							    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/token/${address}`);
									    setAddress('');
								    }
							    }}
                  />
					    </Search>
            </ClickAwayListener>
          )}
				</Toolbar>
			</NavBar>
			<NavDrawer
				variant='permanent'
				open={open}
				onMouseEnter={handleDrawerOpen}
				onMouseLeave={handleDrawerClose}>
				<DrawerHeader>
					<Button variant='outlined' sx={{ borderRadius: '5px	' }}>
						<Avatar
							src='/Uniswap_Logo.svg'
							alt='network'
							sx={{ width: '25px', height: '25px', mr: 1 }}
						/>
						Uniswap
					</Button>
				</DrawerHeader>
				<Divider />
				<List>
					{['Search', 'Favorites'].map((text, index) => {
						const clickHandler = () => {
							switch (index) {
								case 0:
									search ? handleSearchClose() : handleSearchOpen();
									break;
								case 1:
									console.log('test2');
									break;
								default:
									break;
							}
						};
						return (
							<ListItem key={text} disablePadding sx={{ display: 'block' }}>
								<ListItemButton sx={buttonStyle} onClick={clickHandler}>
									<ListItemIcon sx={iconStyle}>
										{(() => {
											switch (index) {
												case 0:
													return <SearchIcon />;
												case 1:
													return <StarIcon />;
												default:
													break;
											}
										})()}
									</ListItemIcon>
									<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
				<List
					sx={{
						height: '100%',
						display: 'flex',
						alignItems: 'flex-end',
						mb: 1
					}}>
					<ListItem key={'authenticate'} disablePadding sx={{ display: 'block' }}>
						<ListItemButton sx={buttonStyle} onClick={userHandler}>
							{!user ? (
								<>
									<ListItemIcon sx={iconStyle}>
										<LoginIcon />
									</ListItemIcon>
									<ListItemText primary='Login' sx={{ opacity: open ? 1 : 0 }} />
								</>
							) : (
								<>
									<ListItemIcon sx={iconStyle}>
										<LogoutIcon />
									</ListItemIcon>
									<ListItemText primary={user?.displayName} sx={{ opacity: open ? 1 : 0 }} />
								</>
							)}
						</ListItemButton>
					</ListItem>
				</List>
			</NavDrawer>
    </>
  )
}