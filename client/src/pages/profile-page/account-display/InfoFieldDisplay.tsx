import { Box, Skeleton, Typography } from '@mui/material';
import { FC } from 'react';

interface InfoFieldDisplayProps {
    label: string;
    value: string | null;
    valueSkelWidth: number;
}

const InfoFieldDisplay: FC<InfoFieldDisplayProps> = ({
    label,
    value,
    valueSkelWidth,
}) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
    >
        <Typography fontWeight='bold'>{label}</Typography>
        {value ? (
            <Typography>{value}</Typography>
        ) : (
            <Skeleton variant='text' width={valueSkelWidth} />
        )}
    </Box>
);

export default InfoFieldDisplay;
