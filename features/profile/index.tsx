import styled from '@emotion/styled';
import { lazy, Suspense, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  LoadingOverlay,
  Paper,
  rem,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { IconEdit, IconInfoCircle } from '@tabler/icons-react';
import { PageHeader } from '@/components';
import StudentThumbnail from '@/features/profile/components/InfoStudent/StudentThumbnail';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { requestRoute } from '@/routes';

const GeneralInfoStudent = lazy(() => import('./components/InfoStudent/GeneralInfoStudent'));

type ActiveTabType = 'general' | 'class' | 'learning_outcome';

const ProfilePage = () => {
  const auth = useAuthStore();
  const student = auth.authUser;
  const iconStyle = { width: rem(24), height: rem(24) };
  const [activeTab, setActiveTab] = useState<ActiveTabType | null>('general');

  return (
    <StudentDetailPageStyled>
      <Container fluid>
        <Stack>
          <PageHeader
            title="Sinh Viên - Thông tin sinh viên"
            breadcrumbItems={[{ title: 'Thông tin sinh viên', href: 'null' }]}
            withActions={
              <Button
                component={Link as any}
                href={requestRoute.myRequest}
                leftSection={<IconEdit size={18} />}
              >
                Yêu cầu chỉnh sửa
              </Button>
            }
          />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
              <StudentThumbnail student={student || undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 8, md: 8, lg: 9 }}>
              <Paper p="md" shadow="md" radius="md">
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value as ActiveTabType)}>
                  <Tabs.List>
                    <Tabs.Tab value="general" leftSection={<IconInfoCircle style={iconStyle} />}>
                      <Text fw={500} size="md">
                        Thông tin chung
                      </Text>
                    </Tabs.Tab>
                  </Tabs.List>

                  <Suspense fallback={<LoadingOverlay visible />}>
                    <Tabs.Panel value="general">
                      {activeTab === 'general' && (
                        <GeneralInfoStudent studentData={student || undefined} />
                      )}
                    </Tabs.Panel>
                  </Suspense>
                </Tabs>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </StudentDetailPageStyled>
  );
};
const StudentDetailPageStyled = styled.div``;

export default ProfilePage;
