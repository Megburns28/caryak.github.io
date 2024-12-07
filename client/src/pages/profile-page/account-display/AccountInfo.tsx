import { Box, Button, Divider } from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { logOut } from '../../../api/services/auth';
import { getUserInfo } from '../../../api/services/user';
import { UserResponseSchema } from '../../../api/types';
import InfoFieldDisplay from './InfoFieldDisplay';

interface AccountInfoProps {
    setAuth: Dispatch<SetStateAction<boolean>>;
}

const AccountInfo: FC<AccountInfoProps> = ({ setAuth }) => {
    const [userInfo, setUserInfo] = useState<UserResponseSchema | null>(null);

    useEffect(() => {
        getUserInfo()
            .then((resp) => {
                setUserInfo(resp.data.user);
            })
            .catch(() => null);
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InfoFieldDisplay label='Name' value={userInfo?.name ?? null} />
                <Divider flexItem />
                <InfoFieldDisplay
                    label='Email'
                    value={userInfo?.email ?? null}
                />
            </Box>
            <Button
                variant='contained'
                onClick={() => {
                    logOut()
                        .then(() => {
                            setAuth(false);
                        })
                        .catch(() => null);
                }}
            >
                Log Out
            </Button>
        </>
    );
};

export default AccountInfo;
