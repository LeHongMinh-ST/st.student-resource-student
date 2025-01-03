import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, UpdateRequest } from '@/types';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

export type RequestUpdateParams = {
  q?: string;
  status?: StudentInfoUpdateStatus | null;
} & BaseParamsList;

export const useRequestUpdateService = () => {
  const getRequestUpdates = (
    params: RequestUpdateParams | null = null
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest[]>, any>> =>
    axiosInstance.get('/request', { params });

  const getMyRequests = (
    params: RequestUpdateParams | null = null
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest[]>, any>> =>
    axiosInstance.get('/request/my-request', { params });

  const createRequest = (
    data: UpdateRequest
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest>, any>> =>
    axiosInstance.post('/request', data);

  const updateRequest = (
    data: UpdateRequest,
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest>, any>> =>
    axiosInstance.patch(`/request/${id}`, data);

  const getRequestById = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest>, any>> =>
    axiosInstance.get(`/request/${id}`);

  const updateRequestStatus = (
    id: number | string,
    status: string
  ): Promise<AxiosResponse<ResultResponse<UpdateRequest>, any>> =>
    axiosInstance.patch(`/request/${id}/status`, { status });

  const deleteRequest = (id: number | string): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/request/${id}`);

  return {
    getRequestUpdates,
    getMyRequests,
    createRequest,
    updateRequest,
    getRequestById,
    updateRequestStatus,
    deleteRequest,
  };
};
