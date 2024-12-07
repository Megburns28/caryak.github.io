import { Box } from '@mui/material';
import './LeaderboardPage.css';
import carYakLogo from '/CarYak.svg';

const LeaderboardPage = () => (
    <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
        <div>
            <a href='http://localhost:5173' target='_blank' rel='noreferrer'>
                <img src={carYakLogo} className='logo' alt='CarYak logo' />
            </a>
        </div>
        <h1>Leaderboard</h1>
    </Box>
);

export default LeaderboardPage;
