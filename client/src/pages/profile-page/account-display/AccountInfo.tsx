import { Box, Button, Divider } from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { logOut } from '../../../api/services/auth';
import { getActiveUser } from '../../../api/services/user';
import { UserResponseSchema } from '../../../api/types';
import InfoFieldDisplay from './InfoFieldDisplay';

interface AccountInfoProps {
    setAuth: Dispatch<SetStateAction<boolean>>;
}

const AccountInfo: FC<AccountInfoProps> = ({ setAuth }) => {
    const [userData, setUserData] = useState<UserResponseSchema | null>(null);

    useEffect(() => {
        getActiveUser()
            .then((resp) => {
                setUserData(resp.data.user);
            })
            .catch(() => null);
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InfoFieldDisplay label='Name' value={userData?.name ?? null} />
                <Divider flexItem />
                <InfoFieldDisplay
                    label='Email'
                    value={userData?.email ?? null}
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
