import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { ResultResponse, SurveyPeriod } from '@/types';

export const useSurveyPeriodService = () => {
  const getSurveyPeriod = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod>, any>> =>
    axiosInstance.get(`/external/survey-periods/${id}`);

  return {
    getSurveyPeriod,
  };
};
