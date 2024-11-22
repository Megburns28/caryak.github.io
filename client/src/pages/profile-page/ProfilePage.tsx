import { Box } from '@mui/material';
import AccountInfo from './AccountInfo';
import PersonalPage from './PersonalPage';

const ProfilePage = () => (
    <Box
        sx={{
            display: 'flex',
            padding: 1,
            gap: 1,
            alignSelf: 'stretch',
        }}
    >
        <PersonalPage />
        <AccountInfo />
    </Box>
);

export default ProfilePage;
