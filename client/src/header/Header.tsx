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
import {
    ChangeEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useState,
} from 'react';

const Header = () => {
    const [_auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [closingMenu, setClosingMenu] = useState(false);

    const _handleAuth = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    }, []);

    const handleMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setClosingMenu(true);
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
                            <MenuItem onClick={handleClose}>
                                My account
                            </MenuItem>
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
