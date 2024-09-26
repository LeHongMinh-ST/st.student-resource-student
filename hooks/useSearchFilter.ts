import { ChangeEvent, useCallback, useRef, useState } from 'react';

export const useSearchFilter = <T extends Record<string, any>>(
  setParams: (params: T) => void,
  setSearchTermValue?: string
) => {
  const [searchTerm, setSearchTerm] = useState<string>(setSearchTermValue ?? '');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSearchQuery = useCallback(
    (value: string) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        // @ts-ignore
        setParams((prevParams) => ({ ...prevParams, q: value }));
      }, 300); // 300ms
    },
    [setParams]
  );

  const handleInputSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value ?? '';
    setSearchTerm(value);
    updateSearchQuery(value);
  };

  return {
    searchTerm,
    handleInputSearchChange,
  };
};
