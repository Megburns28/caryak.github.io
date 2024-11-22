import { Settings } from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    Popover,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { MouseEvent, useCallback, useMemo, useState } from 'react';

const KETTERING_EMAIL_LENGTH = 8;
const MIN_PASS_LENGTH = 8;

const AccountInfo = () => {
    const [auth, setAuth] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [email, setEmail] = useState('');
    const [emailActive, setEmailActive] = useState(false);
    const [pass, setPass] = useState('');
    const [passActive, setPassActive] = useState(false);
    const [confPass, setConfPass] = useState('');

    const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const isEmailValid = useMemo(() => {
        return (
            emailActive ||
            email == '' ||
            (email.endsWith('@kettering.edu') &&
                email.split('@kettering.edu')[0].length ==
                    KETTERING_EMAIL_LENGTH)
        );
    }, [email, emailActive]);

    const isPassValid = useMemo(() => {
        return passActive || pass == '' || pass.length >= MIN_PASS_LENGTH;
    }, [pass, passActive]);

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
                    }}
                >
                    <Typography fontWeight='bold'>Sign Up</Typography>
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
                                onFocus={() => {
                                    setEmailActive(true);
                                }}
                                onBlur={() => {
                                    setEmailActive(false);
                                }}
                                error={!isEmailValid}
                                helperText={
                                    isEmailValid
                                        ? null
                                        : 'Please enter your Kettering email.'
                                }
                                autoComplete='username'
                            />
                            <TextField
                                label='Password'
                                value={pass}
                                onChange={(e) => {
                                    setPass(e.target.value);
                                }}
                                onFocus={() => {
                                    setPassActive(true);
                                }}
                                onBlur={() => {
                                    setPassActive(false);
                                }}
                                error={!isPassValid}
                                helperText={
                                    isPassValid
                                        ? null
                                        : 'Password must be at least 8 characters long.'
                                }
                                autoComplete='password'
                            />
                            <TextField
                                label='Confirm Password'
                                value={confPass}
                                onChange={(e) => {
                                    setConfPass(e.target.value);
                                }}
                            />
                            <Button
                                onClick={() => {
                                    void axios.post(
                                        'http://localhost:8000/api/auth/register',
                                        {
                                            created_at: new Date(),
                                            updated_at: new Date(),
                                            email: email,
                                            name: 'hello',
                                            password: pass,
                                            passwordConfirm: confPass,
                                            verified: false,
                                        },
                                    );
                                }}
                            >
                                Login
                            </Button>
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default AccountInfo;
