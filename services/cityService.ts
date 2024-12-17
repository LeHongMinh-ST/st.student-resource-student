import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { City, ResultResponse } from '@/types';

export const useCityService = () => {
  const getList = (): Promise<AxiosResponse<ResultResponse<City[]>, any>> =>
    axiosInstance.get('/external/cities');

  return {
    getList,
  };
};
