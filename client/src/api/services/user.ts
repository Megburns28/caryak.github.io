import axios, { AxiosResponse } from 'axios';
import { api } from '../endpoints';
import { UserResponse } from '../types';

export const getUserInfo = (): Promise<AxiosResponse<UserResponse>> => {
    return axios.get<UserResponse>(api.user.me);
};
