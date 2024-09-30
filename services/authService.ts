import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { ResultResonse, User } from '@/types';

export type LoginPrams = {
  user_name: string;
  password: string;
  remember: boolean;
};

export type LoginResponse = {
  section: string;
  token_type: string;
  access_token: string;
  refresh_token: string | null;
  expires_in: number;
};

export type RefreshTokenPrams = {
  refresh_token: string;
};

export type RefreshTokenResponse = {} & LoginResponse;

export const useAuthService = () => {
  const login = (params: LoginPrams): Promise<AxiosResponse<LoginResponse, any>> =>
    axiosInstance.post('/auth/login', params);

  const refreshTokenStudent = (
    params: RefreshTokenPrams
  ): Promise<AxiosResponse<RefreshTokenResponse, any>> =>
    axiosInstance.post('/auth/refresh', params);

  const getProfile = (): Promise<AxiosResponse<ResultResonse<User>, any>> =>
    axiosInstance.get('/auth/profile');

  return {
    login,
    refreshTokenStudent,
    getProfile,
  };
};
