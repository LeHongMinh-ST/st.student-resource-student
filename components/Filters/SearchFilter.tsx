import { TextInput } from '@mantine/core';
import { ChangeEvent } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useSearchFilter } from '@/hooks/useSearchFilter';

interface SearchFilterProps {
  setParams: (value: string) => void;
  searchTermValue?: string;
  label?: string;
  description?: string;
  placeholder?: string;
}

const SearchFilter = ({
  setParams,
  searchTermValue,
  description,
  label,
  placeholder,
}: SearchFilterProps) => {
  const { searchTerm, handleInputSearchChange } = useSearchFilter(setParams, searchTermValue);

  return (
    <TextInput
      label={label}
      description={description}
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      value={searchTerm}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputSearchChange(e.target.value)}
    />
  );
};

export default SearchFilter;
