import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { ResultResponse, StudentVerify, SurveyPeriod } from '@/types';

export const useSurveyPeriodService = () => {
  const getSurveyPeriod = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod>, any>> =>
    axiosInstance.get(`/external/survey-periods/${id}`);

  const verifySurveyPeriodStudent = (
    id: number | string,
    params: StudentVerify
  ): Promise<AxiosResponse<ResultResponse<any>, any>> =>
    axiosInstance.get(`/external/survey-periods/${id}/student-verify`, { params });

  return {
    getSurveyPeriod,
    verifySurveyPeriodStudent,
  };
};
