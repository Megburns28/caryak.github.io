import { Settings } from '@mui/icons-material';
import { Box, IconButton, Popover } from '@mui/material';
import { MouseEvent, useCallback, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { refreshAuth } from '../../api/services';
import AccountInput from './AccountInput';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

const AccountInfo = () => {
    const [auth, setAuth] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    useInterval(() => {
        refreshAuth().catch(() => {
            setAuth(false);
        });
    }, REFRESH_INTERVAL_MS);

    return (
        <>
            <IconButton onClick={openMenu}>
                <Settings />
            </IconButton>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={!!anchorEl}
                onClose={closeMenu}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2,
                        gap: 1,
                        minWidth: 300,
                    }}
                >
                    {auth ? (
                        <>Logged in. :)</>
                    ) : (
                        <AccountInput setAuth={setAuth} />
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default AccountInfo;
