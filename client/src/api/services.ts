import axios, { AxiosResponse } from 'axios';
import { api } from './endpoints';
import { CreateUserSchema, LoginUserSchema } from './types';

export const register = (
    email: string,
    name: string,
    pass: string,
    confPass: string,
): Promise<AxiosResponse> => {
    const req: CreateUserSchema = {
        created_at: new Date(),
        updated_at: new Date(),
        email: email,
        name: name,
        password: pass,
        passwordConfirm: confPass,
        verified: true,
    };

    return axios.post(api.auth.register, req);
};

export const login = (email: string, pass: string): Promise<AxiosResponse> => {
    const req: LoginUserSchema = {
        email: email,
        password: pass,
    };

    return axios.post(api.auth.logIn, req);
};
