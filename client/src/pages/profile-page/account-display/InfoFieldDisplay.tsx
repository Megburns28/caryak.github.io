import { Box, Typography } from '@mui/material';
import { FC } from 'react';

interface InfoFieldDisplayProps {
    label: string | null;
    value: string | null;
}

const InfoFieldDisplay: FC<InfoFieldDisplayProps> = ({ label, value }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
    >
        <Typography fontWeight='bold'>{label}</Typography>
        <Typography>{value}</Typography>
    </Box>
);

export default InfoFieldDisplay;
