import { DataTable, DataTableProps } from 'mantine-datatable';
import { MetaResponse } from '@/types';
import EmptyTable from './EmptyTable';

type CommonDataTableProps<T> = {
  columns: DataTableProps<T>['columns'];
  records: T[];
  meta: MetaResponse;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (perPage: number) => void;
  noRecordsText?: string;
  fetching?: boolean;
};

export default function CommonDataTable<T>({
  columns,
  records,
  meta,
  onPageChange,
  onRecordsPerPageChange,
  noRecordsText = 'Không có dữ liệu',
  fetching = false,
}: CommonDataTableProps<T>) {
  return (
    <DataTable
      minHeight={400}
      verticalSpacing="xs"
      striped
      highlightOnHover
      loaderType="bars"
      loaderBackgroundBlur={1}
      fetching={fetching}
      columns={columns ?? []}
      records={records}
      recordsPerPageOptions={[5, 10, 20, 50]}
      totalRecords={meta.total}
      page={meta.current_page}
      recordsPerPage={meta.per_page}
      noRecordsText={noRecordsText}
      recordsPerPageLabel=""
      onPageChange={(page) => onPageChange(page)}
      onRecordsPerPageChange={(perPage) => onRecordsPerPageChange(perPage)}
      emptyState={<EmptyTable />}
    />
  );
}
