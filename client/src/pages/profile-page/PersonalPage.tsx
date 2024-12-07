import { Box } from '@mui/material';
import carYakLogo from '/CarYak.svg';

const PersonalPage = () => (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div>
                <a
                    href='http://localhost:5173'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img src={carYakLogo} className='logo' alt='CarYak logo' />
                </a>
            </div>
            <h1>Personal page</h1>
        </Box>
    </Box>
);

export default PersonalPage;
