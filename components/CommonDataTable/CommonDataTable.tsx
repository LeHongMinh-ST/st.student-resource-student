import { DataTable, DataTableProps } from 'mantine-datatable';
import { MetaResponse } from '@/types';
import EmptyTable from './EmptyTable';

type OnClickProp = { record: any; index: number; event: any };

type CommonDataTableProps<T> = {
  columns: DataTableProps<T>['columns'];
  records?: T[];
  meta?: MetaResponse;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (perPage: number) => void;
  noRecordsText?: string;
  fetching?: boolean;
  onRowClick?: ({ record, index, event }: OnClickProp) => void;
};

export default function CommonDataTable<T>({
  columns,
  records,
  meta,
  onPageChange,
  onRecordsPerPageChange,
  noRecordsText = 'Không có dữ liệu',
  fetching = false,
  onRowClick,
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
      records={records ?? []}
      recordsPerPageOptions={[5, 10, 20, 50]}
      totalRecords={meta?.total ?? 0}
      page={meta?.current_page ?? 1}
      recordsPerPage={meta?.per_page ?? 0}
      noRecordsText={noRecordsText}
      recordsPerPageLabel=""
      onPageChange={(page) => {
        onPageChange(page);
      }}
      onRowClick={onRowClick}
      onRecordsPerPageChange={(perPage) => onRecordsPerPageChange(perPage)}
      emptyState={<EmptyTable />}
    />
  );
}
