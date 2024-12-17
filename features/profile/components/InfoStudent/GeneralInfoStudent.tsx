import { Box, Divider, Grid, Group, List, ListItem, Title } from '@mantine/core';
import { IconUser, IconBook, IconUsers } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { genderLabels, socialPolicyObjectLabels, trainingTypeLabels } from '@/constants/labels';
import { Student } from '@/types';
import { Gender } from '@/enums';

type GeneralInfoStudentProps = {
  studentData?: Student;
};

// Styled component cho Label
const LabelText = styled.span`
  font-weight: 500;
`;

const GeneralInfoStudent = ({ studentData }: GeneralInfoStudentProps) => {
  if (!studentData) return <>Đang cập nhật...</>;

  const { faculty, info, families, currentClass } = studentData;

  return (
    <Box p="lg">
      {/* Section: Thông tin cá nhân */}
      <Group mb="md">
        <IconUser size={20} />
        <Title order={4}>Thông tin cá nhân</Title>
      </Group>
      <Divider />
      <Grid mt="sm">
        <Grid.Col span={6}>
          <List spacing="xs">
            <ListItem>
              <LabelText>Ngày sinh:</LabelText>{' '}
              {info?.dob ? new Date(info.dob).toLocaleDateString('vi-VN') : 'Không có'}
            </ListItem>
            <ListItem>
              <LabelText>Giới tính:</LabelText> {genderLabels[info?.gender as Gender]}
            </ListItem>
            <ListItem>
              <LabelText>Dân tộc:</LabelText> {info?.ethnic || 'Không có'}
            </ListItem>
            <ListItem>
              <LabelText>Loại hình đào tạo:</LabelText>{' '}
              {info?.training_type ? trainingTypeLabels[info.training_type] : 'Không có'}
            </ListItem>
          </List>
        </Grid.Col>
        <Grid.Col span={6}>
          <List spacing="xs">
            <ListItem>
              <LabelText>Địa chỉ:</LabelText> {info?.address || 'Không có'}
            </ListItem>
            <ListItem>
              <LabelText>Số điện thoại:</LabelText> {info?.phone || 'Không có'}
            </ListItem>
            <ListItem>
              <LabelText>Email cá nhân:</LabelText> {info?.person_email || 'Không có'}
            </ListItem>
            <ListItem>
              <LabelText>Đối tượng chính sách:</LabelText>{' '}
              {info?.social_policy_object
                ? socialPolicyObjectLabels[info.social_policy_object]
                : 'Không có'}
            </ListItem>
          </List>
        </Grid.Col>
      </Grid>

      {/* Section: Thông tin học tập */}
      <Group mt="lg" mb="md">
        <IconBook size={20} />
        <Title order={4}>Thông tin học tập</Title>
      </Group>
      <Divider />
      <List spacing="xs" mt="sm">
        <ListItem>
          <LabelText>Khoa:</LabelText> {faculty?.name || 'Không có'}
        </ListItem>
        {/* <ListItem> */}
        {/*   <LabelText>Lớp hiện tại:</LabelText> {currentClass?.name || 'Không có'} */}
        {/* </ListItem> */}
        <ListItem>
          <LabelText>Lớp hiện tại:</LabelText> {currentClass?.code || 'Không có'}
        </ListItem>
      </List>

      {/* Section: Gia đình */}
      <Group mt="lg" mb="md">
        <IconUsers size={20} />
        <Title order={4}>Gia đình</Title>
      </Group>
      <Divider />
      <List spacing="xs" mt="sm">
        {families.map((family, index) => (
          <ListItem key={index}>
            <LabelText>{family.relationship === 'father' ? 'Cha' : 'Mẹ'}:</LabelText>{' '}
            {family.full_name} (SĐT: {family.phone || 'Không có'})
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GeneralInfoStudent;
