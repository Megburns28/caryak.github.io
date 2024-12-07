import { Button, Typography } from '@mui/material';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { useToggle } from 'usehooks-ts';
import { logIn, register } from '../../../api/services/auth';
import HelperTextField from './HelperTextField';

const KETTERING_EMAIL_LENGTH = 8;
const MIN_PASS_LENGTH = 8;

interface AccountInputProps {
    setAuth: Dispatch<SetStateAction<boolean>>;
}

const AccountInput: FC<AccountInputProps> = ({ setAuth }) => {
    const [signingUp, toggleSigningUp] = useToggle(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');

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
            <Typography fontWeight='bold'>
                {signingUp ? 'Nice to meet you!' : 'Welcome back!'}
            </Typography>
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
                autoComplete={signingUp ? 'new-password' : 'current-password'}
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
                                logIn(email, pass)
                                    .then(() => {
                                        setAuth(true);
                                    })
                                    .catch(() => null);
                            })
                            .catch(() => null);
                    } else {
                        logIn(email, pass)
                            .then(() => {
                                setAuth(true);
                            })
                            .catch(() => null);
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
    );
};

export default AccountInput;
