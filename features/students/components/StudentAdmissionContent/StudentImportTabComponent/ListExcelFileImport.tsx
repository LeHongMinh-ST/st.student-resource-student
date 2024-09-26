import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { Paper, Text } from '@mantine/core';
import { CommonDataTable, StatusFileImportBadge } from '@/components';
import { AdmissionYear, ExcelFileImport, MetaResponse } from '@/types';
import { defaultPage, defaultPramsList } from '@/constants/commons';
import { StudentFileImportListParams, useStudentService } from '@/services/studentService';
import { formatDateString } from '@/utils/func/formatDateString';

type ListExcelFileImportProps = {
  admissionYear: AdmissionYear;
  isReloadList?: boolean;
};

const ListExcelFileImport: FC<ListExcelFileImportProps> = ({
  admissionYear,
  isReloadList = false,
}) => {
  const [excelFileImports, setExcelFileImports] = useState<ExcelFileImport[]>([]);
  const [meta, setMeta] = useState<MetaResponse>(defaultPage);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [excelFileImportsParams, setExcelFileImportPrams] = useState<StudentFileImportListParams>({
    ...defaultPramsList,
  });
  const studentService = useStudentService();

  const handleGetListExcelFileImport = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await studentService.getStudentFileImportListAdmission(
        admissionYear.id ?? 0,
        excelFileImportsParams
      );
      setExcelFileImports(res.data.data);
      setMeta(res.data?.meta ?? defaultPage);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }, [admissionYear, excelFileImportsParams]);

  useEffect(() => {
    handleGetListExcelFileImport();
  }, [admissionYear, excelFileImportsParams, isReloadList]);

  const columns: DataTableProps<ExcelFileImport>['columns'] = useMemo(
    () => [
      {
        accessor: 'name',
        title: 'Tên tệp',
      },
      {
        accessor: 'total_record',
        title: 'Tổng số bản ghi',
        textAlign: 'center',
      },
      {
        accessor: 'process_record',
        title: 'Bản ghi xử lý thành công',
        textAlign: 'center',
        render: (excelFileImport: ExcelFileImport) => (
          <Text fz="sm">{excelFileImport.process_record}</Text>
        ),
      },
      {
        accessor: 'file_errors_count',
        title: 'Bản ghi lỗi',
        textAlign: 'center',
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        render: (excelFileImport: ExcelFileImport) => (
          <StatusFileImportBadge status={excelFileImport.status} />
        ),
      },
      {
        accessor: 'user_name',
        title: 'Người tạo',

        render: (excelFileImport: ExcelFileImport) => (
          <Text fz="sm">
            {excelFileImport?.user?.last_name} {excelFileImport?.user?.first_name}
          </Text>
        ),
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (excelFileImport: ExcelFileImport) => (
          <Text fz="sm">{formatDateString(excelFileImport?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
    ],
    []
  );

  return (
    <div className="excel-file-imports">
      <Paper p="md" shadow="md" radius="md">
        <CommonDataTable
          meta={meta}
          columns={columns}
          records={excelFileImports}
          fetching={isFetching}
          onPageChange={(page: number) =>
            setExcelFileImportPrams((params: StudentFileImportListParams) => ({
              ...params,
              current_page: page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setExcelFileImportPrams((params: StudentFileImportListParams) => ({
              ...params,
              limit: perPage,
            }))
          }
        />
      </Paper>
    </div>
  );
};

export default ListExcelFileImport;
