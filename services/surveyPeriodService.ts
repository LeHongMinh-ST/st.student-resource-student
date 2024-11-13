import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { ResultResonse, SurveyPeriod } from '@/types';

export const useSurveyPeriodService = () => {
  const getSurveyPeriod = (
    id: number | string
  ): Promise<AxiosResponse<ResultResonse<SurveyPeriod>, any>> =>
    axiosInstance.get(`/external/survey-periods/${id}`);

  return {
    getSurveyPeriod,
  };
};
