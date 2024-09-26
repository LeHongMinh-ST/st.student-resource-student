import { FC } from 'react';
import { Avatar, Stack, Text } from '@mantine/core';
import { Student } from '@/types';
import { theme } from '@/theme';

type StudentNameCellTableProps = {
  student: Student;
};

const StudentNameCellTable: FC<StudentNameCellTableProps> = ({ student }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar
      variant="filled"
      radius="xl"
      size="md"
      src={student.info?.thumbnail}
      alt={`${student.last_name} ${student.first_name}`}
      color={theme.primaryColor}
    ></Avatar>
    <Stack gap={0}>
      <Text fz="sm" fw={600}>
        {student.first_name} {student.last_name}
      </Text>
      <Text fz="xs">{student.email}</Text>
    </Stack>
  </div>
);

export default StudentNameCellTable;
