import styled from '@emotion/styled';
import { FC } from 'react';
import { IconId, IconMail, IconUserStar } from '@tabler/icons-react';
import { Box, Paper, Text } from '@mantine/core';
import { Student } from '@/types';
import { StatusStudentBadge } from '@/components';

type StudentThumbnailProp = {
  className?: string;
  student?: Student;
};

const StudentThumbnail: FC<StudentThumbnailProp> = ({ className, student }) => {
  console.log(student);

  return (
    <StudentThumbnailStyled className={className}>
      <Paper p="md" shadow="md" radius="md">
        <div className="student-thumbnail">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={student?.info?.thumbnail ?? ''} alt={student?.code} />
        </div>
        <div className="student-info">
          <Box mt={10}>
            <Text className="mt-2" fw={700} size="xl">
              {student?.last_name} {student?.first_name}
            </Text>
          </Box>
        </div>
        <div className="student-info-list">
          <div className="student-info-item">
            <IconId />
            <Text className="mt-2" fw={500} size="md">
              {student?.code}
            </Text>
          </div>
          <div className="student-info-item">
            <IconMail />
            <Text className="mt-2" fw={500} size="md">
              {student?.email}
            </Text>
          </div>
          <div className="student-info-item">
            <IconUserStar />
            {student?.status && <StatusStudentBadge status={student.status} />}
          </div>
        </div>
      </Paper>
    </StudentThumbnailStyled>
  );
};

const StudentThumbnailStyled = styled.div`
  .student-thumbnail {
    display: flex;
    justify-content: center;

    img {
      width: 200px;
      height: auto;
    }
  }

  .student-info {
    text-align: center;
  }

  .student-info-list {
    padding: 10px 20px;
    .student-info-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  .cursor-pointer {
    cursor: pointer;
  }
`;

export default StudentThumbnail;
