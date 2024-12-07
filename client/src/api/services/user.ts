import axios, { AxiosResponse } from 'axios';
import { api } from '../endpoints';
import { UserResponse } from '../types';

export const getActiveUser = (): Promise<AxiosResponse<UserResponse>> => {
    return axios.get<UserResponse>(api.user.me);
};
