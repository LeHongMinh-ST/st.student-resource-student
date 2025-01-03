import React from 'react';
import { Badge } from '@mantine/core';
import { studentInfoUpdateStatusLabels } from '@/constants/labels';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

interface StatusStudentRequestBadgeProps {
  status: StudentInfoUpdateStatus;
}

const StatusStudentRequestBadge: React.FC<StatusStudentRequestBadgeProps> = ({ status }) => {
  const getBadgeProps = (status: StudentInfoUpdateStatus) => {
    switch (status) {
      case StudentInfoUpdateStatus.Pending:
        return { color: 'yellow', label: studentInfoUpdateStatusLabels.pending };
      case StudentInfoUpdateStatus.ClassOfficerApproved:
        return { color: 'blue', label: studentInfoUpdateStatusLabels.class_officer_approved };
      case StudentInfoUpdateStatus.TeacherApproved:
        return { color: 'cyan', label: studentInfoUpdateStatusLabels.teacher_approved };
      case StudentInfoUpdateStatus.OfficerApproved:
        return { color: 'green', label: studentInfoUpdateStatusLabels.officer_approved };
      case StudentInfoUpdateStatus.Rejected:
        return { color: 'red', label: studentInfoUpdateStatusLabels.rejected };
      default:
        return { color: 'gray', label: 'Unknown' };
    }
  };

  const badgeProps = getBadgeProps(status);
  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default StatusStudentRequestBadge;
