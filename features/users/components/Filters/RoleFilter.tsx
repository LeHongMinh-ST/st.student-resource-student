import React from 'react';
import { Select } from '@mantine/core';
import { RoleEnum } from '@/enums';
import { RoleSelectList } from '@/constants/commons';

interface RoleFilterProps {
  value?: RoleEnum | null;
  onChange: (value: RoleEnum | null) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ value, onChange }) => (
  <Select
    label="Vai trò"
    clearable
    placeholder="Chọn vai trò"
    data={RoleSelectList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as RoleEnum)}
  />
);

export default RoleFilter;
