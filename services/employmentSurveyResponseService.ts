import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { FormJobSurvey, ResultResonse } from '@/types';

export const useEmploymentSurveyResponse = () => {
  const createResponse = (
    formJobSurvey: FormJobSurvey
  ): Promise<AxiosResponse<ResultResonse<FormJobSurvey>, any>> =>
    axiosInstance.post('/external/employment-survey-response', formJobSurvey);

  const getResponse = (params: {
    student_code?: string;
    survey_period_id: number;
  }): Promise<AxiosResponse<ResultResonse<FormJobSurvey>, any>> =>
    axiosInstance.get('/external/employment-survey-response-search', { params });

  return {
    createResponse,
    getResponse,
  };
};
