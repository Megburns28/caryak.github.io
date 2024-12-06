import { Settings } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import axios from 'axios';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { useToggle } from 'usehooks-ts';
import { api } from '../../api/endpoints';
import { login, register } from '../../api/services';
import HelperTextField from './HelperTextField';

const KETTERING_EMAIL_LENGTH = 8;
const MIN_PASS_LENGTH = 8;

const AccountInfo = () => {
    const [auth, setAuth] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [signingUp, toggleSigningUp] = useToggle(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');

    const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const isEmailValid = useMemo(() => {
        return (
            email == '' ||
            (email.endsWith('@kettering.edu') &&
                email.split('@kettering.edu')[0].length ==
                    KETTERING_EMAIL_LENGTH)
        );
    }, [email]);

    const isPassValid = useMemo(() => {
        return pass == '' || pass.length >= MIN_PASS_LENGTH;
    }, [pass]);

    const isConfPassValid = useMemo(() => {
        return confPass == '' || confPass == pass;
    }, [confPass, pass]);

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
                    <Typography fontWeight='bold'>
                        {signingUp ? 'Nice to meet you!' : 'Welcome back!'}
                    </Typography>
                    {auth ? (
                        <>Logged in. :)</>
                    ) : (
                        <>
                            {signingUp ? (
                                <HelperTextField
                                    label='Name'
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            ) : null}
                            <HelperTextField
                                label='Email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                error={!isEmailValid}
                                helperText='Please enter your Kettering email.'
                                autoComplete='username'
                            />
                            <HelperTextField
                                label='Password'
                                type='password'
                                value={pass}
                                onChange={(e) => {
                                    setPass(e.target.value);
                                }}
                                error={!isPassValid}
                                helperText='Password must be at least 8 characters long.'
                                autoComplete={
                                    signingUp
                                        ? 'new-password'
                                        : 'current-password'
                                }
                            />
                            {signingUp ? (
                                <HelperTextField
                                    label='Confirm Password'
                                    type='password'
                                    value={confPass}
                                    onChange={(e) => {
                                        setConfPass(e.target.value);
                                    }}
                                    error={!isConfPassValid}
                                    helperText='Password and confirm password must match.'
                                />
                            ) : null}
                            <Button
                                variant='contained'
                                onClick={() => {
                                    if (signingUp) {
                                        register(email, name, pass, confPass)
                                            .then(() => {
                                                toggleSigningUp();
                                            })
                                            .catch(() => null);
                                    } else {
                                        login(email, pass)
                                            .then((resp) => {
                                                console.log(resp);
                                            })
                                            .catch(() => null);

                                        void axios.get(api.auth.refresh);
                                    }
                                }}
                            >
                                {signingUp ? 'Sign up' : 'Log In'}
                            </Button>
                            <Button
                                size='small'
                                onClick={() => {
                                    toggleSigningUp();
                                }}
                            >
                                {signingUp
                                    ? 'Already have an account? Log in'
                                    : "Don't have an account? Sign up"}
                            </Button>
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default AccountInfo;
