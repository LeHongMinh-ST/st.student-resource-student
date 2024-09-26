import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton, UnstyledButtonProps, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import classes from '@/components/UserProfileButton/user-profile-button.module.scss';

type UserProfileButtonProps = {
  user?: User;
  icon?: ReactNode;
  asAction?: boolean;
  hasEmail?: boolean;
} & UnstyledButtonProps;

const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  user,
  icon,
  hasEmail,
  asAction,
  ...others
}) => (
  <UnstyledButton href="/" component={Link} className={classes.user} {...others}>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar variant="filled" radius="xl" size={hasEmail ? 'md' : 'sm'} src={user?.thumbnail} />
      <Stack gap={0}>
        <Group gap={4}>
          <Text size="sm">{user?.last_name}</Text>
          <Text size="sm">{user?.first_name}</Text>
        </Group>
        {hasEmail && <Text size="xs">{user?.email}</Text>}
      </Stack>

      {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
    </div>
  </UnstyledButton>
);

export default UserProfileButton;
