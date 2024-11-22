import { AccountCircle, Home, Leaderboard } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => (
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
                    color='inherit'
                    component={Link}
                    to='/'
                >
                    <Home />
                </IconButton>
                <IconButton
                    size='large'
                    color='inherit'
                    component={Link}
                    to='/leaderboard'
                >
                    <Leaderboard />
                </IconButton>
            </Box>
            <IconButton
                size='large'
                color='inherit'
                component={Link}
                to='/profile'
            >
                <AccountCircle />
            </IconButton>
        </Toolbar>
    </AppBar>
);

export default Header;
