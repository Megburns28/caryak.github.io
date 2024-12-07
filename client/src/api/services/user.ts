import axios, { AxiosResponse } from 'axios';
import { api } from '../endpoints';

export const getActiveUser = (): Promise<AxiosResponse> => {
    return axios.get(api.user.me);
};
