import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { FormJobSurvey, ResultResponse } from '@/types';

export const useEmploymentSurveyResponse = () => {
  const createResponse = (
    formJobSurvey: FormJobSurvey
  ): Promise<AxiosResponse<ResultResponse<FormJobSurvey>, any>> =>
    axiosInstance.post('/external/employment-survey-response', formJobSurvey);

  const updateResponse = (
    formResponse: FormJobSurvey
  ): Promise<AxiosResponse<ResultResponse<FormJobSurvey>, any>> =>
    axiosInstance.patch(`/external/employment-survey-response/${formResponse.id}`, formResponse);

  const getResponse = (params: {
    student_code?: string;
    survey_period_id: number;
    code_verify?: string;
  }): Promise<AxiosResponse<ResultResponse<FormJobSurvey>, any>> =>
    axiosInstance.get('/external/employment-survey-response-search', { params });

  return {
    createResponse,
    getResponse,
    updateResponse,
  };
};
