// RequestPage.tsx (Admin)
import styled from '@emotion/styled';
import { Container, Paper, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTableProps } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CommonDataTable, DeleteModal, PageHeader } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import { defaultPramsList } from '@/constants/commons';
import { dashboardRoute } from '@/routes';
import { RequestUpdateParams, useRequestUpdateService } from '@/services/requestUpdateService';
import { UpdateRequest, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import RequestActionMenu from './components/Cells/RequestActionMenu';
import StatusFilter from './components/Filters/StatusFilter';
import StatusStudentRequestBadge from '@/components/Badge/StatusBadge/StatusStudentRequestBadge';

const RequestPage = () => {
  const requestService = useRequestUpdateService();
  const [requestParams, setRequestParams] = useState<RequestUpdateParams>({
    ...defaultPramsList,
  });

  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<UpdateRequest | null>(null);

  const { data, isLoading, mutate } = useSWR<ResultResponse<UpdateRequest[]>>([requestParams], () =>
    requestService.getRequestUpdates(requestParams).then((res) => res.data)
  );

  const columns: DataTableProps<UpdateRequest>['columns'] = useMemo(
    () => [
      {
        accessor: 'student.full_name',
        title: 'Tên người gửi',
        render: (request: UpdateRequest) => <span>{request.student?.full_name}</span>,
        sorting: true,
      },
      {
        accessor: 'student.code',
        title: 'Mã sinh viên',
        render: (request: UpdateRequest) => <span>{request.student?.code}</span>,
        filter: (
          <SearchFilter
            label="Tìm kiếm"
            placeholder="Nhập mã sinh viên..."
            setParams={(value: any) => {
              setRequestParams({ ...requestParams, q: value });
            }}
            searchTermValue={requestParams.q}
          />
        ),
        filtering: !!requestParams.q,
      },
      {
        accessor: 'person_email',
        title: 'Email',
        render: (request: UpdateRequest) => <span>{request.person_email}</span>,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        filter: (
          <StatusFilter
            value={requestParams.status}
            onChange={(value) => setRequestParams({ ...requestParams, status: value })}
          />
        ),
        render: (request: UpdateRequest) => <StatusStudentRequestBadge status={request.status} />,
        sorting: true,
        filtering: !!requestParams.status,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (request: UpdateRequest) => (
          <Text fz="sm">{formatDateString(request?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (request: UpdateRequest) => (
          <RequestActionMenu request={request} onOpen={onOpen} setSelected={setSelected} isAdmin />
        ),
      },
    ],
    [requestParams]
  );

  return (
    <RequestPageStyled>
      <DeleteModal
        entityName="yêu cầu cập nhật"
        onDelete={async () => {
          if (selected) {
            await requestService.deleteRequest(selected.id!);
            await mutate();
            onClose();
          }
        }}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Yêu cầu cập nhật - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Yêu cầu cập nhật', href: null },
            ]}
          />
          <Paper p="md" shadow="md" radius="md">
            <CommonDataTable
              meta={data?.meta}
              columns={columns}
              records={data?.data}
              fetching={isLoading}
              onPageChange={(page: number) =>
                setRequestParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setRequestParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </RequestPageStyled>
  );
};

const RequestPageStyled = styled.div``;

export default RequestPage;
