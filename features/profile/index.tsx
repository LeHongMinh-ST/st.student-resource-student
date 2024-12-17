import styled from '@emotion/styled';
import { lazy, Suspense, useState } from 'react';
import { Container, Grid, LoadingOverlay, Paper, rem, Stack, Tabs, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { PageHeader } from '@/components';
import StudentThumbnail from '@/features/profile/components/InfoStudent/StudentThumbnail';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const GeneralInfoStudent = lazy(() => import('./components/InfoStudent/GeneralInfoStudent'));
// const ClassStudent = lazy(() => import('./components/InfoStudent/ClassStudent'));

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
                    {/* <Tabs.Tab value="class" leftSection={<IconBook style={iconStyle} />}> */}
                    {/*   <Text fw={500} size="md"> */}
                    {/*     Lớp học */}
                    {/*   </Text> */}
                    {/* </Tabs.Tab> */}
                    {/* <Tabs.Tab */}
                    {/*   value="learning_outcome" */}
                    {/*   leftSection={<IconBackpack style={iconStyle} />} */}
                    {/* > */}
                    {/*   <Text fw={500} size="md"> */}
                    {/*     Điểm */}
                    {/*   </Text> */}
                    {/* </Tabs.Tab> */}
                  </Tabs.List>

                  <Suspense fallback={<LoadingOverlay visible />}>
                    <Tabs.Panel value="general">
                      {activeTab === 'general' && (
                        <GeneralInfoStudent studentData={student || undefined} />
                      )}
                    </Tabs.Panel>
                    {/* <Tabs.Panel value="class"> */}
                    {/*   {activeTab === 'class' && <ClassStudent studentId={data?.data?.id} />} */}
                    {/* </Tabs.Panel> */}
                    {/* <Tabs.Panel value="learning_outcome"> */}
                    {/*   {activeTab === 'learning_outcome' && <GeneralInfoStudent />} */}
                    {/* </Tabs.Panel> */}
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
