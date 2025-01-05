import styled from '@emotion/styled';
import { Button, Container, Paper, Stack, Text, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { CommonDataTable, DeleteModal, PageHeader } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { dashboardRoute, requestRoute } from '@/routes';
import { RequestUpdateParams, useRequestUpdateService } from '@/services/requestUpdateService';
import { UpdateRequest, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import RequestActionMenu from '../components/Cells/RequestActionMenu';
import StatusStudentRequestBadge from '@/components/Badge/StatusBadge/StatusStudentRequestBadge';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const MyRequestPage = () => {
  const requestService = useRequestUpdateService();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [requestParams, setRequestParams] = useState<RequestUpdateParams>({
    ...defaultPramsList,
  });

  const { handleRefreshProfile, authUser } = useAuthStore();
  useEffect(() => {
    handleRefreshProfile();
  }, []);

  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<UpdateRequest | null>(null);

  const getStatusForTab = (tab: string): StudentInfoUpdateStatus | null => {
    const statusMap: Record<string, StudentInfoUpdateStatus | null> = {
      all: null,
      pending: StudentInfoUpdateStatus.Pending,
      class_officer: StudentInfoUpdateStatus.ClassOfficerApproved,
      teacher: StudentInfoUpdateStatus.TeacherApproved,
      admin: StudentInfoUpdateStatus.OfficerApproved,
      rejected: StudentInfoUpdateStatus.Rejected,
    };
    return statusMap[tab];
  };

  const { data, isLoading, mutate } = useSWR<ResultResponse<UpdateRequest[]>>(
    [{ ...requestParams, status: getStatusForTab(activeTab) }],
    () =>
      requestService
        .getMyRequests({ ...requestParams, status: getStatusForTab(activeTab) })
        .then((res) => res.data)
  );

  const columns: DataTableProps<UpdateRequest>['columns'] = useMemo(
    () => [
      {
        accessor: 'student.full_name',
        title: 'Tên',
        render: (request: UpdateRequest) => (
          <span>Yêu cầu cập nhật thông tin sinh viên {request.student?.full_name}</span>
        ),
        sorting: true,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        render: (request: UpdateRequest) => <StatusStudentRequestBadge status={request.status} />,
        sorting: true,
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
          <RequestActionMenu
            request={request}
            onOpen={onOpen}
            setSelected={setSelected}
            isAdmin={false}
          />
        ),
      },
    ],
    [requestParams]
  );

  return (
    <MyRequestPageStyled>
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
            title="Yêu cầu của tôi"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Yêu cầu của tôi', href: null },
            ]}
            withActions={
              !authUser?.has_request_update ? (
                <Button
                  component={Link}
                  href={requestRoute.create}
                  leftSection={<IconPlus size={18} />}
                >
                  Tạo mới yêu cầu
                </Button>
              ) : (
                <Text>Đã có yêu cầu cập nhật</Text>
              )
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value ?? 'all')}>
              <Tabs.List>
                <Tabs.Tab value="all">Tất cả</Tabs.Tab>
                <Tabs.Tab value="pending">Chờ xác nhận</Tabs.Tab>
                <Tabs.Tab value="class_officer">Lớp trưởng đã xác nhận</Tabs.Tab>
                <Tabs.Tab value="teacher">Giáo viên đã xác nhận</Tabs.Tab>
                <Tabs.Tab value="admin">Quản trị viên đã xác nhận</Tabs.Tab>
                <Tabs.Tab value="rejected">Từ chối</Tabs.Tab>
              </Tabs.List>
            </Tabs>
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
    </MyRequestPageStyled>
  );
};

const MyRequestPageStyled = styled.div``;

export default MyRequestPage;
