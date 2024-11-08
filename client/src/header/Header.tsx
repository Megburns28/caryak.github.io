import { AccountCircle, Home, Leaderboard } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

const Header = () => (
    <AppBar position='static'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 20,
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <IconButton
                    size='large'
                    aria-label='account of current user'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    // onClick={handleMenu}
                    color='inherit'
                >
                    <Home />
                </IconButton>
                <IconButton
                    size='large'
                    aria-label='account of current user'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    // onClick={handleMenu}
                    color='inherit'
                >
                    <Leaderboard />
                </IconButton>
            </Box>
            <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                // onClick={handleMenu}
                color='inherit'
            >
                <AccountCircle />
            </IconButton>
        </Toolbar>
    </AppBar>
);

export default Header;
