import { Box } from '@mui/material';
import AccountDisplay from './account-display/AccountDisplay';
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
        <AccountDisplay />
    </Box>
);

export default ProfilePage;
