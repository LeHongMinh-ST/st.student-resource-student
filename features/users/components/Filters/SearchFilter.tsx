import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchFilter } from '@/hooks/useSearchFilter';

interface SearchFilterProps<T> {
  setParams: (params: T) => void;
  searchTermValue?: string;
}

const SearchFilter = <T extends Record<string, any>>({
  setParams,
  searchTermValue,
}: SearchFilterProps<T>) => {
  const { searchTerm, handleInputSearchChange } = useSearchFilter<T>(setParams, searchTermValue);

  return (
    <TextInput
      label="Tìm kiếm"
      description="Hiển thị các mục liên quan"
      placeholder="vd: Admin, Giáo viên..."
      leftSection={<IconSearch size={16} />}
      value={searchTerm}
      onChange={handleInputSearchChange}
    />
  );
};

export default SearchFilter;
