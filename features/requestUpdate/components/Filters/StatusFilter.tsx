import React from 'react';
import { Select } from '@mantine/core';
import { StatusList } from '@/constants/commons';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

interface StatusFilterProps {
  value?: StudentInfoUpdateStatus | null;
  onChange: (value: StudentInfoUpdateStatus | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => (
  <Select
    label="Trạng thái"
    clearable
    placeholder="Chọn trạng thái"
    data={StatusList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as StudentInfoUpdateStatus)}
  />
);

export default StatusFilter;
