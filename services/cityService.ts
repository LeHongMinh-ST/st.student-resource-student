import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { City, ResultResonse } from '@/types';

export const useCityService = () => {
  const getList = (): Promise<AxiosResponse<ResultResonse<City[]>, any>> =>
    axiosInstance.get('/external/cities');

  return {
    getList,
  };
};
