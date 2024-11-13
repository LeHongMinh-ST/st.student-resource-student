import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { FormJobSurvey, ResultResonse } from '@/types';

export const useEmploymentSurveyResponse = () => {
  const createResponse = (
    formJobSurvey: FormJobSurvey
  ): Promise<AxiosResponse<ResultResonse<FormJobSurvey>, any>> =>
    axiosInstance.post('/external/employment-survey-response', formJobSurvey);

  return {
    createResponse,
  };
};
