import { AccountCircle, Home, Leaderboard } from '@mui/icons-material';
import {
    AppBar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import AccountPage from './AccountPage';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [closingMenu, setClosingMenu] = useState(false);
    const [accountPageOpened, setOpenAccountPage] = useState(false);

    const handleMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setClosingMenu(true);
    }, []);

    const handleOpenAccountPage = useCallback(() => {
        setOpenAccountPage(true);
    }, []);

    const handleCloseAccountPage = useCallback(() => {
        setOpenAccountPage(false);
    }, []);

    const theme = useTheme();

    useEffect(() => {
        let timeout = 0;
        if (closingMenu) {
            timeout = setTimeout(() => {
                setAnchorEl(null);
                setClosingMenu(false);
            }, theme.transitions.duration.leavingScreen);
        }

        return () => {
            clearTimeout(timeout);
        };
    });

    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 30,
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    <IconButton
                        size='large'
                        // onClick={handleMenu}
                        color='inherit'
                    >
                        <Home />
                    </IconButton>
                    <IconButton
                        size='large'
                        // onClick={handleMenu}
                        color='inherit'
                    >
                        <Leaderboard />
                    </IconButton>
                </Box>
                <IconButton size='large' onClick={handleMenu} color='inherit'>
                    <AccountCircle />
                </IconButton>
                <Menu
                    id='menu-appbar'
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={!closingMenu && !!anchorEl}
                    onClose={handleClose}
                >
                    {anchorEl ? (
                        <>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleOpenAccountPage}>
                                My Account
                            </MenuItem>
                            <AccountPage
                                open={accountPageOpened}
                                onClose={handleCloseAccountPage}
                            />
                        </>
                    ) : (
                        <MenuItem onClick={handleClose}>Log in</MenuItem>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
