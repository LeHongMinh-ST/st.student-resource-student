import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResonse, TrainingIndustry } from '@/types';

export type TrainingIndustryListParams = {
  q?: string;
  faculty_id?: number | string;
} & BaseParamsList;

export const useTrainingIndustryService = () => {
  const getList = (
    params: TrainingIndustryListParams | null = null
  ): Promise<AxiosResponse<ResultResonse<TrainingIndustry[]>, any>> =>
    axiosInstance.get('/external/training-industries', { params });

  return {
    getList,
  };
};
