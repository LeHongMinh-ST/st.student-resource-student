import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { ResultResonse, Student } from '@/types';

export const useStudentService = () => {
  const getStudent = (params: {
    code?: string;
    code_verify?: string;
    phone_number?: string;
    email?: string;
  }): Promise<AxiosResponse<ResultResonse<Student>, any>> =>
    axiosInstance.get('/external/student-info-search', { params });

  return {
    getStudent,
  };
};
