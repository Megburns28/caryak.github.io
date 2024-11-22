import { Box, Button, Dialog, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { FC, useState } from 'react';

interface AccountPageProps {
    open: boolean;
    onClose: () => void;
}

const AccountPage: FC<AccountPageProps> = ({ open: open, onClose }) => {
    const [auth, setAuth] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');

    return (
        <Dialog open={open} onClose={onClose}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    gap: 1,
                }}
            >
                <DialogTitle>My Account</DialogTitle>
                {auth ? (
                    <>Logged in. :)</>
                ) : (
                    <>
                        <TextField
                            label='Email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        ></TextField>
                        <TextField
                            label='Password'
                            value={pass}
                            onChange={(e) => {
                                setPass(e.target.value);
                            }}
                        ></TextField>
                        <TextField
                            label='Confirm Password'
                            value={confPass}
                            onChange={(e) => {
                                setConfPass(e.target.value);
                            }}
                        ></TextField>
                        <Button
                            onClick={() => {
                                void axios.post(
                                    'https://localhost:8000/register',
                                    {
                                        email: email,
                                        password: pass,
                                        passwordConfirm: confPass,
                                    },
                                );
                            }}
                        >
                            Login
                        </Button>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default AccountPage;
