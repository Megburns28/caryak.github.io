import { Box } from '@mui/material';
import Header from './header/Header';

const App = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
        }}
    >
        <Header />
    </Box>
);

export default App;
