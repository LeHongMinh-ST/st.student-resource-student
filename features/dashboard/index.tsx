import { Container, Stack } from '@mantine/core';
import { PageHeader } from '@/components';
import { User } from '@/types';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const Dashboard = () => {
  const authState = useAuthStore();
  const user: User = authState.authUser ?? ({} as User);
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader user={user} title="Welcome!" hasGreetings />
      </Stack>
    </Container>
  );
};

export default Dashboard;
