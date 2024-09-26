import { Avatar, Text, Stack } from '@mantine/core';
import { FC } from 'react';
import { theme } from '@/theme';
import { User } from '@/types';

type UserNameCellTableProps = {
  user: User;
};
const UserNameCellTable: FC<UserNameCellTableProps> = ({ user }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar
      variant="filled"
      radius="xl"
      size="md"
      src={user.thumbnail}
      alt={`${user.last_name} ${user.first_name}`}
      color={theme.primaryColor}
    ></Avatar>
    <Stack gap={0}>
      <Text fz="sm" fw={600}>
        {user.first_name} {user.last_name}
      </Text>
      <Text fz="xs">{user.email}</Text>
    </Stack>
  </div>
);

export default UserNameCellTable;
