import { Box } from '@mui/material';
import './HomePage.css';
import carYakLogo from '/CarYak.svg';

const HomePage = () => (
    <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
        <div>
            <a href='http://localhost:5173' target='_blank' rel='noreferrer'>
                <img src={carYakLogo} className='logo' alt='CarYak logo' />
            </a>
        </div>
        <h1>Home</h1>
    </Box>
);

export default HomePage;