import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import { defaultPage, defaultPramsList } from '@/constants/commons';
import { AdmissionYear, MetaResponse, Student } from '@/types';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { HttpStatusEnum, StudentStatus } from '@/enums';
import { CommonDataTable, StatusStudentBadge } from '@/components';
import StudentNameCellTable from './StudentListTabComponent/Cells/StudentNameCellTable';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentStatusFilter from './StudentListTabComponent/Filters/StudentStatusFilter';

type StudentListTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentListTabContent: FC<StudentListTabContentProps> = ({ admissionYear }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [meta, setMeta] = useState<MetaResponse>(defaultPage);
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentParams>({
    admission_year_id: admissionYear?.id,
    ...defaultPramsList,
  } as GetListStudentParams);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { getListStudent } = useStudentService();

  const handleGetListStudent = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await getListStudent(getListStudentParams);
      setStudents(res.data.data);
      setMeta(res.data?.meta ?? defaultPage);
    } catch (error: any) {
      if (error?.status === HttpStatusEnum.HTTP_FORBIDDEN) {
        notifications.show({
          title: 'Cảnh báo!',
          message: 'Bạn không có quyền truy cập!',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      } else {
        notifications.show({
          title: 'Lỗi',
          message: 'Có lỗi sảy ra vui lòng thử lại sau !',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
    setIsFetching(false);
  }, [getListStudentParams]);

  useEffect(() => {
    handleGetListStudent();
  }, [getListStudentParams]);

  const columns: DataTableProps<Student>['columns'] = useMemo(
    () => [
      {
        accessor: 'name',
        title: 'Sinh viên',
        render: (student) => <StudentNameCellTable student={student} />,
        sortable: true,
      },
      {
        accessor: 'code',
        title: 'Mã sinh viên',
      },
      {
        accessor: 'currentClass.name',
        title: 'Lớp',
        render: (student) => (
          <Text>
            {student.currentClass?.code} - {student.currentClass?.name}
          </Text>
        ),
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        render: (student) => <StatusStudentBadge status={student.status} />,

        filter: (
          <StudentStatusFilter
            value={getListStudentParams?.status}
            onChange={(value) =>
              setGetListStudentParams({ ...getListStudentParams, status: value as StudentStatus })
            }
          />
        ),
        filtering: !!getListStudentParams.status,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (student) => (
          <Text fz="sm">{formatDateString(student?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
    ],
    [getListStudentParams.status, setGetListStudentParams]
  );
  return (
    <StudentImportTabContentStyled>
      <Paper p="md" shadow="md" radius="md">
        <CommonDataTable
          meta={meta}
          columns={columns}
          records={students}
          fetching={isFetching}
          onPageChange={(page: number) =>
            setGetListStudentParams((params: GetListStudentParams) => ({
              ...params,
              current_page: page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setGetListStudentParams((params: GetListStudentParams) => ({
              ...params,
              limit: perPage,
            }))
          }
        />
      </Paper>
    </StudentImportTabContentStyled>
  );
};

const StudentImportTabContentStyled = styled.div``;

export default StudentListTabContent;
